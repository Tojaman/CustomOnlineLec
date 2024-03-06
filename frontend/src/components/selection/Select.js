import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { GoArrowRight } from "react-icons/go";
import Slider from "react-slick";
import axios from "axios";

import Navbar from "../../components/header/Navbar";
import Background from "../../assets/img/Group.png";
import avatarImg1 from "../../assets/avatarImg/기본아바타여1.jpg";
import avatarImg2 from "../../assets/avatarImg/기본아바타남1.jpg";
import avatarImg3 from "../../assets/avatarImg/윤석열.jpg";
import avatarImg4 from "../../assets/avatarImg/트럼프.jpg";
import avatarImg5 from "../../assets/avatarImg/키키.jpg";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageBackGround = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-image: url(${Background});
  background-size: 100% 100%;
  background-position: center center;
  z-index: -1;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const Selection = styled.div`
  display: flex;
  margin-top: 10px;
`;

const SelectText = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 15px;
  margin-left: 12px;
  margin-top: 80px;
`;

const CustomSlider = styled(Slider)`
  width: 800px;

  .slick-list {
    height: 160px;
    width: 100%;
  }

  .slick-slide {
    margin: 0 10px;
    border: 1px solid #e1dddd;
    background-color: white;

    &:hover {
      height: 150px;
      border: 1px solid #ffeb0b;
    }
  }
  .slick-track {
    display: flex;
  }

  .selected {
    height: 150px;
    border: 2px solid #ffeb0b;
  }

  .slick-prev:before,
  .slick-next:before {
    color: #499be9;
  }
`;

const Img = styled.img`
  border: 1px solid #e9ecef;
  max-width: 100%;
  max-height: 125px;
  margin-bottom: 5px;
`;

const Name = styled.div`
  font-family: "Inter";
  font-weight: 600;
  font-size: 18px;
  line-height: 15px;
  margin: 2px;
`;

const NextButton = styled(Link)`
  text-decoration: underline;
  text-decoration-color: #499be9;
  text-underline-offset: 3px;
  font-family: "Inter";
  font-size: 16px;
  line-height: 22px;
  color: black;
  align-self: flex-end;
  margin-top: 30px;
  margin-left: 5px;
`;

const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const voices = [
  { id: "yoon", name: "윤석열", img: "https://via.placeholder.com/150" },
  { id: "Jimin700", name: "BTS 지민", img: "https://via.placeholder.com/150" },
  { id: "Timcook", name: "Timcook", img: "https://via.placeholder.com/150" },
  { id: "karina", name: "에스파 카리나", img: "https://via.placeholder.com/150" },
];

const avatars = [
  { id: "avatar1", name: "기본 여성", img: avatarImg1 },
  { id: "avatar2", name: "기본 남성", img: avatarImg2 },
  { id: "avatar3", name: "윤석열", img: avatarImg3 },
  { id: "avatar4", name: "트럼프", img: avatarImg4 },
  { id: "avatar5", name: "키키", img: avatarImg5 },
];

const Select = () => {
  const goToCameraPage = () => {
    window.location.href = "/camera.html";
  };
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(null);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const selectedVideoId = sessionStorage.getItem("selectedVideoId");

    if (selectedVideoId) {
      axios
        .post(
          `http://localhost:8080/videos/info`,
          {
            videoid: selectedVideoId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("영상 정보 요청 성공");

          sessionStorage.setItem("selectedVideoInfo", JSON.stringify(response.data));
          const selectedVideoInfoString = sessionStorage.getItem("selectedVideoInfo");
          const selectedVideoInfo = JSON.parse(selectedVideoInfoString);
          console.log("영상 정보 : ", selectedVideoInfo);
        })
        .catch((error) => console.error("영상 정보 요청 실패 : ", error));
    }
  }, [token]);

  const handleVoiceSelection = (index) => {
    setSelectedVoiceIndex(index);
    const selectedVoice = voices[index];
    sessionStorage.setItem("selectedVoice", selectedVoice.id);
    console.log("선택한 음성 : ", sessionStorage.getItem("selectedVoice"));
  };

  const handleAvatarSelection = (index) => {
    setSelectedAvatarIndex(index);
    const selectedAvatar = avatars[index];
    sessionStorage.setItem("selectedAvatar", selectedAvatar.id);
    console.log("선택한 아바타 : ", sessionStorage.getItem("selectedAvatar"));
  };

  return (
    <SelectContainer>
      <Navbar />
      <PageBackGround />
      <ContentContainer>
        <SelectText>음성 선택</SelectText>
        <Selection>
          <CustomSlider {...settings}>
            {voices.map((voice, index) => (
              <div key={voice.name} className={selectedVoiceIndex === index ? "selected" : ""} onClick={() => handleVoiceSelection(index)}>
                <Img src={voice.img} />
                <Name>{voice.name}</Name>
              </div>
            ))}
          </CustomSlider>
        </Selection>
        <SelectText>아바타 선택</SelectText>
        <Selection>
          <CustomSlider {...settings}>
            {avatars.map((avatar, index) => (
              <div
                key={avatar.name}
                className={selectedAvatarIndex === index ? "selected" : ""}
                onClick={() => handleAvatarSelection(index)}
              >
                <Img src={avatar.img} />
                <Name>{avatar.name}</Name>
              </div>
            ))}
          </CustomSlider>
        </Selection>

        <NextButton onClick={goToCameraPage}>
          다음 <GoArrowRight />
        </NextButton>
      </ContentContainer>
    </SelectContainer>
  );
};

export default Select;
