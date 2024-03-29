import * as posenet_module from "@tensorflow-models/posenet";
import * as facemesh_module from "@tensorflow-models/facemesh";
import * as faceLandmarksDetection_module from "@tensorflow-models/face-landmarks-detection";
import * as tf from "@tensorflow/tfjs";
import * as paper from "paper";
import "@tensorflow-models/face-detection";
import "babel-polyfill";
import { SVGUtils } from "./utils/svgUtils";
import { PoseIllustration } from "./utils/illustration";
import { Skeleton } from "./utils/skeleton";
import { displayPreviousSessionInfo, downloadPDFFromS3, openDiv } from "./extra.js";

import * as test1SVG from "./resources/illustration/test1.svg";
import * as test2SVG from "./resources/illustration/test2.svg";
import * as test3SVG from "./resources/illustration/윤석열.svg";
import * as test4SVG from "./resources/illustration/트럼프.svg";
import * as test5SVG from "./resources/illustration/키키.svg";
import * as test6SVG from "./resources/illustration/뽀로로.svg";

let camera;
let illustration = null;

let detection = null;
let facemesh = null;
let posenet = null;

let eyesDetection = null;
let faceDetection = null;
let poseDetection = null;

let canvasScope;

let showSubtitle = false;
let subtitles;

const selectedVideoInfoString = sessionStorage.getItem("selectedVideoInfo");
const selectedVideoInfo = JSON.parse(selectedVideoInfoString);
if (selectedVideoInfo.subtitle) {
  subtitles = JSON.parse(selectedVideoInfo.subtitle);
}

let originWidth = selectedVideoInfo.videoWidth;
let originHeight = selectedVideoInfo.videoHeight;
let pointWidth = 640;
let sx = selectedVideoInfo.x;
let sy = selectedVideoInfo.y;
let sw = selectedVideoInfo.width;
let sh = selectedVideoInfo.height;

const EAR_THRESHOLD = 0.27;

function setting() {
  camera.originVideo.width = originWidth;
  let rate = originWidth / pointWidth;
  sx = sx * rate;
  sy = sy * rate;
  sw = sw * rate;
  sh = sh * rate;
}

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

