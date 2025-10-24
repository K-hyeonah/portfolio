package com.example.ApiRound.Controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;

import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/oauth/kakao")
public class KakaoOAuthController {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.client-secret:}")
    private String clientSecret;
    
    @Autowired
    private SocialUsersRepository socialUsersRepository;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 카카오 OAuth2 콜백
     */
    @GetMapping("/callback")
    public RedirectView kakaoCallback(@RequestParam String code, HttpSession session) {
        try {
            // 1. Access Token 가져오기
            String accessToken = getAccessToken(code);
            
            // 2. 사용자 정보 가져오기
            Map<String, Object> userInfo = getUserInfo(accessToken);
            
            String email = (String) userInfo.get("email");
            String nickname = (String) userInfo.get("nickname");
            
            // 3. 사용자 DB 조회 또는 생성
            Optional<SocialUsers> userOpt = socialUsersRepository.findByEmail(email);
            SocialUsers user;
            
            if (userOpt.isPresent()) {
                user = userOpt.get();
                
                // 사용자 상태 검증
                if (!"ACTIVE".equals(user.getStatus())) {
                    System.out.println("로그인 거부: 사용자 상태가 ACTIVE가 아님 - " + user.getStatus());
                    return new RedirectView("/login?error=account_inactive");
                }
                
                // 삭제된 사용자 검증
                if (Boolean.TRUE.equals(user.getIsDeleted())) {
                    System.out.println("로그인 거부: 삭제된 사용자");
                    return new RedirectView("/login?error=account_deleted");
                }
                
                user.setLastLoginAt(LocalDateTime.now());
                socialUsersRepository.save(user);
            } else {
                // 신규 사용자 생성
                user = SocialUsers.builder()
                        .email(email)
                        .name(nickname)
                        .isDeleted(false)
                        .lastLoginAt(LocalDateTime.now())
                        .build();
                user = socialUsersRepository.save(user);
            }
            
            // 4. 세션에 사용자 정보 저장
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("userName", user.getName());
            session.setAttribute("userType", "social");
            session.setAttribute("loginMethod", "kakao");
            
            return new RedirectView("/main");
            
        } catch (Exception e) {
            System.err.println("Kakao OAuth error: " + e.getMessage());
            e.printStackTrace();
            return new RedirectView("/login?error=kakao_oauth_failed");
        }
    }

    /**
     * Access Token 가져오기
     */
    private String getAccessToken(String code) throws Exception {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        if (clientSecret != null && !clientSecret.isEmpty()) {
            params.add("client_secret", clientSecret);
        }
        
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        
        ResponseEntity<String> response = restTemplate.postForEntity(
            tokenUrl,
            request,
            String.class
        );
        
        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("access_token").asText();
    }

    /**
     * 사용자 정보 가져오기
     */
    private Map<String, Object> getUserInfo(String accessToken) throws Exception {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        HttpEntity<String> request = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            userInfoUrl,
            HttpMethod.GET,
            request,
            String.class
        );
        
        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        
        // 카카오 응답에서 필요한 정보 추출
        String email = jsonNode.path("kakao_account").path("email").asText(null);
        String nickname = jsonNode.path("properties").path("nickname").asText("카카오사용자");
        String profileImage = jsonNode.path("properties").path("profile_image").asText(null);
        
        return Map.of(
            "email", email != null ? email : "",
            "nickname", nickname,
            "profileImage", profileImage != null ? profileImage : ""
        );
    }
}
