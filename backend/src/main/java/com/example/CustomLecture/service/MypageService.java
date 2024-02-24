package com.example.CustomLecture.service;

import com.example.CustomLecture.dto.JoinDTO;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@Service
@RestController
public class MypageService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public MypageService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {

        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    //회원 프로필 업데이트하기
    public void updateProfileS3Path(Long id, String ProfileS3Path) {
        Optional<UserEntity> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            user.setProfileS3Path(ProfileS3Path);
            userRepository.save(user);
        } else {
            // 해당 ID의 사용자를 찾을 수 없을 경우 예외처리 또는 메시지 반환
            throw new EntityNotFoundException("User with ID " + id + " not found");
        }
    }

    //회원 현재 닉네임 조회하기
    public String getUserNicknameById(Long id) {
        return userRepository.findById(id)
                .map(UserEntity::getNickname)
                .orElse(null);
    }

    //회원 현재 비밀번호 조회하기
    public String getUserPasswordById(Long id) {
        return userRepository.findById(id)
                .map(UserEntity::getPassword)
                .orElse(null);
    }

    //회원 프로필 조회하기
    public String getUserProfileById(Long id) {
        return userRepository.findById(id)
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
    //회원 탈퇴
    public void deleteUserById(Long userId) {
        userRepository.deleteById(userId);
    }

    // 현재 회원 비밀번호 확인
    public boolean isCurrentPasswordCorrect(Long userId, String currentPassword) {
        String storedPassword = getUserPasswordById(userId);

        // 현재 비밀번호가 일치하면 true, 일치하지 않으면 false 반환
        return bCryptPasswordEncoder.matches(currentPassword, storedPassword);
    }

    // 회원 정보 업데이트
    public void updateUserDetail(Long userId, Map<String, String> updateInfo) {
        String currentPassword = updateInfo.get("currentPassword");

        // 비밀번호 변경 시 현재 비밀번호 확인
        if (updateInfo.containsKey("newPassword")) {
            if (!isCurrentPasswordCorrect(userId, currentPassword)) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
        }

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
}
