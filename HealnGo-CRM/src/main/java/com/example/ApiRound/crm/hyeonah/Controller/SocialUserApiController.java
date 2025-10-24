package com.example.ApiRound.crm.hyeonah.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;

import lombok.RequiredArgsConstructor;

/**
 * 소셜 사용자 정보 조회 API
 * - 업체가 채팅 시 고객 정보를 확인하기 위한 용도
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class SocialUserApiController {
    
    private final SocialUsersRepository socialUsersRepository;
    
    /**
     * 사용자 정보 조회 (ID로)
     * company_inquiry_chat.js에서 사용
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        return socialUsersRepository.findById(userId)
            .map(user -> {
                Map<String, Object> response = new HashMap<>();
                response.put("userId", user.getUserId());
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                response.put("phone", user.getPhone());
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}

