package com.example.ApiRound.crm.hyeonah.Service;

public interface EmailVerificationService {
    
    /**
     * 인증 코드 생성 및 이메일 전송
     */
    void sendVerificationCode(String email, String userType);
    
    /**
     * 인증 코드 검증
     */
    boolean verifyCode(String email, String code);
    
    /**
     * 인증 코드 삭제
     */
    void clearCode(String email);
}

