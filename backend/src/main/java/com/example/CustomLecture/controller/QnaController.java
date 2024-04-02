package com.example.CustomLecture.controller;

import com.example.CustomLecture.dto.Request.QnaUploadRequestDTO;
import com.example.CustomLecture.dto.Response.QnaListResponseDTO;
import com.example.CustomLecture.service.QnaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name="문의글 API", description = "문의글 관련 API 입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/qna")
public class QnaController {

    @Autowired
    private final QnaService qnaService;

    @PostMapping("/upload")
    @Operation(summary = "문의글 작성", description = "qna 문의글을 작성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> saveQna(@RequestBody QnaUploadRequestDTO qnaUploadRequestDTO, HttpServletRequest request) {

        try {
            // JWT 토큰 추출
            String jwtToken = request.getHeader("Authorization");

            // DB에 문의글 저장
            qnaService.saveQna(qnaUploadRequestDTO, jwtToken);

            return ResponseEntity.status(HttpStatus.OK).body("문의글 업로드 성공");
        } catch (IllegalArgumentException e) {
            // 유효성 검사 실패 등 예외 발생 시 클라이언트에게 BadRequest 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("요청이 잘못되었습니다: " + e.getMessage());
        } catch (Exception e) {
            // 그 외 예상치 못한 예외 발생 시 클라이언트에게 InternalServerError 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @DeleteMapping("/{qnaid}")
    @Operation(summary = "문의글 삭제", description = "qna 문의글을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> deleteQna(@PathVariable Long qnaid) {

        try {
            qnaService.deleteQna(qnaid);
            return ResponseEntity.status(HttpStatus.OK).body("문의글 삭제 성공");
        } catch (IllegalArgumentException e) {
            // 유효성 검사 실패 등 예외 발생 시 클라이언트에게 BadRequest 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("요청이 잘못되었습니다: " + e.getMessage());
        } catch (Exception e) {
            // 그 외 예상치 못한 예외 발생 시 클라이언트에게 InternalServerError 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    @Operation(summary = "문의글 목록 조회", description = "qna 문의글 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> getQnaList() {

        try {
            List<QnaListResponseDTO> qnaListResponseDTOS = qnaService.getQnaList();

            // ObjectMapper를 사용하여 List<QnaListResponseDTO>를 JSON 문자열로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.registerModule(new JavaTimeModule()).writeValueAsString(qnaListResponseDTOS);

            // JSON 문자열을 ResponseEntity의 body로 설정하여 반환
            return ResponseEntity.status(HttpStatus.OK).body(json);
        } catch (IllegalArgumentException e) {
            // 유효성 검사 실패 등 예외 발생 시 클라이언트에게 BadRequest 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("요청이 잘못되었습니다: " + e.getMessage());
        } catch (Exception e) {
            // 그 외 예상치 못한 예외 발생 시 클라이언트에게 InternalServerError 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }


    
}
