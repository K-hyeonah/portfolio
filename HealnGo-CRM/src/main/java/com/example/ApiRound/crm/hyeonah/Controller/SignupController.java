package com.example.ApiRound.crm.hyeonah.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.example.ApiRound.crm.hyeonah.Service.SignupService;

// @Controller  // 임시 비활성화 - CompanyAuthController 사용
@RequestMapping("/crm")
public class SignupController {

    @Autowired
    private SignupService signupService;

    /**
     * 회원가입 페이지 표시
     */
    @GetMapping("/signup")
    public String signupPage(Model model) {
        return "crm/signup";
    }

    /**
     * 일반 사용자 회원가입 처리
     */
    @PostMapping("/signup/social")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> signupSocial(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("name") String name,
            @RequestParam("phone") String phone,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 이메일 중복 확인
            if (signupService.isEmailExists(email, "social_users")) {
                response.put("success", false);
                response.put("message", "이미 사용 중인 이메일입니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 회원가입 처리
            boolean result = signupService.createSocialUser(email, password, name, phone, avatar);
            
            if (result) {
                response.put("success", true);
                response.put("message", "회원가입이 완료되었습니다.");
            } else {
                response.put("success", false);
                response.put("message", "회원가입에 실패했습니다.");
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 업체 회원가입 처리
     */
    @PostMapping("/signup/company")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> signupCompany(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("companyName") String companyName,
            @RequestParam("bizNo") String bizNo,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 이메일 중복 확인
            if (signupService.isEmailExists(email, "company_user")) {
                response.put("success", false);
                response.put("message", "이미 사용 중인 이메일입니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 사업자등록번호 중복 확인
            if (signupService.isBizNoExists(bizNo)) {
                response.put("success", false);
                response.put("message", "이미 등록된 사업자등록번호입니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 회원가입 처리
            boolean result = signupService.createCompanyUser(email, password, companyName, bizNo, phone, address, avatar);
            
            if (result) {
                response.put("success", true);
                response.put("message", "업체 등록이 완료되었습니다.");
            } else {
                response.put("success", false);
                response.put("message", "업체 등록에 실패했습니다.");
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 관리자 회원가입 처리
     */
    @PostMapping("/signup/manager")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> signupManager(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("name") String name,
            @RequestParam("role") String role) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 이메일 중복 확인
            if (signupService.isEmailExists(email, "manager_user")) {
                response.put("success", false);
                response.put("message", "이미 사용 중인 이메일입니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 회원가입 처리
            boolean result = signupService.createManagerUser(email, password, name, role);
            
            if (result) {
                response.put("success", true);
                response.put("message", "관리자 등록이 완료되었습니다.");
            } else {
                response.put("success", false);
                response.put("message", "관리자 등록에 실패했습니다.");
            }
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 이메일 중복 확인 API
     */
    @GetMapping("/check-email")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkEmail(
            @RequestParam("email") String email,
            @RequestParam("userType") String userType) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String tableName = getTableName(userType);
            boolean exists = signupService.isEmailExists(email, tableName);
            
            response.put("exists", exists);
            response.put("message", exists ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다.");
            
        } catch (Exception e) {
            response.put("exists", true);
            response.put("message", "확인 중 오류가 발생했습니다.");
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 사업자등록번호 중복 확인 API
     */
    @GetMapping("/check-bizno")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkBizNo(@RequestParam("bizNo") String bizNo) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean exists = signupService.isBizNoExists(bizNo);
            
            response.put("exists", exists);
            response.put("message", exists ? "이미 등록된 사업자등록번호입니다." : "사용 가능한 사업자등록번호입니다.");
            
        } catch (Exception e) {
            response.put("exists", true);
            response.put("message", "확인 중 오류가 발생했습니다.");
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * 사용자 타입에 따른 테이블명 반환
     */
    private String getTableName(String userType) {
        switch (userType) {
            case "social":
                return "social_users";
            case "company":
                return "company_user";
            case "manager":
                return "manager_user";
            default:
                return "social_users";
        }
    }
}
