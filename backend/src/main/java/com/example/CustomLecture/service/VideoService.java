package com.example.CustomLecture.service;

import com.example.CustomLecture.dto.JoinDTO;
import com.example.CustomLecture.dto.Request.VideoSaveRequestDTO;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.entity.Video;
import com.example.CustomLecture.entity.VideoData;
import com.example.CustomLecture.jwt.JWTUtil;
import com.example.CustomLecture.repository.UserRepository;
import com.example.CustomLecture.repository.VideoDataRepository;
import com.example.CustomLecture.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
@RestController
public class VideoService {

    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final VideoDataRepository videoDataRepository;
    private final RestTemplate restTemplate;
    private final JWTUtil jwtUtil;



    /**
     * 강의 영상 업로드 및 음성 변환
     */
    public String convertVideo(String requestBody, String jwtToken) {

        String token = jwtToken.replace("Bearer ", "");

        // JWTUtil을 사용하여 사용자 이름 추출
        String username = jwtUtil.getUsername(token);


        UserEntity userEntity = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 ID 입니다."));

        Long userId = userEntity.getId();


        // requestBody에 userId 추가
        String updatedRequestBody = requestBody.substring(0, requestBody.length() - 1) + ", \"userId\":" + userId + "}";
        System.out.println(updatedRequestBody);

        // 플라스크 서버 URL
        String flaskUrl = "http://localhost:5000/convert";

        // HTTP 요청 헤더 설정(Flask에 JSON 형식이란 것을 알기리 위해 header에 포함)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // HTTP 요청 객체 생성
        HttpEntity<String> requestEntity = new HttpEntity<>(updatedRequestBody, headers);

        // 플라스크 서버로 요청 전송 및 응답 받기
        ResponseEntity<String> response = restTemplate.postForEntity(flaskUrl, requestEntity, String.class);

        return response.getBody();
    }


    /**
     * 강의 영상 정보 업로드
     */
    public void uploadVideo(VideoSaveRequestDTO videoSaveRequestDTO, String jwtToken) {

        String token = jwtToken.replace("Bearer ", "");

        // JWTUtil을 사용하여 사용자 이름 추출
        String username = jwtUtil.getUsername(token);

        // userId로 부터 UserEntity 객체 추출
        UserEntity userEntity = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 userId 입니다."));

        // DTO 객체를 domain 객체로 변환
        Video video = videoRepository.findById(videoSaveRequestDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 boardId 입니다."));

        // Video 레코드 생성
        video.setVideo(videoSaveRequestDTO, userEntity);


        // VideoData 레코드 생성
        Optional<VideoData> existingVideoDataOptional = videoDataRepository.findByVideo(video);

        if (existingVideoDataOptional.isPresent()) {
            // 기존 레코드가 존재할 경우 업데이트
            VideoData existingVideoData = existingVideoDataOptional.get();
            existingVideoData.setVideoData(videoSaveRequestDTO, video);
            videoDataRepository.save(existingVideoData);
        } else {
            // 기존 레코드가 없을 경우 새로운 레코드 생성
            VideoData videoData = new VideoData();
            videoData.setVideoData(videoSaveRequestDTO, video);
            videoDataRepository.save(videoData);
            video.setVideoData(videoData);
        }
        videoRepository.save(video);

    }

    public List<Long> getAllVideoIds() {
        List<Video> videoIds = videoRepository.findAll();
        return videoIds.stream()
                .map(Video::getId)
                .collect(Collectors.toList());
    }

    public List<String> getAllVideoTitles() {
        List<Video> videoTitles = videoRepository.findAll();
        return videoTitles.stream()
                .map(Video::getTitle)
                .collect(Collectors.toList());
    }

    public List<String> getAllVideoThumbnails(){
        List<Video> videoThumbnails = videoRepository.findAll();
        return videoThumbnails.stream()
                .map(Video::getThumbnailS3Path)
                .collect(Collectors.toList());
    }

    public List<String> getAllNicknames() {
        List<Video> videos = videoRepository.findAll();
        return videos.stream()
                .map(video -> {
                    Optional<UserEntity> userOptional = userRepository.findById(video.getMember().getId());
                    return userOptional.map(UserEntity::getNickname).orElse(null);
                })
                .collect(Collectors.toList());
    }

    public String returnVideo(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 userId 입니다."));

        // title, content, category, lecturenote, date
        // 프로필 사진, 닉네임
        // 영상 정보
        // 변환 영상 경로
        String videoInfo = video.toString() + "\n" + video.getMember().getNickname() + "\n" +
                        video.getVideoData().toString() + "\n" + video.getConvertVideos().toString();

        return videoInfo;
    }
}

