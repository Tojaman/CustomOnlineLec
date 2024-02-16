import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GoArrowRight } from "react-icons/go";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../assets/img/UUJJ.png";
import Background from "../assets/img/Group.png";
import GoogleLogin from "../assets/img/GoogleLogin.png";
import OR from "../assets/img/Or.png";

const LoginContainer = styled.div`
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
  align-items: center;
  justify-content: center;
  background-image: url(${Background});
  background-size: 100% 100%;
  background-position: center center;
  z-index: -1;
`;

const LoginText = styled.p`
  font-weight: 650;
  font-size: 30px;
  line-height: 15px;
`;

const RegisterButton = styled(Link)`
  text-decoration: none;
  font-family: "Inter";
  font-size: 16px;
  line-height: 22px;
  color: black;
  align-self: flex-end;
  margin-bottom: 8px;
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

const Google = styled.button`
  width: 400px;
  height: 57.55px;
  background: url(${GoogleLogin});
  border: none;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
`;

const OrImg = styled.div`
  width: 400px;
  height: 30px;
  background-image: url(${OR});
  background-size: contain;
  background-repeat: no-repeat;
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
  margin-top: 80px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/login", {
        username,
        password,
      });
      const { token, user_name, pass_word } = response.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("username", user_name);
      sessionStorage.setItem("password", pass_word);
      showToast();
      
    } catch (error) {
      console.error("로그인 요청 실패:", error.response.data); // 서버에서 전달한 에러 메시지 출력
      if (error.response.status === 401) {
        showToastError("입력값이 올바르지 않습니다.");
      } else {
        // 기타 예외 처리
        showToastError("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const showToast = () => {
    Swal.fire({
      icon: "success",
      title: "로그인 성공",
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      navigate("/");
    });
  };
  
  const showToastError = (message) => {
    Swal.fire({
      icon: "error",
      title: "로그인 실패",
      text: message,
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  return (
    <LoginContainer>
      <Link to="/">
        <LogoImage />
      </Link>
      <PageBackGround />
      <form>
        <BoxContainer>
          <RegisterButton to="/register">
            회원가입
            <GoArrowRight />
          </RegisterButton>
          <LoginText>로그인</LoginText>
          <ContentContainer>
            <Google />

            <OrImg />

            <TextInfo>아이디</TextInfo>
            <InfoInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

            <TextInfo>비밀번호</TextInfo>
            <InfoInput autoComplete="on" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </ContentContainer>
        </BoxContainer>
      </form>
      <GradientButton onClick={handleLogin}>로그인</GradientButton>
    </LoginContainer>
  );
}
