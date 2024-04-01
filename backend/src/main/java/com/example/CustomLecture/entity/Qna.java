package com.example.CustomLecture.entity;

import com.example.CustomLecture.dto.Request.QnaUploadRequestDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity user;

    private String title;
    private String content;

    @Column(nullable = false) // columnDefinition을 제거합니다.
    private LocalDateTime date;

    public void setQna(QnaUploadRequestDTO qnaUploadRequestDTO, UserEntity user) {
        this.title = qnaUploadRequestDTO.getTitle();
        this.content = qnaUploadRequestDTO.getContent();
        this.user = user;
        this.date = LocalDateTime.now();
    }

    public Qna(String title, String content, UserEntity user) {
        this.title = title;
        this.content = content;
        this.user = user;
        this.date = LocalDateTime.now();
    }

}
