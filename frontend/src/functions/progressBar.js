document.addEventListener("DOMContentLoaded", function () {
  var originVideo = document.getElementById("originVideo");
  var progressBar = document.getElementById("progressBar");
  var time = document.getElementById("time");
  var playPauseButton = document.getElementById("playPauseButton");
  var volume = document.getElementById("volume");
  var volumeSlider = document.getElementById("volumeSlider");
  var isDragging = false;
  var progressBarFull = document.getElementById("progressBarFull");

  originVideo.addEventListener("timeupdate", updateProgressBar);
  progressBar.parentNode.addEventListener("click", seek);
  playPauseButton.addEventListener("click", togglePlayPause);
  volume.addEventListener("click", toggleMute);
  volumeSlider.addEventListener("input", adjustVolume);

  function updateProgressBar() {
    var value = (originVideo.currentTime / originVideo.duration) * 100;
    progressBar.style.width = value + "%";
    updatetime();
  }

  function seek(e) {
    var percent = e.offsetX / progressBar.parentNode.offsetWidth;
    originVideo.currentTime = percent * originVideo.duration;
  }

  function updatetime() {
    var currentTime = formatTime(originVideo.currentTime);
    var duration = formatTime(originVideo.duration);
    time.textContent = currentTime + " / " + duration;
  }

  function formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  }

  function togglePlayPause() {
    if (originVideo.paused) {
      originVideo.play();
      playPauseButton.textContent = "❚❚";
    } else {
      originVideo.pause();
      playPauseButton.textContent = "▶";
    }
  }

  function toggleMute() {
    originVideo.muted = !originVideo.muted;
    updatevolume();
  }

  function adjustVolume() {
    originVideo.volume = volumeSlider.value;
    updatevolume();
  }

  function updatevolume() {
    if (originVideo.muted || originVideo.volume === 0) {
      volume.textContent = "🔇";
    } else {
      volume.textContent = "🔊";
    }
  }

  volumeSlider.addEventListener("mouseover", function () {
    volumeSlider.style.cursor = "pointer";
  });

  volumeSlider.addEventListener("mouseout", function () {
    volumeSlider.style.cursor = "default";
  });

  volume.addEventListener("mouseover", function () {
    volume.style.cursor = "pointer";
  });

  volume.addEventListener("mouseout", function () {
    volume.style.cursor = "default";
  });

  playPauseButton.addEventListener("mouseover", function () {
    playPauseButton.style.cursor = "pointer";
  });

  playPauseButton.addEventListener("mouseout", function () {
    playPauseButton.style.cursor = "default";
  });

  progressBar.parentNode.addEventListener("mouseover", function () {
    progressBar.parentNode.style.cursor = "pointer";
  });

  progressBar.parentNode.addEventListener("mouseout", function () {
    progressBar.parentNode.style.cursor = "default";
  });

  progressBarFull.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mousemove", handleMouseMove);

  function handleMouseDown(e) {
    isDragging = true;
    seek(e);
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleMouseMove(e) {
    if (isDragging) {
      seek(e);
    }
  }

  document.addEventListener("keydown", handleKeyPress);

  function handleKeyPress(e) {
    if (e.code === "Space") {
      togglePlayPause();
      e.preventDefault();
    }
    if (e.code === "ArrowLeft") {
      originVideo.currentTime -= 5;
    } else if (e.code === "ArrowRight") {
      originVideo.currentTime += 5;
    }
  }
});
