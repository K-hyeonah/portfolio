package com.example.ApiRound.crm.hyeonah.Service;

import java.util.Optional;

import com.example.ApiRound.crm.hyeonah.dto.SocialUsersDto;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;

public interface SocialUsersService {
    
    /**
     * 회원가입
     */
    SocialUsers register(SocialUsersDto dto);
    
    /**
     * 이메일로 사용자 조회
     */
    Optional<SocialUsers> findByEmail(String email);
    
    /**
     * 로그인
     */
    Optional<SocialUsers> login(String email, String password);
    
    /**
     * 이메일 중복 확인
     */
    boolean existsByEmail(String email);
    
    /**
     * 마지막 로그인 시간 업데이트
     */
    void updateLastLogin(String email);
    
    /**
     * 비밀번호 업데이트
     */
    void updatePassword(String email, String newPassword);
}

