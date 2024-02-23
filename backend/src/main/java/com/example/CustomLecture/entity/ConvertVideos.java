package com.example.CustomLecture.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "convertVideos")
@NoArgsConstructor
@Getter
public class ConvertVideos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "videoId")
//    private Video video;

    @Column(unique = true)
    private String yoon;

    @Column(unique = true)
    private String jimin;

    @Column(unique = true)
    private String timcook;

    @Column(unique = true)
    private String karina;
}
