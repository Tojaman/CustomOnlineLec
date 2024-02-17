import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IoIosArrowForward } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import Navbar from "../components/header/Navbar";

const Container = styled.div`
  margin-right: 100px;
  margin-left: 100px;
  margin-top: 4rem;
`;

const SubTitle = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px;
  border-radius: 10px;
  border: 2px solid #000;
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
  width: 300px;
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
  background-color: lightgrey;
  padding: 20px;
  border-radius: 10px;
  position: relative;
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
  cursor: pointer;
`;

const Thumbnail = styled.img`
  max-width: 100%;
  max-height: 125px;
`;

const Text = styled.span`
  max-width: 100%;
  max-height: 50px;
  margin-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WithdrawalButton = styled.span`
  cursor: pointer;
  font-size: 15px;
  display: block;
  margin-top: 40px;
`;

const MyPage = () => {
  const [userProfileImageUrl, setUserProfileImageUrl] = useState("/favicon.ico");
  const [userName, setUserName] = useState("John Doe");
  const [emailAddress, setEmailAddress] = useState("john.doe@example.com");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserName, setEditedUserName] = useState(userName);
  const [editedEmailAddress, setEditedEmailAddress] = useState(emailAddress);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setUserName(editedUserName);
    setEmailAddress(editedEmailAddress);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedUserName(userName);
    setEditedEmailAddress(emailAddress);
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
        <SubTitle>User Profile</SubTitle>
        <ProfileContainer>
          <ProfileImageContainer>
            <Image src={userProfileImageUrl} alt="프로필" />
            <EditIcon htmlFor="fileInput">
              <FaPencilAlt />
              <InputFile id="fileInput" type="file" accept="image/*" onChange={handleImageChange} />
            </EditIcon>
          </ProfileImageContainer>
          <InfoText>User Name</InfoText>
          {isEditing ? (
            <Input value={editedUserName} onChange={(e) => setEditedUserName(e.target.value)} />
          ) : (
            <Input value={userName} readOnly />
          )}
          <InfoText>Email Address</InfoText>
          {isEditing ? (
            <Input value={editedEmailAddress} onChange={(e) => setEditedEmailAddress(e.target.value)} />
          ) : (
            <Input value={emailAddress} readOnly />
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
          <VideoContainer>
            <Thumbnail src="/favicon.ico" alt="썸네일" />
            <Text>간지나게 사는 방법</Text>
            <Text>Tony</Text>
          </VideoContainer>
          <MoreButton>
            <ListLink to="/uploadList">
              더보기
              <IoIosArrowForward />
            </ListLink>
          </MoreButton>
        </UploadListContainer>
        <WithdrawalButton>
          탈퇴하기
          <IoIosArrowForward />
        </WithdrawalButton>
      </Container>
    </div>
  );
};

export default MyPage;
