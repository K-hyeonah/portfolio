package com.example.ApiRound.Service;

import com.example.ApiRound.dto.SocialUserDTO;
/*
* 1. 사용자 조회 (Mapper)
2. 존재하지 않으면 → 회원가입 (Mapper)
3. 존재하면 → 로그인 시간 업데이트 (Mapper)
* */
public interface SocialUserService {
    SocialUserDTO loginOrRegister(SocialUserDTO user);

    SocialUserDTO processKakaoLogin(String code);
    SocialUserDTO processGoogleLogin(String code);

}

