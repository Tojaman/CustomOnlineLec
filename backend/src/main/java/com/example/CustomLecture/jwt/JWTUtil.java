package com.example.CustomLecture.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {
    private SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secret}")String secret) {


        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    // public String getUsername(String token) {

    //     return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("username", String.class);
    // }

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

    public Boolean isExpired(String token) {

        return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration()
                    .before(new Date());
    }

    public String createJwt(String username, String role, Long expiredMs) {

        return Jwts.builder()
                .subject(username) // 토큰의 주제. 즉, Key
                // .claim("username", username)
                .claim("role", role) // 토큰의 추가 정보 or 속성. 즉, Value
                .issuedAt(new Date(System.currentTimeMillis())) // 토클 발행 시간
                .expiration(new Date(System.currentTimeMillis() + expiredMs)) // 토큰 소멸 시간
                .signWith(secretKey) // 토큰 암호화
                .compact();
    }
}
