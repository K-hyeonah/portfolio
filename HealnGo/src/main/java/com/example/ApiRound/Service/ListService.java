package com.example.ApiRound.Service;

import com.example.ApiRound.dto.ListDto;

import java.util.List;

/**
 * 병원 정보 관련 서비스
 */
public interface ListService {

    // 전체 병원 목록 조회 (i18n)
    List<ListDto> getAllList(String locale);

    // ID로 병원 조회 (i18n)
    ListDto getListById(Long id, String locale);

    // 병원 등록 (원본 저장)
    void addList(ListDto hospital);

    // 카테고리별 병원 목록 (i18n)
    List<ListDto> getListByCategory(String category, String locale);

    // 지역 + 구 + 카테고리 검색 (i18n)
    List<ListDto> getListByRegionAndSubregion(String region, String subRegion, String category, String locale);

    // 카운트(지역/구/카테고리)
    int countByRegionAndCategory(String region, String subregion, String category);

    // 페이징(지역/구/카테고리, i18n)
    List<ListDto> getListByRegionAndSubregionPaged(String region, String subregion, String category,
                                                   int amount, int offset, String locale);

    // 카운트(카테고리)
    int countByCategory(String category);

    // 페이징(카테고리, i18n)
    List<ListDto> getListByCategoryPaged(String category, int amount, int offset, String locale);

    // 디버깅용: 모든 카테고리 값
    List<String> getAllCategories();
}
