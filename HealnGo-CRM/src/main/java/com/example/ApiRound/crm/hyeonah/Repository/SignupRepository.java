package com.example.ApiRound.crm.hyeonah.Repository;

import java.util.Map;

public interface SignupRepository {
    
    /**
     * 이메일 중복 확인
     */
    boolean checkEmailExists(String email, String tableName);
    
    /**
     * 사업자등록번호 중복 확인
     */
    boolean checkBizNoExists(String bizNo);
    
    /**
     * 일반 사용자 회원가입
     */
    int insertSocialUser(Map<String, Object> userData);
    
    /**
     * 업체 회원가입
     */
    int insertCompanyUser(Map<String, Object> companyData);
    
    /**
     * 관리자 회원가입
     */
    int insertManagerUser(Map<String, Object> managerData);
}
