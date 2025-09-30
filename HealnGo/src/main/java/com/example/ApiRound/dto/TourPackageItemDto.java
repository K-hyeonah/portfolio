package com.example.ApiRound.dto;

import lombok.Data;

@Data
public class TourPackageItemDto {
    private Long id;
    private Long packageId;
    private Long itemId;
    private Integer sequenceNo;

    // 옵션: 조인을 통해 아이템 상세 정보 포함 가능
    private ListDto listDto;
}
