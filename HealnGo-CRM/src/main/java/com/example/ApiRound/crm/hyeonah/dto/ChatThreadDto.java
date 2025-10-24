package com.example.ApiRound.crm.hyeonah.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatThreadDto {
    private Long threadId;
    private Integer userId;
    private Integer companyId;
    private Long itemId;
    private String title;
    private boolean muted;
    private String status; // NEW, IN_PROGRESS, COMPLETED
    private LocalDateTime lastMsgAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
