package com.example.ApiRound.crm.hyeonah.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "social_users",
        indexes = {
                @Index(name = "idx_social_users_provider_provider_id", columnList = "provider, provider_id"),
                @Index(name = "idx_social_users_email", columnList = "email")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_social_users_provider_provider_id", columnNames = {"provider", "provider_id"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "email", length = 190, unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "phone", length = 30)
    private String phone;

    @Lob
    @Column(name = "avatar_blob", columnDefinition = "LONGBLOB")
    private byte[] avatarBlob;

    @Column(name = "avatar_mime", length = 50)
    private String avatarMime;

    @Column(name = "avatar_updated_at")
    private LocalDateTime avatarUpdatedAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "is_deleted", columnDefinition = "TINYINT(1) DEFAULT 0")
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, SUSPENDED, INACTIVE


    // ✅ 소셜 로그인 구분/식별용 필드 (기존 서비스/레포 시그니처 호환)
    @Column(name = "provider", length = 50)       // ex) google, kakao, naver
    private String provider;

    @Column(name = "provider_id", length = 190)   // 소셜에서 내려오는 유저 고유 ID
    private String providerId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isDeleted == null) {
            this.isDeleted = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
