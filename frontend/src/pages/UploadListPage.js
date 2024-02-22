import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/header/Navbar";
import Background from "../assets/img/Group.png";
import axios from "axios";
import AWS from "aws-sdk";

const Container = styled.div`
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
  width: 700px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-top: 40px;
`;

const SubTitle = styled.p`
  width: 100%;
  display: flex;
  font-weight: bold;
  font-size: 20px;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 10px;
`;

const StatisticsContainer = styled.div`
  height: 150px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid #000;
  margin-bottom: 5px;
`;

const Statistics = styled.div`
  width: 100%;
`;

const VideoItems = styled.div``;

const PlainLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const VideoContainer = styled.div`
  display: flex;
  border: 1px solid #000;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: #fff;
`;

const ImageContainer = styled.img`
  height: 100px;
`;

const TextContainer = styled.div`
  width: 100%;
`;

const Text = styled.div`
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UploadList = () => {
  const [videos, setVideos] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    });

    const s3 = new AWS.S3();

    axios
      .get("http://localhost:8080/videos/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const videoData = response.data
          .map((video) => ({
            id: video.id,
            title: video.title,
            thumbnail: video.thumbnail,
            nickname: video.nickname,
          }))
          .filter((video) => video.title !== null && video.thumbnail !== null && video.nickname !== null);

        const getThumbnails = videoData.map((video) => {
          return s3.getSignedUrlPromise("getObject", {
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Key: video.thumbnail,
            Expires: 300,
          });
        });

        Promise.all(getThumbnails)
          .then((urls) => {
            const updatedVideoData = videoData.map((video, index) => ({
              ...video,
              thumbnail: urls[index],
            }));
            setVideos(updatedVideoData);
          })
          .catch((error) => console.error("Error:", error));
      })
      .catch((error) => console.error("Error:", error));
  }, [token]);

  const handleVideoClick = (videoId) => {
    sessionStorage.setItem("selectedVideoId", videoId);
    console.log("selected Video:", sessionStorage.getItem("selectedVideoId"));
  };

  return (
    <Container>
      <Navbar />
      <PageBackGround />
      <ContentContainer>
        <SubTitle>Upload List</SubTitle>
        <StatisticsContainer>
          통계
          <Statistics></Statistics>
        </StatisticsContainer>
        <VideoItems>
          {videos.map((video) => (
            <PlainLink to="/select" key={video.id} onClick={() => handleVideoClick(video.id)}>
              <VideoContainer>
                <ImageContainer src={video.thumbnail} alt="썸네일" />
                <TextContainer>
                  <Text>{video.title}</Text>
                  <Text>{video.nickname}</Text>
                </TextContainer>
              </VideoContainer>
            </PlainLink>
          ))}
        </VideoItems>
      </ContentContainer>
    </Container>
  );
};

export default UploadList;
