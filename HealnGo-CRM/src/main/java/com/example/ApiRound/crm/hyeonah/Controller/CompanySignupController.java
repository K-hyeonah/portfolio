package com.example.ApiRound.crm.hyeonah.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@Controller
public class CompanySignupController {

    // 회사 회원가입 페이지
    @GetMapping("/company/signup")
    public String companySignup() {
        return "crm/company_signup";
    }

    // SMS 인증번호 전송
    @PostMapping("/api/sms/send")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> sendSMS(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String phoneNumber = request.get("phoneNumber");
            
            // 실제 구현에서는 SMS 서비스 API 호출
            // String verificationCode = smsService.sendVerificationCode(phoneNumber);
            
            // 시뮬레이션: 6자리 인증번호 생성
            String verificationCode = generateVerificationCode();
            
            response.put("success", true);
            response.put("message", "SMS 인증번호가 전송되었습니다.");
            response.put("verificationCode", verificationCode); // 개발용 (실제로는 전송하지 않음)
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "SMS 전송 중 오류가 발생했습니다.");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // SMS 인증번호 검증
    @PostMapping("/api/sms/verify")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> verifySMS(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String phoneNumber = request.get("phoneNumber");
            String verificationCode = request.get("verificationCode");
            
            // 실제 구현에서는 SMS 서비스에서 검증
            // boolean isValid = smsService.verifyCode(phoneNumber, verificationCode);
            
            // 시뮬레이션: 6자리 숫자면 통과
            boolean isValid = verificationCode != null && verificationCode.length() == 6 && verificationCode.matches("\\d{6}");
            
            if (isValid) {
                response.put("success", true);
                response.put("message", "인증이 완료되었습니다.");
            } else {
                response.put("success", false);
                response.put("message", "인증번호가 올바르지 않습니다.");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "인증 중 오류가 발생했습니다.");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 회사 회원가입 처리
    @PostMapping("/api/company/signup")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> processSignup(@RequestBody Map<String, Object> signupData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 회원가입 데이터 검증
            if (!validateSignupData(signupData)) {
                response.put("success", false);
                response.put("message", "입력된 정보를 다시 확인해주세요.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 실제 구현에서는 데이터베이스에 저장
            // CompanyUser companyUser = companyUserService.createCompanyUser(signupData);
            
            // 시뮬레이션: 성공 응답
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("userId", "COMP_" + System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "회원가입 중 오류가 발생했습니다: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 회원가입 데이터 검증
    private boolean validateSignupData(Map<String, Object> signupData) {
        // 필수 필드 검증
        String phone = (String) signupData.get("phone");
        String email = (String) signupData.get("email");
        String password = (String) signupData.get("password");
        String companyName = (String) signupData.get("companyName");
        String companyNumber = (String) signupData.get("companyNumber");
        String hospitalType = (String) signupData.get("hospitalType");
        String position = (String) signupData.get("position");
        
        // 기본 검증
        if (phone == null || phone.trim().isEmpty()) return false;
        if (email == null || email.trim().isEmpty()) return false;
        if (password == null || password.length() < 6) return false;
        if (companyName == null || companyName.trim().isEmpty()) return false;
        if (companyNumber == null || companyNumber.trim().isEmpty()) return false;
        if (hospitalType == null || hospitalType.trim().isEmpty()) return false;
        if (position == null || position.trim().isEmpty()) return false;
        
        // 이메일 형식 검증
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) return false;
        
        return true;
    }

    // 인증번호 생성 (개발용)
    private String generateVerificationCode() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }
}
