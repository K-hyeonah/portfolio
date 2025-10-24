package com.example.ApiRound.crm.hyeonah.review;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class UserReviewDto {
    
    private Integer reviewId;
    private Integer userId;
    private String userName; // 사용자 이름
    private Long itemId;
    private Long serviceId;  // medical_service.service_id
    private String itemName; // 아이템 이름
    private Long bookingId;  // reservations.id (Long)
    private Byte rating;
    private String title;
    private String content;
    private String imageUrl; // 이미지를 Base64나 URL로 변환
    private String imageMime;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 답글 정보
    private List<UserReviewReplyDto> replies;
    
    // 통계
    private Long replyCount;
}

