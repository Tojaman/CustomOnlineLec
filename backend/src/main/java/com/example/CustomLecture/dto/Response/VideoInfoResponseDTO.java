package com.example.CustomLecture.dto.Response;

import com.example.CustomLecture.entity.Video;
import com.example.CustomLecture.entity.VideoData;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
public class VideoInfoResponseDTO {

    // 영상 정보
    private String title;
    private String content;
    private String category;
    private String lecturenote;
    private String date;

    // 강사 정보
    private String nickname;

    // 영상 상세 정보
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private Integer videoWidth;
    private Integer videoHeight;

    // 변환 영상 s3 경로
    //private String convertVideoS3Path;
    private String karina;
    private String yoon;
    private String Timcook;
    private String Jimin700;
}
