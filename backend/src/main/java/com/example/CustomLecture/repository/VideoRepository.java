package com.example.CustomLecture.repository;


import com.example.CustomLecture.dto.Request.VideoSaveRequestDTO;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Book;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface VideoRepository extends JpaRepository<Video, Long> {

    List<Video> findByMember(UserEntity user);

    @Query("SELECT v.subtitle FROM Video v WHERE v.id = :id")
    String findBySubtitle(@Param("id") Long id);
}
