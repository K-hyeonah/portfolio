package com.example.ApiRound.crm.hyeonah.notice;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "notice")
@Data
public class Notice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Integer noticeId;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "body", columnDefinition = "TEXT")
    private String body;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "audience", length = 20)
    private Audience audience = Audience.ALL;
    
    @Column(name = "is_pinned", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isPinned = false;
    
    @Column(name = "publish_at")
    private LocalDateTime publishAt;
    
    @Column(name = "created_by")
    private Integer createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (publishAt == null) {
            publishAt = LocalDateTime.now();
        }
        if (isPinned == null) {
            isPinned = false;
        }
        if (audience == null) {
            audience = Audience.ALL;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // 대상 타입 Enum
    public enum Audience {
        ALL,      // 전체
        SOCIAL,   // 일반 사용자
        COMPANY   // 업체
    }
}

