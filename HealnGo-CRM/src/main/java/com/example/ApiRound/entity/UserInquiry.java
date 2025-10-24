package com.example.ApiRound.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
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
@Table(name = "user_inquiry")
public class UserInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inquiry_id")
    private Integer inquiryId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Target target = Target.ADMIN;  // ADMIN

    @Enumerated(EnumType.STRING)
    @Column(name = "reporter_type", nullable = false)
    private ReporterType reporterType;     // SOCIAL, COMPANY

    @Column(name = "reporter_id")
    private Integer reporterId;            // 통합 ID

    @Column(name = "reporter_social_id")
    private Integer reporterSocialId;      // social_users의 user_id

    @Column(name = "reporter_company_id")
    private Integer reporterCompanyId;     // company_user의 company_id

    @Column(nullable = false, length = 200)
    private String subject;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "target_url", length = 1000)
    private String targetUrl;              // 대상 URL

    @Column(name = "attachment_path", length = 1024)
    private String attachmentPath;         // 첨부파일 경로

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.NORMAL;  // NORMAL, URGENT

    @Lob
    @Column(name = "admin_answer")
    private String adminAnswer;            // 관리자 답변

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;   // OPEN, ANSWERED, CLOSED

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type")
    private RequestType requestType;       // PROMOTION, CUSTOMER_REPORT, TECH_SUPPORT, SETTLEMENT, ACCOUNT, OTHER

    @Column(name = "assigned_to")
    private Integer assignedTo;            // 담당자 관리자 ID

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @Column(name = "answered_by")
    private Integer answeredBy;            // 답변한 관리자 ID

    public enum Target {
        ADMIN
    }

    public enum ReporterType {
        SOCIAL, COMPANY
    }

    public enum Status {
        OPEN, ANSWERED, CLOSED
    }

    public enum Priority {
        NORMAL, URGENT
    }

    public enum RequestType {
        PROMOTION,          // 프로모션/광고 문의
        CUSTOMER_REPORT,    // 고객 신고 처리
        TECH_SUPPORT,       // 기술 지원
        SETTLEMENT,         // 정산 문의
        ACCOUNT,            // 계정 관련
        OTHER               // 기타
    }
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (target == null) {
            target = Target.ADMIN;
        }
        if (status == null) {
            status = Status.OPEN;
        }
        if (priority == null) {
            priority = Priority.NORMAL;
        }
    }
}
