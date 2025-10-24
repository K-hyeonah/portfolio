package com.example.ApiRound.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "community_post") 
@Data
public class CommunityPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "create_at")
    private LocalDateTime createAt;
    
    @Column(name = "like_count", columnDefinition = "INT DEFAULT 0")
    private Integer likeCount = 0;
    
    @Column(name = "is_deleted", columnDefinition = "CHAR(1) DEFAULT 'N'")
    private String isDeleted = "N";
    
    @Column(name = "is_update", columnDefinition = "CHAR(1) DEFAULT 'N'")
    private String isUpdate = "N";
    
    // Constructors
    public CommunityPost() {}
    
    public CommunityPost(String userId, String title, String content, String category) {
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.category = category;
        this.createAt = LocalDateTime.now();
    }
    
}
