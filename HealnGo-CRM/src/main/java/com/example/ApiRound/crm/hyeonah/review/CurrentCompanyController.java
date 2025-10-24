package com.example.ApiRound.crm.hyeonah.review;

import java.util.Map;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 현재 로그인한 업체의 companyId를 JSON으로 반환
 * 경로: GET /crm/api/current-company
 * - 클래스 레벨 @RequestMapping("/review") 붙이지 마세요.
 */
@RestController
@Slf4j
public class CurrentCompanyController {

    @GetMapping(value = "/crm/api/current-company", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> currentCompany(HttpSession session) {
        // CRM은 세션 기반 로그인이므로 세션에서 직접 가져옴
        Integer companyId = (Integer) session.getAttribute("companyId");
        String userType = (String) session.getAttribute("userType");
        
        log.info("[current-company] companyId={}, userType={}", companyId, userType);
        
        if (companyId != null && "company".equals(userType)) {
            return Map.of(
                "companyId", companyId,
                "success", true
            );
        } else {
            log.warn("[current-company] 세션에 companyId가 없거나 userType이 company가 아님");
            throw new Unauthenticated();
        }
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    static class Unauthenticated extends RuntimeException {}

    @ResponseStatus(HttpStatus.FORBIDDEN)
    static class NoCompany extends RuntimeException {}
}