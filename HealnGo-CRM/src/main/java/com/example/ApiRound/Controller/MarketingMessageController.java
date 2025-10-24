package com.example.ApiRound.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ApiRound.entity.MarketingMessage;
import com.example.ApiRound.repository.MarketingMessageRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/marketing-notifications")
@RequiredArgsConstructor
public class MarketingMessageController {

    private final MarketingMessageRepository marketingMessageRepository;

    /**
     * 사용자에게 발송된 마케팅 메시지 조회
     * 전체 고객 대상 또는 해당 사용자가 속한 세그먼트의 메시지만 반환
     */
    @GetMapping("/my-notifications")
    public ResponseEntity<?> getMyNotifications(HttpSession session) {
        log.info("===== 마케팅 알림 조회 =====");

        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            log.warn("로그인하지 않은 사용자");
            return ResponseEntity.ok(List.of());
        }

        log.info("userId: {}", userId);

        // 발송 완료된 메시지 중 전체 고객 대상 메시지 조회 (최근 30일)
        List<MarketingMessage> allMessages = marketingMessageRepository.findAll();
        
        List<MarketingMessage> userMessages = allMessages.stream()
                .filter(m -> m.getStatus() == MarketingMessage.Status.SENT)
                .filter(m -> m.getTargetSegment() == MarketingMessage.TargetSegment.ALL ||
                           shouldReceiveMessage(userId, m.getTargetSegment()))
                .sorted((a, b) -> b.getSentAt().compareTo(a.getSentAt()))
                .limit(10)
                .collect(Collectors.toList());

        log.info("조회된 알림 수: {}", userMessages.size());

        // DTO로 변환 (Lazy Loading 문제 방지)
        List<Map<String, Object>> notifications = userMessages.stream()
                .map(this::toNotificationDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(notifications);
    }
    
    /**
     * MarketingMessage를 DTO로 변환
     */
    private Map<String, Object> toNotificationDto(MarketingMessage msg) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("messageId", msg.getMessageId());
        dto.put("title", msg.getTitle());
        dto.put("content", msg.getContent());
        dto.put("linkUrl", msg.getLinkUrl());
        dto.put("sentAt", msg.getSentAt());
        dto.put("createdAt", msg.getCreatedAt());
        
        // company 정보 (Lazy Loading 방지)
        if (msg.getCompany() != null) {
            Map<String, Object> companyInfo = new HashMap<>();
            companyInfo.put("companyId", msg.getCompany().getCompanyId());
            companyInfo.put("companyName", msg.getCompany().getCompanyName());
            dto.put("company", companyInfo);
        }
        
        return dto;
    }

    /**
     * 사용자가 특정 세그먼트의 메시지를 받아야 하는지 확인
     */
    private boolean shouldReceiveMessage(Integer userId, MarketingMessage.TargetSegment segment) {
        // TODO: 실제 세그먼트 조건 확인
        // RECENT_30DAYS: 최근 30일 예약 여부 확인
        // VIP: VIP 고객 여부 확인
        // INACTIVE: 장기 미방문 여부 확인
        // FIRST_TIME: 신규 가입 여부 확인
        
        // 현재는 전체 고객만 true 반환
        return segment == MarketingMessage.TargetSegment.ALL;
    }
}

