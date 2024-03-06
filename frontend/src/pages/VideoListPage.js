import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { FaSyncAlt } from "react-icons/fa";
import Navbar from "../components/header/Navbar";
import Background from "../assets/img/Group.png";
import axios from "axios";
import AWS from "aws-sdk";

const ListContainer = styled.div`
  display: flex;
`;

const PageBackGround = styled.div`
  position: fixed;
  width: 100%;
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
  width: 850px;
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

const ResetButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
`;

const PlainLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  margin: 0 10px 10px 0;
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
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searched, setSearched] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("defaultCategory");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    sessionStorage.removeItem("selectedVideoId");
    sessionStorage.removeItem("selectedVideoInfo");
    sessionStorage.removeItem("selectedVoice");
    sessionStorage.removeItem("selectedAvatar");

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
            date: video.date,
            subject: video.subject,
          }))
          .filter((video) => video.title !== null && video.thumbnail !== null && video.nickname !== null);
        console.log("영상 목록 요청 성공");

        const getThumbnails = videoData.map((video) => {
          return s3.getSignedUrlPromise("getObject", {
            Bucket: process.env.REACT_APP_S3_BUCKET,
            Key: video.thumbnail,
            Expires: 300,
          });
        });

        Promise.all(getThumbnails)
          .then((urls) => {
            const updatedVideoData = videoData
              .map((video, index) => ({
                ...video,
                thumbnail: urls[index],
              }))
              .reverse();
            setVideos(updatedVideoData);
            setFilteredVideos(updatedVideoData);
            console.log("썸네일 출력 성공");
          })
          .catch((error) => console.error("썸네일 출력 실패 : ", error));
      })
      .catch((error) => console.error("영상 목록 요청 실패 : ", error));
  }, [token]);

  const handleVideoClick = (videoId) => {
    sessionStorage.setItem("selectedVideoId", videoId);
  };

  const handleSearchButtonClick = () => {
    setFilteredVideos(videos.filter((video) => video.title.toLowerCase().includes(searchTerm.toLowerCase())));
    setSortByDate("defaultDate");
    setSelectedCategory("defaultCategory");
    setSearched(true);
    setIsSearchActive(true);
  };

  const handleSortAndFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === "selectedCategory") {
      if (value === "defaultCategory") {
        if (sortByDate === "defaultDate") {
          setFilteredVideos(videos);
        } else if (sortByDate === "Recent") {
          setFilteredVideos([...videos].sort((a, b) => new Date(b.date) - new Date(a.date)));
        } else if (sortByDate === "Old") {
          const sortedVideos = [...videos].sort((a, b) => new Date(a.date) - new Date(b.date));
          const uniqueDates = Array.from(new Set(sortedVideos.map((video) => video.date)));
          const rearrangedVideos = uniqueDates.map((date) => sortedVideos.filter((video) => video.date === date).reverse()).flat();
          setFilteredVideos(rearrangedVideos);
        }
        setSelectedCategory("defaultCategory");
      } else {
        setSelectedCategory(value);
        let filtered = videos.filter((video) => video.subject === value);
        if (sortByDate === "Recent") {
          filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortByDate === "Old") {
          const sortedVideos = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          const uniqueDates = Array.from(new Set(sortedVideos.map((video) => video.date)));
          const rearrangedVideos = uniqueDates.map((date) => sortedVideos.filter((video) => video.date === date).reverse()).flat();
          filtered = rearrangedVideos;
        }
        setFilteredVideos(filtered);
      }
    } else if (name === "sortByDate") {
      if (value === "defaultDate") {
        setFilteredVideos([...filteredVideos].sort((a, b) => new Date(b.date) - new Date(a.date)));
        setSortByDate("defaultDate");
      } else if (value === "Recent") {
        setSortByDate(value);
        setFilteredVideos([...filteredVideos].sort((a, b) => new Date(b.date) - new Date(a.date)));
      } else if (value === "Old") {
        setSortByDate(value);
        const sortedVideos = [...filteredVideos].sort((a, b) => new Date(a.date) - new Date(b.date));
        const uniqueDates = Array.from(new Set(sortedVideos.map((video) => video.date)));
        const rearrangedVideos = uniqueDates.map((date) => sortedVideos.filter((video) => video.date === date).reverse()).flat();
        setFilteredVideos(rearrangedVideos);
      }
    }

    setSearched(true);
  };

  const handleReset = () => {
    setFilteredVideos(videos);
    setSortByDate("defaultDate");
    setSelectedCategory("defaultCategory");
    setSearchTerm("");
    setIsSearchActive(false);
  };

  return (
    <ListContainer>
      <Navbar />
      <PageBackGround />
      <ContentContainer>
        <SearchContent>
          <Search placeholder="검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <SearchButton onClick={handleSearchButtonClick}>
            <FaSearch style={{ fontSize: "18px" }} />
          </SearchButton>
          <Select name="sortByDate" value={sortByDate} onChange={handleSortAndFilterChange}>
            <Option value="defaultDate">날짜</Option>
            <Option value="Recent">최신순</Option>
            <Option value="Old">오래된순</Option>
          </Select>
          <Select
            name="selectedCategory"
            value={selectedCategory}
            onChange={handleSortAndFilterChange}
            style={{ display: isSearchActive ? "none" : "block" }}
          >
            <Option value="defaultCategory">카테고리</Option>
            <Option value="C">C</Option>
            <Option value="Python">Python</Option>
            <Option value="Java">Java</Option>
            <Option value="C++">C++</Option>
            <Option value="DB">DB</Option>
            <Option value="Spring">Spring</Option>
            <Option value="React">React</Option>
            <Option value="etc">기타</Option>
          </Select>
          <ResetButton onClick={handleReset}>
            <FaSyncAlt style={{ fontSize: "20px", display: searched ? "block" : "none" }} />
          </ResetButton>
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
