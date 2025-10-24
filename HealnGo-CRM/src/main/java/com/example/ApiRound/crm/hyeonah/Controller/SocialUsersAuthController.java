package com.example.ApiRound.crm.hyeonah.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.ApiRound.crm.hyeonah.Service.EmailVerificationService;
import com.example.ApiRound.crm.hyeonah.Service.SocialUsersService;
import com.example.ApiRound.crm.hyeonah.dto.EmailVerificationDto;
import com.example.ApiRound.crm.hyeonah.dto.SocialUsersDto;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;

import jakarta.servlet.http.HttpSession;

@Controller
public class SocialUsersAuthController {
    
    private final SocialUsersService userService;
    private final EmailVerificationService emailService;
    
    @Autowired
    public SocialUsersAuthController(
            SocialUsersService userService,
            EmailVerificationService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }
    
    /**
     * 회원가입 페이지
     */
    @GetMapping("/signup")
    public String signupPage() {
        return "crm/signup"; // templates/user-signup.html
    }
    
    /**
     * 비밀번호 찾기 페이지
     */
    @GetMapping("/forgot-password")
    public String forgotPasswordPage() {
        return "crm/forgot-password"; // templates/crm/forgot-password.html
    }
    
    /**
     * 이메일 중복 확인
     */
    @GetMapping("/api/user/check-email")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        boolean exists = userService.existsByEmail(email);
        
        if (exists) {
            response.put("available", false);
            response.put("message", "이미 사용 중인 이메일입니다.");
        } else {
            response.put("available", true);
            response.put("message", "사용 가능한 이메일입니다.");
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 이메일 인증 코드 전송
     */
    @PostMapping("/api/user/send-code")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> sendVerificationCode(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "이메일을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }
            
            emailService.sendVerificationCode(email, "social");
            
            response.put("success", true);
            response.put("message", "인증 코드가 이메일로 전송되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "이메일 전송에 실패했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 인증 코드 확인
     */
    @PostMapping("/api/user/verify-code")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody EmailVerificationDto dto) {
        Map<String, Object> response = new HashMap<>();
        
        boolean isValid = emailService.verifyCode(dto.getEmail(), dto.getCode());
        
        if (isValid) {
            response.put("success", true);
            response.put("message", "인증이 완료되었습니다.");
        } else {
            response.put("success", false);
            response.put("message", "인증 코드가 올바르지 않거나 만료되었습니다.");
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 회원가입
     */
    @PostMapping("/api/user/register")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> register(@RequestBody SocialUsersDto dto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            SocialUsers user = userService.register(dto);
            
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("userId", user.getUserId());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "회원가입 처리 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 로그인
     */
    @PostMapping("/api/user/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> loginRequest,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        Optional<SocialUsers> userOpt = userService.login(email, password);
        
        if (userOpt.isPresent()) {
            SocialUsers user = userOpt.get();
            
            // 사용자 상태 검증
            if (!"ACTIVE".equals(user.getStatus())) {
                System.out.println("로그인 거부: 사용자 상태가 ACTIVE가 아님 - " + user.getStatus());
                response.put("success", false);
                response.put("message", "계정이 비활성화되었습니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 삭제된 사용자 검증
            if (Boolean.TRUE.equals(user.getIsDeleted())) {
                System.out.println("로그인 거부: 삭제된 사용자");
                response.put("success", false);
                response.put("message", "계정이 삭제되었습니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 세션에 사용자 정보 저장
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("userEmail", user.getEmail());
            session.setAttribute("userName", user.getName());
            session.setAttribute("userType", "social");
            
            // 마지막 로그인 시간 업데이트
            userService.updateLastLogin(email);
            
            response.put("success", true);
            response.put("message", "로그인 성공");
            response.put("redirectUrl", "/main");
            
            return ResponseEntity.ok(response);
            
        } else {
            response.put("success", false);
            response.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 비밀번호 재설정
     */
    @PostMapping("/api/user/reset-password")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");
            
            if (email == null || newPassword == null) {
                response.put("success", false);
                response.put("message", "이메일과 새 비밀번호를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 사용자 찾기
            Optional<SocialUsers> userOpt = userService.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "해당 이메일로 등록된 계정을 찾을 수 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 비밀번호 업데이트
            userService.updatePassword(email, newPassword);
            
            response.put("success", true);
            response.put("message", "비밀번호가 성공적으로 재설정되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "비밀번호 재설정 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}

