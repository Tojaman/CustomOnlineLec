package com.example.CustomLecture.repository;

import com.example.CustomLecture.entity.ConvertVideos;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConvertVideoRepository extends JpaRepository<ConvertVideos, Long> {
}
