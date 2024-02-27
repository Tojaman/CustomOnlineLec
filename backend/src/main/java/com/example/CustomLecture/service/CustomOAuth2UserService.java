package com.example.CustomLecture.service;

import com.example.CustomLecture.dto.CustomOAuth2User;
import com.example.CustomLecture.dto.GoogleResponse;
import com.example.CustomLecture.dto.OAuth2Response;
import com.example.CustomLecture.dto.UserDTO;
import com.example.CustomLecture.entity.UserEntity;
import com.example.CustomLecture.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    // userRequest : 리소스 서버에서 제공되는 user 정보
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println(oAuth2User);

        // 네이버인지 구글인지 확인 -> 우린 구글만 함
        OAuth2Response oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());

        //리소스 서버에서 발급 받은 정보로 사용자를 특정할 아이디값을 만듬
        String googleId = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();

        UserEntity existData = userRepository.findByGoogleId(googleId);
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 userId 입니다."));

        // 로그인을 한 번도 안한 경우 -> 회원가입
        if (existData == null) {
            UserEntity userEntity = new UserEntity();
            userEntity.setGoogleId(googleId);
            userEntity.setUsername(oAuth2Response.getEmail());
            userEntity.setNickname(oAuth2Response.getName());
            userEntity.setRole("ROLE_USER");

            userRepository.save(userEntity);

            UserDTO userDTO = new UserDTO();
            userDTO.setGoogleId(googleId);
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole("ROLE_USER");

            return new CustomOAuth2User(userDTO);
        }
        // 한 번이라도 로그인을 한 경우 -> 로그인
        else {
            // 이메일이나 닉네임이 바뀌었을 경우 재설정
            existData.setUsername(oAuth2Response.getEmail());
            existData.setNickname(oAuth2Response.getName());
            userRepository.save(existData);


            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(existData.getUsername());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole(existData.getRole());

            return new CustomOAuth2User(userDTO);
        }
    }
}