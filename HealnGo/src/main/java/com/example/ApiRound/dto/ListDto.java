package com.example.ApiRound.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // getter, setter, toString, equals, hashCode 자동 생성
@NoArgsConstructor      // 기본 생성자
@AllArgsConstructor     // 모든 필드 포함 생성자
public class ListDto {

    // 원본 컬럼들 (DB ITEM_LIST 기준)
    private Long id;
    private String name;
    private String region;
    private String subregion;
    private String address;
    private String phone;
    private String homepage;
    private Double coordX;   // 위도/경도는 Double
    private Double coordY;
    private String category;
    private String imageUrl; // 사진 URL 필드 추가

    // 번역 라벨(화면 표출용) - i18n 조인 결과를 매핑
    private String nameLabel;     // 번역된 이름 (없으면 쿼리에서 ko/원문으로 폴백)
    private String addressLabel;  // 번역된 주소 (없으면 쿼리에서 ko/원문으로 폴백)
}