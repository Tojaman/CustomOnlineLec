import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import styled from "styled-components";
import Navbar from "../../components/header/Navbar";
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

const VideoInfo = () => {
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
            <FileInput type="file" accept=".jpg" onChange={(e) => handleFileChange(e, "imageFile")} />

            <Image src={formData.imageFile && URL.createObjectURL(formData.imageFile)} alt="Thumbnail Preview" />
          </SelectContainer>
          <Link to="/">
            <SubmitButton>제출</SubmitButton>
          </Link>
        </FormContainer>
      </InfoContainer>
    </Container>
  );
};

export default VideoInfo;
