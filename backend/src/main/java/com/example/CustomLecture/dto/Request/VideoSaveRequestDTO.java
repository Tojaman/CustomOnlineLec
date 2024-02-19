package com.example.CustomLecture.dto.Request;

import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.entity.Video;
import com.example.CustomLecture.entity.VideoData;
import lombok.*;

import java.sql.Timestamp;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class VideoSaveRequestDTO {

    private Long id;
    private String title;
    private String content;
    private String subject;
    private String thumbnailS3Path;
    private String lectureNoteS3Path;

    // 영상 데이터 테이블
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private Integer videoWidth;
    private Integer videoHeight;
}