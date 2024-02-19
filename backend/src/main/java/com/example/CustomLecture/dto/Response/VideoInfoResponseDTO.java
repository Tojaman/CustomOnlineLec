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
    private String lecturenete;
    private Date data;

    // 강사 정보
    private String nickname;

    // 영상 상세 정보
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private Integer videoWidth;
    private Integer videoHeight;



}
