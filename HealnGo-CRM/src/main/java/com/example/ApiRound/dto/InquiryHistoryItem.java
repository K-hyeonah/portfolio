package com.example.ApiRound.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InquiryHistoryItem {
    private Integer inquiryId;
    private String subject;
    private String content;
    private String adminAnswer;      // 관리자 답변
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
}