async function drawVideoToCanvas() {
  camera.originVideo.width = originWidth;
  camera.originVideo.height = originHeight;

  camera.copyCanvas.width = originWidth;
  camera.copyCanvas.height = originHeight;

  camera.mergedCanvas.width = originWidth;
  camera.mergedCanvas.height = originHeight;

  camera.camCanvas.width = sw;
  camera.camCanvas.height = sh;

  camera.camFlipCanvas.width = sw;
  camera.camFlipCanvas.height = sh;

  camera.mergedCanvas.width = originWidth;
  camera.mergedCanvas.height = originHeight;

  while (true) {
    if (camera.originVideo.paused || camera.originVideo.ended) {
      break;
    }

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

    if (subtitles) {
      if (showSubtitle) {
        camera.mergedctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        camera.mergedctx.fillRect(10, camera.mergedCanvas.height - 50, camera.mergedCanvas.width - 20, 40);

        const currentTime = camera.originVideo.currentTime;
        let currentSubtitle = subtitles.find((subtitle) => currentTime >= subtitle.start && currentTime <= subtitle.end);
        if (currentSubtitle) {
          const maxSubtitleLength = 80;

          if (currentSubtitle.text.length > maxSubtitleLength) {
            const midpoint = Math.ceil(currentSubtitle.text.length / 2);

            const firstHalfText = currentSubtitle.text.substr(0, midpoint);
            const secondHalfText = currentSubtitle.text.substr(midpoint);
            if (currentSubtitle.start + (currentSubtitle.end - currentSubtitle.start) / 2 >= currentTime) {
              camera.mergedctx.fillStyle = "black";
              camera.mergedctx.font = "25px Arial";
              camera.mergedctx.fillText(firstHalfText, 20, camera.mergedCanvas.height - 20);
            } else {
              camera.mergedctx.fillStyle = "black";
              camera.mergedctx.font = "25px Arial";
              camera.mergedctx.fillText(secondHalfText, 20, camera.mergedCanvas.height - 20);
            }
          } else {
            camera.mergedctx.fillStyle = "black";
            camera.mergedctx.font = "25px Arial";
            camera.mergedctx.fillText(currentSubtitle.text, 20, camera.mergedCanvas.height - 20);
          }
        }
      }
    }

    camera.mergedctx.restore();

    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
}

function detectPose() {
  let pauseFlag = false;

  camera.originVideo.addEventListener("play", async function () {
    if (resultVideo.srcObject) {
      resultVideo.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }

    drawVideoToCanvas();
    var canvasStream = camera.mergedCanvas.captureStream();
    resultVideo.srcObject = canvasStream;
    resultVideo.play();
    pauseFlag = false;
  });

  camera.originVideo.addEventListener("pause", function () {
    resultVideo.pause();
    pauseFlag = true;
  });

  async function poseDetectionFrame() {
    if (pauseFlag) {
      requestAnimationFrame(poseDetectionFrame);
      return;
    }

    const input = tf.browser.fromPixels(camera.camCanvas);
    const selectedAvatarSVG = await loadSelectedAvatar();
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

    input.dispose();

    canvasScope.project.clear();

    if (poseDetection.length >= 1 && illustration) {
      const pose = poseDetection[0];
      Skeleton.flipPose(pose);

      let face = null;
      if (faceDetection && faceDetection.length > 0) {
        face = Skeleton.toFaceFrame(faceDetection[0]);
      }
      illustration.updateSkeleton(pose, face);

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
  const selectedAvatarId = sessionStorage.getItem("selectedAvatar");
  if (selectedAvatarId) {
    let selectedAvatarSVG;
    switch (selectedAvatarId) {
      case "avatar1":
        selectedAvatarSVG = test1SVG.default;
        break;
      case "avatar2":
        selectedAvatarSVG = test2SVG.default;
        break;
      case "avatar3":
        selectedAvatarSVG = test3SVG.default;
        break;
      case "avatar4":
        selectedAvatarSVG = test4SVG.default;
        break;
      case "avatar5":
        selectedAvatarSVG = test5SVG.default;
        break;
      case "avatar6":
        selectedAvatarSVG = test6SVG.default;
        break;

      default:
        return null;
    }
    return selectedAvatarSVG;
  } else {
    console.log("아바타 선택 오류");
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

export async function run() {
  displayPreviousSessionInfo();

  camera = new Context();

  setting();

  setupCanvas();

  toggleLoadingUI(true);

  await loadModels();

  toggleLoadingUI(false);

  detectPose(posenet);

  const role = sessionStorage.getItem("role");
  if (role === "ROLE_ADMIN") {
    document.getElementById("toggleContent").style.display = "block";
  }
}

run();

document.addEventListener("DOMContentLoaded", function () {
  var downloadButton = document.getElementById("downloadButton");
  downloadButton.addEventListener("click", downloadPDFFromS3);
});

document.getElementById("goBackButton").addEventListener("click", function () {
  window.location.href = "/videoList";
});

function toggleAvatarSelection() {
  var avatarSelection = document.getElementById("avatarSelection");
  avatarSelection.hidden = !avatarSelection.hidden;
}

function handleAvatarSelection(avatarId) {
  sessionStorage.setItem("selectedAvatar", avatarId);
}

document.getElementById("toggleAvatarButton").addEventListener("click", function () {
  toggleAvatarSelection();
});

document.getElementById("avatar1").addEventListener("click", function () {
  handleAvatarSelection("avatar1");
});

document.getElementById("avatar2").addEventListener("click", function () {
  handleAvatarSelection("avatar2");
});

document.getElementById("avatar3").addEventListener("click", function () {
  handleAvatarSelection("avatar3");
});

document.getElementById("avatar4").addEventListener("click", function () {
  handleAvatarSelection("avatar4");
});

document.getElementById("avatar5").addEventListener("click", function () {
  handleAvatarSelection("avatar5");
});

document.getElementById("avatar6").addEventListener("click", function () {
  handleAvatarSelection("avatar6");
});

var buttonElement = document.getElementById("arrow");

buttonElement.addEventListener("click", function () {
  openDiv();
});

document.getElementById("subtitle").addEventListener("click", toggleSubtitle);

function toggleSubtitle() {
  showSubtitle = !showSubtitle;
}
