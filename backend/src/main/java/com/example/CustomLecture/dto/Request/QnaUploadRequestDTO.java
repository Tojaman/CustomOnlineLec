package com.example.CustomLecture.dto.Request;

import com.example.CustomLecture.entity.Qna;
import com.example.CustomLecture.entity.UserEntity;
import lombok.Getter;

@Getter
public class QnaUploadRequestDTO {

    private String title;
    private String content;

    public Qna toQna(QnaUploadRequestDTO qnaUploadRequestDTO, UserEntity userEntity) {
        return new Qna(qnaUploadRequestDTO.getTitle(), qnaUploadRequestDTO.getContent(), userEntity);
    }
}
