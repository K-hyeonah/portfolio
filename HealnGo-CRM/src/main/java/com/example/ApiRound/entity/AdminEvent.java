package com.example.ApiRound.entity;

import java.time.LocalDate;
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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "admin_event")
public class AdminEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "company_id")
    private Integer companyId;

    @Column(length = 255)
    private String target;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Slot slot;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.NORMAL;

    @Column(name = "landing_url", length = 1000)
    private String landingUrl;

    @Column(name = "banner_image_path", length = 1024)
    private String bannerImagePath;

    @Builder.Default
    @Column(nullable = false)
    private Integer clicks = 0;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(name = "reject_reason", length = 500)
    private String rejectReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Slot {
        HOME_HERO,
        HOME_CARD,
        CATEGORY,
        DETAIL
    }

    public enum Priority {
        NORMAL,
        HIGH
    }

    public enum ApprovalStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (clicks == null) {
            clicks = 0;
        }
        if (priority == null) {
            priority = Priority.NORMAL;
        }
        if (approvalStatus == null) {
            approvalStatus = ApprovalStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

