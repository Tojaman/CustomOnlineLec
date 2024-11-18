package com.example.CustomLecture.controller;


import com.example.CustomLecture.dto.Response.UserInfoResponseDTO;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.service.MypageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Tag(name="마이페이지 API", description = "마이페이지 API 입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage")
public class MypageController {

    @Autowired
    final MypageService mypageService;


    @GetMapping("/{username}")
    @Operation(summary = "회원 정보 조회", description = "회원 정보(프로필, 닉네임, 비밀번호) 조회하기")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<Object> getUserInfoByNickname(@PathVariable String username) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(mypageService.getUserByUsername(username));
        } catch (NoSuchElementException e) {
            // 유효성 검사 실패 등 예외 발생 시 클라이언트에게 BadRequest 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            // 그 외 예상치 못한 예외 발생 시 클라이언트에게 InternalServerError 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PatchMapping("/update/profile/{username}")
    @Operation(summary = "회원 프로필 업데이트", description = "회원 프로필 업데이트하기")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> updateProfileS3Path(
            @PathVariable String username,
            @RequestBody Map<String, String> requestBody) {

        try {
            String ProfileS3Path = requestBody.get("ProfileS3Path");
            mypageService.updateProfileS3Path(username, ProfileS3Path);
            return new ResponseEntity<>("Profile S3 Path updated successfully", HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }


    @PatchMapping("/update/{username}")
    @Operation(summary = "회원 정보 업데이트", description = "회원 정보 업데이트하기")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    public ResponseEntity<String> updateUserDetail(
            @PathVariable String username,
            @RequestBody Map<String, String> request) {
        try {
            mypageService.updateUserDetail(username, request);
            return new ResponseEntity<>("User profile updated successfully", HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{username}")
    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴하기")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        try {
            UserInfoResponseDTO userInfoResponseDTO = mypageService.getUserByUsername(username);

            // 해당 유저의 모든 비디오 삭제
            mypageService.deleteVideosByUser(userInfoResponseDTO);

            // 유저 탈퇴
            mypageService.deleteUserByUsername(username);
            return ResponseEntity.status(HttpStatus.OK).body("User and associated videos deleted successfully");
        } catch (NoSuchElementException e) {
            // 유효성 검사 실패 등 예외 발생 시 클라이언트에게 BadRequest 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            // 그 외 예상치 못한 예외 발생 시 클라이언트에게 InternalServerError 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다: " + e.getMessage());
        }
    }
}

