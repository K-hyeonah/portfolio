package com.example.ApiRound.crm.hyeonah.Service;

import java.util.Optional;

import com.example.ApiRound.crm.hyeonah.dto.CompanyUserDto;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;

public interface CompanyUserService {
    
    /**
     * 업체 회원가입
     */
    CompanyUser register(CompanyUserDto dto);
    
    /**
     * ID로 업체 조회
     */
    Optional<CompanyUser> findById(Integer companyId);
    
    /**
     * 이메일로 업체 조회
     */
    Optional<CompanyUser> findByEmail(String email);
    
    /**
     * 로그인
     */
    Optional<CompanyUser> login(String email, String password);
    
    /**
     * 이메일 중복 확인
     */
    boolean existsByEmail(String email);
    
    /**
     * 비밀번호 업데이트
     */
    void updatePassword(String email, String newPassword);
    
    /**
     * 업체 정보 업데이트
     */
    CompanyUser update(Integer companyId, CompanyUserDto dto);
    
    /**
     * 아바타 이미지 업데이트
     */
    void updateAvatar(Integer companyId, byte[] imageData, String mimeType);
}

