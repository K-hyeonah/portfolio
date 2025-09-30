package com.example.ApiRound.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${google.redirect-uri}")
    private String googleRedirectUri;

    @GetMapping("/login")
    public String loginPage(Model model) {
        String kakaoLoginUrl = "https://kauth.kakao.com/oauth/authorize"
                + "?client_id=" + kakaoClientId
                + "&redirect_uri=" + kakaoRedirectUri
                + "&response_type=code"
                + "&prompt=login"; // 즉시 로그인 방지 옵션

        String googleLoginUrl = "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + googleClientId
                + "&redirect_uri=" + googleRedirectUri
                + "&response_type=code"
                + "&scope=openid%20email%20profile";

        System.out.println("[LOG] Google Login URL: " + googleLoginUrl);

        model.addAttribute("kakaoLoginUrl", kakaoLoginUrl);
        model.addAttribute("googleLoginUrl", googleLoginUrl);

        return "login";  // /WEB-INF/views/login.jsp (뷰 이름)
    }
}
