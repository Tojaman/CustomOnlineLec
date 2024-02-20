import * as posenet_module from "@tensorflow-models/posenet";
import * as facemesh_module from "@tensorflow-models/facemesh";
import * as faceLandmarksDetection_module from "@tensorflow-models/face-landmarks-detection";
import * as tf from "@tensorflow/tfjs";
import * as paper from "paper";
import "@tensorflow-models/face-detection";
import "babel-polyfill";
import AWS from "aws-sdk";
import { SVGUtils } from "./utils/svgUtils";
import { PoseIllustration } from "./utils/illustration";
import { Skeleton } from "./utils/skeleton";

import * as girlSVG from "./resources/illustration/girl.svg";
import * as test1SVG from "./resources/illustration/test1.svg";
import * as test2SVG from "./resources/illustration/test2.svg";
import * as test3SVG from "./resources/illustration/윤석열.svg";
import * as test4SVG from "./resources/illustration/트럼프.svg";
import * as test5SVG from "./resources/illustration/키키.svg";

class Context {
  constructor() {
    this.originVideo = document.getElementById("originVideo");
    this.resultVideo = document.getElementById("resultVideo");

    this.copyCanvas = document.getElementById("copyCanvas");
    this.copyctx = this.copyCanvas.getContext("2d");
    this.camCanvas = document.getElementById("camCanvas");
    this.camctx = this.camCanvas.getContext("2d");
    this.camFlipCanvas = document.getElementById("camFlipCanvas");
    this.flipedctx = this.camFlipCanvas.getContext("2d");
    this.mergedCanvas = document.getElementById("mergedCanvas");
    this.mergedctx = this.mergedCanvas.getContext("2d");

    this.canvas = document.querySelector(".illustrationCanvas");
  }
}

let camera;
let illustration = null;

let detection = null;
let facemesh = null;
let posenet = null;

let eyesDetection = null;
let faceDetection = null;
let poseDetection = null;

let canvasScope;

let originWeight = 1280;
let originHeight = 720;
let pointWeight = 640;
let pointHeight = 360;
let sx = 505;
let sy = 125;
let sw = 135;
let sh = 95;

const EAR_THRESHOLD = 0.27;

function setting() {
  camera.originVideo.width = originWeight;
  let rate = originWeight / pointWeight;
  sx = sx * rate;
  sy = sy * rate;
  sw = sw * rate;
  sh = sh * rate;
}

function setupCanvas() {
  canvasScope = paper.default;
  canvasScope.setup(camera.canvas);
  canvasScope.view.setViewSize(sw, sh);
}

function toggleLoadingUI(showLoadingUI, loadingDivId = "loading", contentDivId = "videoPlayer") {
  if (showLoadingUI) {
    document.getElementById(loadingDivId).style.display = "block";
    document.getElementById(contentDivId).style.display = "none";
  } else {
    document.getElementById(loadingDivId).style.display = "none";
    document.getElementById(contentDivId).style.display = "block";
  }
}

function setStatusText(text) {
  const resultElement = document.getElementById("status");
  resultElement.innerText = text;
}

function drawVideoToCanvas() {
  camera.originVideo.width = originWeight;
  camera.originVideo.height = originHeight;

  camera.copyCanvas.width = originWeight;
  camera.copyCanvas.height = originHeight;

  camera.mergedCanvas.width = originWeight;
  camera.mergedCanvas.height = originHeight;

  camera.camCanvas.width = sw;
  camera.camCanvas.height = sh;

  camera.camFlipCanvas.width = sw;
  camera.camFlipCanvas.height = sh;

  camera.mergedCanvas.width = originWeight;
  camera.mergedCanvas.height = originHeight;

  camera.copyctx.clearRect(0, 0, camera.copyCanvas.width, camera.copyCanvas.height);
  camera.copyctx.save();
  camera.copyctx.drawImage(camera.originVideo, 0, 0, camera.copyCanvas.width, camera.copyCanvas.height);
  camera.copyctx.restore();

  camera.camctx.clearRect(0, 0, sw, sh);
  camera.camctx.save();
  camera.camctx.drawImage(camera.copyCanvas, sx, sy, sw, sh, 0, 0, sw, sh);
  camera.camctx.restore();

  camera.flipedctx.clearRect(0, 0, sw, sh);
  camera.flipedctx.save();
  camera.flipedctx.scale(-1, 1);
  camera.flipedctx.drawImage(camera.camCanvas, 0, 0, sw, sh, -sw, 0, sw, sh);
  camera.flipedctx.restore();

  camera.mergedctx.clearRect(0, 0, camera.copyCanvas.width, camera.copyCanvas.height);
  camera.mergedctx.save();
  camera.mergedctx.drawImage(camera.copyCanvas, 0, 0, camera.copyCanvas.width, camera.copyCanvas.height);
  camera.mergedctx.fillStyle = "white";
  camera.mergedctx.fillRect(sx, sy, sw, sh);
  camera.mergedctx.strokeStyle = "black";
  camera.mergedctx.lineWidth = 1;
  camera.mergedctx.strokeRect(sx, sy, sw, sh + 5);
  camera.mergedctx.drawImage(camera.canvas, sx, sy, sw, sh);
  camera.mergedctx.restore();

  requestAnimationFrame(drawVideoToCanvas);
}

