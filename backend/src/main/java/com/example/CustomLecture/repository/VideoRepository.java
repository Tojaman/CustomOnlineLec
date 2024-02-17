package com.example.CustomLecture.repository;

import com.example.CustomLecture.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {

    List<Video> findAll();

}
