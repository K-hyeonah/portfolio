package com.example.ApiRound.mapper;

import com.example.ApiRound.dto.TourPackageDto;
import com.example.ApiRound.dto.TourPackageItemDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TourPackageMapper {
    List<TourPackageDto> getAllPackages(); // 패키지 전체 조회
    TourPackageDto getPackageById(Long id); // 패키지 상세 조회
    List<TourPackageItemDto> getItemsByPackageId(Long packageId); // 특정 패키지의 아이템 리스트
}
