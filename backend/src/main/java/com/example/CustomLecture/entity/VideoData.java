package com.example.CustomLecture.entity;

import com.example.CustomLecture.dto.Request.VideoSaveRequestDTO;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "videoData")
@NoArgsConstructor
@Getter
public class VideoData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "videoId")
    private Video video;

    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private Integer videoWidth;
    private Integer videoHeight;

    public void setVideoData(VideoSaveRequestDTO videoSaveRequestDTO, Video video) {
        this.video = video;
        this.x = videoSaveRequestDTO.getX();
        this.y = videoSaveRequestDTO.getY();
        this.width = videoSaveRequestDTO.getWidth();
        this.height = videoSaveRequestDTO.getHeight();
        this.videoWidth = videoSaveRequestDTO.getVideoWidth();
        this.videoHeight = videoSaveRequestDTO.getVideoHeight();
    }

//    public VideoData(Long id, Video video, Integer x, Integer y, Integer width, Integer height, Integer videoWidth, Integer videoHeight) {
//        this.id = id;
//        this.video = video;
//        this.x = x;
//        this.y = y;
//        this.width = width;
//        this.height = height;
//        this.videoWidth = videoWidth;
//        this.videoHeight = videoHeight;
//    }

    public String toString() {
        return "x : " + this.x + "," +
                "y : " + this.y + "," +
                "width : " + this.width + "," +
                "height : " + this.height + "," +
                "videoWidth : " + this.videoWidth + "," +
                "videoHeight : " + this.videoHeight + ",";
    }
}