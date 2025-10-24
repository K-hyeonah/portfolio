package com.example.ApiRound.dto;

import lombok.Data;

@Data
public class SocialUserDTO {
    private Long id;
    private String email;
    private String name;
    private String provider;
    private String providerId;
    private String profileImage;
    private String accessToken;
    private String refreshToken;
}