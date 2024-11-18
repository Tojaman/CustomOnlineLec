package com.example.CustomLecture.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserInfoResponseDTO {
    private String nickname;
    private String password;
    private String profileS3Path;
}
