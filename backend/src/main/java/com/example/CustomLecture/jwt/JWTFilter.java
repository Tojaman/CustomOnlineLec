package com.example.CustomLecture.jwt;

import com.example.CustomLecture.dto.CustomUserDetails;
import com.example.CustomLecture.entity.UserEntity;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

//요청에 대해 한번만 동작하는 필터
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    // JWTUtil 주입
    public JWTFilter(JWTUtil jwtUtil){
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //request에서 Authorization 헤더를 찾음
        // String authorization= request.getHeader("Authorization");

        // //Authorization 헤더 검증
        // /* - 검증 내용 -
        //  * HTTP 헤더에 JWT 토큰이 존재하는지 여부
        //  * JWT 토큰의 형식이 맞는지 여부
        //  */
        // // JWT 토큰이 없거나 형식에 문제가 있는 경우도 있겠지만
        // // 로그인 요청일 경우도 이에 해당된다. 이 경우 LoginFilter로 넘어가게 되고 로그인 요청은 여기서 검증에 성공하게 된다.(다른 요청은 실패)
        // if (authorization == null || !authorization.startsWith("Bearer ")) {

        //     System.out.println("token null");
        //     // 다음 필터로 넘어가도록 함 -> LoginFilter로 넘어감
        //     filterChain.doFilter(request, response);

        //     //조건이 해당되면 메소드 종료 (필수)
        //     return;
        // }

        // System.out.println("authorization now");

        // //Bearer 부분 제거 후 순수 토큰만 획득
        // String token = authorization.split(" ")[1];

        // //토큰 소멸 시간 검증
        // if (jwtUtil.isExpired(token)) {

        //     System.out.println("token expired");
        //     filterChain.doFilter(request, response);

        //     //조건이 해당되면 메소드 종료 (필수)
        //     return;
        // }

//        String accessToken = request.getHeader("access");
        String accessToken = request.getHeader("Authorization");

        if (accessToken == null) {
            filterChain.doFilter(request, response);

            return;
        }

        accessToken = accessToken.substring(7).trim();
        
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String type = jwtUtil.getType(accessToken);

        if (!type.equals("access")) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        //토큰에서 username과 role 획득
        String username = jwtUtil.getUsername(accessToken);
        String role = jwtUtil.getRole(accessToken);

        //userEntity를 생성하여 값 set
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setPassword("temppassword"); // JWT 토큰에 비밀번호는 담기지 않지만 Entity에는 필요하기 때문에 아무거나 임시로 넣어둠
        userEntity.setRole(role);

        //UserDetails에 회원 정보 객체 담기
        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());

        //세션에 사용자 등록(임시 세션을 만들어서 임시 저장)
        // 토큰을 검증한 후, 사용자를 스프링 시큐리티 컨텍스트에 등록하여 애플리케이션 내에서 인증된 사용자로 취급하도록 하는 역할
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // 
        filterChain.doFilter(request, response);
    }
}
