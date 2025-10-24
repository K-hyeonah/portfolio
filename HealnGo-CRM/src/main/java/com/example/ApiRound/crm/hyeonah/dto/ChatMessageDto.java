package com.example.ApiRound.crm.hyeonah.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private Long messageId;
    private Long threadId;
    private SenderRole senderRole;
    private Integer senderUserId;
    private Integer senderCompanyId;
    private String body;
    private byte[] attachmentBlob;
    private String attachmentMime;
    private LocalDateTime createdAt;
}
