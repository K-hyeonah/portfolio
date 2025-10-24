package com.example.ApiRound.crm.hyeonah.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chat_thread")
public class ChatThread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thread_id")
    private Long threadId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "company_id", nullable = false)
    private Integer companyId;

    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "is_muted", nullable = false)
    private boolean muted;

    @Column(name = "status", length = 20)
    private String status; // NEW, IN_PROGRESS, COMPLETED

    @Column(name = "last_msg_at")
    private LocalDateTime lastMsgAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        var now = LocalDateTime.now();
        if(createdAt == null) createdAt = now;
        if(updatedAt == null) updatedAt = now;
        if(lastMsgAt == null) lastMsgAt = now;
    }

}
