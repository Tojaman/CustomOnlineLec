package com.example.CustomLecture.repository;

import com.example.CustomLecture.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoRepository extends JpaRepository<Video, Long> {

}
