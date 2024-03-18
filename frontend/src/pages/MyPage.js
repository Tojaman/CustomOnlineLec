import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import AWS from "aws-sdk";
import { IoIosArrowForward } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import Background from "../assets/img/Group.png";
import Navbar from "../components/header/Navbar";
import originProfileImage from "../assets/origin_profile.jpg";
import Swal from "sweetalert2";
import { useToasts } from "react-toast-notifications";

const Container = styled.div`
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

const SubTitle = styled.p`
  display: flex;
  width: 100%;
  font-weight: bold;
  font-size: 20px;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 10px;
`;

const ContentContainer = styled.div`
  width: 750px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  margin-top: 80px;
`;

const ProfileContainer = styled.div`
  background-color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  border: 2px solid #000;
  margin: 0 auto;
`;

const ProfileImageContainer = styled.div`
  margin-top: 30px;
  margin-left: 30px;
  position: relative;
  display: inline-block;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
`;

const EditIcon = styled.label`
  position: absolute;
  bottom: -10px;
  right: -10px;
  background-color: #ffffff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #000;
`;

const InfoText = styled.span`
  margin-top: 15px;
`;

const InputFile = styled.input`
  display: none;
`;

const Input = styled.input`
  background-color: white;
  padding: 8px;
  width: 100%;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const ChangeButton = styled.button`
  border-radius: 10px;
  margin-right: 10px;
`;

const ButtonContent = styled.div`
  display: flex;
  margin-left: 30px;
  margin-bottom: 40px;
`;

const UploadListContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: lightgrey;
  padding-top: 30px;
  border-radius: 10px;
  position: relative;
  margin: 0 auto;
`;

const ListLink = styled(Link)`
  text-decoration: none;
  color: #000;
`;

const MoreButton = styled.span`
  cursor: pointer;
  color: #fff;
  font-size: 15px;
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px;
`;

const VideoContainer = styled.div`
  height: 200px;
  width: 200px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #000;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 30px;
  margin-bottom: 20px;
`;

const Thumbnail = styled.img`
  max-width: 100%;
  max-height: 125px;
`;

const Text = styled.span`
  max-width: 100%;
  max-height: 50px;
  margin-top: 10px;
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ButtonContainer = styled.div`
  font-weight: bold;
  margin-right: auto;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const WithdrawalButton = styled.span`
  cursor: pointer;
  font-size: 15px;
  display: block;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  width: 30%;
