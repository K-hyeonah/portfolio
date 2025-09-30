package com.example.ApiRound.dto;

import java.sql.Timestamp;

public class SocialUserDTO {
    private Long userId;
    private String socialId;
    private String email;
    private String name;
    private String profileImage;
    private String provider;
    private Timestamp createdAt;
    private Timestamp lastLogin;
    private String accessToken;

    // 기본 생성자
    public SocialUserDTO() {}

    // 전체 필드 생성자
    public SocialUserDTO(Long userId, String socialId, String email, String name, String profileImage, 
                        String provider, Timestamp createdAt, Timestamp lastLogin, String accessToken) {
        this.userId = userId;
        this.socialId = socialId;
        this.email = email;
        this.name = name;
        this.profileImage = profileImage;
        this.provider = provider;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
        this.accessToken = accessToken;
    }

    // Getter 메서드들
    public Long getUserId() { return userId; }
    public String getSocialId() { return socialId; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getProfileImage() { return profileImage; }
    public String getProvider() { return provider; }
    public Timestamp getCreatedAt() { return createdAt; }
    public Timestamp getLastLogin() { return lastLogin; }
    public String getAccessToken() { return accessToken; }

    // Setter 메서드들
    public void setUserId(Long userId) { this.userId = userId; }
    public void setSocialId(String socialId) { this.socialId = socialId; }
    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public void setProvider(String provider) { this.provider = provider; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public void setLastLogin(Timestamp lastLogin) { this.lastLogin = lastLogin; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
}