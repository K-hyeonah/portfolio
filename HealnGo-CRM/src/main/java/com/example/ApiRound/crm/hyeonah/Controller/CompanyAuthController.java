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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.ApiRound.crm.hyeonah.Service.CompanyUserService;
import com.example.ApiRound.crm.hyeonah.Service.EmailVerificationService;
import com.example.ApiRound.crm.hyeonah.Service.ManagerUserService;
import com.example.ApiRound.crm.hyeonah.dto.CompanyUserDto;
import com.example.ApiRound.crm.hyeonah.dto.EmailVerificationDto;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.crm.hyeonah.entity.ManagerUser;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/crm")
public class CompanyAuthController {
    
    private final CompanyUserService companyService;
    private final EmailVerificationService emailService;
    private final ManagerUserService managerService;
    
    @Autowired
    public CompanyAuthController(
            CompanyUserService companyService,
            EmailVerificationService emailService,
            ManagerUserService managerService) {
        this.companyService = companyService;
        this.emailService = emailService;
        this.managerService = managerService;
    }
    
    /**
     * 현재 로그인한 업체 ID 조회 API
     */
    @GetMapping("/api/current-company")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getCurrentCompany(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        
        Integer companyId = (Integer) session.getAttribute("companyId");
        String userType = (String) session.getAttribute("userType");
        
        if (companyId != null && "company".equals(userType)) {
            response.put("companyId", companyId);
            response.put("success", true);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * CRM 로그인 페이지
     */
    @GetMapping("/crm_login")
    public String loginPage() {
        return "crm/crm_login"; // templates/crm/crm_login.html
    }
    
    /**
     * CRM 회원가입 페이지
     */
    @GetMapping("/company_signup")
    public String signupPage() {
        return "crm/company_signup"; // templates/crm/company_signup.html
    }
    
    /**
     * CRM 비밀번호 찾기 페이지
     */
    @GetMapping("/forgot-password")
    public String forgotPasswordPage() {
        return "crm/forgot-crm-password"; // templates/crm/forgot-crm-password.html
    }
    
    /**
     * 이메일 중복 확인 (company_user + manager_user)
     */
    @GetMapping("/check-email")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        
        boolean existsInCompany = companyService.existsByEmail(email);
        boolean existsInManager = managerService.existsByEmail(email);
        
        if (existsInCompany || existsInManager) {
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
    @PostMapping("/send-code")
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
            
            emailService.sendVerificationCode(email, "company");
            
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
    @PostMapping("/verify-code")
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
     * 업체 회원가입
     */
    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> register(@RequestBody CompanyUserDto dto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            CompanyUser company = companyService.register(dto);
            
            response.put("success", true);
            response.put("message", "업체 회원가입이 완료되었습니다.");
            response.put("companyId", company.getCompanyId());
            
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
     * 관리자 회원가입
     */
    @PostMapping("/register-manager")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> registerManager(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String email = request.get("email");
            String password = request.get("password");
            String name = request.get("name");
            String phone = request.get("phone");
            String inviteCode = request.get("inviteCode");
            
            ManagerUser manager = managerService.register(email, password, name, phone, inviteCode);
            
            response.put("success", true);
            response.put("message", "관리자 회원가입이 완료되었습니다.");
            response.put("managerId", manager.getManagerId());
            
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
     * 로그인 (company_user 또는 manager_user)
     */
    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> loginRequest,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        // 1. company_user 테이블에서 먼저 확인
        Optional<CompanyUser> companyOpt = companyService.login(email, password);
        
        if (companyOpt.isPresent()) {
            CompanyUser company = companyOpt.get();
            
            System.out.println("====== 업체 로그인 시도 ======");
            System.out.println("업체 ID: " + company.getCompanyId());
            System.out.println("업체 이름: " + company.getCompanyName());
            System.out.println("업체 주소: " + company.getAddress());
            System.out.println("승인 상태: " + company.getApprovalStatus());
            
            // 승인 상태 체크
            String approvalStatus = company.getApprovalStatus();
            
            // 승인 대기 중인 경우
            if ("PENDING".equals(approvalStatus)) {
                System.out.println("승인 대기 중인 업체 로그인 시도: " + company.getEmail());
                response.put("success", false);
                response.put("status", "PENDING");
                response.put("message", "승인 대기중입니다.");
                response.put("detail", "관리자의 승인을 기다리고 있습니다. 승인 완료 후 로그인이 가능합니다.");
                return ResponseEntity.ok(response);
            }
            
            // 반려된 경우
            if ("REJECTED".equals(approvalStatus)) {
                System.out.println("반려된 업체 로그인 시도: " + company.getEmail());
                response.put("success", false);
                response.put("status", "REJECTED");
                response.put("message", "승인이 거부되었습니다.");
                response.put("detail", company.getRejectionReason() != null ? 
                    company.getRejectionReason() : "관리자에게 문의하시기 바랍니다.");
                return ResponseEntity.ok(response);
            }
            
            // 활성화되지 않은 경우
            if (!company.getIsActive()) {
                System.out.println("비활성화된 업체 로그인 시도: " + company.getEmail());
                response.put("success", false);
                response.put("status", "INACTIVE");
                response.put("message", "비활성화된 계정입니다.");
                response.put("detail", "관리자에게 문의하시기 바랍니다.");
                return ResponseEntity.ok(response);
            }
            
            // 승인된 경우에만 로그인 허용 (APPROVED)
            if (!"APPROVED".equals(approvalStatus)) {
                System.out.println("알 수 없는 승인 상태: " + approvalStatus);
                response.put("success", false);
                response.put("message", "로그인할 수 없는 계정 상태입니다.");
                return ResponseEntity.ok(response);
            }
            
            System.out.println("====== 업체 로그인 성공 ======");
            
            // 세션에 업체 정보 저장
            session.setAttribute("companyId", company.getCompanyId());
            session.setAttribute("companyEmail", company.getEmail());
            session.setAttribute("companyName", company.getCompanyName());
            session.setAttribute("companyAddress", company.getAddress());
            session.setAttribute("userType", "company");
            
            System.out.println("세션에 저장된 companyId: " + session.getAttribute("companyId"));
            System.out.println("세션에 저장된 companyName: " + session.getAttribute("companyName"));
            System.out.println("세션에 저장된 userType: " + session.getAttribute("userType"));
            
            response.put("success", true);
            response.put("message", "로그인 성공");
            response.put("redirectUrl", "/company/dashboard");
            
            return ResponseEntity.ok(response);
        }
        
        // 2. manager_user 테이블에서 확인
        Optional<ManagerUser> managerOpt = managerService.login(email, password);
        
        if (managerOpt.isPresent()) {
            ManagerUser manager = managerOpt.get();
            
            // 세션에 매니저 정보 저장
            session.setAttribute("managerId", manager.getManagerId());
            session.setAttribute("managerEmail", manager.getEmail());
            session.setAttribute("managerName", manager.getName());
            session.setAttribute("userType", "manager");
            
            response.put("success", true);
            response.put("message", "로그인 성공");
            response.put("redirectUrl", "/admin/dashboard");
            
            return ResponseEntity.ok(response);
        }
        
        // 3. 둘 다 실패
        response.put("success", false);
        response.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
        return ResponseEntity.badRequest().body(response);
    }
    
    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/crm/crm_login";
    }
    
    /**
     * 비밀번호 재설정 (company_user 또는 manager_user)
     */
    @PostMapping("/reset-password")
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
            
            // 1. company_user에서 먼저 찾기
            Optional<CompanyUser> companyOpt = companyService.findByEmail(email);
            
            if (companyOpt.isPresent()) {
                // 업체 비밀번호 업데이트
                companyService.updatePassword(email, newPassword);
                
                response.put("success", true);
                response.put("message", "비밀번호가 성공적으로 재설정되었습니다.");
                return ResponseEntity.ok(response);
            }
            
            // 2. manager_user에서 찾기
            Optional<ManagerUser> managerOpt = managerService.findByEmail(email);
            
            if (managerOpt.isPresent()) {
                // 관리자 비밀번호 업데이트
                managerService.updatePassword(email, newPassword);
                
                response.put("success", true);
                response.put("message", "비밀번호가 성공적으로 재설정되었습니다.");
                return ResponseEntity.ok(response);
            }
            
            // 3. 둘 다 없음
            response.put("success", false);
            response.put("message", "해당 이메일로 등록된 계정을 찾을 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "비밀번호 재설정 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    // ========== 리뷰 시스템용 API ==========
    
}