`;

const InfoEditContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MyPage = () => {
  const [profileImage, setProfileImage] = useState(originProfileImage);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [videos, setVideos] = useState([]);
  const { addToast } = useToasts();

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  const navigate = useNavigate();

  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_DEFAULT_REGION,
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    axios
      .patch(
        `http://localhost:8080/mypage/update/${username}`,
        {
          newNickname: editedNickname,
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("회원 정보 수정 요청 성공");
        setIsEditing(false);
        addToast("회원 정보가 성공적으로 수정되었습니다.", { appearance: "success", autoDismiss: true, autoDismissTimeout: 5000 });
      })
      .catch((error) => {
        console.error("회원 정보 수정 요청 실패 : ", error);
        addToast("회원 정보 수정을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
      });
    sessionStorage.setItem("userNickname", editedNickname);
    setNickname(editedNickname);
  };

  const handleCancelClick = () => {
    setEditedNickname(nickname);
    setEditedPassword(password);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        uploadFileToS3(file);
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFileToS3 = (file) => {
    const imageFileName = file.name;
    const imageS3Path = `profile/${imageFileName}`;

    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: imageS3Path,
      Body: file,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log("S3에 프로필 사진 업로드 실패 : ", err);
        addToast("S3에 업로드를 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
      } else {
        console.log("S3에 프로필 사진 업로드 성공");
        sendS3UrlToServer(imageS3Path);
      }
    });
  };

  const sendS3UrlToServer = (s3Url) => {
    axios
      .patch(
        `http://localhost:8080/mypage/update/profile/${username}`,
        { ProfileS3Path: s3Url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("프로필 사진 링크 업로드 요청 성공");
        addToast("프로필이 성공적으로 변경되었습니다.", { appearance: "success", autoDismiss: true, autoDismissTimeout: 5000 });
      })
      .catch((error) => {
        console.error("프로필 사진 링크 업로드 요청 실패 : ", error);
        addToast("프로필 변경을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
      });
  };

  useEffect(() => {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    });

    const s3 = new AWS.S3();

    async function fetchProfileInfo() {
      try {
        const response = await axios.get(`http://localhost:8080/mypage/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("회원 정보 확인 요청 성공");

        setNickname(response.data.nickname);
        setEditedNickname(response.data.nickname);
        sessionStorage.setItem("userNickname", response.data.nickname);

        if (response.data.profile !== null) {
          s3.getSignedUrl(
            "getObject",
            {
              Bucket: process.env.REACT_APP_S3_BUCKET,
              Key: response.data.profile,
              Expires: 300,
            },
            (err, url) => {
              if (err) {
                console.error("프로필 사진 출력 실패 : ", err);
                addToast("프로필 출력을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
              } else {
                console.log("프로필 사진 출력 성공");
                setProfileImage(url);
              }
            }
          );
        }
      } catch (error) {
        if (error.response) {
          console.error("회원 정보 확인 요청 실패 : ", error.response.status);
          addToast("회원 정보 확인을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
        } else {
          console.error("회원 정보 확인 요청 실패 : ", error.message);
          addToast("회원 정보 확인을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
        }
      }
    }

    async function fetchVideos() {
      try {
        const response = await axios.get("http://localhost:8080/videos/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("영상 목록 요청 성공");

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

        const urls = await Promise.all(getThumbnails);

        const updatedVideoData = videoData
          .map((video, index) => ({
            ...video,
            thumbnail: urls[index],
          }))
          .reverse();
        console.log("썸네일 출력 성공");
        const userNickname = sessionStorage.getItem("userNickname");
        const userVideos = updatedVideoData.filter((video) => video.nickname === userNickname);
        setVideos(userVideos);
      } catch (error) {
        if (error.response) {
          console.error("영상 목록 요청 실패 : ", error.response.status);
          addToast("영상 목록 요청을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
        } else {
          console.error("영상 목록 요청 실패 : ", error.message);
          addToast("영상 목록 요청을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
        }
      }
    }

    fetchProfileInfo();
    fetchVideos();
  }, [token, username]);

  const handleWithdrawalClick = () => {
    Swal.fire({
      title: "정말로 탈퇴하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "예",
      cancelButtonText: "아니요",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8080/mypage/delete/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("회원탈퇴 요청 성공");
            addToast("성공적으로 회원탈퇴되었습니다.", { appearance: "success", autoDismiss: true, autoDismissTimeout: 5000 });
            sessionStorage.clear();
            navigate("/");
          })
          .catch((error) => {
            console.error("회원탈퇴 요청 실패 : ", error);
            addToast("회원탈퇴 요청을 실패했습니다.", { appearance: "error", autoDismiss: true, autoDismissTimeout: 5000 });
          });
      }
    });
  };

  return (
    <Container>
      <Navbar />
      <PageBackGround />
      <ContentContainer>
        <SubTitle>User Profile</SubTitle>
        <ProfileContainer>
          <ProfileImageContainer>
            <Image src={profileImage} />
            <EditIcon htmlFor="fileInput">
              <FaPencilAlt />
              <InputFile id="fileInput" type="file" accept="image/*" onChange={handleImageChange} />
            </EditIcon>
          </ProfileImageContainer>

          <InfoContainer>

            {isEditing ? (
              <InfoEditContainer>
              <InfoText>변경할 닉네임</InfoText>
              <Input value={editedNickname} onChange={(e) => setEditedNickname(e.target.value)} /></InfoEditContainer>
            ) : (
                <InfoEditContainer>
                <InfoText>닉네임</InfoText>
              <Input value={nickname} readOnly /></InfoEditContainer>
            )}

            {isEditing && (
              <InfoEditContainer>
                <InfoText>현재 비밀번호</InfoText>
                <Input type="password" onChange={(e) => setCurrentPassword(e.target.value)} />
              </InfoEditContainer>
            )}

            {isEditing && (
              <InfoEditContainer>
                <InfoText>새로운 비밀번호</InfoText>
                <Input type="password" onChange={(e) => setNewPassword(e.target.value)} />
              </InfoEditContainer>
            )}
          </InfoContainer>

          {isEditing && (
            <ButtonContent>
              <ChangeButton onClick={handleSaveClick}>저장</ChangeButton>
              <ChangeButton onClick={handleCancelClick}>취소</ChangeButton>
            </ButtonContent>
          )}
          {!isEditing && (
            <ButtonContent>
              <ChangeButton onClick={handleEditClick}>수정</ChangeButton>
            </ButtonContent>
          )}
        </ProfileContainer>

        <SubTitle>Upload List</SubTitle>
        <UploadListContainer>
          {videos.slice(0, 3).map((video) => (
            <VideoContainer key={video.id}>
              <Thumbnail src={video.thumbnail} alt="썸네일" />
              <Text>{video.title}</Text>
              <Text>{video.person}</Text>
            </VideoContainer>
          ))}
          <MoreButton>
            <ListLink to="/uploadList">
              더보기
              <IoIosArrowForward />
            </ListLink>
          </MoreButton>
        </UploadListContainer>
        <ButtonContainer>
          <WithdrawalButton onClick={handleWithdrawalClick}>
            탈퇴하기
            <IoIosArrowForward />
          </WithdrawalButton>
        </ButtonContainer>
      </ContentContainer>
    </Container>
  );
};

export default MyPage;
