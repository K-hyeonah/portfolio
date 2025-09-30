package com.example.ApiRound.Service;

import com.example.ApiRound.dto.SocialUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
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
        return kakaoService.processKakaoLogin(code);
    }

    @Override
    public SocialUserDTO processGoogleLogin(String code) {
        return googleService.processGoogleLogin(code);
    }
}
