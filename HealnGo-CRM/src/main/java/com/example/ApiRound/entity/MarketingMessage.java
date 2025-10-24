package com.example.ApiRound.entity;

import java.time.LocalDateTime;

import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
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
@Table(name = "marketing_message")
public class MarketingMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Integer messageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyUser company;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_segment", nullable = false, length = 50)
    private TargetSegment targetSegment;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_channel", nullable = false, length = 20)
    @Builder.Default
    private TargetChannel targetChannel = TargetChannel.PUSH;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "link_url", length = 1000)
    private String linkUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "send_type", nullable = false, length = 20)
    @Builder.Default
    private SendType sendType = SendType.IMMEDIATE;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "target_count")
    @Builder.Default
    private Integer targetCount = 0;

    @Column(name = "success_count")
    @Builder.Default
    private Integer successCount = 0;

    @Column(name = "fail_count")
    @Builder.Default
    private Integer failCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", length = 20)
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.APPROVED;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "reject_reason", length = 500)
    private String rejectReason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum TargetSegment {
        ALL,              // 전체 고객
        RECENT_30DAYS,    // 최근 30일 예약 고객
        VIP,              // VIP 고객
        INACTIVE,         // 장기 미방문 고객
        FIRST_TIME        // 첫 방문 고객
    }

    public enum TargetChannel {
        PUSH,    // 앱 푸시
        SMS,     // 문자메시지
        EMAIL    // 이메일
    }

    public enum SendType {
        IMMEDIATE,   // 즉시 발송
        SCHEDULED    // 예약 발송
    }

    public enum Status {
        PENDING,   // 대기중
        SENDING,   // 발송중
        SENT,      // 발송완료
        FAILED     // 발송실패
    }

    public enum ApprovalStatus {
        PENDING,   // 승인 대기
        APPROVED,  // 승인됨
        REJECTED   // 반려됨
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = Status.PENDING;
        }
        if (approvalStatus == null) {
            approvalStatus = ApprovalStatus.APPROVED;
        }
        if (targetChannel == null) {
            targetChannel = TargetChannel.PUSH;
        }
        if (sendType == null) {
            sendType = SendType.IMMEDIATE;
        }
    }
}

