package com.example.CustomLecture.service;

import com.example.CustomLecture.dto.Request.QnaUploadRequestDTO;
import com.example.CustomLecture.entity.Qna;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.jwt.JWTUtil;
import com.example.CustomLecture.repository.QnaRepository;
import com.example.CustomLecture.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
@RestController
public class QnaService {

    private final UserRepository userRepository;
    private final QnaRepository qnaRepository;
    private final JWTUtil jwtUtil;

    /**
     * 문의글 업로드
     */
    public void saveQna(QnaUploadRequestDTO qnaUploadRequestDTO, String jwtToken) {

        String token = jwtToken.replace("Bearer ", "");

        // JWTUtil을 사용하여 사용자 이름 추출
        String username = jwtUtil.getUsername(token);

        UserEntity userEntity = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 ID 입니다."));


        Qna qna = qnaUploadRequestDTO.toQna(qnaUploadRequestDTO, userEntity);

        qnaRepository.save(qna);
    }

    /**
     * 문의글 삭제
     */
    public void deleteQna(Long qnaid) {
        Qna qna = qnaRepository.findById(qnaid)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 문의글입니다."));
        qnaRepository.deleteById(qnaid);
    }
}
