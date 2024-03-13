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
import { displayPreviousSessionInfo, downloadPDFFromS3, openDiv } from './extra.js';

import * as test1SVG from "./resources/illustration/test1.svg";
import * as test2SVG from "./resources/illustration/test2.svg";
import * as test3SVG from "./resources/illustration/윤석열.svg";
import * as test4SVG from "./resources/illustration/트럼프.svg";
import * as test5SVG from "./resources/illustration/키키.svg";

let camera;
let illustration = null;

let detection = null;
let facemesh = null;
let posenet = null;

let eyesDetection = null;
let faceDetection = null;
let poseDetection = null;

let canvasScope;

const selectedVideoInfoString = sessionStorage.getItem("selectedVideoInfo");
const selectedVideoInfo = JSON.parse(selectedVideoInfoString);

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

function drawVideoToCanvas() {
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
      default:
        return null;
    }
    return selectedAvatarSVG;
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

var buttonElement = document.getElementById("arrow");

buttonElement.addEventListener("click", function () {
  openDiv();
});
