package com.example.ApiRound.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.ApiRound.entity.ItemList;

public interface ItemListService {

    // ===== 페이징 검색 =====
    Page<ItemList> getItemsByRegionAndCategory(String region, String subRegion, String category, Pageable pageable);
    Page<ItemList> getItemsByCategory(String category, Pageable pageable);

    // ===== 카운트 =====
    long countByRegionAndCategory(String region, String subRegion, String category);
    long countByCategory(String category);

    // ===== 카테고리 =====리
    List<String> getAllCategories();

    // ===== 단건/전체 =====
    ItemList getListById(Long id);
    Optional<ItemList> findById(Long id);
    List<ItemList> getAllList();

    // ===== 등록/저장 =====
    ItemList addList(ItemList hospital);

    // 관광/특정 섹션에서 전체 가져올 때 사용 (페이징X)
    List<ItemList> getListByCategory(String category);
}
