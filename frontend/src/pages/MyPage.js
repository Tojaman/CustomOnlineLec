import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IoIosArrowForward } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import Background from "../assets/img/Group.png";
import Navbar from "../components/header/Navbar";
import originProfileImage from "../assets/origin_profile.jpg";

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

const videos = [
  { id: 1, title: "간지나게 사는 방법", person: "john" },
  { id: 2, title: "리액트 컴포넌트 디자인", person: "john" },
  { id: 3, title: "웹 개발 기초", person: "john" },
  { id: 4, title: "웹 개발 기초", person: "john" },
  { id: 5, title: "웹 개발 기초", person: "john" },
  { id: 6, title: "웹 개발 기초", person: "john" },
  { id: 7, title: "웹 개발 기초", person: "john" },
];

const MyPage = () => {
  const [userProfileImageUrl, setUserProfileImageUrl] = useState(originProfileImage);
  const [nickname, setNickname] = useState("john");
  const [password, setPassword] = useState("a");
  const [isEditing, setIsEditing] = useState(false);
  const [editedNickname, setEditedNickname] = useState(nickname);
  const [editedPassword, setEditedPassword] = useState(password);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setNickname(editedNickname);
    setPassword(editedPassword);
    setIsEditing(false);
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
      reader.onloadend = () => {
        setUserProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Navbar />
      <Container>
        <PageBackGround />
        <SubTitle>User Profile</SubTitle>
        <ProfileContainer>
          <ProfileImageContainer>
            <Image src={userProfileImageUrl} alt="프로필" />
            <EditIcon htmlFor="fileInput">
              <FaPencilAlt />
              <InputFile id="fileInput" type="file" accept="image/*" onChange={handleImageChange} />
            </EditIcon>
          </ProfileImageContainer>
          <InfoText>Nickname</InfoText>
          {isEditing ? (
            <Input value={editedNickname} onChange={(e) => setEditedNickname(e.target.value)} />
          ) : (
            <Input value={nickname} readOnly />
          )}
          <InfoText>Password</InfoText>
          {isEditing ? (
            <Input value={editedPassword} onChange={(e) => setEditedPassword(e.target.value)} />
          ) : (
            <Input type="password" value={password} readOnly />
          )}
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
            <VideoContainer>
              <Thumbnail src={originProfileImage} alt="썸네일" />
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
          <WithdrawalButton>
            탈퇴하기
            <IoIosArrowForward />
          </WithdrawalButton>
        </ButtonContainer>
      </Container>
    </div>
  );
};

export default MyPage;
