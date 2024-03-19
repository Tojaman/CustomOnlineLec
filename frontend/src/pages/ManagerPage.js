import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { registerables, CategoryScale, Chart } from "chart.js";
Chart.register(CategoryScale, ...registerables);
import { Line, Bar } from "react-chartjs-2";
import { BsTrash } from "react-icons/bs";
import Navbar from "../components/header/Navbar";
import Background from "../assets/img/Group.png";
import axios from "axios";
import AWS from "aws-sdk";
import Swal from "sweetalert2";
import { useToasts } from "react-toast-notifications";

import avatarImg1 from "../assets/avatarImg/기본아바타여1.jpg";
import avatarImg2 from "../assets/avatarImg/기본아바타남1.jpg";
import avatarImg3 from "../assets/avatarImg/윤석열.jpg";
import avatarImg4 from "../assets/avatarImg/트럼프.jpg";
import avatarImg5 from "../assets/avatarImg/키키.jpg";
import avatarImg6 from "../assets/avatarImg/뽀로로.jpg";

const avatarImages = [avatarImg1, avatarImg2, avatarImg3, avatarImg4, avatarImg5, avatarImg6];
const audioImages = [avatarImg1, avatarImg2, avatarImg3, avatarImg4, avatarImg5, avatarImg6];

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

const MainContainer = styled.div`
  margin-top: 80px;
  background-color: #e2e2e2;
  width: 100%;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
`;

const SubTitle = styled.p`
  display: flex;
  width: 100%;
  font-weight: bold;
  font-size: 20px;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 8px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const DashContainer = styled.div`
  width: 50%;
  background-color: #fff;
  margin: 8px;
`;

const Sub = styled.span`
  display: flex;
  width: 100%;
  font-size: 15px;
  padding: 8px;
  margin-left: 8px;
`;

const VideoItems = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  height: 400px;
  overflow-y: auto;
`;

const VideoListContainer = styled.div`
  background-color: #fff;
  width: 99%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 2px;
  align-items: center;
`;

const PlainLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  height: 30px;
`;

const Thumbnail = styled.img`
  max-width: 100%;
  max-height: 45px;
`;

const TextThumbnail = styled.div`
  width: 80px;
  height: 30px;
`;

const TextTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  height: 30px;
  cursor: pointer;
`;

const TextNickname = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100px;
  height: 30px;
`;

const DeleteButton = styled.div`
  padding-top: 5px;
  cursor: pointer;
  width: 17px;
  height: 25px;
`;

const TextDelete = styled.div`
  width: 17px;
  height: 25px;
`;

const DivideLine = styled.hr`
  border: none;
  height: 1px;
  background-color: #ccc;
  margin: 2px 0;
`;

const Image = styled.img`
  width: 120px;
  height: 120px;
  border: 1px solid #000;
  margin: 5px;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 12px;
  width: 90%;
