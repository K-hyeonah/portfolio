package com.example.ApiRound.crm.hyeonah.review;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserReviewReplyDto {
    
    private Integer replyId;
    private Integer reviewId;
    private Integer companyId;
    private String companyName;
    private String body;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}