package com.example.CustomLecture.entity;

import com.example.CustomLecture.dto.Request.VideoSaveRequestDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private UserEntity member;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "videoDataId")
    private VideoData videoData;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "convertVideosId")
    private ConvertVideos convertVideos;

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


    public Video(final Long id, final UserEntity member, final String title, final String content, final String subject, final String thumbnailS3Path, final String lectureMaterialsS3Path) {
        this.id = id;
        this.member = member;
        this.title = title;
        this.content = content;
        this.subject = subject;
        this.thumbnailS3Path = thumbnailS3Path;
        this.lectureNoteS3Path = lectureMaterialsS3Path;

    }

    public void setVideo(VideoSaveRequestDTO videoSaveRequestDTO, UserEntity user) {
        this.setMember(user);
        this.setTitle(videoSaveRequestDTO.getTitle());
        this.setContent(videoSaveRequestDTO.getContent());
        this.setSubject(videoSaveRequestDTO.getSubject());
        this.setThumbnailS3Path(videoSaveRequestDTO.getThumbnailS3Path());
        this.setLectureNoteS3Path(videoSaveRequestDTO.getLectureNoteS3Path());
        this.setDate(new Timestamp(System.currentTimeMillis()));

    }


    public String toString() {
        return "title : " + this.title + "," +
                "content : " + this.content + "," +
                "subject : " + this.subject + "," +
                "lectureNoteS3Path : " + this.lectureNoteS3Path + "," +
                "date : " + this.date + ",";
    }

}
