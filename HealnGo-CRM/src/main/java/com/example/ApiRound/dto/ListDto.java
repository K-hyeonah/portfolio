package com.example.ApiRound.dto;

import lombok.Data;

@Data
public class ListDto {
    private Long id;
    private String name;
    private String region;
    private String subregion;
    private String address;
    private String phone;
    private String homepage;
    private Double coordX;
    private Double coordY;
    private String category;
}