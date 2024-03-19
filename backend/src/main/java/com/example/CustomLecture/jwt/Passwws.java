package com.example.CustomLecture.jwt;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Passwws {
    public static void main(String[] args) {
        // 비밀번호 문자열
        String password = "admin123";

        // BCryptPasswordEncoder 객체 생성
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // 비밀번호를 해싱하여 저장
        String hashedPassword = passwordEncoder.encode(password);

        // 해싱된 비밀번호 출력
        System.out.println("Hashed Password: " + hashedPassword);
    }
}
