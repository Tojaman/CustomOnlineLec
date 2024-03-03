import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";

import logo from "../assets/img/UUJJ.png";
import Background from "../assets/img/Group.png";

const RegistContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoImage = styled.img.attrs({
  src: logo,
})`
  position: absolute;
  width: 100px;
  height: 35px;
  left: 10px;
  top: 11px;
`;

const PageBackGround = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${Background});
  background-size: 100% 100%;
  background-position: center center;
  z-index: -1;
`;

const RegistText = styled.p`
  font-weight: 650;
  font-size: 30px;
  line-height: 15px;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 150px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
  width: 400px;
`;

const TextInfo = styled.span`
  margin-top: 20px;
  align-self: flex-start;
`;

const InfoInput = styled.input`
  box-sizing: border-box;
  width: 400px;
  height: 45px;
  padding: 12px;
  font-size: 16px;
  background: #f5f5f5;
  border: 1px solid #b7b7b7;
  border-radius: 4px;
  outline: none;
  margin-bottom: 30px;
`;

const GradientButton = styled.button`
  text-decoration: none;
  background: linear-gradient(90deg, #5bacf2, #6ed8c2);
  border-radius: 20px;
  padding: 10px 15px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
  border: none;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
`;

export default function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:8080/join", {
        username,
        password,
        nickname,
      });

      console.log("회원가입 요청 성공");
      showToast();
    } catch (error) {
      console.error("회원가입 요청 실패", error.response.status);
      if (error.response.status === 500) {
        showToastError("입력값이 올바르지 않습니다.");
      } else if (error.response.status === 409) {
        showToastError("이미 존재하는 사용자 이름 또는 닉네임입니다.");
      } else {
        showToastError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  const showToastError = (message) => {
    Swal.fire({
      icon: "error",
      title: "회원가입 실패",
      text: message,
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const showToast = () => {
    Swal.fire({
      icon: "success",
      title: "회원가입 성공",
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <RegistContainer>
      <PageBackGround />
      <Link to="/">
        <LogoImage />
      </Link>

      <BoxContainer>
        <RegistText>회원가입</RegistText>
        <ContentContainer>
          <form>
            <TextInfo>아이디</TextInfo>
            <InfoInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

            <TextInfo>비밀번호</TextInfo>
            <InfoInput autoComplete="on" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <TextInfo>닉네임</TextInfo>
            <InfoInput type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </form>
        </ContentContainer>
      </BoxContainer>

      <GradientButton onClick={handleRegister}>회원가입</GradientButton>
    </RegistContainer>
  );
}