function detectPose() {
  let pauseFlag = false;

  camera.originVideo.addEventListener("play", function () {
    var canvasStream = camera.mergedCanvas.captureStream();
    resultVideo.srcObject = canvasStream;
    resultVideo.play();
    drawVideoToCanvas();
    pauseFlag = false;
  });

  camera.originVideo.addEventListener("pause", function () {
    pauseFlag = true;
  });

  async function poseDetectionFrame() {
    if (pauseFlag) {
      requestAnimationFrame(poseDetectionFrame);
      return;
    }

    let poses = [];

    const input = tf.browser.fromPixels(camera.camCanvas);
    const selectedAvatarSVG = await loadSelectedAvatar(); // 아바타
    faceDetection = await facemesh.estimateFaces(input, false, false, { scoreThreshold: 0.1 });

    poseDetection = await posenet.estimatePoses(camFlipCanvas, {
      flipHorizontal: true,
      decodingMethod: "multi-person",
      maxDetections: 1,
      scoreThreshold: 0.7,
      nmsRadius: 30.0,
    });

    eyesDetection = await detection.estimateFaces({
      input: input,
      returnTensors: false,
      flipHorizontal: false,
      predictIrises: true,
    });

    poses = poses.concat(poseDetection);
    input.dispose();

    canvasScope.project.clear();

    if (poses.length >= 1 && illustration) {
      Skeleton.flipPose(poses[0]);

      if (faceDetection && faceDetection.length > 0) {
        let face = Skeleton.toFaceFrame(faceDetection[0]);
        illustration.updateSkeleton(poses[0], face);
        eyesDetection.forEach((eyesDetection) => {
          const rightEAR = getEAR(eyesDetection.annotations.rightEyeLower0, eyesDetection.annotations.rightEyeUpper0);
          const leftEAR = getEAR(eyesDetection.annotations.leftEyeLower0, eyesDetection.annotations.leftEyeUpper0);
          let blinked = leftEAR <= EAR_THRESHOLD && rightEAR <= EAR_THRESHOLD;
          if (blinked) {
            parseSVG(selectedAvatarSVG, blinked);
          } else {
            parseSVG(selectedAvatarSVG, blinked);
          }
        });
      } else {
        illustration.updateSkeleton(poses[0], null);
      }
      illustration.draw(canvasScope, sw, sh);
    }

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

function getEAR(upper, lower) {
  return (
    (getEucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1]) +
      getEucledianDistance(upper[3][0], upper[3][1], lower[2][0], lower[2][1])) /
    (2 * getEucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]))
  );
}

function getEucledianDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

async function parseSVG(target, blinking) {
  let svgScope = await SVGUtils.importSVG(target);
  let skeleton = new Skeleton(svgScope);
  illustration = new PoseIllustration(canvasScope);
  illustration.bindSkeleton(skeleton, svgScope, blinking);
}

async function loadSelectedAvatar() {
  const selectedAvatarId = sessionStorage.getItem('selectedAvatar');
  if (selectedAvatarId) {
    let selectedAvatarSVG;
    switch (selectedAvatarId) {
      case 'avatar1':
        selectedAvatarSVG = test1SVG.default;
        break;
      case 'avatar2':
        selectedAvatarSVG = test2SVG.default;
        break;
      case 'avatar3':
        selectedAvatarSVG = test3SVG.default;
        break;
      case 'avatar4':
        selectedAvatarSVG = test4SVG.default;
        break;
     case 'avatar5':
        selectedAvatarSVG = test5SVG.default;
        break; 

      // 다른 아바타에 대한 처리 추가
      default:
        console.log("Unknown selected avatar ID:", selectedAvatarId);
        return null;
    }
    return selectedAvatarSVG; // 선택된 아바타의 SVG 경로 반환
  } else {
    console.log("No selected avatar ID found in session storage.");
    return null;
  }
}

