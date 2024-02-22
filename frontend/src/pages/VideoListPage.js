import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import Navbar from "../components/header/Navbar";
import Background from "../assets/img/Group.png";
import axios from "axios";
import AWS from "aws-sdk";

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
  width: 900px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  margin-top: 80px;
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

const SearchContent = styled.div`
  display: flex;
  align-items: center;
`;

const Search = styled.input`
  width: 300px;
  border-radius: 20px;
  padding: 7px;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
`;

const Select = styled.select`
  padding: 5px;
  width: 100px;
  margin-left: 10px;
`;

const Option = styled.option``;

const PlainLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

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
  margin-top: 30px;
`;

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searched, setSearched] = useState(false);

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

  const handleSearchButtonClick = () => {
    setFilteredVideos(videos.filter((video) => video.title.toLowerCase().includes(searchTerm.toLowerCase())));
    setSearched(true);
  };

  return (
    <ListContainer>
      <Navbar />
      <PageBackGround />
      <ContentContainer>
        <SearchContent>
          <Search placeholder="검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <SearchButton onClick={handleSearchButtonClick}>
            <FaSearch />
          </SearchButton>
          <Select>
            <Option value="">날짜</Option>
            <Option value="Recent">최신순</Option>
            <Option value="Old">오래된순</Option>
          </Select>
          <Select>
            <Option value="">카테고리</Option>
            <Option value="C">C언어</Option>
            <Option value="Python">파이썬</Option>
            <Option value="Java">자바</Option>
            <Option value="JavaScript">자바스크립트</Option>
          </Select>
        </SearchContent>
        <VideoItems>
          {searched
            ? filteredVideos.map((video) => (
                <PlainLink to="/select" key={video.id} onClick={() => handleVideoClick(video.id)}>
                  <VideoContainer>
                    <Thumbnail src={video.thumbnail} alt="썸네일" />
                    <Text>{video.title}</Text>
                    <Text>{video.nickname}</Text>
                  </VideoContainer>
                </PlainLink>
              ))
            : videos.map((video) => (
                <PlainLink to="/select" key={video.id} onClick={() => handleVideoClick(video.id)}>
                  <VideoContainer>
                    <Thumbnail src={video.thumbnail} alt="썸네일" />
                    <Text>{video.title}</Text>
                    <Text>{video.nickname}</Text>
                  </VideoContainer>
                </PlainLink>
              ))}
        </VideoItems>
      </ContentContainer>
    </ListContainer>
  );
};

export default VideoList;
