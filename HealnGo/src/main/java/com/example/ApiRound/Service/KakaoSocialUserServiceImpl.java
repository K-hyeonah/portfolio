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

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Transactional
@Service
public class KakaoSocialUserServiceImpl implements SocialUserService {

    @Autowired
    private SocialUserMapper socialUserMapper;

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${kakao.client-secret:}")
    private String kakaoClientSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public SocialUserDTO loginOrRegister(SocialUserDTO user) {
        SocialUserDTO existingUser = socialUserMapper.findBySocialIdAndProvider(
                user.getSocialId(), user.getProvider());

        if (existingUser == null) {
            socialUserMapper.insertUser(user);
            return user;
        }else {
            // 필요한 필드만 업데이트 (예: lastLogin, accessToken 등)
            existingUser.setLastLogin(Timestamp.valueOf(LocalDateTime.now()));
            existingUser.setAccessToken(user.getAccessToken());
            // 필요하다면 이름, 프로필 이미지, 이메일도 갱신 가능
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setProfileImage(user.getProfileImage());

            socialUserMapper.updateUser(existingUser);
            return existingUser;
        }
    }

    @Override
    public SocialUserDTO processKakaoLogin(String code) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", kakaoClientId);
            params.add("redirect_uri", kakaoRedirectUri);
            params.add("code", code);
            if (kakaoClientSecret != null && !kakaoClientSecret.isEmpty()) {
                params.add("client_secret", kakaoClientSecret);
            }

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);

            ResponseEntity<String> tokenResponse = restTemplate.postForEntity(
                    "https://kauth.kakao.com/oauth/token",
                    tokenRequest,
                    String.class
            );

            JsonNode tokenJson = objectMapper.readTree(tokenResponse.getBody());
            String accessToken = tokenJson.get("access_token").asText();
            System.out.println("[LOG] 액세스 토큰: " + accessToken);

            HttpHeaders userInfoHeaders = new HttpHeaders();
            userInfoHeaders.setBearerAuth(accessToken);
            HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);

            ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.GET,
                    userInfoRequest,
                    String.class
            );

            JsonNode userInfoJson = objectMapper.readTree(userInfoResponse.getBody());
            String socialId = userInfoJson.get("id").asText();
            String nickname = userInfoJson.path("properties").path("nickname").asText();
            String email = userInfoJson.path("kakao_account").path("email").asText(null);
            String profileImage = userInfoJson.path("properties").path("profile_image").asText(null);

            System.out.println("[LOG] 카카오 사용자 정보 JSON: " + userInfoResponse.getBody());


            SocialUserDTO user = new SocialUserDTO();
            user.setSocialId(socialId);
            user.setProvider("KAKAO");
            user.setName(nickname);
            user.setEmail(email);
            user.setProfileImage(profileImage);
            user.setAccessToken(accessToken);  // 추가!

            System.out.println("[LOG] SocialUserDTO 생성: " + user);

            return loginOrRegister(user);

        } catch (Exception e) {
            throw new RuntimeException("카카오 로그인 처리 실패", e);
        }
    }

    // Google 메서드는 여기서 구현하지 않음. 단순히 UnsupportedOperation 예외 처리
    @Override
    public SocialUserDTO processGoogleLogin(String code) {
        throw new UnsupportedOperationException("카카오 서비스에서는 구글 로그인 처리 불가");
    }
}
