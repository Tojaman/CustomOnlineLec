package com.example.CustomLecture.repository;

import com.example.CustomLecture.entity.Qna;
import com.example.CustomLecture.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QnaRepository extends JpaRepository<Qna, Long> {
    public Optional<Qna> findById(Long id);


}
