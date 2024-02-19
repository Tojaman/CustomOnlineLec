import React, { useEffect } from "react";
import styled from "styled-components";
import { FaCheck } from "react-icons/fa";

const StepContainer = styled.div`
  width: 200px;
  height: 100%;
  box-sizing: border-box;
  position: fixed;
  background-color: #fff;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 90px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  border: 2px solid ${(props) => (props.$current ? "#0066CC" : props.$completed ? "#9DD84B" : "#99CCFF")};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  color: ${(props) => (props.$current ? "#0066CC" : props.$completed ? "#9DD84B" : "#99CCFF")};
  margin-right: 10px;
`;

const StepTitle = styled.div`
  font-size: 16px;
`;

const Progress = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  position: relative;
`;

const ProgressBar = styled.div`
  margin-left: 27px;
  margin-right: 1000px;
  position: absolute;
  width: 3px;
  height: 100%;
  background: ${(props) =>
    props.$current ? `linear-gradient(to bottom, #0066CC 50%, #99CCFF 50%)` : props.$completed ? "#9DD84B" : "#99CCFF"};
  transform: translateX(-50%);
`;

function Sidebar({ step }) {
  const [currentStep, setCurrentStep] = React.useState(1);

  useEffect(() => {
    // step 값에 따라 적절한 동작 수행
    switch (step) {
      case 1:
        setCurrentStep(1);
        break;
      case 2:
        setCurrentStep(2);
        break;
      case 3:
        setCurrentStep(3);
        break;
      default:
        console.log("페이지 없음");
        break;
    }
  }, [step]);

  return (
    <StepContainer>
      <StepsWrapper>
        <Step>
          <StepNumber $current={currentStep === 1} $completed={currentStep > 1}>
            {currentStep > 1 ? <FaCheck /> : "1"}
          </StepNumber>
          <StepTitle>영상 첨부</StepTitle>
        </Step>
        <Progress>
          <ProgressBar $current={currentStep === 1} $completed={currentStep > 1} />
        </Progress>
        <Step>
          <StepNumber $current={currentStep === 2} $completed={currentStep > 2}>
            {currentStep > 2 ? <FaCheck /> : "2"}
          </StepNumber>
          <StepTitle>자막 수정</StepTitle>
        </Step>
        <Progress>
          <ProgressBar $current={currentStep === 2} $completed={currentStep > 2} />
        </Progress>
        <Step>
          <StepNumber $current={currentStep === 3} $completed={currentStep > 3}>
            {currentStep > 3 ? <FaCheck /> : "3"}
          </StepNumber>
          <StepTitle>영상 정보</StepTitle>
        </Step>
      </StepsWrapper>
    </StepContainer>
  );
}

export default Sidebar;
