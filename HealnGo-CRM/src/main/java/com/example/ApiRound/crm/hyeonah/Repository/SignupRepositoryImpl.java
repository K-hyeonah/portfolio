package com.example.ApiRound.crm.hyeonah.Repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class SignupRepositoryImpl implements SignupRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public boolean checkEmailExists(String email, String tableName) {
        String sql = "SELECT COUNT(*) FROM " + tableName + " WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    @Override
    public boolean checkBizNoExists(String bizNo) {
        String sql = "SELECT COUNT(*) FROM company_user WHERE biz_no = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, bizNo);
        return count != null && count > 0;
    }

    @Override
    public int insertSocialUser(Map<String, Object> userData) {
        String sql = """
            INSERT INTO social_users 
            (email, password_hash, name, phone, avatar_blob, avatar_mime, avatar_updated_at, is_deleted, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        
        return jdbcTemplate.update(sql,
            userData.get("email"),
            userData.get("password_hash"),
            userData.get("name"),
            userData.get("phone"),
            userData.get("avatar_blob"),
            userData.get("avatar_mime"),
            userData.get("avatar_updated_at"),
            userData.get("is_deleted"),
            userData.get("created_at"),
            userData.get("updated_at")
        );
    }

    @Override
    public int insertCompanyUser(Map<String, Object> companyData) {
        String sql = """
            INSERT INTO company_user 
            (email, password_hash, company_name, biz_no, phone, address, avatar_blob, avatar_mime, avatar_updated_at, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        
        return jdbcTemplate.update(sql,
            companyData.get("email"),
            companyData.get("password_hash"),
            companyData.get("company_name"),
            companyData.get("biz_no"),
            companyData.get("phone"),
            companyData.get("address"),
            companyData.get("avatar_blob"),
            companyData.get("avatar_mime"),
            companyData.get("avatar_updated_at"),
            companyData.get("is_active"),
            companyData.get("created_at"),
            companyData.get("updated_at")
        );
    }

    @Override
    public int insertManagerUser(Map<String, Object> managerData) {
        String sql = """
            INSERT INTO manager_user 
            (email, password_hash, name, role, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """;
        
        return jdbcTemplate.update(sql,
            managerData.get("email"),
            managerData.get("password_hash"),
            managerData.get("name"),
            managerData.get("role"),
            managerData.get("is_active"),
            managerData.get("created_at"),
            managerData.get("updated_at")
        );
    }
}
