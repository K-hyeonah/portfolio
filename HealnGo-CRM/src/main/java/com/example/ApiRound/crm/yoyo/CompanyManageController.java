package com.example.ApiRound.crm.yoyo;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.example.ApiRound.crm.hyeonah.Service.CompanyUserService;
import com.example.ApiRound.crm.hyeonah.dto.CompanyUserDto;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/company")
public class CompanyManageController {
    
    private final CompanyUserService companyUserService;
    
    @Autowired
    public CompanyManageController(CompanyUserService companyUserService) {
        this.companyUserService = companyUserService;
    }

    @GetMapping
    public String companyDashboard(Model model, HttpSession session) {
        model.addAttribute("sidebarType", "company");
        addCommonAttributes(model, session);
        return "crm/company";
    }

    @GetMapping("/review")
    public String companyReview(Model model, HttpSession session) {
        // 세션 체크: 업체로 로그인한 사용자만 접근 가능
        Integer companyId = (Integer) session.getAttribute("companyId");
        String userType = (String) session.getAttribute("userType");
        
        if (companyId == null || !"company".equals(userType)) {
            return "redirect:/crm/crm_login";
        }
        
        // 리뷰 통계 데이터 (실제로는 서비스에서 가져와야 함)
        model.addAttribute("totalReviews", 26);
        model.addAttribute("pendingReplies", 3);
        model.addAttribute("completedReplies", 16);
        model.addAttribute("averageRating", 4.7);
        model.addAttribute("sidebarType", "company");
        
        // 공통 정보 추가 (companyId, companyName, hasAvatar)
        addCommonAttributes(model, session);

        return "crm/company_review";
    }

    @GetMapping("/edit")
    public String companyEdit(Model model, HttpSession session) {
        // 세션에서 companyId 가져오기
        Integer companyId = (Integer) session.getAttribute("companyId");
        
        if (companyId == null) {
            // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
            return "redirect:/crm/crm_login";
        }
        
        // 데이터베이스에서 실제 회사 정보 조회
        Optional<CompanyUser> companyOpt = companyUserService.findById(companyId);
        
        if (companyOpt.isEmpty()) {
            // 회사 정보가 없는 경우
            return "redirect:/crm/crm_login";
        }
        
        CompanyUser company = companyOpt.get();
        
        model.addAttribute("companyName", company.getCompanyName());
        
        // 기본 정보 데이터
        Map<String, Object> basicInfo = new HashMap<>();
        basicInfo.put("companyId", company.getCompanyId());
        basicInfo.put("companyName", company.getCompanyName() != null ? company.getCompanyName() : "");
        basicInfo.put("businessNumber", company.getBizNo() != null ? company.getBizNo() : "");
        basicInfo.put("representative", company.getRepresentative() != null ? company.getRepresentative() : "");
        basicInfo.put("category", company.getCategory() != null ? company.getCategory() : "");
        basicInfo.put("companyIntroduction", company.getCompanyIntroduction() != null ? company.getCompanyIntroduction() : "");
        basicInfo.put("hasAvatar", company.getAvatarBlob() != null && company.getAvatarBlob().length > 0);
        model.addAttribute("basicInfo", basicInfo);
        
        // 연락처 정보 데이터
        Map<String, Object> contactInfo = new HashMap<>();
        contactInfo.put("email", company.getEmail() != null ? company.getEmail() : "");
        contactInfo.put("mainPhone", company.getMainPhone() != null ? company.getMainPhone() : "");
        contactInfo.put("fax", company.getFax() != null ? company.getFax() : "");
        contactInfo.put("postcode", company.getPostcode() != null ? company.getPostcode() : "");
        contactInfo.put("address", company.getAddress() != null ? company.getAddress() : "");
        contactInfo.put("detailAddress", company.getDetailAddress() != null ? company.getDetailAddress() : "");
        contactInfo.put("website", company.getWebsite() != null ? company.getWebsite() : "");
        model.addAttribute("contactInfo", contactInfo);
        
        // 업데이트 현황 데이터
        Map<String, Object> updateStatus = getUpdateStatus(company);
        model.addAttribute("updateStatus", updateStatus);
        
        model.addAttribute("sidebarType", "company");
        model.addAttribute("companyId", companyId);
        model.addAttribute("hasAvatar", company.getAvatarBlob() != null && company.getAvatarBlob().length > 0);
        
        return "crm/company_edit";
    }
    
    /**
     * 공통 속성 추가 (companyId, companyName, hasAvatar)
     */
    private void addCommonAttributes(Model model, HttpSession session) {
        Integer companyId = (Integer) session.getAttribute("companyId");
        String companyName = (String) session.getAttribute("companyName");
        
        model.addAttribute("companyId", companyId);
        model.addAttribute("companyName", companyName);
        
        // 아바타 존재 여부 확인
        if (companyId != null) {
            Optional<CompanyUser> companyOpt = companyUserService.findById(companyId);
            boolean hasAvatar = companyOpt.isPresent() && 
                               companyOpt.get().getAvatarBlob() != null && 
                               companyOpt.get().getAvatarBlob().length > 0;
            model.addAttribute("hasAvatar", hasAvatar);
        } else {
            model.addAttribute("hasAvatar", false);
        }
    }
    
