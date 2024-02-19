package com.example.CustomLecture.entity;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "convertVideos")
@NoArgsConstructor
public class ConvertVideos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "videoId")
    private Video video;

    @Column(unique = true)
    private String AconvertS3Path;

    @Column(unique = true)
    private String BconvertS3Path;

    @Column(unique = true)
    private String CconvertS3Path;

    @Column(unique = true)
    private String DconvertS3Path;
}
