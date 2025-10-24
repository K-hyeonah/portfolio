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

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/oauth/google")
public class GoogleOAuthController {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.redirect-uri}")
    private String redirectUri;
    
    @Value("${google.client-secret:}")
    private String clientSecret;

    @Autowired
    private SocialUsersRepository socialUsersRepository;

    /**
     * Google OAuth2 콜백
     */
    @GetMapping("/callback")
    public RedirectView googleCallback(@RequestParam String code, HttpSession session) {
        try {
            // 1. Access Token 가져오기
            String accessToken = getAccessToken(code);
            
            // 2. 사용자 정보 가져오기
            Map<String, Object> userInfo = getUserInfo(accessToken);
            
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            
            // 3. 사용자 DB 조회 또는 생성
            System.out.println("Google OAuth: 사용자 조회 시작 - " + email);
            Optional<SocialUsers> userOpt = socialUsersRepository.findByEmail(email);
            System.out.println("Google OAuth: 사용자 조회 결과 - " + (userOpt.isPresent() ? "존재" : "없음"));
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
                        .name(name)
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
            session.setAttribute("loginMethod", "google");
            
            return new RedirectView("/main");
            
        } catch (RuntimeException e) {
            // 상태 검증 실패 시
            if (e.getMessage().contains("계정이 비활성화") || e.getMessage().contains("계정이 삭제")) {
                System.err.println("Google OAuth 상태 검증 실패: " + e.getMessage());
                return new RedirectView("/login?error=account_inactive");
            }
            System.err.println("Google OAuth error: " + e.getMessage());
            e.printStackTrace();
            return new RedirectView("/login?error=google_oauth_failed");
        } catch (Exception e) {
            System.err.println("Google OAuth error: " + e.getMessage());
            e.printStackTrace();
            return new RedirectView("/login?error=google_oauth_failed");
        }
    }

    /**
     * Access Token 가져오기
     */
    private String getAccessToken(String code) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        
        String tokenUrl = "https://oauth2.googleapis.com/token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");
        
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        
        @SuppressWarnings("rawtypes")
        ResponseEntity<Map> response = restTemplate.exchange(
            tokenUrl,
            HttpMethod.POST,
            request,
            Map.class
        );
        
        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new RuntimeException("Failed to get access token from Google");
        }
        return (String) body.get("access_token");
    }

    /**
     * 사용자 정보 가져오기
     */
    @SuppressWarnings("rawtypes")
    private Map<String, Object> getUserInfo(String accessToken) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        
        String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        HttpEntity<String> request = new HttpEntity<>(headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(
            userInfoUrl,
            HttpMethod.GET,
            request,
            Map.class
        );
        
        return response.getBody();
    }
}
