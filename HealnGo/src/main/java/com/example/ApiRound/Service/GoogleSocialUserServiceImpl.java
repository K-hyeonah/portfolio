package com.example.ApiRound.Service;

import com.example.ApiRound.dto.SocialUserDTO;
import com.example.ApiRound.mapper.SocialUserMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Transactional
@Service
public class GoogleSocialUserServiceImpl implements SocialUserService {

    @Autowired
    private SocialUserMapper socialUserMapper;

    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${google.client-secret}")
    private String googleClientSecret;

    @Value("${google.redirect-uri}")
    private String googleRedirectUri;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public SocialUserDTO loginOrRegister(SocialUserDTO user) {
        SocialUserDTO existingUser = socialUserMapper.findBySocialIdAndProvider(
                user.getSocialId(), user.getProvider());

        if (existingUser == null) {
            socialUserMapper.insertUser(user);
            return user;
        }
        return existingUser;
    }

    @Override
    public SocialUserDTO processGoogleLogin(String code) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", googleClientId);
            params.add("client_secret", googleClientSecret);
            params.add("redirect_uri", googleRedirectUri);
            params.add("grant_type", "authorization_code");

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);

            ResponseEntity<String> tokenResponse = restTemplate.postForEntity(
                    "https://oauth2.googleapis.com/token",
                    tokenRequest,
                    String.class
            );

            JsonNode tokenJson = objectMapper.readTree(tokenResponse.getBody());
            String accessToken = tokenJson.get("access_token").asText();

            HttpHeaders userInfoHeaders = new HttpHeaders();
            userInfoHeaders.setBearerAuth(accessToken);

            HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);
            ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    HttpMethod.GET,
                    userInfoRequest,
                    String.class
            );

            JsonNode userInfoJson = objectMapper.readTree(userInfoResponse.getBody());

            SocialUserDTO user = new SocialUserDTO();
            user.setSocialId(userInfoJson.get("id").asText());
            user.setEmail(userInfoJson.path("email").asText(null));
            user.setName(userInfoJson.path("name").asText(null));
            user.setProfileImage(userInfoJson.path("picture").asText(null));
            user.setProvider("GOOGLE");
            user.setAccessToken(accessToken);  // 추가!

            return loginOrRegister(user);

        } catch (Exception e) {
            throw new RuntimeException("구글 로그인 처리 실패", e);
        }
    }

    // Kakao 메서드는 여기서 구현하지 않음. 단순히 UnsupportedOperation 예외 처리
    @Override
    public SocialUserDTO processKakaoLogin(String code) {
        throw new UnsupportedOperationException("구글 서비스에서는 카카오 로그인 처리 불가");
    }
}
