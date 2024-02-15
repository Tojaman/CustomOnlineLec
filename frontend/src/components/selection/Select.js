import React from "react";
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
  diplay: flex;
  margin-top: 60px;
`;

const SelectText = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 15px;
  margin-left: 12px;
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
    border: 1px solid #1b78da;
    padding: 1px;
  }
  .slick-track {
    display: flex;
  }
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 125px;
  margin-bottom: 5px;
`;

const Name = styled.div`
  diplay: flex;
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 15px;
`;

const NextButton = styled(Link)`
  text-decoration: none;
  font-family: "Inter";
  font-size: 16px;
  line-height: 22px;
  color: black;
  align-self: flex-end;
  margin-top: 30px;
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
  { name: "아바타1", img: "https://via.placeholder.com/150" },
  { name: "아바타2", img: "https://via.placeholder.com/150" },
  { name: "아바타3", img: "https://via.placeholder.com/150" },
  { name: "아바타4", img: "https://via.placeholder.com/150" },
  { name: "아바타5", img: "https://via.placeholder.com/150" },
  { name: "아바타6", img: "https://via.placeholder.com/150" },
];

const Select = () => {
  const goToCameraPage = () => {
    window.location.href = "/camera.html";
  };
  return (
    <SelectContainer>
      <Navbar />
      <PageBackGround />
      <ContentContainer>
        <Selection>
          <SelectText>음성 선택</SelectText>
          <CustomSlider {...settings}>
            {voices.map((voice) => (
              <div key={voice.name}>
                <Img src={voice.img} />
                <Name>{voice.name}</Name>
              </div>
            ))}
          </CustomSlider>
        </Selection>

        <Selection>
          <SelectText>아바타 선택</SelectText>
          <CustomSlider {...settings}>
            {avatars.map((avatar) => (
              <div key={avatar.index}>
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
