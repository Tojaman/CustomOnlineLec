import React, { useState, useRef, useEffect } from "react";
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

const AttachContainer = styled.div`
  padding: 10px;
  margin: 0 auto;
`;

const FileContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const VideoContainer = styled.div`
  margin-bottom: 20px;
`;

const CanvasContainer = styled.div`
  margin-bottom: 20px;

  canvas {
    border: 1px solid #000;
    width: 640px;
  }
`;

const InputPointContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  label {
    font-size: 1em;
    margin-right: 5px;
  }

  input {
    font-size: 1em;
    margin-right: 10px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
  font-size: 1em;
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

const Attach = () => {
  const [videoURL, setVideoURL] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rectRef = useRef({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    isDragging: false,
  });
  const widthInputRef = useRef(null);
  const heightInputRef = useRef(null);
  const [infoText, setInfoText] = useState("");

  const updateVideo = async (event) => {
    URL.revokeObjectURL(videoRef.current.src);
    const file = event.target.files[0];
    setVideoURL(URL.createObjectURL(file));

    videoRef.current.load();
    await new Promise((resolve) => {
      videoRef.current.onloadeddata = () => {
        resolve(videoRef.current);
      };
    });

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.getAttribute("width");
    canvas.height = video.offsetHeight;
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = rectRef.current;
    const widthInput = widthInputRef.current;
    const heightInput = heightInputRef.current;

    const drawVideoToCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.rect(rect.x, rect.y, rect.width, rect.height);
      ctx.stroke();
      ctx.closePath();

      const newInfoText = `시작 지점 : (${rect.x}, ${rect.y})`;
      setInfoText(newInfoText);

      requestAnimationFrame(drawVideoToCanvas);
    };

    const handlePlay = () => {
      drawVideoToCanvas();
    };

    video.addEventListener("play", handlePlay);

    const handleWidthInput = () => {
      const newWidth = parseInt(widthInputRef.current.value);
      if (newWidth > 0 && newWidth < canvas.width) {
        rectRef.current.width = newWidth;
        drawVideoToCanvas();
      } else {
        alert("가로 값이 올바르지 않습니다.");
        widthInputRef.current.value = rectRef.current.width;
      }
    };

    const handleHeightInput = () => {
      const newHeight = parseInt(heightInputRef.current.value);
      if (newHeight > 0 && newHeight < canvas.height) {
        rectRef.current.height = newHeight;
        drawVideoToCanvas();
      } else {
        alert("세로 값이 올바르지 않습니다.");
        heightInputRef.current.value = rectRef.current.height;
      }
    };

    widthInput.addEventListener("input", handleWidthInput);
    heightInput.addEventListener("input", handleHeightInput);

    return () => {
      video.removeEventListener("play", handlePlay);
      widthInput.removeEventListener("input", handleWidthInput);
      heightInput.removeEventListener("input", handleHeightInput);
    };
  }, [videoURL]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const isMouseInsideRect = (e, rect) => {
      const mouseX = e.clientX - canvasRef.current.getBoundingClientRect().left;
      const mouseY = e.clientY - canvasRef.current.getBoundingClientRect().top;

      return mouseX >= rect.x && mouseX <= rect.x + rect.width && mouseY >= rect.y && mouseY <= rect.y + rect.height;
    };

    const handleMouseUp = () => {
      const rect = rectRef.current;
      rect.isDragging = false;
    };

    const handleMouseDown = (e) => {
      const rect = rectRef.current;

      if (isMouseInsideRect(e, rect)) {
        rect.isDragging = true;
      }
    };

    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      const rect = rectRef.current;

      if (rect.isDragging) {
        rect.x = Math.max(0, Math.min(canvas.width - rect.width, e.clientX - canvas.getBoundingClientRect().left - rect.width / 2));
        rect.y = Math.max(0, Math.min(canvas.height - rect.height, e.clientY - canvas.getBoundingClientRect().top - rect.height / 2));
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <Container>
      <Navbar />
      <Sidebar step={1} />
      <SidebarContainer></SidebarContainer>
      <AttachContainer>
        <SubTitle>동영상 업로드</SubTitle>
        <FileContainer>
          <label htmlFor="videofile">Upload a video file : </label>
          <input type="file" id="videofile" name="videofile" accept="video/*" onChange={updateVideo} />
        </FileContainer>

        <VideoContainer>
          <video id="video" width="640" controls ref={videoRef}>
            <source id="videoURL" src={videoURL} type="video/mp4" />
          </video>
        </VideoContainer>

        <CanvasContainer>
          <canvas id="canvas" ref={canvasRef}></canvas>
        </CanvasContainer>

        <InputPointContainer>
          <label htmlFor="widthInput">가로 :</label>
          <input type="number" id="widthInput" ref={widthInputRef} defaultValue="100" />
          <label htmlFor="heightInput">세로 :</label>
          <input type="number" id="heightInput" ref={heightInputRef} defaultValue="100" />
        </InputPointContainer>

        <InfoContainer>{infoText}</InfoContainer>
        <ButtonContainer>
          <NextButton to="/modify">
            다음 <GoArrowRight />
          </NextButton>
        </ButtonContainer>
      </AttachContainer>
    </Container>
  );
};

export default Attach;
