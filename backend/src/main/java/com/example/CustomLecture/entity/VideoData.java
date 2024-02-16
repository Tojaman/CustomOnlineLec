package com.example.CustomLecture.entity;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "videoData")
@NoArgsConstructor
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

    public VideoData(Long id, Video video, Integer x, Integer y, Integer width, Integer height, Integer videoWidth, Integer videoHeight) {
        this.id = id;
        this.video = video;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;
    }
}