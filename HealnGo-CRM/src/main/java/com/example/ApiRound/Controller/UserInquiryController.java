package com.example.ApiRound.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartException;

import com.example.ApiRound.Service.UserInquiryService;
import com.example.ApiRound.dto.InquiryHistoryItem;
import com.example.ApiRound.dto.InquirySubmitRequest;
import com.example.ApiRound.entity.UserInquiry;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class UserInquiryController {

    private final UserInquiryService inquiryService;

    /** 폼 제출 (AJAX, multipart/form-data) */
    @PostMapping("/api/user-inquiry/submit")
    @ResponseBody
    public ResponseEntity<?> submit(@ModelAttribute InquirySubmitRequest req,
                                    HttpSession session) {
        try {
            System.out.println("===== 문의/신고 제출 요청 =====");
            System.out.println("subject: " + req.getSubject());
            System.out.println("content: " + req.getContent());
            System.out.println("orderId: " + req.getOrderId());
            
            // 세션에서 현재 로그인 사용자 ID 뽑기 (회사면 companyId, 일반이면 userId)
            String userType = (String) session.getAttribute("userType"); // "social" | "company"
            Integer socialUserId = (Integer) session.getAttribute("userId");
            Integer companyId = (Integer) session.getAttribute("companyId");
            
            System.out.println("userType: " + userType);
            System.out.println("socialUserId: " + socialUserId);
            System.out.println("companyId: " + companyId);
            
            Integer effectiveUserId = "company".equalsIgnoreCase(userType) ? companyId : socialUserId;
            
            // 세션에 userId가 없으면 게스트로 처리 (테스트용)
            if (effectiveUserId == null) {
                effectiveUserId = 1; // 임시 사용자 ID
                System.out.println("세션 사용자 없음, 게스트 ID 사용: " + effectiveUserId);
            } else {
                System.out.println("effectiveUserId: " + effectiveUserId);
            }

            Integer newId = inquiryService.submit(req, effectiveUserId);
            
            System.out.println("저장 성공! ID: " + newId);

            Map<String, Object> body = new HashMap<>();
            body.put("success", true);
            body.put("id", newId);
            return ResponseEntity.ok(body);
        } catch (MultipartException e) {
            System.err.println("Multipart 에러: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "첨부 처리 실패: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("제출 에러: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "제출 실패: " + e.getMessage()));
        }
    }

    /** 내 문의/신고 내역 (최근 100건) */
    @GetMapping("/api/user-inquiry/my-history")
    @ResponseBody
    public ResponseEntity<?> myHistory(HttpSession session) {
        System.out.println("===== 내 문의/신고 내역 조회 =====");
        
        String userType = (String) session.getAttribute("userType");
        Integer socialUserId = (Integer) session.getAttribute("userId");
        Integer companyId = (Integer) session.getAttribute("companyId");
        Integer effectiveUserId = "company".equalsIgnoreCase(userType) ? companyId : socialUserId;

        System.out.println("userType: " + userType);
        System.out.println("socialUserId: " + socialUserId);
        System.out.println("companyId: " + companyId);
        System.out.println("effectiveUserId: " + effectiveUserId);

        var page = inquiryService.getMyPagedList(effectiveUserId, 1, 100);
        List<InquiryHistoryItem> items = page.getContent().stream()
                .map(this::toHistoryItem)
                .toList();

        System.out.println("조회된 문의 내역 수: " + items.size());
        for (InquiryHistoryItem item : items) {
            System.out.println("문의 ID: " + item.getInquiryId() + 
                             ", 제목: " + item.getSubject() + 
                             ", 상태: " + item.getStatus() + 
                             ", 답변: " + (item.getAdminAnswer() != null ? "있음" : "없음"));
        }

        return ResponseEntity.ok(items);
    }

    private InquiryHistoryItem toHistoryItem(UserInquiry e) {
        return InquiryHistoryItem.builder()
                .inquiryId(e.getInquiryId())
                .subject(e.getSubject())
                .content(e.getContent())
                .adminAnswer(e.getAdminAnswer())
                .status(e.getStatus() != null ? e.getStatus().name() : null)
                .createdAt(e.getCreatedAt())
                .answeredAt(e.getAnsweredAt())
                .build();
    }
}