`;

const Manage = () => {
  const [videos, setVideos] = useState([]);
  const [categoryStats, setCategoryStats] = useState({
    C: 0,
    Python: 0,
    Java: 0,
    "C++": 0,
    DB: 0,
    Spring: 0,
    React: 0,
    etc: 0,
  });
  const [dateStats, setDateStats] = useState([]);
  const { addToast } = useToasts();

  const today = new Date();
  const pastWeek = new Array(7)
    .fill()
    .map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - index + 1);
      return date.toISOString().split("T")[0];
    })
    .reverse();

  const labelArray = pastWeek.map((dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${month}-${day}`;
  });

  const data1 = {
    labels: labelArray,
    datasets: [
      {
        label: "날짜별 수",
        data: Object.values(dateStats),
        borderColor: "#99CCFF",
        pointBackgroundColor: "blue",
      },
    ],
  };

  const data2 = {
    labels: Object.keys(categoryStats),
    datasets: [
      {
        label: "카테고리별 수",
        data: Object.values(categoryStats),
        backgroundColor: "#99CCFF",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
        afterDataLimits: (scale) => {
          scale.max = scale.max * 1.2;
        },
      },
    },
    layout: {
      padding: {
        left: 8,
        right: 8,
        bottom: 8,
      },
    },
  };

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchUserData();
    fetchVideoData();
  }, []);

  const fetchUserData = () => {
    
  };

  const fetchVideoData = () => {
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

        const pastWeekCount = pastWeek.reduce((acc, dateString) => {
          acc[dateString] = 0;
          return acc;
        }, {});

        const categoryCount = {
          C: 0,
          Python: 0,
          Java: 0,
          "C++": 0,
          DB: 0,
          Spring: 0,
          React: 0,
          etc: 0,
        };

        videoData.forEach((video) => {
          if (video.date.substring(0, 10) in pastWeekCount) {
            pastWeekCount[video.date.substring(0, 10)]++;
          }
          if (video.subject in categoryCount) {
            categoryCount[video.subject]++;
          }
        });

        setDateStats(pastWeekCount);
        setCategoryStats(categoryCount);

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
            console.log("썸네일 출력 성공");
          })
          .catch((error) => console.error("썸네일 출력 실패 : ", error));
      })
      .catch((error) => console.error("영상 목록 요청 실패 : ", error));
  };

  const handleVideoClick = (videoId) => {
    sessionStorage.setItem("selectedVideoId", videoId);
  };

  const handleDeleteButtonClick = (videoId) => {
    Swal.fire({
      title: "정말로 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니요",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/videos/${videoId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("영상 삭제 성공");
            addToast("성공적으로 영상이 삭제되었습니다.", { appearance: "success", autoDismiss: true, autoDismissTimeout: 5000 });
            fetchVideoData();
          })
          .catch((error) => {
            console.error("영상 삭제 요청 실패 : ", error);
            addToast("영상 삭제 요청을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
          });
      }
    });
  };

  return (
    <ListContainer>
      <Navbar />
      <PageBackGround />
      <MainContainer>
        <SubTitle>Dash Board</SubTitle>
        <Container>
          <DashContainer>
            <Sub>날짜별 선형 그래프</Sub>
            <Line data={data1} options={options} />
          </DashContainer>
          <DashContainer>
            <Sub>주제별 막대 그래프</Sub>
            <Bar data={data2} options={options} />
          </DashContainer>
        </Container>
        <Container>
          <DashContainer>
            <Sub>사용자 목록</Sub>
          </DashContainer>
          <DashContainer>
            <Sub>영상 목록</Sub>
            <VideoItems>
              <br></br>
              <VideoListContainer>
                <TextThumbnail>썸네일</TextThumbnail>
                <TextTitle>제목</TextTitle>
                <TextNickname>닉네임</TextNickname>
                <TextDelete></TextDelete>
              </VideoListContainer>
              <DivideLine></DivideLine>
              {videos.map((video) => (
                <div key={video.id}>
                  <VideoListContainer>
                    <Thumbnail src={video.thumbnail} alt="썸네일" />
                    <PlainLink to="/select" onClick={() => handleVideoClick(video.id)}>
                      <TextTitle>{video.title} </TextTitle>
                    </PlainLink>
                    <TextNickname>{video.nickname}</TextNickname>
                    <DeleteButton onClick={() => handleDeleteButtonClick(video.id)}>
                      <BsTrash />
                    </DeleteButton>
                  </VideoListContainer>
                  <DivideLine></DivideLine>
                </div>
              ))}
            </VideoItems>
          </DashContainer>
        </Container>
        <Container>
          <DashContainer>
            <Sub>지원 목록</Sub>
            <Sub>아바타</Sub>
            <ImageContainer>
              {avatarImages.map((avatar, index) => (
                <Image key={index} src={avatar} alt={`아바타${index + 1}`} />
              ))}
            </ImageContainer>
            <hr></hr>
            <Sub>오디오</Sub>
            <ImageContainer>
              {audioImages.map((audio, index) => (
                <Image key={index} src={audio} alt={`오디오${index + 1}`} />
              ))}
            </ImageContainer>
          </DashContainer>
          <DashContainer>
            <Sub>문의 내역</Sub>
          </DashContainer>
        </Container>
      </MainContainer>
    </ListContainer>
  );
};

export default Manage;
