import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import styled from "styled-components";
import Navbar from "../../components/header/Navbar";
import { GoArrowRight } from "react-icons/go";

const Container = styled.div`
  display: flex;
  margin-top: 50px;
`;

const SidebarContainer = styled.nav`
  width: 200px;
  height: 100%;
`;

const SubTitle = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

const ModifyContainer = styled.div`
  padding: 10px;
  margin: 0 auto;
`;

const SubtitleContainer = styled.div`
  padding: 20px;
  height: 700px;
  width: 600px;
  overflow-y: auto;
  border: 2px solid #000;
  border-radius: 5px;
`;

const ModifySubtitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  button {
    align-self: flex-start;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const NextButton = styled(Link)`
  text-decoration: none;
  font-family: "Inter";
  font-size: 18px;
  color: black;
  margin-top: 5px;
`;

const Modify = () => {
  const lines = [
    "동해물과 백두산이 마르고 닳도록.",
    "하느님이 보우하사 우리나라만세.",
    "무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세.",
    "남산위에 저 소나무 철갑을 두른듯.",
    "바람서리 불변함은 우리기상 일세.",
    "무궁화 삼천리 화려강산 대한사람 대한으로 길이보전하세.",
    "가을하늘 공활한데 높고 구름없이 .",
    "밝은달은 우리가슴 일편단심일세.",
    "무궁화 삼천리 화려강산 대한사람 대한으로 길이보전하세.",
    "이 기상과 이 맘으로 충성을 다하여.",
    "괴로우나 즐거우나 나라사랑하세.",
    "무궁화 삼천리 화려강산 대한사람 대한으로 길이보전하세.",
    "동해물과 백두산이 마르고 닳도록.",
    "하느님이 보우하사 우리나라만세.",
    "무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세.",
    "남산위에 저 소나무 철갑을 두른듯.",
    "바람서리 불변함은 우리기상 일세.",
    "무궁화 삼천리 화려강산 대한사람 대한으로 길이보전하세.",
    "가을하늘 공활한데 높고 구름없이 .",
    "밝은달은 우리가슴 일편단심일세.",
    "무궁화 삼천리 화려강산 대한사람 대한으로 길이보전하세.",
    "이 기상과 이 맘으로 충성을 다하여.",
    "괴로우나 즐거우나 나라사랑하세.",
    "무궁화 삼천리 화려강산 대한사람 대한으로 길이보전하세.",
  ];

  const [editStates, setEditStates] = useState(Array(lines.length).fill(false));
  const [modifiedContents, setModifiedContents] = useState([...lines]);
  const setResult = useState([]);

  const handleSaveClick = (index) => {
    const newEditStates = [...editStates];
    newEditStates[index] = false;
    setEditStates(newEditStates);
  };

  const handleInputChange = (index, value) => {
    const newModifiedContents = [...modifiedContents];
    newModifiedContents[index] = value;
    setModifiedContents(newModifiedContents);
  };

  const handleSaveAllClick = () => {
    const updatedResult = modifiedContents.map((content, index) => ({
      original: lines[index],
      modified: content,
    }));
    setResult(updatedResult);
  };

  return (
    <Container>
      <Navbar />
      <Sidebar step={2} />
      <SidebarContainer></SidebarContainer>
      <ModifyContainer>
        <SubTitle>자막 수정</SubTitle>
        <SubtitleContainer>
          {lines.map((line, index) => (
            <ModifySubtitle key={index}>
              <text>{line}</text>
              <textarea
                type="text"
                value={modifiedContents[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={{
                  width: "100%",
                  height: "auto",
                  minHeight: "50px",
                }}
              />
              {editStates[index] && <button onClick={() => handleSaveClick(index)}>저장</button>}
            </ModifySubtitle>
          ))}
          <button onClick={handleSaveAllClick}>저장</button>
        </SubtitleContainer>
        <ButtonContainer>
          <NextButton to="/inform">
            다음 <GoArrowRight />
          </NextButton>
        </ButtonContainer>
      </ModifyContainer>
    </Container>
  );
};

export default Modify;
