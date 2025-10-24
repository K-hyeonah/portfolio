package com.example.ApiRound.crm.yoyo.medi;

import com.example.ApiRound.entity.ItemList;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_service")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;

    /** ✅ 외래키 (item_id → item_list.id) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", referencedColumnName = "id", nullable = false)
    private ItemList item;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender_target", length = 10)
    private GenderTarget genderTarget;

    @Column(length = 255)
    private String tags;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_country", length = 10)
    private TargetCountry targetCountry;

    @Column(name = "service_category", length = 255)
    private String serviceCategory;

    @Column(precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "vat_included", columnDefinition = "TINYINT(1)")
    private Boolean vatIncluded;

    @Column(length = 10)
    private String currency;

    @Column(name = "discount_rate", precision = 5, scale = 2)
    private BigDecimal discountRate;

    @Column(name = "is_refundable", columnDefinition = "TINYINT(1)")
    private Boolean isRefundable;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /** 생성 및 수정 시점 자동 세팅 */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /** Enum 타입 정의 */
    public enum GenderTarget {
        ALL, MALE, FEMALE
    }

    public enum TargetCountry {
        KOR, JPN, OTHER
    }
}
