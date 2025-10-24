package com.example.ApiRound.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ApiRound.dto.SocialUserDTO;
import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserApiController {
    
    private final SocialUsersRepository socialUsersRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserApiController(SocialUsersRepository socialUsersRepository, PasswordEncoder passwordEncoder) {
        this.socialUsersRepository = socialUsersRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    /**
     * 현재 로그인한 사용자 정보 조회
     * GET /api/current-user
     */
    @GetMapping("/current-user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        SocialUserDTO user = getLoginUser(session);
        
        if (user == null) {
            response.put("error", "로그인이 필요합니다.");
            return ResponseEntity.status(401).body(response);
        }
        
        response.put("userId", user.getId());
        response.put("userName", user.getName());
        response.put("email", user.getEmail());
        response.put("provider", user.getProvider());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 로그인 상태 확인
     * GET /api/check-login
     */
    @GetMapping("/check-login")
    public ResponseEntity<Map<String, Object>> checkLogin(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        SocialUserDTO user = getLoginUser(session);
        response.put("isLoggedIn", user != null);
        
        if (user != null) {
            response.put("userId", user.getId());
            response.put("userName", user.getName());
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 사용자 프로필 업데이트
     * PUT /api/user/profile
     */
    @PutMapping("/user/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestBody Map<String, String> requestData,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        // 로그인 확인
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(401).body(response);
        }
        
        try {
            // 사용자 조회
            Optional<SocialUsers> userOpt = socialUsersRepository.findById(userId);
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "사용자를 찾을 수 없습니다.");
                return ResponseEntity.status(404).body(response);
            }
            
            SocialUsers user = userOpt.get();
            
            // 이름 업데이트
            String newName = requestData.get("name");
            if (newName != null && !newName.trim().isEmpty()) {
                user.setName(newName.trim());
            }
            
            // 비밀번호 변경 처리 (일반 로그인 사용자만)
            String currentPassword = requestData.get("currentPassword");
            String newPassword = requestData.get("newPassword");
            
            if (currentPassword != null && newPassword != null) {
                // OAuth 사용자는 비밀번호 변경 불가
                if (user.getProvider() != null && !user.getProvider().isEmpty()) {
                    response.put("success", false);
                    response.put("message", "소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.");
                    return ResponseEntity.badRequest().body(response);
                }
                
                // 현재 비밀번호 확인
                if (user.getPasswordHash() == null || 
                    !passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                    response.put("success", false);
                    response.put("message", "현재 비밀번호가 일치하지 않습니다.");
                    return ResponseEntity.badRequest().body(response);
                }
                
                // 새 비밀번호 설정
                user.setPasswordHash(passwordEncoder.encode(newPassword));
            }
            
            // 업데이트 시간 설정
            user.setUpdatedAt(LocalDateTime.now());
            
            // 저장
            socialUsersRepository.save(user);
            
            // 세션 정보 업데이트
            session.setAttribute("userName", user.getName());
            
            response.put("success", true);
            response.put("message", "정보가 성공적으로 저장되었습니다.");
            response.put("userName", user.getName());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("프로필 업데이트 오류: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "저장 중 오류가 발생했습니다.");
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // 로그인 사용자 가져오기 (헬퍼 메서드) - 상태 검증 포함
    private SocialUserDTO getLoginUser(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return null;
        }
        
        try {
            // DB에서 실제 사용자 정보 조회 및 상태 검증
            Optional<SocialUsers> userOpt = socialUsersRepository.findById(userId);
            if (userOpt.isEmpty()) {
                // 사용자가 DB에서 삭제됨 - 세션 무효화
                session.invalidate();
                return null;
            }
            
            SocialUsers user = userOpt.get();
            
            // 사용자 상태 검증
            if (!"ACTIVE".equals(user.getStatus())) {
                System.out.println("세션 무효화: 사용자 상태가 ACTIVE가 아님 - " + user.getStatus());
                session.invalidate();
                return null;
            }
            
            // 삭제된 사용자 검증
            if (Boolean.TRUE.equals(user.getIsDeleted())) {
                System.out.println("세션 무효화: 삭제된 사용자");
                session.invalidate();
                return null;
            }
            
            // 검증 통과 시 DTO 생성
            SocialUserDTO userDto = new SocialUserDTO();
            userDto.setId(user.getUserId().longValue());
            userDto.setEmail(user.getEmail());
            userDto.setName(user.getName());
            userDto.setProvider(user.getProvider());
            return userDto;
            
        } catch (Exception e) {
            System.err.println("getLoginUser 오류: " + e.getMessage());
            session.invalidate();
            return null;
        }
    }
}

