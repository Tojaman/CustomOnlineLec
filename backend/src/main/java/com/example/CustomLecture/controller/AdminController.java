package com.example.CustomLecture.controller;

import com.example.CustomLecture.dto.JoinDTO;
import com.example.CustomLecture.dto.UserDTO;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Tag(name="관리자 API", description = "관리자 API 입니다.")
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    @GetMapping("/user/list")
    @Operation(summary = "회원 정보 API", description = "회원 정보 API")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<List<Map<String, Object>>> getAllUserDetails() {
        List<Map<String, Object>> result = new ArrayList<>();
        List<String> usernames = adminService.findAllUsernames();
        List<String> nicknames = adminService.findAllNicknames();
        List<String> profilePaths = adminService.findAllProfile();

        IntStream.range(0, Math.min(Math.min(usernames.size(), nicknames.size()), profilePaths.size()))
                .forEach(i -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("username", usernames.get(i));
                    map.put("nickname", nicknames.get(i));
                    map.put("profileS3Path", profilePaths.get(i));
                    result.add(map);
                });
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/videos/{videoid}")
    @Operation(summary = "강의 삭제", description = "영상 업로드 도중 취소하면 관련 정보 삭제")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "500", description = "Server Error")
    })
    public ResponseEntity<String> deleteVideo(@PathVariable Long videoid) {

        try {
            adminService.deleteVideo(videoid);
            return ResponseEntity.status(HttpStatus.OK).body("게시물 삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패");
        }
    }

}
