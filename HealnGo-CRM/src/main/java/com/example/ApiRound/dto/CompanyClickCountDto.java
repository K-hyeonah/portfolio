package com.example.ApiRound.dto;

import lombok.Data;

@Data
public class CompanyClickCountDto {
    private Long companyId;
    private Long clickCount;
    
    public CompanyClickCountDto(Long companyId, Long clickCount) {
        this.companyId = companyId;
        this.clickCount = clickCount;
    }
}