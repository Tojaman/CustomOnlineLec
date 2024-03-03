// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"progressBar.js":[function(require,module,exports) {
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
    var value = originVideo.currentTime / originVideo.duration * 100;
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
  originVideo.addEventListener("ended", function () {
    playPauseButton.textContent = "▶";
  });
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
},{}]},{},["progressBar.js"], null)