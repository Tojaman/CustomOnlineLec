package com.example.CustomLecture.entity;

import com.example.CustomLecture.dto.Request.VideoSaveRequestDTO;
import com.example.CustomLecture.dto.Response.VideoInfoResponseDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

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
    private LocalDateTime date;

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
        this.setDate(LocalDateTime.now());

    }

    public String getFormattedDate() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return this.date.format(formatter);
    }
    public VideoInfoResponseDTO toVideoInfoResponseDTO(UserEntity user, VideoData videoData, ConvertVideos s3Path) {
        return new VideoInfoResponseDTO(
                // 영상 정보
                this.getTitle(),
                this.getContent(),
                this.getSubject(),
                this.getLectureNoteS3Path(),
                this.getFormattedDate(),

                // 강사 정보
                user.getNickname(),

                // 영상 상세 정보
                videoData.getX(),
                videoData.getY(),
                videoData.getWidth(),
                videoData.getHeight(),
                videoData.getVideoHeight(),
                videoData.getVideoHeight(),

                s3Path.getElonmusk(),
                s3Path.getYoon(),
                s3Path.getTimcook(),
                s3Path.getJimin700()
        );
    }

}
