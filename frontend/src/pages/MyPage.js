import React, { useState, useEffect } from "react";
import { Link,  useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import AWS from "aws-sdk";
import { IoIosArrowForward } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import Background from "../assets/img/Group.png";
import Navbar from "../components/header/Navbar";
import originProfileImage from "../assets/origin_profile.jpg";
import Swal from "sweetalert2";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
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

const SubTitle = styled.p`
  display: flex;
  width: 730px;
  font-weight: bold;
  font-size: 20px;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 10px;
`;

const ProfileContainer = styled.div`
  background-color: #fff;
  width: 650px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px;
  border-radius: 10px;
  border: 2px solid #000;
  margin: 0 auto;
`;

const ProfileImageContainer = styled.div`
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
  width: 40%;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const ChangeButton = styled.button`
  border-radius: 10px;
  margin-right: 10px;
`;

const ButtonContent = styled.div`
  display: flex;
`;

const UploadListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 730px;
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
  width: 730px;
  font-weight: bold;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const WithdrawalButton = styled.span`
  cursor: pointer;
  font-size: 15px;
  display: block;
`;

const MyPage = () => {
  const [userProfileImageUrl, setUserProfileImageUrl] = useState(originProfileImage);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); 
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState("");
  const [editedPassword, setEditedPassword] = useState("");


  const [videos, setVideos] = useState([]);

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  const navigate = useNavigate(); // useNavigate 훅 사용
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    axios.patch(`http://localhost:8080/mypage/update/${username}`, {
      newNickname: editedNickname,
      currentPassword: currentPassword, 
      newPassword: newPassword 
    }, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
    .then(response => {
      console.log('서버 응답:', response.data);
      setIsEditing(false); 
    })
    .catch(error => {
      console.error('서버 오류:', error);
    });
  };
  

  const handleCancelClick = () => {
    setEditedNickname(nickname);
    setEditedPassword(password);
    setIsEditing(false);
  };

  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_DEFAULT_REGION
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfileImageUrl(reader.result);
        uploadFileToS3(file);
      };
      reader.readAsDataURL(file);
    }
  };

    const uploadFileToS3 = (file) => {
      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: file.name,
        Body: file
      };
    
      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading file to S3:", err);
        } else {
          console.log("S3:", data.Location);
          sendS3UrlToServer(data.Location);
        }
      });
  };

  const sendS3UrlToServer = (s3Url) => {
    axios.patch(`http://localhost:8080/mypage/update/profile/${username}`, 
    { ProfileS3Path: s3Url },
    {
    headers: {
      'Authorization': `Bearer ${token}`
    }
    })
      .then(response => {
        console.log("S3 URL 전송 성공:", response.data);
      })
      .catch(error => {
        console.error("S3 URL 전송 실패:", error);
      });
  };
  
  useEffect(() => {
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    });

    const s3 = new AWS.S3();
  async function fetchVideos() {
    try {
      const response = await axios.get("http://localhost:8080/videos/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

      const updatedVideoData = videoData.map((video, index) => ({
        ...video,
        thumbnail: urls[index],
      }));

      setVideos(updatedVideoData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function fetchProfileInfo() {
    try {
      const response = await axios.get(`http://localhost:8080/mypage/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("프로필 응답:", response.data.profile);
      setNickname(response.data.nickname);

      // 프로필이 null이 아닌 경우에만 처리
    if (response.data.profile !== null) {

      s3.getSignedUrl("getObject", {
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: response.data.profile,
        Expires: 300,
      }, (err, url) => {
        if (err) {
          console.error("Error getting profile image from S3:", err);
        } else {
          setUserProfileImageUrl(url);
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
  }

  fetchVideos();
  fetchProfileInfo();
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
          console.log("회원탈퇴 요청 성공:", response.data);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("username");
          navigate("/");
        })
        .catch((error) => {
          console.error("회원탈퇴 요청 실패:", error);
        });
    }
  });
};

  return (
    <div>
      <Navbar />
      <Container>
        <PageBackGround />
        <SubTitle>User Profile</SubTitle>
        <ProfileContainer>
          <ProfileImageContainer>
            <Image src={userProfileImageUrl}/>
            <EditIcon htmlFor="fileInput">
              <FaPencilAlt />
              <InputFile id="fileInput" type="file"  onChange={handleImageChange} />
            </EditIcon>
          </ProfileImageContainer>
          <div>
          <InfoText>닉네임</InfoText>
      {isEditing ? (
        <Input value={nickname} onChange={(e) => setEditedNickname(e.target.value)} />
      ) : (
        <Input value={nickname}/>
      )}
      {isEditing && (
        <div>
          <InfoText>현재 비밀번호</InfoText>
          <Input type="password" onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
      )}
      {isEditing && (
        <div>
          <InfoText>새로운 비밀번호</InfoText>
          <Input type="password" onChange={(e) => setNewPassword(e.target.value)}/>
        </div>
      )}
</div>
      {isEditing && (
        <ButtonContent>
          <ChangeButton onClick={handleSaveClick}>저장</ChangeButton>
          <ChangeButton onClick={handleCancelClick}>취소</ChangeButton>
        </ButtonContent>
      )}
      {!isEditing && <ChangeButton onClick={handleEditClick}>수정</ChangeButton>}
        </ProfileContainer>
        <SubTitle>업로드 영상 목록</SubTitle>
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
      </Container>
    </div>
  );
};

export default MyPage;
