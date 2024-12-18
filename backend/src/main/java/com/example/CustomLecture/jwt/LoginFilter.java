package com.example.CustomLecture.jwt;

import com.example.CustomLecture.dto.CustomUserDetails;
import com.example.CustomLecture.dto.LoginDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Iterator;


/**
 * 서블릿 필터 체인의 DelegatingFilter에 있는 요청을 가로채서 Security 필터 체인(LoginFilter, JWTFilter)에서 검증
 * UsernamePasswordAuthenticationFilter를 상속받은 경우 URL이 /login 경로로 오는 POST 요청만 처리하도록 함
 * 이는 JWT Filter 이후 LoginFilter가 실행되는데 로그인 요청을 제외한 다른 요청에는 Login Filter가 실행되면 안되기 떄문에 제한을 건 것
 */
public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;


    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        LoginDTO loginDTO = new LoginDTO();
        //클라이언트 요청에서 username, password 추출
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            loginDTO = objectMapper.readValue(messageBody, LoginDTO.class);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();

        System.out.println(username);


        //스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

        /**
         * token에 담은 검증을 위한 AuthenticationManager로 전달
         * DB에서 user 정보를 가져와서 검증을 진행
         * 여기서 로그인에 성공하면 바로 아래 successfulAuthentication 실행
         */
        return authenticationManager.authenticate(authToken);
    }

    //로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
        String username = authentication.getName();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        String accesstoken = jwtUtil.createJwt("access", username, role, 6*10000L);
        String refreshtoken = jwtUtil.createJwt("refresh", username, role, 60*60*1000*10L);

        //응답 설정
        response.addHeader("Authorization", "Bearer " + accesstoken);
        response.addCookie(createCookie("refresh", refreshtoken));
        response.setStatus(HttpStatus.OK.value());
    }


    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {

        response.setStatus(401);
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        //cookie.setPath("/");
        // cookie.setHttpOnly(true); // JavaScropt가 쿠키 읽기를 허용할지 결정 -> true면 읽을 수 없음(document.cookie로 쿠키 정보를 얻을 수 없음)
        cookie.setSecure(true); // https 환경에서만 가능
        cookie.setAttribute("SameSite", "None");
        return cookie;
    }
}