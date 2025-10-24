package com.example.ApiRound.crm.hyeonah.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.ApiRound.crm.hyeonah.Repository.SignupRepository;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class SignupServiceImpl implements SignupService {

    @Autowired
    private SignupRepository signupRepository;

    @Override
    public boolean isEmailExists(String email, String tableName) {
        return signupRepository.checkEmailExists(email, tableName);
    }

    @Override
    public boolean isBizNoExists(String bizNo) {
        return signupRepository.checkBizNoExists(bizNo);
    }

    @Override
    public boolean createSocialUser(String email, String password, String name, String phone, MultipartFile avatar) {
        try {
            String hashedPassword = hashPassword(password);
            byte[] avatarBlob = processAvatarImage(avatar);
            String avatarMime = getAvatarMimeType(avatar);
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("email", email);
            userData.put("password_hash", hashedPassword);
            userData.put("name", name);
            userData.put("phone", phone);
            userData.put("avatar_blob", avatarBlob);
            userData.put("avatar_mime", avatarMime);
            userData.put("avatar_updated_at", avatar != null ? LocalDateTime.now() : null);
            userData.put("is_deleted", 0);
            userData.put("created_at", LocalDateTime.now());
            userData.put("updated_at", LocalDateTime.now());
            
            return signupRepository.insertSocialUser(userData) > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean createCompanyUser(String email, String password, String companyName, String bizNo, String phone, String address, MultipartFile avatar) {
        try {
            String hashedPassword = hashPassword(password);
            byte[] avatarBlob = processAvatarImage(avatar);
            String avatarMime = getAvatarMimeType(avatar);
            
            Map<String, Object> companyData = new HashMap<>();
            companyData.put("email", email);
            companyData.put("password_hash", hashedPassword);
            companyData.put("company_name", companyName);
            companyData.put("biz_no", bizNo);
            companyData.put("phone", phone);
            companyData.put("address", address);
            companyData.put("avatar_blob", avatarBlob);
            companyData.put("avatar_mime", avatarMime);
            companyData.put("avatar_updated_at", avatar != null ? LocalDateTime.now() : null);
            companyData.put("is_active", 1);
            companyData.put("created_at", LocalDateTime.now());
            companyData.put("updated_at", LocalDateTime.now());
            
            return signupRepository.insertCompanyUser(companyData) > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean createManagerUser(String email, String password, String name, String role) {
        try {
            String hashedPassword = hashPassword(password);
            
            Map<String, Object> managerData = new HashMap<>();
            managerData.put("email", email);
            managerData.put("password_hash", hashedPassword);
            managerData.put("name", name);
            managerData.put("role", role);
            managerData.put("is_active", 1);
            managerData.put("created_at", LocalDateTime.now());
            managerData.put("updated_at", LocalDateTime.now());
            
            return signupRepository.insertManagerUser(managerData) > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 알고리즘을 찾을 수 없습니다.", e);
        }
    }

    @Override
    public byte[] processAvatarImage(MultipartFile avatar) {
        if (avatar == null || avatar.isEmpty()) {
            return null;
        }
        
        try {
            // 이미지 크기 제한 (5MB)
            if (avatar.getSize() > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("파일 크기는 5MB 이하여야 합니다.");
            }
            
            // 이미지 타입 확인
            String contentType = avatar.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
            }
            
            return avatar.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("이미지 처리 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    public String getAvatarMimeType(MultipartFile avatar) {
        if (avatar == null || avatar.isEmpty()) {
            return null;
        }
        
        String contentType = avatar.getContentType();
        if (contentType != null && contentType.startsWith("image/")) {
            return contentType;
        }
        
        return null;
    }
}