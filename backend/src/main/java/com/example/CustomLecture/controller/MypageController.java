package com.example.CustomLecture.controller;


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

@Tag(name="마이페이지 API", description = "마이페이지 API 입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/mypage")
public class MypageController {

    @Autowired
    final MypageService mypageService;


    @GetMapping("/{nickname}")
    @Operation(summary = "회원 정보 조회", description = "회원 정보(프로필, 닉네임, 비밀번호) 조회하기")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<Map<String, String>> getUserInfoByNickname(@PathVariable String nickname) {
        UserEntity user = mypageService.getUserByNickname(nickname);

        if (user != null) {
            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("nickname", user.getNickname());
            userInfo.put("password", user.getPassword());
            userInfo.put("profile", user.getProfileS3Path());

            return new ResponseEntity<>(userInfo, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/update/profile/{nickname}")
    @Operation(summary = "회원 프로필 업데이트", description = "회원 프로필 업데이트하기")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> updateProfileS3Path(
            @PathVariable String nickname,
            @RequestBody Map<String, String> requestBody) {

        try {
            String ProfileS3Path = requestBody.get("ProfileS3Path");
            mypageService.updateProfileS3Path(nickname, ProfileS3Path);
            return new ResponseEntity<>("Profile S3 Path updated successfully", HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }


    @PatchMapping("/update/{nickname}")
    @Operation(summary = "회원 정보 업데이트", description = "회원 정보 업데이트하기")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    public ResponseEntity<String> updateUserDetail(
            @PathVariable String nickname,
            @RequestBody Map<String, String> request) {
        try {
            mypageService.updateUserDetail(nickname, request);
            return new ResponseEntity<>("User profile updated successfully", HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{nickname}")
    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴하기")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> deleteUser(@PathVariable String nickname) {
        try {
            mypageService.deleteUserByNickname(nickname);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } catch (EmptyResultDataAccessException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }
}

