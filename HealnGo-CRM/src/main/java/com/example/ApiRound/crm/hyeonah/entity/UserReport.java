package com.example.ApiRound.crm.hyeonah.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_report")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")   // DB: BIGINT AI PK
    private Long reportId;

    @Column(name = "title", length = 200)
    private String title;

    // FK 컬럼 자체 (DB: INT NOT NULL)
    @Column(name = "assigned_to", nullable = false)
    private Integer assignedTo;

    // 읽기 전용 연관 매핑(옵션) — 같은 컬럼을 중복 매핑하므로 insertable/updatable 막음
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to", referencedColumnName = "manager_id", insertable = false, updatable = false)
    private ManagerUser assignedManager;

    // DB: ENUM('OPEN','IN_PROGRESS','DONE') 유지
    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            columnDefinition = "ENUM('OPEN','IN_PROGRESS','DONE')"
    )
    private UserReportStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = UserReportStatus.OPEN;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
