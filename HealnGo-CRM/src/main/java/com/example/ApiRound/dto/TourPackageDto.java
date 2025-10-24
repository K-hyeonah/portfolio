package com.example.ApiRound.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TourPackageDto {
    private Long packageId;
    private String name;
    private String description;
    private String category;
    private String region;
    private String imagePath;
    private String isRecommended;
    private Date createdAt;
    private Date updatedAt;

    // 패키지에 포함된 아이템 리스트
    private List<ListDto> items;
}