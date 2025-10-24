package com.example.ApiRound.crm.hyeonah.review;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "user_review")
@Data
public class UserReview {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;
    
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "item_id")
    private Long itemId;
    
    @Column(name = "service_id")
    private Long serviceId;
    
    // booking_id 직접 매핑 (FK 연결 문제 해결용)
    @Column(name = "booking_id")
    private Long bookingId;
    
    @Column(name = "rating")
    private Byte rating;
    
    @Column(name = "title", length = 150)
    private String title;
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Lob
    @Column(name = "image_blob", columnDefinition = "LONGBLOB")
    private byte[] imageBlob;
    
    @Column(name = "image_mime", length = 50)
    private String imageMime;
    
    @Column(name = "is_public")
    private Boolean isPublic;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 답글 관계
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserReviewReply> replies;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isPublic == null) {
            isPublic = true;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

