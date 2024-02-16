package com.example.CustomLecture.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "videos")
@NoArgsConstructor
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "video_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity member;

    private String title;

    private String content;

    @Column(nullable = false) // columnDefinition을 제거합니다.
    private Date date;

    private String subject;

    @Column(unique = true)
    private String originalS3Path;

//    @Column(unique = true)
//    private String convertS3Path;

    @Column(unique = true)
    private String subtitleS3Path;

    private String thumbnailS3Path;
    private String lectureNoteS3Path;

    public Video(final Long id, final UserEntity member, final String title, final String content, final String subject, final String thumbnailS3Path, final String lectureNoteS3Path) {
        this.id = id;
        this.member = member;
        this.title = title;
        this.content = content;
        this.subject = subject;
        this.thumbnailS3Path = thumbnailS3Path;
        this.lectureNoteS3Path = lectureNoteS3Path;
    }

}
