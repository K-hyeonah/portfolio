package com.example.ApiRound.Controller;

import com.example.ApiRound.Service.SocialUserService;
import com.example.ApiRound.dto.SocialUserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

@Controller
@RequestMapping("/oauth/google")
public class GoogleOAuthController {

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    @Autowired
    @Qualifier("googleSocialUserServiceImpl") //GoogleSocialUserServiceImpl 를 주입하고 싶을 때
    private SocialUserService socialUserService;

    // 구글 로그인 URL 생성 메서드 (클라이언트에 URL 전달하거나, 직접 링크로 사용 가능)
    @GetMapping("/login-url")
    public String getGoogleLoginUrl() {
        String googleLoginUrl = "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&response_type=code"
                + "&scope=openid%20email%20profile";
        return googleLoginUrl;
    }

    @GetMapping("/callback")
    public RedirectView googleCallback(@RequestParam String code, HttpSession session) {
        SocialUserDTO loginUser = socialUserService.processGoogleLogin(code);
        session.setAttribute("loginUser", loginUser);
        session.setAttribute("accessToken", loginUser.getAccessToken());  // 추가!
        return new RedirectView("/main");
    }

}
