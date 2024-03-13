import AWS from 'aws-sdk';

export function displayPreviousSessionInfo() {
    const selectedVoice = sessionStorage.getItem("selectedVoice");
    const selectedVideoInfoString = sessionStorage.getItem("selectedVideoInfo");
    const selectedVideoInfo = JSON.parse(selectedVideoInfoString);
  
    let selectedS3Path;
  
    switch (selectedVoice) {
      case "karina":
        selectedS3Path = selectedVideoInfo.karina;
        break;
      case "Jimin700":
        selectedS3Path = selectedVideoInfo.Jimin700;
        break;
      case "yoon":
        selectedS3Path = selectedVideoInfo.yoon;
        break;
      case "Timcook":
        selectedS3Path = selectedVideoInfo.Timcook;
        break;
      default:
    }
  
    if (selectedVideoInfo) {
      document.getElementById("title").textContent = selectedVideoInfo.title;
      document.getElementById("instructor").textContent = selectedVideoInfo.nickname;
      document.getElementById("description").textContent = selectedVideoInfo.content;
      document.getElementById("date").textContent = selectedVideoInfo.date;
  
      const s3 = new AWS.S3({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.REACT_APP_AWS_DEFAULT_REGION,
      });
  
      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET,
        Key: selectedS3Path,
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
  
      const profileS3Path = selectedVideoInfo.profileS3Path;
  
      if (profileS3Path !== null) {
        const profileImageParams = {
          Bucket: process.env.REACT_APP_S3_BUCKET,
          Key: profileS3Path,
        };
  
        s3.getObject(profileImageParams, (profileErr, profileData) => {
          if (profileErr) {
            console.error("프로필 이미지 가져오기 오류:", profileErr);
          } else {
            console.log("프로필 이미지 객체 가져옴:", profileData);
  
            const profileBlob = new Blob([profileData.Body], { type: profileData.ContentType });
            const profileImageUrl = URL.createObjectURL(profileBlob);
  
            const profileElement = document.getElementById("profile");
            profileElement.src = profileImageUrl;
          }
        });
      }
    }
  }
  
 export function downloadPDFFromS3() {
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
      Key: selectedVideoInfo.lecturenote,
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
        const fileName = selectedVideoInfo.lecturenote.split("/").pop();
        link.download = fileName;
        link.click();
      }
    });
  }
  
  export function openDiv() {
    if (document.getElementById("inner").style.display === "none") {
      document.getElementById("inner").style.display = "block";
      document.getElementById("arrow").style.transform = "rotate(225deg)";
    } else {
      document.getElementById("inner").style.display = "none";
      document.getElementById("arrow").style.transform = "rotate(135deg)";
    }
  }