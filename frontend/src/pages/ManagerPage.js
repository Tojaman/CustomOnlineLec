import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Line, Bar } from "react-chartjs-2";
import { BsTrash } from "react-icons/bs";
import { FcOk } from "react-icons/fc";
import Navbar from "../components/header/Navbar";
import Background from "../assets/img/Group.png";
import axios from "axios";
import config from '../config';
import AWS from "aws-sdk";
import Swal from "sweetalert2";
import { useToasts } from "react-toast-notifications";

import originProfileImage from "../assets/origin_profile.jpg";

import avatarImg1 from "../assets/avatarImg/기본아바타여1.jpg";
import avatarImg2 from "../assets/avatarImg/기본아바타남1.jpg";
import avatarImg3 from "../assets/avatarImg/윤석열.jpg";
import avatarImg4 from "../assets/avatarImg/트럼프.jpg";
import avatarImg5 from "../assets/avatarImg/키키.jpg";
import avatarImg6 from "../assets/avatarImg/뽀로로.jpg";

import voiceImg1 from "../assets/avatarImg/문재인.jpg";
import voiceImg2 from "../assets/avatarImg/일론머스크.jpg";
import voiceImg3 from "../assets/avatarImg/아이유.jpg";
import voiceImg4 from "../assets/avatarImg/카리나.jpg";

import { registerables, CategoryScale, Chart } from "chart.js";
Chart.register(CategoryScale, ...registerables);

const apiUrl = config.apiUrl;

const avatarImages = [avatarImg1, avatarImg2, avatarImg3, avatarImg4, avatarImg5, avatarImg6];
const audioImages = [voiceImg1, voiceImg2, voiceImg3, voiceImg4];

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
  border-radius: 10px;
`;

const Sub = styled.span`
  display: flex;
  width: 100%;
  font-size: 15px;
  padding: 8px;
  margin-left: 8px;
`;

const UserItems = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  height: 400px;
  overflow-y: auto;
`;

const UserListContainer = styled.div`
  background-color: #fff;
  width: 99%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 2px;
  align-items: center;
`;

const ProfileContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const Profile = styled.img`
  max-width: 60px;
  max-height: 60px;
  object-fit: cover;
`;

const TextProfile = styled.div`
  width: 60px;
  height: 30px;
`;

const TextUsername = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  height: 30px;
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

const ThumbnailContainer = styled.div`
  width: 120px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const Thumbnail = styled.img`
  max-width: 120px;
  max-height: 60px;
  object-fit: cover;
`;

const TextThumbnail = styled.div`
  width: 120px;
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
  padding-right: 10px;
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
  border-radius: 50%;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 12px;
  width: 90%;
`;

const QnaItems = styled.div`
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  height: 450px;
  overflow-y: auto;
`;

const QnaContainer = styled.div`
  align-items: center;
`;

const QnaBox = styled.div`
  padding: 10px;
`;

const QnaTitle = styled.p`
  margin: 0;
  font-family: "Inter";
  font-weight: 600;
  font-size: 20px;
`;

const QnaDate = styled.p`
  color: gray;
  margin: 0;
`;

const QnaContent = styled.p`
  margin: 0;
  font-family: "Inter";
  font-color: gray;
  font-weight: 400;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const QnaContainer2 = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledFcOk = styled(FcOk)`
  font-size: 25px;
`;

