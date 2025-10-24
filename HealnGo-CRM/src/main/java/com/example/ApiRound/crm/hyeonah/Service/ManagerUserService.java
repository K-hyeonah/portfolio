package com.example.ApiRound.crm.hyeonah.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.ApiRound.crm.hyeonah.entity.ManagerUser;

public interface ManagerUserService {
    
    /**
     * 사용자 목록 조회 (페이지네이션)
     */
    List<Map<String, Object>> getUserList(int pageNo, int amount, String search);
    
    /**
     * 전체 사용자 수 조회
     */
    int getTotalUserCount(String search);
    
    /**
     * 이메일과 비밀번호로 로그인
     */
    Optional<ManagerUser> login(String email, String password);
    
    /**
     * 이메일로 매니저 찾기
     */
    Optional<ManagerUser> findByEmail(String email);
    
    /**
     * 매니저 회원가입
     */
    ManagerUser register(String email, String password, String name, String phone, String inviteCode);
    
    /**
     * 이메일 중복 확인
     */
    boolean existsByEmail(String email);
    
    /**
     * 비밀번호 업데이트
     */
    void updatePassword(String email, String newPassword);
}