    /**
     * 업체 정보 저장 API
     */
    @PostMapping("/edit")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> saveCompanyInfo(
            @RequestBody Map<String, Object> request, 
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Integer companyId = (Integer) session.getAttribute("companyId");
            
            if (companyId == null) {
                response.put("success", false);
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 요청 데이터 파싱
            @SuppressWarnings("unchecked")
            Map<String, String> basicInfo = (Map<String, String>) request.get("basicInfo");
            @SuppressWarnings("unchecked")
            Map<String, String> contactInfo = (Map<String, String>) request.get("contactInfo");
            
            // DTO 생성
            CompanyUserDto dto = CompanyUserDto.builder()
                    .companyName(basicInfo.get("companyName"))
                    .bizNo(basicInfo.get("businessNumber"))
                    .representative(basicInfo.get("representative"))
                    .category(basicInfo.get("category"))
                    .companyIntroduction(basicInfo.get("companyIntroduction"))
                    .email(contactInfo.get("email"))
                    .mainPhone(contactInfo.get("mainPhone"))
                    .fax(contactInfo.get("fax"))
                    .postcode(contactInfo.get("postcode"))
                    .address(contactInfo.get("address"))
                    .detailAddress(contactInfo.get("detailAddress"))
                    .website(contactInfo.get("website"))
                    .build();
            
            // 업데이트 실행
            CompanyUser updated = companyUserService.update(companyId, dto);
            
            // 세션 업데이트
            session.setAttribute("companyName", updated.getCompanyName());
            
            response.put("success", true);
            response.put("message", "업체 정보가 저장되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "저장 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 로고 업로드 API
     */
    @PostMapping("/upload-logo")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> uploadLogo(
            @RequestParam("logo") MultipartFile file,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Integer companyId = (Integer) session.getAttribute("companyId");
            
            if (companyId == null) {
                response.put("success", false);
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 파일 유효성 검사
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "파일이 비어있습니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 파일 타입 검사
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "이미지 파일만 업로드 가능합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 파일 크기 검사 (5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                response.put("success", false);
                response.put("message", "파일 크기는 5MB 이하여야 합니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // DB에서 회사 정보 조회
            Optional<CompanyUser> companyOpt = companyUserService.findById(companyId);
            
            if (companyOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "업체 정보를 찾을 수 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 로고 저장
            companyUserService.updateAvatar(companyId, file.getBytes(), contentType);
            
            response.put("success", true);
            response.put("message", "로고가 업로드되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "로고 업로드 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 로고 이미지 조회 API
     */
    @GetMapping("/avatar/{id}")
    @ResponseBody
    public ResponseEntity<byte[]> getAvatar(@PathVariable Integer id) {
        try {
            Optional<CompanyUser> companyOpt = companyUserService.findById(id);
            
            if (companyOpt.isEmpty() || companyOpt.get().getAvatarBlob() == null) {
                return ResponseEntity.notFound().build();
            }
            
            CompanyUser company = companyOpt.get();
            
            HttpHeaders headers = new HttpHeaders();
            if (company.getAvatarMime() != null) {
                headers.setContentType(MediaType.parseMediaType(company.getAvatarMime()));
            } else {
                headers.setContentType(MediaType.IMAGE_PNG);
            }
            
            return new ResponseEntity<>(company.getAvatarBlob(), headers, HttpStatus.OK);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 업데이트 현황 데이터 생성
     */
    private Map<String, Object> getUpdateStatus(CompanyUser company) {
        Map<String, Object> status = new HashMap<>();
        
        // 마지막 수정 시간 계산
        LocalDateTime updatedAt = company.getUpdatedAt();
        if (updatedAt != null) {
            long minutesAgo = ChronoUnit.MINUTES.between(updatedAt, LocalDateTime.now());
            String lastModified;
            
            if (minutesAgo < 60) {
                lastModified = minutesAgo + "분 전";
            } else if (minutesAgo < 1440) { // 24시간
                lastModified = (minutesAgo / 60) + "시간 전";
            } else {
                lastModified = (minutesAgo / 1440) + "일 전";
            }
            status.put("lastModified", lastModified);
        } else {
            status.put("lastModified", "정보 없음");
        }
        
        // 완료도 계산 (필수 필드가 채워진 정도)
        int totalFields = 11; // 필수 필드 개수
        int filledFields = 0;
        
        if (company.getCompanyName() != null && !company.getCompanyName().isEmpty()) filledFields++;
        if (company.getBizNo() != null && !company.getBizNo().isEmpty()) filledFields++;
        if (company.getRepresentative() != null && !company.getRepresentative().isEmpty()) filledFields++;
        if (company.getMainPhone() != null && !company.getMainPhone().isEmpty()) filledFields++;
        if (company.getEmail() != null && !company.getEmail().isEmpty()) filledFields++;
        if (company.getPostcode() != null && !company.getPostcode().isEmpty()) filledFields++;
        if (company.getAddress() != null && !company.getAddress().isEmpty()) filledFields++;
        if (company.getCategory() != null && !company.getCategory().isEmpty()) filledFields++;
        if (company.getFax() != null && !company.getFax().isEmpty()) filledFields++;
        if (company.getWebsite() != null && !company.getWebsite().isEmpty()) filledFields++;
        if (company.getCompanyIntroduction() != null && !company.getCompanyIntroduction().isEmpty()) filledFields++;
        
        int completionRate = (int) ((filledFields / (double) totalFields) * 100);
        status.put("completionRate", completionRate);
        
        return status;
    }
}
