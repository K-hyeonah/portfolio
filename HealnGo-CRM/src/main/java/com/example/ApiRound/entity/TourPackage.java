package com.example.ApiRound.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

// @Entity  // 임시로 비활성화
@Table(name = "tour_package_new")  // 새로운 테이블명 사용
@Data
public class TourPackage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "price")
    private Double price;
    
    @Column(name = "duration")
    private Integer duration;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "region")
    private String region;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "is_active")
    private String isActive;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public TourPackage() {}
    
    public TourPackage(String name, String description, Double price, Integer duration, String category, String region) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
        this.category = category;
        this.region = region;
        this.isActive = "Y";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
