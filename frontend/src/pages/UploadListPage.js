import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/header/Navbar";

const Container = styled.div`
  padding: 40px;
  margin-top: 4rem;
`;

const VideoContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 3px;
  border: 1px solid #000;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  margin: 0 10px 10px 0;
`;

const ImageContainer = styled.img`
  width: 100px;
  height: 100px;
`;

const TextContainer = styled.div``;

const Text = styled.div`
  max-width: 100%;
  max-height: 50px;
  margin-left: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 3px;
`;

const videos = [
  { id: 1, title: "간지나게 사는 방법", person: "Tony" },
  { id: 2, title: "리액트 컴포넌트 디자인", person: "Alice" },
  { id: 3, title: "웹 개발 기초", person: "Bob" },
];

const UploadList = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoClick = (title, person) => {
    setSelectedVideo({ title, person });
  };

  return (
    <Container>
      <Navbar />
      {videos.map((video) => (
        <VideoContainer onClick={() => handleVideoClick(video.id, video.title, video.person)}>
          <ImageContainer src="/favicon.ico" alt="썸네일" />
          <TextContainer>
            <Text>{video.title}</Text>
            <Text>{video.person}</Text>
          </TextContainer>
        </VideoContainer>
      ))}
    </Container>
  );
};

export default UploadList;
