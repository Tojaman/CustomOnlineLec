package com.example.CustomLecture.service;

import com.example.CustomLecture.dto.JoinDTO;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {

        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    public void joinProcess(JoinDTO joinDTO) {
        String username = joinDTO.getUsername();
        String password = joinDTO.getPassword();
        String nickname = joinDTO.getNickname();

        // 중복된 사용자 이름 체크
        if (userRepository.existsByUsername(username)) {
            throw new DataIntegrityViolationException("중복된 사용자 이름이 이미 존재합니다.");
        }

        if (userRepository.existsByNickname(nickname)) {
            throw new DataIntegrityViolationException("중복된 별명이 이미 존재합니다.");
        }

        // 중복이 없으면 사용자 생성 및 저장
        UserEntity data = new UserEntity();
        data.setUsername(username);
        data.setPassword(bCryptPasswordEncoder.encode(password));
        data.setRole("ROLE_ADMIN");
        data.setNickname(nickname);
        userRepository.save(data);
    }


}
