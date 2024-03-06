package com.example.CustomLecture.service;

import com.example.CustomLecture.dto.JoinDTO;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.entity.Video;
import com.example.CustomLecture.repository.UserRepository;
import com.example.CustomLecture.repository.VideoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RestController
public class MypageService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private final VideoRepository videoRepository;

    public MypageService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, VideoRepository videoRepository) {

        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.videoRepository = videoRepository;
    }

    //회원 프로필 업데이트하기
    public void updateProfileS3Path(String username, String ProfileS3Path) {
        Optional<UserEntity> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            user.setProfileS3Path(ProfileS3Path);
            userRepository.save(user);
        } else {
            // 해당 ID의 사용자를 찾을 수 없을 경우 예외처리 또는 메시지 반환
            throw new EntityNotFoundException("User with ID " + username + " not found");
        }
    }


  
    public UserEntity getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }


    public String getUserNicknameByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(UserEntity::getNickname)
                .orElse(null);
    }

    public String getUserPasswordByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(UserEntity::getPassword)
                .orElse(null);
    }

    public String getUserProfileByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(UserEntity::getProfileS3Path)
                .orElse(null);
    }

    /**
    //회원 정보 업데이트
    public void updateUserDetail(Long userId, Map<String, String> updateInfo) {
        Optional<UserEntity> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();

            if (updateInfo.containsKey("newNickname")) {
                user.setNickname(updateInfo.get("newNickname"));
            }

            if (updateInfo.containsKey("newPassword")) {
                String newPassword = updateInfo.get("newPassword");
                user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            }

            userRepository.save(user);
        } else {
            throw new EntityNotFoundException("User with ID " + userId + " not found");
        }
    }
*/

    //탈퇴하는 회원 비디오 삭제
    public void deleteVideosByUser(UserEntity user) {
        List<Video> videos = videoRepository.findByMember(user);
        for (Video video : videos) {
            videoRepository.delete(video);
        }
    }

    //회원 탈퇴
    public void deleteUserByUsername(String username) {
        userRepository.deleteByUsername(username);
    }

    // 현재 회원 비밀번호 확인
    public boolean isCurrentPasswordCorrect(String username, String currentPassword) {
        String storedPassword = getUserPasswordByUsername(username);

        // 현재 비밀번호가 일치하면 true, 일치하지 않으면 false 반환
        return bCryptPasswordEncoder.matches(currentPassword, storedPassword);
    }

    // 회원 정보 업데이트
    public void updateUserDetail(String username, Map<String, String> updateInfo) {
        String currentPassword = updateInfo.get("currentPassword");

        // 비밀번호 변경 시 현재 비밀번호 확인
        if (updateInfo.containsKey("newPassword")) {
            if (!isCurrentPasswordCorrect(username, currentPassword)) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
        }

        Optional<UserEntity> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();

            if (updateInfo.containsKey("newNickname")) {
                user.setNickname(updateInfo.get("newNickname"));
            }

            if (updateInfo.containsKey("newPassword")) {
                String newPassword = updateInfo.get("newPassword");
                user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            }

            userRepository.save(user);
        } else {
            throw new EntityNotFoundException("User with ID " + username + " not found");
        }
    }
}
