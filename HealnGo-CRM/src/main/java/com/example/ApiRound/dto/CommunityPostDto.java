package com.example.ApiRound.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommunityPostDto {
    private Long id;
    private String title;
    private String content;
    private String userId;
    private String category;
    private int likeCount;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private String isDeleted;
}