package com.example.ApiRound.crm.hyeonah.Service;

import org.springframework.web.multipart.MultipartFile;

public interface SignupService {
    
    /**
     * 이메일 중복 확인
     */
    boolean isEmailExists(String email, String tableName);
    
    /**
     * 사업자등록번호 중복 확인
     */
    boolean isBizNoExists(String bizNo);
    
    /**
     * 일반 사용자 회원가입
     */
    boolean createSocialUser(String email, String password, String name, String phone, MultipartFile avatar);
    
    /**
     * 업체 회원가입
     */
    boolean createCompanyUser(String email, String password, String companyName, String bizNo, String phone, String address, MultipartFile avatar);
    
    /**
     * 관리자 회원가입
     */
    boolean createManagerUser(String email, String password, String name, String role);
    
    /**
     * 비밀번호 해시화
     */
    String hashPassword(String password);
    
    /**
     * 아바타 이미지 저장
     */
    byte[] processAvatarImage(MultipartFile avatar);
    
    /**
     * 아바타 MIME 타입 확인
     */
    String getAvatarMimeType(MultipartFile avatar);
}
