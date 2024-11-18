package com.example.CustomLecture.dto.Response;
import com.example.CustomLecture.entity.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
public class VideoListResponseDTO {
    private Long id;
    private String title;
    private String thumbnail;
    private String nickname;
    private String subject;
    private LocalDateTime date;
}
