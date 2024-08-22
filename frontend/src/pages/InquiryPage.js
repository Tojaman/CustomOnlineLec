import React, { useState } from "react";
import Background from "../assets/img/Group.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/header/Navbar";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageBackGround = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${Background});
  background-size: 100% 100%;
  background-position: center center;
  z-index: -1;
`;
const TitleContainer = styled.div`
  margin: auto;
  margin-top: 100px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const Text1 = styled.div`
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #499be9;
`;
const Text2 = styled.div`
  font-family: "Inter";
  font-weight: 600;
  font-size: 12px;
  line-height: 24px;
  color: rgba(54, 37, 66, 0.49);
  margin-left: 15px;
`;
const ContentContainer = styled.div`
  padding: 20px;
  margin: auto;
  margin-top: 40px;
  width: 700px;
  justify-content: center;
  flex-direction: column;
  border: 1px solid #e1dddd;
  border-radius: 5px;
  background-color: white;
`;
const InputRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const InputLabel = styled.div`
  width: 80px;
  font-family: "Inter";
  font-weight: 600;
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  color: rgba(54, 37, 66, 0.49);
`;

const InputField = styled.input`
  flex: 1;
  font-family: "Inter";
  background-color: white;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #e1dddd;
  font-size: 15px;
  margin-left: 10px;
`;

const InputField2 = styled.textarea`
  flex: 1;
  font-family: "Inter";
  height: 200px;
  background-color: white;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #e1dddd;
  font-size: 15px;
  margin-left: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin: auto;
  width: 750px;
  margin-top: 40px;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  width: 80px;
  height: 30px;
  padding: 3px;
  background-color: #499be9;
  color: #ffffff;
  border-radius: 60px;
  border: 1px solid #ffffff;
  cursor: pointer;
`;

const InquiryPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/qna/upload",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("문의가 성공적으로 제출되었습니다:", response.data);
      showToast("문의 제출 성공");
    } catch (error) {
      console.error("문의 제출에 실패했습니다:", error);
      showToastError("문의 제출 실패");
    }
  };

  const showToast = (message) => {
    Swal.fire({
      icon: "success",
      toast: true,
      text: message,
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      navigate("/mypage");
    });
  };

  const showToastError = (message) => {
    Swal.fire({
      icon: "error",
      text: message,
      toast: true,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };
  return (
    <MainContainer>
      <Navbar />
      <PageBackGround />
      <TitleContainer>
        <Text1>문의/불편사항</Text1>
        <Text2>사이트 이용 시 궁금한 점이나 불편한 사항을 해결할 수 있는 문의사항입니다.</Text2>
      </TitleContainer>
      <ContentContainer>
        <InputRow>
          <InputLabel>제목</InputLabel>
          <InputField type="text" placeholder="제목을 입력하세요" value={title} onChange={handleTitleChange} />
        </InputRow>
        <InputRow>
          <InputLabel>내용</InputLabel>
          <InputField2 type="text" placeholder="내용을 입력하세요" value={content} onChange={handleContentChange} />
        </InputRow>
      </ContentContainer>
      <ButtonContainer>
        <SubmitButton onClick={handleSubmit}>제출</SubmitButton>
      </ButtonContainer>
    </MainContainer>
  );
};

export default InquiryPage;
