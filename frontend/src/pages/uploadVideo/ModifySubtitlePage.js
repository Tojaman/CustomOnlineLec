import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import styled from "styled-components";
import Navbar from "../../components/header/Navbar";
import { GoArrowRight } from "react-icons/go";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { subtitle } from "../../redux/subtitle";
import { SyncLoader } from "react-spinners";
import { useToasts } from "react-toast-notifications";
const { addToast } = useToasts();

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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Modify = () => {
  const dispatch = useDispatch();
  const transSubtitle = useSelector((state) => state.subtitle.value);
  const jsonData = transSubtitle.subtitleList;
  const [isLoading, setLoading] = useState(true);

  const [texts, setTexts] = useState([]);
  const [timeRanges, setTimeRanges] = useState([]);

  const [modifiedContents, setModifiedContents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!jsonData || jsonData.length === 0) {
        setLoading(true);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setTexts(jsonData.map((item) => item.text.trim()));
        setModifiedContents(jsonData.map((item) => item.text.trim()));
        setTimeRanges(jsonData.map((item) => ({ start: item.start, end: item.end })));
        setLoading(false);
      }
    };
    if (isLoading) {
      fetchData();
    }
  }, [jsonData, isLoading]);

  const handleSaveAllClick = () => {
    addToast("자막이 성공적으로 저장되었습니다.", { appearance: "success", autoDismiss: true, autoDismissTimeout: 5000 });

    const newData = modifiedContents.map((content, index) => ({
      text: content,
      start: timeRanges[index].start,
      end: timeRanges[index].end,
    }));
    const subtitleResponse = { subtitleEdit: newData };

    dispatch(subtitle(subtitleResponse));
  };

  const handleTextChange = (index, newValue) => {
    const updatedContents = [...modifiedContents];
    updatedContents[index] = newValue;
    setModifiedContents(updatedContents);
  };

  const handleNextClick = () => {

  };

  return (
    <Container>
      <Navbar />
      <Sidebar step={2} />
      <SidebarContainer></SidebarContainer>

      {isLoading ? (
        <ModifyContainer>
          <SubTitle>자막 수정</SubTitle>
          <SubtitleContainer>
            <LoadingContainer>
              <SyncLoader color="#99CCFF" size={15} />
            </LoadingContainer>
          </SubtitleContainer>
        </ModifyContainer>
      ) : (
        <ModifyContainer>
          <SubTitle>자막 수정</SubTitle>
          <SubtitleContainer>
            {texts.map((line, index) => (
              <ModifySubtitle key={index}>
                <span>{line}</span>
                <textarea
                  type="text"
                  value={modifiedContents[index]}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  style={{
                    width: "100%",
                    height: "auto",
                    minHeight: "50px",
                  }}
                />
              </ModifySubtitle>
            ))}
          </SubtitleContainer>
          <ButtonContainer>
            <SaveButton onClick={handleSaveAllClick}>저장</SaveButton>
            <NextButton to="/inform" onClick={handleNextClick}>
              다음 <GoArrowRight />
            </NextButton>
          </ButtonContainer>
        </ModifyContainer>
      )}
    </Container>
  );
};

export default Modify;
