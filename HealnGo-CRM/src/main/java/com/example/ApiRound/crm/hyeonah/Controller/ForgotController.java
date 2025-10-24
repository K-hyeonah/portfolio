package com.example.ApiRound.crm.hyeonah.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 이 컨트롤러는 SocialUsersAuthController와 CompanyAuthController로 대체되었습니다.
 * /forgot-password는 SocialUsersAuthController에서 처리합니다.
 */
//@Controller
//public class ForgotController {
//
//    /**
//     * 비밀번호 찾기 페이지
//     */
//    @GetMapping("/forgot-password")
//    public String forgotPasswordPage() {
//        return "crm/forgot-password";
//    }
//
//    /**
//     * 이메일 찾기 페이지
//     */
//    @GetMapping("/forgot-email")
//    public String forgotEmailPage() {
//        return "crm/forgot-email";
//    }
//
//    /**
//     * 비밀번호 재설정 요청 처리
//     */
//    @PostMapping("/forgot-password")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestParam("email") String email) {
//        Map<String, Object> response = new HashMap<>();
//        
//        try {
//            // TODO: 실제 이메일 발송 로직 구현
//            // 1. 이메일이 존재하는지 확인
//            // 2. 비밀번호 재설정 토큰 생성
//            // 3. 이메일 발송
//            
//            // 시뮬레이션
//            boolean emailExists = checkEmailExists(email);
//            
//            if (emailExists) {
//                // 실제로는 이메일 발송 로직이 여기에 들어감
//                System.out.println("비밀번호 재설정 링크를 " + email + "로 발송");
//                
//                response.put("success", true);
//                response.put("message", "비밀번호 재설정 링크가 이메일로 발송되었습니다.");
//            } else {
//                response.put("success", false);
//                response.put("message", "해당 이메일로 등록된 계정을 찾을 수 없습니다.");
//            }
//            
//        } catch (Exception e) {
//            response.put("success", false);
//            response.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
//        }
//        
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 이메일 찾기 요청 처리
//     */
//    @PostMapping("/forgot-email")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> forgotEmail(
//            @RequestParam("name") String name,
//            @RequestParam("phone") String phone) {
//        
//        Map<String, Object> response = new HashMap<>();
//        
//        try {
//            // TODO: 실제 데이터베이스 조회 로직 구현
//            // 1. 이름과 전화번호로 사용자 조회
//            // 2. 이메일 반환 (보안을 위해 일부 마스킹)
//            
//            // 시뮬레이션
//            String foundEmail = findEmailByNameAndPhone(name, phone);
//            
//            if (foundEmail != null) {
//                response.put("success", true);
//                response.put("email", foundEmail);
//                response.put("message", "이메일을 찾았습니다.");
//            } else {
//                response.put("success", false);
//                response.put("message", "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
//            }
//            
//        } catch (Exception e) {
//            response.put("success", false);
//            response.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
//        }
//        
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 이메일 존재 여부 확인 (시뮬레이션)
//     */
//    private boolean checkEmailExists(String email) {
//        // TODO: 실제 데이터베이스 조회
//        // 여기서는 시뮬레이션으로 몇 가지 이메일만 존재한다고 가정
//        return email.equals("test@example.com") || 
//               email.equals("user@healngo.com") || 
//               email.equals("admin@healngo.com");
//    }
//
//    /**
//     * 이름과 전화번호로 이메일 찾기 (시뮬레이션)
//     */
//    private String findEmailByNameAndPhone(String name, String phone) {
//        // TODO: 실제 데이터베이스 조회
//        // 여기서는 시뮬레이션으로 몇 가지 조합만 반환
//        if (name.equals("홍길동") && phone.equals("010-1234-5678")) {
//            return "hong@example.com";
//        } else if (name.equals("김철수") && phone.equals("010-9876-5432")) {
//            return "kim@healngo.com";
//        } else if (name.equals("이영희") && phone.equals("010-5555-1234")) {
//            return "lee@healngo.com";
//        }
//        return null;
//    }
//}
