package com.example.ApiRound.crm.hyeonah.entity;

import com.example.ApiRound.crm.hyeonah.dto.SenderRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "chat_message")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "thread_id", nullable = false)
    private ChatThread thread;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender_role", length = 16, nullable = false)
    private SenderRole senderRole;

    @Column(name = "sender_user_id")
    private Integer senderUserId;

    @Column(name = "sender_company_id")
    private Integer senderCompanyId;

    @Lob
    @Column(name = "body")
    private String body;

    @Lob
    @Column(name = "attachment_bolb")
    private byte[] attachmentBlob;

    @Column(name = "attachment_mime", length = 50)
    private String attachmentMime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

}
