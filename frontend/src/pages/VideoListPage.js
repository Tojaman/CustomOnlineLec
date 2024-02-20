import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/header/Navbar";
import Background from "../assets/img/Group.png";
import axios from "axios";

const ListContainer = styled.div`
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
  padding: 75px;
`;

const VideoContainer = styled.div`
  background-color: #fff;
  height: 200px;
  width: 200px;
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  margin: 0 10px 10px 0;
`;

const SearchContent = styled.div``;

const Search = styled.input``;

const FilterButton = styled.button``;

const Thumbnail = styled.img`
  max-width: 100%;
  max-height: 125px;
`;

const Text = styled.div`
  max-width: 100%;
  max-height: 50px;
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 3px;
`;

const VideoItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;
`;

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/videos/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const videoData = response.data.map((video) => ({
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          nickname: video.nickname,
        }));
        setVideos(videoData);
      })
      .catch((error) => console.error("Error:", error));
  }, [token]);

  // 비디오를 클릭할 때 선택된 비디오 ID를 세션 스토리지에 저장하는 함수
  const handleVideoClick = (videoId) => {
    sessionStorage.setItem("selectedVideoId", videoId);
    console.log("selected Video:", sessionStorage.getItem("selectedVideoId"));
  };

  return (
    <ListContainer>
      <Navbar />
      <PageBackGround />
      <ContentContainer>
        <SearchContent>
          <Search placeholder="검색"></Search>
          <FilterButton>필터링</FilterButton>
        </SearchContent>
        <VideoItems>
          {videos.map((video) => (
            <Link to="/select" key={video.id} onClick={() => handleVideoClick(video.id)}>
              <VideoContainer>
                <Thumbnail src={video.thumbnail} alt="썸네일" />
                <Text>{video.title}</Text>
                <Text>{video.nickname}</Text>
              </VideoContainer>
            </Link>
          ))}
        </VideoItems>
      </ContentContainer>
    </ListContainer>
  );
};

export default VideoList;
