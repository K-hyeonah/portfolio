package com.example.ApiRound.crm.hyeonah.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.ApiRound.crm.hyeonah.Service.ChatAppService;
import com.example.ApiRound.crm.hyeonah.dto.ChatMessageDto;
import com.example.ApiRound.crm.hyeonah.dto.ChatThreadDto;
import com.example.ApiRound.crm.hyeonah.dto.SenderRole;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatRestController {

    private final ChatAppService chatAppService;
    private final com.example.ApiRound.crm.hyeonah.Repository.CompanyUserRepository companyUserRepository;

    //사용자 기준 스레드 목록
    @GetMapping("/threads/user/{userId}")
    public Page<ChatThreadDto> listThreadsByUser(@PathVariable Integer userId,
                                                 @RequestParam(defaultValue = "1") int page,
                                                 @RequestParam(defaultValue = "20") int size) {

        return  chatAppService.listThreadsForUser(userId,page,size);
    }

    // 회사 기준 스레드 목록
    @GetMapping("/threads")
    public Page<ChatThreadDto> listThreadsByCompany(@RequestParam Integer companyId,
                                                    @RequestParam(defaultValue = "1") int page,
                                                    @RequestParam(defaultValue = "20") int size,
                                                    @RequestParam(required = false) String status) {
        return chatAppService.listThreadsForCompany(companyId, page, size, status);
    }

    // 메시지 목록
    @GetMapping("/messages/{threadId}")
    public Page<ChatMessageDto> listMessages(@PathVariable Long threadId,
                                             @RequestParam(defaultValue = "1") int page,
                                             @RequestParam(defaultValue = "20") int size) {
        return chatAppService.listMessages(threadId, page, size);
    }

    // 메시지 전송 (파일 포함)
    @PostMapping(value = "/message", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ChatMessageDto send(@RequestPart("threadId") Long threadId,
                               @RequestPart("senderRole") String senderRole,
                               @RequestPart(value = "senderUserId", required = false) Integer senderUserId,
                               @RequestPart(value = "senderCompanyId", required = false) Integer senderCompanyId,
                               @RequestPart(value = "body", required = false) String body,
                               @RequestPart(value = "file", required = false) MultipartFile file) throws Exception {

        byte[] bin = (file != null && !file.isEmpty()) ? file.getBytes() : null;
        String mime = (file != null) ? file.getContentType() : null;

        SenderRole role;
        try {
            role = SenderRole.valueOf(senderRole.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "senderRole must be SOCIAL or COMPANY");
        }

        return chatAppService.sendMessage(
                threadId,
                role,
                senderUserId,
                senderCompanyId,
                body,
                bin,
                mime
        );
    }

    // 메시지 전송 (JSON 형식 - 간단한 텍스트 전송용)
    @PostMapping("/send")
    public ChatMessageDto sendSimple(@RequestBody java.util.Map<String, Object> payload) {
        Long threadId = Long.valueOf(payload.get("threadId").toString());
        String senderRoleStr = (String) payload.get("senderRole");
        Integer senderUserId = payload.containsKey("senderUserId") ?
                (Integer) payload.get("senderUserId") : null;
        Integer senderCompanyId = payload.containsKey("senderCompanyId") ?
                (Integer) payload.get("senderCompanyId") : null;
        String body = (String) payload.get("body");

        SenderRole role;
        try {
            role = SenderRole.valueOf(senderRoleStr.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "senderRole must be SOCIAL or COMPANY");
        }

        return chatAppService.sendMessage(threadId, role, senderUserId, senderCompanyId, body, null, null);
    }

    // 스레드 상태 업데이트
    @PostMapping("/thread/{threadId}/status")
    public ResponseEntity<?> updateThreadStatus(@PathVariable Long threadId, @RequestParam String status) {
        try {
            // 상태 유효성 검사
            if (!status.equals("IN_PROGRESS") && !status.equals("COMPLETED") && !status.equals("CANCELLED")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
            }

            // 스레드 상태 업데이트
            boolean updated = chatAppService.updateThreadStatus(threadId, status);

            if (updated) {
                return ResponseEntity.ok(Map.of("message", "Thread status updated successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("스레드 상태 업데이트 실패: threadId={}, status={}", threadId, status, e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to update thread status"));
        }
    }

    // 병원과의 새 스레드 생성
    @PostMapping("/threads/create")
    public ResponseEntity<Map<String, Object>> createHospitalThread(@RequestBody Map<String, Object> request) {
        try {
            Integer companyId = (Integer) request.get("companyId");
            String title = (String) request.get("title");
            Integer userId = (Integer) request.get("userId");

            if (companyId == null || title == null || userId == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "필수 파라미터가 누락되었습니다.");
                return ResponseEntity.badRequest().body(error);
            }

            ChatThreadDto thread = chatAppService.createThread(companyId, title, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("threadId", thread.getThreadId());
            response.put("title", thread.getTitle());
            response.put("status", thread.getStatus());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "스레드 생성 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * 업체 정보 조회 (ID로)
     */
    @GetMapping("/company/{companyId}")
    public ResponseEntity<?> getCompanyById(@PathVariable Integer companyId) {
        return companyUserRepository.findById(companyId)
                .map(company -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("companyId", company.getCompanyId());
                    response.put("companyName", company.getCompanyName());
                    response.put("address", company.getAddress());
                    response.put("phone", company.getPhone());
                    response.put("email", company.getEmail());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
