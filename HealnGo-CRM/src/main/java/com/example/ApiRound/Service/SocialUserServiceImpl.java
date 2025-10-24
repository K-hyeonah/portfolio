package com.example.ApiRound.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.example.ApiRound.dto.SocialUserDTO;

@Transactional
// @Service  // 임시 비활성화 - 새로운 SocialUsers 구조 사용
public class SocialUserServiceImpl implements SocialUserService {

    private final KakaoSocialUserServiceImpl kakaoService;
    private final GoogleSocialUserServiceImpl googleService;

    @Autowired
    public SocialUserServiceImpl(KakaoSocialUserServiceImpl kakaoService,
                                 GoogleSocialUserServiceImpl googleService) {
        this.kakaoService = kakaoService;
        this.googleService = googleService;
    }

    @Override
    public SocialUserDTO loginOrRegister(SocialUserDTO user) {
        // 공통 로직만 여기서 처리하거나, 필요 시 두 서비스 각각에 위임
        // 지금은 두 서비스에 각각 구현되어 있으므로 임의로 구분 필요 없음
        throw new UnsupportedOperationException("이 메서드는 직접 호출하지 마세요.");
    }

    @Override
    public SocialUserDTO processKakaoLogin(String code) {
        // TODO: Kakao 로그인 처리 로직 구현
        throw new UnsupportedOperationException("Kakao 로그인 처리 로직이 구현되지 않았습니다.");
    }

    @Override
    public SocialUserDTO processGoogleLogin(String code) {
        // TODO: Google 로그인 처리 로직 구현
        throw new UnsupportedOperationException("Google 로그인 처리 로직이 구현되지 않았습니다.");
    }
}
