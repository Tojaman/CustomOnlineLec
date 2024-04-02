package com.example.CustomLecture.dto.Response;

import com.example.CustomLecture.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@NoArgsConstructor // 기본 생성자 생성
@AllArgsConstructor // 모든 필드 값을 파라미터로 받는 생성자를 생성
@Getter
public class QnaListResponseDTO {

    private String title;
    private String content;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime date;
    private String nickname;

//    public QnaListResponseDTO(String title, String content, LocalDateTime date, String username) {
//        this.title = title;
//        this.content = content;
//        this.username = username;
//        this.date = date;
//    }
}
