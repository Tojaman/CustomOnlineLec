import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import styled from "styled-components";
import Navbar from "../../components/header/Navbar";
import { GoArrowRight } from "react-icons/go";

import { useDispatch } from "react-redux";
import { subtitle } from "../../redux/subtitle";

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
  justify-content: space-between;
`;

const SaveButton = styled.button`
  margin-top: 5px;
`;

const NextButton = styled(Link)`
  text-decoration: none;
  font-family: "Inter";
  font-size: 18px;
  color: black;
  margin-top: 5px;
`;

const Modify = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [lines, setTexts] = useState([]);
  const [timeRanges, setTimeRanges] = useState([]);

  useEffect(() => {
    const jsonData = [
      { text: " GDB를 결국에 D-Bug잖아요.", start: 15.8, end: 18.28 },
      { text: " 제가 솔직하게 얘기하면 GDB 저도 써봤는데", start: 18.5, end: 22.0 },
      { text: " Inverted 개발할 때 GDB 못 쓰는 경우가 오히려 더 태반이에요.", start: 22.0, end: 26.84 },
      { text: " 진짜 웃긴 얘기지만 프린트 F로 D-Bug 하는 경우도 굉장히 많습니다.", start: 26.84, end: 31.72 },
      { text: " 제가 Kernel 강의하잖아요.", start: 32.12, end: 33.2 },
      { text: " 그러면 F-Trace나 이런 것들 쓴단 말이에요.", start: 33.6, end: 36.02 },
      { text: " 근데 F-Trace도 결국에 근본으로 가보면 프린트 F랑 방법이 좀 비슷해요.", start: 36.52, end: 41.1 },
      {
        text: " 기본적으로 내가 원하는 로그를 찍어서 추적하는 과정 이런 게 프린트 F랑 좀 비슷한 면이 있습니다.",
        start: 41.38,
        end: 47.12,
      },
      { text: " 근데 D-Bug를 사용하면 좋은 게 뭐냐면", start: 47.38, end: 49.42 },
      { text: " 내가 원하는 지점에 멈출 수 있고 변수도 볼 수 있고", start: 49.42, end: 52.84 },
      { text: " 뭐 Assembler로 어떻게 되었나 이런 것도 추적하기 되게 용이한 거죠.", start: 52.84, end: 56.22 },
    ];

    const textsArray = jsonData.map((item) => item.text.trim());
    const timeRangesArray = jsonData.map((item) => ({ start: item.start, end: item.end }));

    setData(jsonData);
    setTexts(textsArray);
    setTimeRanges(timeRangesArray);
  }, []);

  useEffect(() => {
    setModifiedContents([...lines]);
  }, [lines]);

  const [editStates, setEditStates] = useState(Array(lines.length).fill(false));
  const [modifiedContents, setModifiedContents] = useState([...lines]);
  const [result, setResult] = useState([]);

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
    const saves = modifiedContents.map((content, index) => content);
    setResult(saves);

    const newData = modifiedContents.map((content, index) => ({
      text: content,
      start: timeRanges[index].start,
      end: timeRanges[index].end,
    }));

    dispatch(subtitle(newData));
    console.log(newData);
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
              <span>{line}</span>
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
        </SubtitleContainer>
        <ButtonContainer>
          <SaveButton onClick={handleSaveAllClick}>저장</SaveButton>
          <NextButton to="/inform">
            다음 <GoArrowRight />
          </NextButton>
        </ButtonContainer>
      </ModifyContainer>
    </Container>
  );
};

export default Modify;
