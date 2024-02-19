import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { GoArrowRight } from "react-icons/go";
import Slider from "react-slick";

import Navbar from "../../components/header/Navbar";
import Background from "../../assets/img/Group.png";

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
  margin-top: 50px;
`;

const Selection = styled.div`
  display: flex;
  margin-top: 30px;
`;

const SelectText = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 15px;
  margin-left: 12px;
  margin-top:60px
`;

const CustomSlider = styled(Slider)`
  width: 800px;

  .slick-list {
    height: 160px;
    width: 100%;
  }

  .slick-slide {
    height: 150px;
    margin: 0 10px;
    border: 1px solid #e1dddd;
    padding: 1px;

    &:hover {
      border: 1px solid #499be9;
    }
    
  }
  .slick-track {
    display: flex;
  }
  .selected { 
  border: 1px solid #499be9;
}
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 125px;
  margin-bottom: 5px;
`;

const Name = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 15px;
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
  { name: "음성1", img: "https://via.placeholder.com/150" },
  { name: "음성2", img: "https://via.placeholder.com/150" },
  { name: "음성3", img: "https://via.placeholder.com/150" },
  { name: "음성4", img: "https://via.placeholder.com/150" },
  { name: "음성5", img: "https://via.placeholder.com/150" },
  { name: "음성6", img: "https://via.placeholder.com/150" },
];

const avatars = [
  { name: "아바타 1", img: "https://via.placeholder.com/150" },
  { name: "아바타 2", img: "https://via.placeholder.com/150" },
  { name: "아바타 3", img: "https://via.placeholder.com/150" },
  { name: "아바타 4", img: "https://via.placeholder.com/150" },
  { name: "아바타 5", img: "https://via.placeholder.com/150" },
  { name: "아바타 6", img: "https://via.placeholder.com/150" },
];

const Select = () => {
  const goToCameraPage = () => {
    window.location.href = "/camera.html";
  };
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(null);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);

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
    sessionStorage.setItem("selectedAvatar", selectedAvatar.name);
    console.log("Selected Avatar:", sessionStorage.getItem("selectedAvatar"));
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
              <div
                key={voice.name}
                className={selectedVoiceIndex === index ? "selected" : ""}
                onClick={() => handleVoiceSelection(index)}
              >
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
