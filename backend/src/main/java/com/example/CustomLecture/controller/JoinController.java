package com.example.CustomLecture.controller;

import com.example.CustomLecture.dto.JoinDTO;
import com.example.CustomLecture.service.JoinService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@ResponseBody
public class JoinController {

    private final JoinService joinService;

    private JoinController(JoinService joinService){

        this.joinService = joinService;
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinProcess(@Valid @RequestBody JoinDTO joinDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // 유효성 검사 에러가 있는 경우
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("입력값이 올바르지 않습니다.");
        }

        try {
            joinService.joinProcess(joinDTO);
            return ResponseEntity.ok("가입 성공");
        } catch (DataIntegrityViolationException e) {
            // 중복된 사용자 이름 예외를 처리
            return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 사용자 이름 혹은 닉네임이 이미 존재합니다.");
        } catch (Exception e) {
            // 기타 예외 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("가입 프로세스 중 오류가 발생했습니다.");
        }
    }
}
