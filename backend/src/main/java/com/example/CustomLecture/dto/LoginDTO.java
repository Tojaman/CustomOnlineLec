package com.example.CustomLecture.dto;

import lombok.Getter;
import lombok.Setter;

//LoginFilter에서 form-data가 아닌 application-json방식으로
//얻기 위해 LoginDTO 파일 생성
@Getter
@Setter
public class LoginDTO {

    private String username;
    private String password;




}