async function loadModels() {
  setStatusText("Loading PoseNet model...");
  const selectedAvatarSVG = await loadSelectedAvatar();
  posenet = await posenet_module.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    inputResolution: 200,
    multiplier: 1.0,
    quantBytes: 2,
  });

  setStatusText("Loading FaceMesh model...");
  facemesh = await facemesh_module.load();

  detection = await faceLandmarksDetection_module.load(faceLandmarksDetection_module.SupportedPackages.mediapipeFacemesh, {
    maxFaces: 1,
  });

  setStatusText("Loading Avatar file...");
  await parseSVG(selectedAvatarSVG, true);
}

function displayPreviousSessionInfo() {
  const selectedVideoInfoString = sessionStorage.getItem("selectedVideoInfo");
  const selectedVideoInfo = JSON.parse(selectedVideoInfoString);
  
  if (selectedVideoInfo) {
    document.getElementById("title").textContent = selectedVideoInfo.title;
    document.getElementById("instructor").textContent = selectedVideoInfo.nickname;
    document.getElementById("description").textContent = selectedVideoInfo.content;
    document.getElementById("date").textContent = selectedVideoInfo.date;

    // S3에서 동영상 정보 가져오기
    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    });

    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: selectedVideoInfo.convertVideoS3Path
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        console.error("S3 동영상 객체 가져오기 오류:", err);
      } else {
        console.log("S3 동영상 객체 가져옴:", data);

        const videoBlob = new Blob([data.Body], { type: data.ContentType });
        const videoUrl = URL.createObjectURL(videoBlob);
        
        const videoElement = document.getElementById("originVideo");
        videoElement.src = videoUrl;
      }
    });
  } else {
    console.log("이전에 저장된 세션 정보가 없습니다.");
  }
}


export async function run() {
  displayPreviousSessionInfo();
  camera = new Context();

  setting();

  setupCanvas();

  toggleLoadingUI(true);

  await loadModels();

  toggleLoadingUI(false);

  detectPose(posenet);
}

run();

document.addEventListener("DOMContentLoaded", function () {
  var downloadButton = document.getElementById("downloadButton");
  downloadButton.addEventListener("click", downloadPDFFromS3); // downloadPDF 대신 downloadPDFFromS3를 호출

  function downloadPDFFromS3() {
    const selectedVideoInfoString = sessionStorage.getItem("selectedVideoInfo");
    const selectedVideoInfo = JSON.parse(selectedVideoInfoString);

    if (!selectedVideoInfo) {
      console.log("이전에 저장된 세션 정보가 없습니다.");
      return;
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    });

    const params2 = {
      Bucket: process.env.REACT_APP_S3_BUCKET,
      Key: selectedVideoInfo.lecturenote // 강의 자료의 S3 키를 세션에서 가져옴
    };

    s3.getObject(params2, (err, data) => {
      if (err) {
        console.error("S3 강의 자료 객체 가져오기 오류:", err);
      } else {
        console.log("S3 강의 자료 객체 가져옴:", data);

        const pdfBlob = new Blob([data.Body], { type: data.ContentType });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        const link = document.createElement("a");
        link.href = pdfUrl;
         // 다운로드될 파일 이름 설정
         const fileName = selectedVideoInfo.lecturenote.split("/").pop(); // S3 키에서 파일 이름 추출
         link.download = fileName;
        link.click();
      }
    });
  }
});


document.getElementById("goBackButton").addEventListener("click", function () {
  window.location.href = "/videoList";
});

// 아바타 선택 창 토글 함수
function toggleAvatarSelection() {
  var avatarSelection = document.getElementById("avatarSelection");
  avatarSelection.hidden = !avatarSelection.hidden;
}

// 아바타 선택 이벤트 핸들러
function handleAvatarSelection(avatarId) {
  // 선택한 아바타의 ID를 세션 스토리지에 저장
  sessionStorage.setItem('selectedAvatar', avatarId);
   // 세션 스토리지에 저장된 내용을 콘솔에 출력
   console.log("선택된 아바타:", sessionStorage.getItem('selectedAvatar'));
}

// 버튼 클릭 이벤트 핸들러
document.getElementById("toggleAvatarButton").addEventListener("click", function() {
  toggleAvatarSelection();
});

// 각 아바타 버튼에 클릭 이벤트 핸들러 추가
document.getElementById("avatar1").addEventListener("click", function() {
  handleAvatarSelection("avatar1"); // 아바타 1을 선택한 경우
});

document.getElementById("avatar2").addEventListener("click", function() {
  handleAvatarSelection("avatar2"); 
});
document.getElementById("avatar3").addEventListener("click", function() {
  handleAvatarSelection("avatar3"); 
});
document.getElementById("avatar4").addEventListener("click", function() {
  handleAvatarSelection("avatar4"); 
});
document.getElementById("avatar5").addEventListener("click", function() {
  handleAvatarSelection("avatar5"); 
});



