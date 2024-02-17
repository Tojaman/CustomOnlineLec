package com.example.CustomLecture.controller;

import com.example.CustomLecture.dto.Request.VideoConvertRequestDTO;
import com.example.CustomLecture.dto.Request.VideoSaveRequestDTO;
import com.example.CustomLecture.entity.Video;
import com.example.CustomLecture.jwt.JWTUtil;
import com.example.CustomLecture.repository.VideoRepository;
import com.example.CustomLecture.service.VideoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

// swagger
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name="강의 정보 업로드 API", description = "자막 및 강의 정보를 업로드하는 API 입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/videos")
public class VideoController {

    @Autowired // 생성자 주입
    private final VideoService videoService;


    /**
     * 강의 영상 업로드 및 음성 변환 프록시 API
     */
    @PostMapping("/uploadVideo")
    @Operation(summary = "강의 영상 업로드", description = "강의 영상을 보내주세요.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> convertVideo(@RequestBody VideoConvertRequestDTO videoConvertRequestDTO, HttpServletRequest request) {

        try {

            // JWT 토큰 추출
            String jwtToken = request.getHeader("Authorization");

            ObjectMapper objectMapper = new ObjectMapper();
            String requestBody = objectMapper.writeValueAsString(videoConvertRequestDTO);
            String responseBody = videoService.convertVideo(requestBody, jwtToken);
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            // 예외 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생: " + e.getMessage());
        }
    }

    /**
     * 원본 자막 get
     */



    /**
     * 강의 영상 정보 업로드
     */
    @PostMapping("/uploadInfo")
    @Operation(summary = "강의 영상 정보 업로드", description = "강의 영상 정보를 DB에 저장합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> uploadVideoInfo(@RequestBody VideoSaveRequestDTO videoSaveRequestDTO, HttpServletRequest request) {

        try {
            // JWT 토큰 추출
            String jwtToken = request.getHeader("Authorization");

            // DB에 강의 영상 정보 저장
            videoService.uploadVideo(videoSaveRequestDTO, jwtToken);

            return ResponseEntity.status(HttpStatus.OK).body("강의 영상 업로드 및 음성 변환 성공");
        } catch (IllegalArgumentException e) {
            // 유효성 검사 실패 등 예외 발생 시 클라이언트에게 BadRequest 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("요청이 잘못되었습니다: " + e.getMessage());
        } catch (Exception e) {
            // 그 외 예상치 못한 예외 발생 시 클라이언트에게 InternalServerError 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public List<Video> getList() {
        return videoService.getList();
    }

}
