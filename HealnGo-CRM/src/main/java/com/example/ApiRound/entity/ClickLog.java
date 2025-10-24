package com.example.ApiRound.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "click_logs")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 업체(Company) 식별자 */
    @Column(name = "company_id", nullable = false)
    private Long companyId;

    /** 클릭한 아이템(병원/시설) 식별자 */
    @Column(name = "item_id", nullable = false)
    private Long itemId;

    /** (선택) 클릭한 소셜 유저 ID */
    @Column(name = "user_id")
    private Integer userId;

    /** 클릭 시각 */
    @Column(name = "clicked_at", nullable = false)
    private LocalDateTime clickedAt;

    @PrePersist
    protected void onCreate() {
        if (clickedAt == null) clickedAt = LocalDateTime.now();
    }

    /** 편의 생성자 */
    public ClickLog(Long companyId) {
        this.companyId = companyId;
        this.clickedAt = LocalDateTime.now();
    }
}
