package com.example.CustomLecture.config;

import com.example.CustomLecture.dto.CustomOAuth2User;
import com.example.CustomLecture.dto.GoogleResponse;
import com.example.CustomLecture.jwt.JWTFilter;
import com.example.CustomLecture.jwt.JWTUtil;
import com.example.CustomLecture.jwt.LoginFilter;
import com.example.CustomLecture.oauth2.CustomSuccessHandler;
import com.example.CustomLecture.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration // 스프링 컨테이너에 Configuration Bean으로 등록
@EnableWebSecurity // security 활성화(WebSecurityConfiguration.class, SpringWebMvcImportSelector.class, OAuth2ImportSelector.class, HttpSecurityConfiguration.class들을 import해서 활성화해줌)
public class SecurityConfig {

    //AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;

    // oauth2 google 로그인
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil, CustomOAuth2UserService customOAuth2UserService, CustomSuccessHandler customSuccessHandler) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtUtil = jwtUtil;
        this.customOAuth2UserService = customOAuth2UserService;
        this.customSuccessHandler = customSuccessHandler;
    }

    //AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // 비밀번호 암호화
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)throws Exception {


        http

            .cors((corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

                @Override
                public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                    CorsConfiguration configuration = new CorsConfiguration();

                    configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                    configuration.setAllowedMethods(Collections.singletonList("*"));
                    configuration.setAllowCredentials(true);
                    configuration.setAllowedHeaders(Collections.singletonList("*"));
                    configuration.setMaxAge(3600L);

//                    configuration.setExposedHeaders(Collections.singletonList("Set-Cookie"));
                    configuration.setExposedHeaders(Collections.singletonList("Authorization"));

                    return configuration;
                }
            })));


        /**
         * csrf disable : 세션을 stateless 상태로 관리하기 때문에 csrf에 대한 공격을 방어하지 않아도 됨
         * 세션 방식은 사용자의 정보를 브라우저의 세션 쿠키로 그리고 서버에 저장한다.
         * csrf는 세션 쿠키를 해킹?하여 서버에 요청(ex. 비밀번호 변경)을 보내면 서버상의 세션 정보와 비교하여 요청을 실행하는 방식으로 공격이 진행된다.
         * 따라서, 세션을 사용하지 않아 서버에 사용자의 정보가 저장되지 않는 JWT 토큰 방식은 csrf가 필요 없는 것이다.
         */
        http
                .csrf((auth) -> auth.disable());

        //From 로그인 방식 disable (JWT 방식 사용할꺼라 필요 없음)
        http
                .formLogin((auth) -> auth.disable());

        //http basic 인증 방식 disable (JWT 방식 사용할꺼라 필요 없음)
        http
                .httpBasic((auth) -> auth.disable());
        //oauth2
        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(customSuccessHandler));

        // 경로별 인가 작업
        http
            .authorizeHttpRequests((auth) -> auth
                    // 아래 경로에 대해서 모든 권한 허용 -> 이걸 밑밑으로 옮기면 로그인 한 사용자만 접근할 수 있도록 변경
                    .requestMatchers("/login", "/", "/join", "/v3/**", "/swagger-ui/**").permitAll()
                    // admin 경로는 admin이라는 권한 가진 사용자만 접근
                    .requestMatchers("/admin").hasRole("ADMIN")
                    // 그 외 다른 요청은 로그인한 사용자만 접근가능
                    .anyRequest().authenticated());


        // LoginFilter 앞에 JWTFilter 등록
        http
            .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        //필터 추가 LoginFilter는 인자를 받음 (AuthenticationManager() 메소드에 authenticationConfiguration 객체를 넣어야 함) 따라서 등록 필요
        http
            .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil), UsernamePasswordAuthenticationFilter.class);

        // 세션 stateless 상태로 설정
        http

            .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)); //stateless로 설정해야함


        return http.build();
    }
}
