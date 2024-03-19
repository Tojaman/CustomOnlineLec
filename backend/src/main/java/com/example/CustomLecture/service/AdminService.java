package com.example.CustomLecture.service;

import com.example.CustomLecture.dto.JoinDTO;
import com.example.CustomLecture.dto.UserDTO;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.entity.Video;
import com.example.CustomLecture.repository.ConvertVideoRepository;
import com.example.CustomLecture.repository.UserRepository;
import com.example.CustomLecture.repository.VideoDataRepository;
import com.example.CustomLecture.repository.VideoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VideoRepository videoRepository;
    @Autowired
    private ConvertVideoRepository convertVideoRepository;
    @Autowired
    private VideoDataRepository videoDataRepository;


    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<String> findAllUsernames() {
        List<UserEntity> users = userRepository.findAll();
        return users.stream()
                .map(UserEntity::getUsername)
                .collect(Collectors.toList());
    }

    public List<String> findAllNicknames() {
        List<UserEntity> users = userRepository.findAll();
        return users.stream()
                .map(UserEntity::getNickname)
                .collect(Collectors.toList());
    }


    public List<String> findAllProfile() {
        List<UserEntity> users = userRepository.findAll();
        return users.stream()
                .map(UserEntity::getProfileS3Path)
                .collect(Collectors.toList());
    }

    public void deleteVideo(Long videoid) {
        Video video = videoRepository.findById(videoid).orElse(null);

        if (video == null) {
            throw new NoSuchElementException("해당 ID의 동영상이 존재하지 않습니다.");
        }
                
        videoRepository.delete(video);
        convertVideoRepository.delete(video.getConvertVideos());
        videoDataRepository.delete(video.getVideoData());
    }
}