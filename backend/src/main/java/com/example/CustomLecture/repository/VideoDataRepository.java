package com.example.CustomLecture.repository;


import com.example.CustomLecture.entity.Video;
import com.example.CustomLecture.entity.VideoData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VideoDataRepository extends JpaRepository<VideoData, Long> {
    Optional<VideoData> findByVideo(Video video);
}
