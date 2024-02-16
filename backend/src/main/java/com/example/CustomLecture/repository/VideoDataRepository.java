package com.example.CustomLecture.repository;


import com.example.CustomLecture.entity.VideoData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoDataRepository extends JpaRepository<VideoData, Long> {

}
