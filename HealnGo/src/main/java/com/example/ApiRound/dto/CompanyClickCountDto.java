package com.example.ApiRound.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyClickCountDto {
    private Long companyId;
    private String companyName; // 업체 이름 (ITEM_LIST.NAME 컬럼이라고 가정)
    private int clickCount;

    // 추가 필드: 지역/세부지역/카테고리
    private String region;     // 대지역 (예: 서울특별시)
    private String subregion;  // 세부지역 (예: 강남구)
    private String category;   // 카테고리 (예: 마사지, 성형외과 등)
    private String address;
}