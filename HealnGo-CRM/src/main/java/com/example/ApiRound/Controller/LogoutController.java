package com.example.ApiRound.Controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.http.HttpHeaders;




@Controller
@RequestMapping("/logout")
public class LogoutController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public RedirectView logout(HttpSession session) {
        String loginProvider = (String) session.getAttribute("loginProvider");
        String accessToken = (String) session.getAttribute("accessToken");

        if (loginProvider == null) {
            session.invalidate();
            return new RedirectView("/login");
        }

        try {
            if ("kakao".equals(loginProvider) && accessToken != null) {
                // 카카오 로그아웃 API 호출
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(accessToken);
                HttpEntity<Void> request = new HttpEntity<>(headers);
                restTemplate.postForEntity("https://kapi.kakao.com/v1/user/logout", request, String.class);
            } else if ("google".equals(loginProvider)) {
                // 구글 로그아웃 API 호출 (필요 시)
                // 기본적으로는 세션만 무효화해도 됨
                session.invalidate();
                return new RedirectView("/main");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        session.invalidate();
        return new RedirectView("/login");
    }
}
