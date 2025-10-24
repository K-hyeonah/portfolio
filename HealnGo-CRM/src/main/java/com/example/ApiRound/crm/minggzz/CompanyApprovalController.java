package com.example.ApiRound.crm.minggzz;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/companies")
public class CompanyApprovalController {

    private final CompanyApprovalService companyApprovalService;

    /** ✅ 승인 처리 + 대표 지점 자동 생성 */
    @PostMapping("/{companyId}/approve")
    public ResponseEntity<Void> approve(
            @PathVariable Integer companyId,
            @RequestParam(required = false) Long managerUserId
    ) {
        companyApprovalService.approve(companyId, managerUserId);
        return ResponseEntity.ok().build();
    }

    /** 반려 */
    @PostMapping("/{companyId}/reject")
    public ResponseEntity<Void> reject(
            @PathVariable Integer companyId,
            @RequestParam(required = false) Long managerUserId,
            @RequestParam String reason
    ) {
        companyApprovalService.reject(companyId, managerUserId, reason);
        return ResponseEntity.ok().build();
    }
}
