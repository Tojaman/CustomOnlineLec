package com.example.CustomLecture.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Objects;

@Component
public class JWTUtil {
    private final RedisUtil redisUtil;
    private SecretKey secretKey;

    public JWTUtil(RedisUtil redisUtil, @Value("${spring.jwt.secret}")String secret) {
        this.redisUtil = redisUtil;
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    // 토큰에서 subject를 가져오는 메서드
    public String getUsername(String token) {
        return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
    }

    public String getRole(String token) {

        return Jwts.parser()
                    .verifyWith(secretKey)
                    .build().parseSignedClaims(token)
                    .getPayload()
                    .get("role", String.class);
    }

    public String getType(String token) {
        return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("token_type", String.class);
    }

    public Boolean isExpired(String token) {

        return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration()
                    .before(new Date());
    }

    // jwtUtil.java 파일
    public Long getExpiration(String token) {
        long ex = Jwts.parser()
                    .verifyWith(secretKey)  // JWT 서명 키
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration()
                    .getTime();
        return ex - System.currentTimeMillis();
    }


    public String createJwt(String type, String username, String role, Long expiredMs) {

        String token = Jwts.builder()
                .subject(username) // 토큰의 주제. 즉, Key
                .claim("role", role) // 토큰의 추가 정보 or 속성. 즉, Value
                .claim("token_type", type)
                .issuedAt(new Date(System.currentTimeMillis())) // 토클 발행 시간
                .expiration(new Date(System.currentTimeMillis() + expiredMs)) // 토큰 소멸 시간
                .signWith(secretKey) // 토큰 암호화
                .compact();

        // refreshToken 생성 시 Redis에 저장
        if (Objects.equals(type, "refresh")) {
            redisUtil.setValue(username, token, expiredMs);
        }

        return token;
    }
}
