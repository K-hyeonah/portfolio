package com.example.ApiRound.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class InquirySubmitRequest {
    private Integer orderId;
    private String subject;
    private String content;
    private String targetUrl;         // 대상 URL
    private String requestType;       // 요청 유형 (PROMOTION, CUSTOMER_REPORT, TECH_SUPPORT, SETTLEMENT, ACCOUNT, OTHER)
    private String priority;          // 우선순위 (NORMAL, URGENT)
    private MultipartFile attachment; // 파일 저장 로직 필요시 서비스에서 처리
}
