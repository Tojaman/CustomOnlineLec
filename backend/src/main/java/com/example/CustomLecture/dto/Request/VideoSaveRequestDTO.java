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

    // 영상 테이블 저장을 위한 함수
    public Video toVideo(UserEntity user) {
        Video video = new Video(
                this.id,
                user,
                this.title,
                this.content,
                this.subject,
                this.thumbnailS3Path,
                this.lectureNoteS3Path
        );
        video.setDate(new Timestamp(System.currentTimeMillis())); // 현재 시간을 설정
        return video;
    }

    // 영상 데이터 테이블 저장을 위한 함수
    public VideoData toVideoData(Video video) {
        return new VideoData(
            this.id,
            video,
            this.x,
            this.y,
            this.width,
            this.height,
            this.videoWidth,
            this.videoHeight
        );
    }
}