const Manage = () => {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
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
  const [qnaData, setQnaData] = useState([]);
  const { addToast } = useToasts();

  const today = new Date();
  const pastWeek = new Array(7)
    .fill()
    .map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
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
    fetchQnaData();
  }, []);

  const fetchUserData = () => {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    });

    const s3 = new AWS.S3();

    axios
      .get(`${apiUrl}/admin/user/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userData = response.data
          .map((user) => ({
            nickname: user.nickname,
            profileS3Path: user.profileS3Path,
            username: user.username,
          }))
          .slice(1)
          .reverse();
        console.log("사용자 목록 요청 성공");

        const getProfiles = userData.map((user) => {
          return user.profileS3Path
            ? s3.getSignedUrlPromise("getObject", {
                Bucket: process.env.REACT_APP_S3_BUCKET,
                Key: user.profileS3Path,
                Expires: 300,
              })
            : Promise.resolve(null);
        });

        Promise.all(getProfiles)
          .then((urls) => {
            const modifiedUserData = userData
              .map((user, index) => ({
                ...user,
                profileS3Path: urls[index] ? urls[index] : originProfileImage,
              }))
              .reverse();
            setUsers(modifiedUserData);
            console.log("프로필 출력 성공");
          })
          .catch((error) => console.error("프로필 출력 실패 : ", error));
      })
      .catch((error) => console.error("사용자 목록 요청 실패 : ", error));
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
      .get(`${apiUrl}/videos/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const videoData = response.data.map((video) => ({
          id: video.id || "",
          title: video.title || "",
          thumbnail: video.thumbnail || "",
          nickname: video.nickname || "",
          date: video.date || "",
          subject: video.subject || "",
        }));
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
          if (
            video.title.trim() !== "" &&
            video.thumbnail.trim() !== "" &&
            video.nickname.trim() !== "" &&
            video.date.trim() !== "" &&
            video.subject.trim() !== ""
          ) {
            if (video.subject in categoryCount) {
              categoryCount[video.subject]++;
            }
          }
        });

        setDateStats(pastWeekCount);
        setCategoryStats(categoryCount);

        const getThumbnails = videoData.map((video) => {
          if (video.thumbnail) {
            return s3.getSignedUrlPromise("getObject", {
              Bucket: process.env.REACT_APP_S3_BUCKET,
              Key: video.thumbnail,
              Expires: 300,
            });
          } else {
            return Promise.resolve("");
          }
        });

        Promise.all(getThumbnails)
          .then((urls) => {
            const updatedVideoData = videoData
              .map((video, index) => ({
                ...video,
                thumbnail: urls[index] ? urls[index] : "",
              }))
              .reverse();
            setVideos(updatedVideoData);
            console.log("썸네일 출력 성공");
          })
          .catch((error) => console.error("썸네일 출력 실패 : ", error));
      })
      .catch((error) => console.error("영상 목록 요청 실패 : ", error));
  };

  const fetchQnaData = () => {
    axios
      .get(`${apiUrl}/qna/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const qnaData = response.data.slice(0, 10); 
        console.log("Q&A 목록 요청 성공");
        setQnaData(qnaData);
      })
      .catch((error) => console.error("Q&A 목록 요청 실패: ", error));
  };

  const handleVideoClick = (videoId) => {
    sessionStorage.setItem("selectedVideoId", videoId);
  };

  const handleDeleteUserButtonClick = (username) => {
    Swal.fire({
      title: "정말로 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니요",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiUrl}/mypage/delete/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("회원 삭제 요청 성공");
            addToast("성공적으로 회원이 삭제되었습니다.", { appearance: "success", autoDismiss: true, autoDismissTimeout: 5000 });
            fetchUserData();
          })
          .catch((error) => {
            console.error("회원 삭제 요청 실패 : ", error);
            addToast("회원 삭제 요청을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
          });
      }
    });
  };

  const handleDeleteVideoButtonClick = (videoId) => {
    Swal.fire({
      title: "정말로 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니요",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiUrl}/admin/${videoId}`, {
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
  const handleDeleteQnaButtonClick = (qnaId) => {
    Swal.fire({
      title: "문의 확인되었습니다.",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      axios
        .delete(`${apiUrl}/qna/${qnaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("문의 삭제 성공");
          fetchQnaData();
        })
        .catch((error) => {
          console.error("문의 삭제 요청 실패 : ", error);
          addToast("문의 삭제 요청을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
        });
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
            <br></br>
            <UserItems>
              <UserListContainer>
                <TextProfile>프로필</TextProfile>
                <TextUsername>아이디</TextUsername>
                <TextNickname>닉네임</TextNickname>
                <TextDelete></TextDelete>
              </UserListContainer>
              <DivideLine></DivideLine>
              {users.map((user) => (
                <div key={user.username}>
                  <UserListContainer>
                    <ProfileContainer>
                      <Profile src={user.profileS3Path} alt="프로필" />
                    </ProfileContainer>
                    <TextUsername>{user.username} </TextUsername>
                    <TextNickname>{user.nickname}</TextNickname>
                    <DeleteButton onClick={() => handleDeleteUserButtonClick(user.username)}>
                      <BsTrash />
                    </DeleteButton>
                  </UserListContainer>
                  <DivideLine></DivideLine>
                </div>
              ))}
            </UserItems>
          </DashContainer>
          <DashContainer>
            <Sub>영상 목록</Sub>
            <br></br>
            <VideoItems>
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
                    <ThumbnailContainer>
                      <Thumbnail src={video.thumbnail} alt="썸네일" />
                    </ThumbnailContainer>
                    {video.id !== "" &&
                    video.title !== "" &&
                    video.thumbnail !== "" &&
                    video.nickname !== "" &&
                    video.date !== "" &&
                    video.subject !== "" ? (
                      <PlainLink to="/select" onClick={() => handleVideoClick(video.id)}>
                        <TextTitle>{video.title} </TextTitle>
                      </PlainLink>
                    ) : (
                      <TextTitle>Error</TextTitle>
                    )}
                    <TextNickname>{video.nickname}</TextNickname>
                    <DeleteButton onClick={() => handleDeleteVideoButtonClick(video.id)}>
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
            <QnaItems>
              <DivideLine></DivideLine>
              {qnaData.map((qna, index) => (
                <><QnaContainer key={qna.id || index}>
                  <QnaBox>
                    <QnaContainer2>
                      <QnaTitle>{qna.title}</QnaTitle>
                      <QnaDate>{qna.date}</QnaDate>
                    </QnaContainer2>
                    <QnaContainer2>
                      <QnaContent>{qna.content}</QnaContent>
                      <DeleteButton onClick={() => handleDeleteQnaButtonClick(qna.id)}>
                        <StyledFcOk />
                      </DeleteButton>
                    </QnaContainer2>
                  </QnaBox>
                </QnaContainer><DivideLine></DivideLine></>
              ))}
            </QnaItems>
          </DashContainer>
        </Container>
      </MainContainer>
    </ListContainer>
  );
};

export default Manage;
