package com.example.CustomLecture.dto;

import com.example.CustomLecture.entity.UserEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.catalina.User;

@NoArgsConstructor
@Getter
@Setter
public class JoinDTO {
    private String username;
    private String password;
    private String nickname;

    public JoinDTO(String username, String password, String nickname) {

        this.username = username;
        this.password = password;
        this.nickname = nickname;
    }

    public JoinDTO(String username, String nickname){
        this.username = username;
        this.nickname=nickname;
    }





}
