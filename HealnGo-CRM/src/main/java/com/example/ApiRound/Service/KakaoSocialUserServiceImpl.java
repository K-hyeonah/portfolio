package com.example.ApiRound.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.example.ApiRound.dto.SocialUserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

@Transactional
// @Service  // 임시 비활성화 - SocialUserMapper 없음
public class KakaoSocialUserServiceImpl implements SocialUserService {

    // @Autowired
    // private SocialUserMapper socialUserMapper;  // 임시 주석

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${kakao.client-secret:}")
    private String kakaoClientSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public SocialUserDTO loginOrRegister(SocialUserDTO user) {
        // TODO: 새로운 SocialUsers 엔티티로 변경 필요
        return user;
    }

    @Override
    public SocialUserDTO processKakaoLogin(String code) {
        // TODO: 새로운 SocialUsers 엔티티로 구현 필요
        throw new UnsupportedOperationException("카카오 로그인 미구현");
    }

    // Google 메서드는 여기서 구현하지 않음. 단순히 UnsupportedOperation 예외 처리
    @Override
    public SocialUserDTO processGoogleLogin(String code) {
        throw new UnsupportedOperationException("카카오 서비스에서는 구글 로그인 처리 불가");
    }
}