import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/header/Navbar";

import { useSelector } from "react-redux";

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

const Image = styled.img`
  width: 200px;
  height: 200px;
  margin-top: 10px;
`;

const ResultContainer = styled.div`
  display: flex;
`;

const VideoInfo = () => {
  const videoData = useSelector((state) => state.videoData.value);

  const subtitle = useSelector((state) => state.subtitle.value);
  const x = videoData ? videoData.x : "N/A";
  const y = videoData ? videoData.x : "N/A";
  const width = videoData ? videoData.width : "N/A";
  const height = videoData ? videoData.height : "N/A";
  const videoWidth = videoData ? videoData.videoWidth : "N/A";
  const videoHeight = videoData ? videoData.videoHeight : "N/A";

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
    const token = sessionStorage.getItem("token");
    
    const id = 0;

    const title = formData.title;
    const content = formData.description;
    const subject = formData.category;
    const thumbnailS3Path = "formData.pdfFile";
    const lectureNoteS3Path = "formData.imageFile";

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

      console.log("요청 성공");
    } catch (error) {
      console.error("요청 실패", error.response.status);
    }

    console.log("제목:", title);
    console.log("강의 설명:", content);
    console.log("카테고리:", subject);

    console.log("강의자료:", formData.pdfFile);
    console.log("썸네일:", formData.imageFile);

    console.log("자막:", subtitle);
    console.log("x:", x);
    console.log("y:", y);
    console.log("너비:", width);
    console.log("높이:", height);
    console.log("영상 너비:", videoWidth);
    console.log("영상 높이:", videoHeight);
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
              <Option value="C">C언어</Option>
              <Option value="Python">파이썬</Option>
              <Option value="Java">자바</Option>
              <Option value="JavaScript">자바스크립트</Option>
            </Select>

            <Label2>강의자료</Label2>
            <FileInput type="file" accept=".pdf" onChange={(e) => handleFileChange(e, "pdfFile")} />

            <Label2>썸네일</Label2>
            <FileInput type="file" accept="image/*" onChange={(e) => handleFileChange(e, "imageFile")} />
            <Image src={formData.imageFile && URL.createObjectURL(formData.imageFile)} alt="Thumbnail Preview" />
          </SelectContainer>
          <Link to="/">
            <SubmitButton onClick={handleSubmit}>제출</SubmitButton>
          </Link>
        </FormContainer>
      </InfoContainer>
    </Container>
  );
};

export default VideoInfo;
