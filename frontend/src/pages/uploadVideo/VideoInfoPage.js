import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import AWS from "aws-sdk";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/header/Navbar";

import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

const Container = styled.div`
  display: flex;
  margin-top: 50px;
`;

const SidebarContainer = styled.nav`
  width: 200px;
  height: 100%;
`;

const SubTitle = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

const InfoContainer = styled.div`
  padding: 10px;
  margin: 0 auto;
`;

const FormContainer = styled.div`
  padding: 10px;
  height: 750px;
  width: 600px;
  overflow-y: auto;
  border: 2px solid #000;
  border-radius: 5px;
`;

const WriteContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label1 = styled.p`
  margin-top: 10px;
  margin-left: 85px;
`;

const TextInput = styled.input`
  margin-bottom: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 70%;
  margin: 0 auto;
`;

const TextArea = styled.textarea`
  margin-bottom: 10px;
  padding: 5px;
  width: 70%;
  margin: 0 auto;
`;

const SelectContainer = styled.div`
  margin-left: 85px;
  display: flex;
  flex-direction: column;
`;

const Label2 = styled.p`
  margin-top: 10px;
`;

const Select = styled.select`
  margin-bottom: 10px;
  padding: 5px;
  width: 180px;
`;

const FileInput = styled.input`
  margin-bottom: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 180px;
`;

const Option = styled.option``;

const SubmitButton = styled.button`
  margin-top: 15px;
  padding: 3px;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 85px;
`;

const DisabledSubmitButton = styled.button`
  margin-top: 15px;
  padding: 3px;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 85px;
`;

const Image = styled.img`
  width: 200px;
  margin-top: 10px;
`;

const VideoInfo = () => {
  const videoData = useSelector((state) => state.videoData.value);
  const x = videoData ? videoData.x : "N/A";
  const y = videoData ? videoData.y : "N/A";
  const width = videoData ? videoData.width : "N/A";
  const height = videoData ? videoData.height : "N/A";
  const videoWidth = videoData ? videoData.videoWidth : "N/A";
  const videoHeight = videoData ? videoData.videoHeight : "N/A";

  const { addToast } = useToasts();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    pdfFile: null,
    imageFile: null,
  });

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [fileType]: file });
  };

  const handleSubmit = async () => {
    const subtitle = useSelector((state) => state.subtitle.value);
    const subtitleResult = subtitle.subtitleEdit;

    if (formData.title === "" || formData.description === "" || formData.category === "") {
      console.error("영상 정보 로드 실패");
      addToast("모든 필수 항목을 입력해주세요.", { appearance: "warning", autoDismiss: true, autoDismissTimeout: 5000 });
      return;
    }

    if (!formData.pdfFile) {
      console.error("강의자료 파일 로드 실패");
      addToast("강의자료 파일을 첨부해주세요.", { appearance: "warning", autoDismiss: true, autoDismissTimeout: 5000 });
      return;
    }

    if (!formData.imageFile) {
      console.error("썸네일 파일 로드 실패");
      addToast("썸네일 파일을 첨부해주세요.", { appearance: "warning", autoDismiss: true, autoDismissTimeout: 5000 });
      return;
    }

    const token = sessionStorage.getItem("token");
    const id = sessionStorage.getItem("UploadVideoID");
    const title = formData.title;
    const content = formData.description;
    const subject = formData.category;

    const lectureNoteFileName = formData.pdfFile.name;
    const thumbnailFileName = formData.imageFile.name;

    const lectureNoteS3Path = `lecture_note/${lectureNoteFileName}`;
    const thumbnailS3Path = `thumbnail/${thumbnailFileName}`;

    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    });

    const s3 = new AWS.S3();

    const lectureNoteParams = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: lectureNoteS3Path,
      Body: formData.pdfFile,
    };

    try {
      const data = await s3.upload(lectureNoteParams).promise();
      console.log("S3에 강의자료 업로드 성공");
    } catch (error) {
      console.error("S3에 강의자료 업로드 실패 : ", error);
    }

    const thumbnailParams = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: thumbnailS3Path,
      Body: formData.imageFile,
    };

    try {
      const data = await s3.upload(thumbnailParams).promise();
      console.log("S3에 썸네일 업로드 성공");
    } catch (error) {
      console.error("S3에 썸네일 업로드 실패 : ", error);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/videos/uploadInfo",
        {
          id,
          title,
          content,
          subject,
          thumbnailS3Path,
          lectureNoteS3Path,
          x,
          y,
          width,
          height,
          videoWidth,
          videoHeight,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("영상 정보 업로드 요청 성공");
      addToast("영상 정보가 성공적으로 업로드되었습니다.", { appearance: "success", autoDismiss: true, autoDismissTimeout: 5000 });
      sessionStorage.removeItem("UploadVideoID");
    } catch (error) {
      console.error("영상 정보 업로드 요청 실패 : ", error.response.status);
      addToast("영상 정보 업로드를 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
    }

    console.log("자막 : ", subtitle);
  };

  return (
    <Container>
      <Navbar />
      <Sidebar step={3} />
      <SidebarContainer></SidebarContainer>
      <InfoContainer>
        <SubTitle>강의 정보</SubTitle>
        <FormContainer>
          <WriteContainer>
            <Label1>제목</Label1>
            <TextInput type="text" placeholder="제목을 입력하세요" onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

            <Label1>강의 설명</Label1>
            <TextArea
              placeholder="강의 설명을 입력하세요"
              rows="4"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </WriteContainer>
          <SelectContainer>
            <Label2>카테고리</Label2>
            <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              <Option value="">카테고리 선택</Option>
              <Option value="C">C</Option>
              <Option value="Python">Python</Option>
              <Option value="Java">Java</Option>
              <Option value="C++">C++</Option>
              <Option value="DB">DB</Option>
              <Option value="Spring">Spring</Option>
              <Option value="React">React</Option>
              <Option value="etc">기타</Option>
            </Select>

            <Label2>강의자료</Label2>
            <FileInput type="file" accept=".pdf" onChange={(e) => handleFileChange(e, "pdfFile")} />

            <Label2>썸네일</Label2>
            <FileInput type="file" accept="image/*" onChange={(e) => handleFileChange(e, "imageFile")} />
            <Image src={formData.imageFile && URL.createObjectURL(formData.imageFile)} alt="Thumbnail Preview" />
          </SelectContainer>
          {formData.title &&
          formData.description &&
          formData.category &&
          formData.pdfFile &&
          formData.imageFile &&
          sessionStorage.getItem("UploadVideoID") ? (
            <Link to="/">
              <SubmitButton onClick={handleSubmit}>제출</SubmitButton>
            </Link>
          ) : (
            <DisabledSubmitButton onClick={handleSubmit}>제출</DisabledSubmitButton>
          )}
        </FormContainer>
      </InfoContainer>
    </Container>
  );
};

export default VideoInfo;
