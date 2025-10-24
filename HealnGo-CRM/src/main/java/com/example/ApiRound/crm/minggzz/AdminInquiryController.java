package com.example.ApiRound.crm.minggzz;

import com.example.ApiRound.Service.UserInquiryService;
import com.example.ApiRound.entity.UserInquiry;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/inquiries") // ★ 기존 /admin/inquiry-report 등과 충돌 방지
public class AdminInquiryController {

    private final UserInquiryService inquiryService;

    /** 목록 조회 (JSON) */
    @GetMapping
    public ResponseEntity<?> list(@RequestParam(defaultValue = "1") int page,
                                  @RequestParam(defaultValue = "20") int size,
                                  @RequestParam(required = false) String status) {
        Page<UserInquiry> result = inquiryService.getAdminPagedList(page, size, status);
        return ResponseEntity.ok(result);
    }

    /** 상태 변경 (JSON) */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable("id") Integer id,
                                          @RequestBody AdminStatusRequest req,
                                          @RequestHeader(name = "X-ADMIN-ID", required = false) Integer adminIdHeader) {
        // 관리자 ID는 세션/토큰에서 가져오되, 예시로 헤더도 허용
        Integer adminId = adminIdHeader != null ? adminIdHeader : 0;
        if (req.getInquiryId() == null) req.setInquiryId(id);

        inquiryService.updateStatus(req, adminId);
        return ResponseEntity.ok().build();
    }

    /** 답변 등록 (JSON) */
    @PostMapping("/{id}/answer")
    public ResponseEntity<?> answer(@PathVariable("id") Integer id,
                                    @RequestBody AdminAnswerRequest req,
                                    @RequestHeader(name = "X-ADMIN-ID", required = false) Integer adminIdHeader) {
        Integer adminId = adminIdHeader != null ? adminIdHeader : 0;

        if (req.getInquiryId() == null) req.setInquiryId(id);
        if (req.getAssignedTo() == null) {
            inquiryService.answer(req.getInquiryId(), req.getAnswer(), adminId);
        } else {
            inquiryService.answer(req.getInquiryId(), req.getAnswer(), adminId, req.getAssignedTo());
        }
        return ResponseEntity.ok().build();
    }
}
