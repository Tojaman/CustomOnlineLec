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
  display: flex;
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
      border: 1px solid #499be9;
    }
  }
  .slick-track {
    display: flex;
  }

  .selected {
    height: 150px;
    border: 1px solid #499be9;
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
  { name: "윤석열", img: "https://via.placeholder.com/150" },
  { name: "jimin700", img: "https://via.placeholder.com/150" },
  { name: "timcook", img: "https://via.placeholder.com/150" },
  { name: "Elonmusk", img: "https://via.placeholder.com/150" },
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

  const handleVoiceSelection = (index) => {
    setSelectedVoiceIndex(index);
    const selectedVoice = voices[index];
    sessionStorage.setItem("selectedVoice", selectedVoice.name);
    console.log("selected Video:", sessionStorage.getItem("selectedVideoId"));
    console.log("Selected Voice:", sessionStorage.getItem("selectedVoice"));
  };

  const handleAvatarSelection = (index) => {
    setSelectedAvatarIndex(index);
    const selectedAvatar = avatars[index];
    sessionStorage.setItem("selectedAvatar", selectedAvatar.id);
    console.log("Selected Avatar:", sessionStorage.getItem("selectedAvatar"));
  };

  useEffect(() => {
    const selectedVideoId = sessionStorage.getItem("selectedVideoId");
    const selectedVoice = sessionStorage.getItem("selectedVoice");

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
          console.log("요청 성공");
          console.log("Received video info:", response.data);

          sessionStorage.setItem("selectedVideoInfo", JSON.stringify(response.data));
          const selectedVideoInfoString = sessionStorage.getItem("selectedVideoInfo");
          const selectedVideoInfo = JSON.parse(selectedVideoInfoString);
          console.log("Stored video info:", selectedVideoInfo);

          let selectedS3Path;

          if (selectedVideoInfo.Elonmusk !== undefined) {
            console.log("Elonmusk:", selectedVideoInfo.Elonmusk);
            selectedS3Path = selectedVideoInfo.Elonmusk;
          } else if (selectedVideoInfo.Jimin700 !== undefined) {
            console.log("Jimin700:", selectedVideoInfo.Jimin700);
            selectedS3Path = selectedVideoInfo.Jimin700;
          } else if (selectedVideoInfo.yoon !== undefined) {
            console.log("yoon:", selectedVideoInfo.yoon);
            selectedS3Path = selectedVideoInfo.yoon;
          } else if (selectedVideoInfo.Timcook !== undefined) {
            console.log("Timcook:", selectedVideoInfo.Timcook);
            selectedS3Path = selectedVideoInfo.Timcook;
          }

          if (selectedS3Path !== undefined) {
            console.log("Selected S3 Path:", selectedS3Path);
            sessionStorage.setItem("convertVideoS3Path", selectedS3Path);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [token]);

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
