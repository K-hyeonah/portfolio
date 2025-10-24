package com.example.ApiRound.crm.yoyo.reservation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "CONFIRMED"; // CONFIRMED, CANCELLED, COMPLETED

    @Column(name = "google_event_id", length = 100)
    private String googleEventId;

    @Column(name = "google_sync_enabled", columnDefinition = "TINYINT(1) DEFAULT 0")
    @Builder.Default
    private Boolean googleSyncEnabled = false;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    // service_id 컬럼 (medical_service 테이블의 service_id)
    @Column(name = "service_id")
    private Long serviceId;
    
    // item_id 컬럼 (item_list 테이블의 id)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // FK 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private SocialUsers user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyUser company;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.googleSyncEnabled == null) {
            this.googleSyncEnabled = false;
        }
        if (this.status == null) {
            this.status = "CONFIRMED";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}