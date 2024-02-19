import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaRegCirclePlay } from "react-icons/fa6";
import { GoArrowRight } from "react-icons/go";
import Navbar from "../components/header/Navbar";

import Swal from "sweetalert2";
import Background from "../assets/img/background.png";
import Mainimg from "../assets/img/MainImg.png";

const MainContainer = styled.div`
  display: flex;
`;

const PageBackGround = styled.div`
  position: fixed;
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

const ContentContainer = styled.div`
  margin: 0 auto;
  display: flex;
  padding: 50px;
`;

const LeftContainer = styled.div`
  margin-top: 100px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Explain1 = styled.div`
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: rgba(255, 5, 110, 0.49);
  margin-bottom: 30px;
  margin-left: 10px;
`;

const Explain2 = styled.div`
  font-family: "Inter";
  font-weight: 643;
  font-size: 58px;
  line-height: 64px;
  color: #2c2c2c;
  margin-bottom: 15px;
`;

const Explain3 = styled.div`
  font-family: "Inter";
  font-weight: 579;
  font-size: 18px;
  line-height: 24px;
  color: rgba(54, 37, 66, 0.49);
  margin-bottom: 15px;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const GradientButton = styled(Link)`
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
  margin-top: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const LectureLink = styled(Link)`
  text-decoration: none;
  font-family: "Inter";
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: #499be9;
  margin-top: 19px;
  margin-left: 14px;
`;

const MainImg = styled.img.attrs({
  src: Mainimg,
})`
  width: 510px;
  height: 380px;
  filter: drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.1));
  transform: rotate(5deg);
  margin-top: 140px;
  margin-left: 40px;
  position: relative;
  z-index: -1;
`;

export default function MainPage() {
  const token = sessionStorage.getItem("token");
  const navigate= useNavigate();

  const handleUploadClick = () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "로그인 필요",
        text: "강의 업로드를 하시려면 로그인이 필요합니다.",
        toast: true,
      }).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <MainContainer>
      <Navbar />
      <PageBackGround />
      <ContentContainer>
        <LeftContainer>
          <TextContainer>
            <Explain1>LEARN FROM TODAY</Explain1>
            <Explain2>커스텀 인강 사이트</Explain2>
            <Explain3>강의를 업로드하고 원하는 음성과 캐릭터를 선택해 강의를 시청해보세요!</Explain3>
          </TextContainer>
          <LinkContainer>
            <GradientButton to="/attach" onClick={handleUploadClick}>
              강의 업로드 하러가기
              <GoArrowRight />
            </GradientButton>
            <LectureLink to="/videoList">
              강의 시청하기
              <FaRegCirclePlay/>
            </LectureLink>
          </LinkContainer>
        </LeftContainer>
        <MainImg />
      </ContentContainer>
    </MainContainer>
  );
}
