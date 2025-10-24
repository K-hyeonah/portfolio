package com.example.ApiRound.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.ApiRound.entity.ItemList;
import com.example.ApiRound.repository.ItemListRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemListServiceImpl implements ItemListService {

    private final ItemListRepository itemListRepository;

    // ===== 페이징 검색 =====
    @Override
    public Page<ItemList> getItemsByRegionAndCategory(String region, String subRegion, String category, Pageable pageable) {
        return itemListRepository.findByRegionAndSubregionAndCategory(region, subRegion, category, pageable);
    }

    @Override
    public Page<ItemList> getItemsByCategory(String category, Pageable pageable) {
        return itemListRepository.findByCategory(category, pageable);
    }

    // ===== 카운트 =====
    @Override
    public long countByRegionAndCategory(String region, String subRegion, String category) {
        return itemListRepository.countByRegionAndSubregionAndCategory(region, subRegion, category);
    }

    @Override
    public long countByCategory(String category) {
        return itemListRepository.countByCategory(category);
    }

    // ===== 카테고리 =====
    @Override
    public List<String> getAllCategories() {
        return itemListRepository.findAllCategories();
    }

    // ===== 단건/전체 =====
    @Override
    public ItemList getListById(Long id) {
        return itemListRepository.findById(id).orElse(null);
    }
    
    @Override
    public Optional<ItemList> findById(Long id) {
        return itemListRepository.findById(id);
    }

    @Override
    public List<ItemList> getAllList() {
        return itemListRepository.findAll();
    }

    // ===== 등록/저장 =====
    @Override
    public ItemList addList(ItemList hospital) {
        return itemListRepository.save(hospital);
    }

    // 관광/특정 섹션에서 전체 가져올 때 사용 (페이징X)
    @Override
    public List<ItemList> getListByCategory(String category) {
        return itemListRepository.findByCategory(category, Pageable.unpaged()).getContent();
    }
}
