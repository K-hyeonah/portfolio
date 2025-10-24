package com.example.ApiRound.Service;

import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;

public interface GoogleSocialUserService {
    SocialUsers findOrCreateUser(String email, String name, String providerId, String profileImage, String accessToken, String refreshToken);
    SocialUsers findByEmailAndProvider(String email, String provider);
}
