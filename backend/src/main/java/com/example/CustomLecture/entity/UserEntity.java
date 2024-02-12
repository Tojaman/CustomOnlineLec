package com.example.CustomLecture.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user") // 테이블 이름 지정
@Setter
@Getter
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //Id 생성되는 방식 자동으로 생성, IDENTITY로 해야 겹치지 않음.
    private Long id;

    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$", message = "이메일 형식에 맞지 않습니다.")
    @Column(unique = true, length = 20)
    private String username;
    private String password;
    @Column(unique = true, length = 20)
    private String nickname;

    //유저에 대한 권한을 나타낼  role값
    private String role;

    public UserEntity(Long id, String username, String password, String nickname, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
    }


    public UserEntity() {

    }
}