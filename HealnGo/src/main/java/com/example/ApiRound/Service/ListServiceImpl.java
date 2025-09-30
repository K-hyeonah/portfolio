package com.example.ApiRound.Service;

import com.example.ApiRound.Service.ListService;
import com.example.ApiRound.dto.ListDto;
import com.example.ApiRound.mapper.ListMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListServiceImpl implements ListService {

    private final ListMapper listMapper;

    public ListServiceImpl(ListMapper listMapper) {
        this.listMapper = listMapper;
    }

    @Override
    public List<ListDto> getAllList(String locale) {
        return listMapper.findAll(locale);
    }

    @Override
    public ListDto getListById(Long id, String locale) {
        return listMapper.findById(id, locale);
    }

    @Override
    public void addList(ListDto hospital) {
        listMapper.insert(hospital);
    }

    @Override
    public List<ListDto> getListByCategory(String category, String locale) {
        return listMapper.findByCategory(category, locale);
    }

    @Override
    public List<ListDto> getListByRegionAndSubregion(String region, String subRegion, String category, String locale) {
        return listMapper.findByRegionAndCategory(region, subRegion, category, locale);
    }

    @Override
    public int countByRegionAndCategory(String region, String subregion, String category) {
        return listMapper.countByRegionAndCategory(region, subregion, category);
    }

    @Override
    public List<ListDto> getListByRegionAndSubregionPaged(String region, String subregion, String category,
                                                          int amount, int offset, String locale) {
        return listMapper.findByRegionAndCategoryPaged(region, subregion, category, amount, offset, locale);
    }

    @Override
    public int countByCategory(String category) {
        return listMapper.countByCategory(category);
    }

    @Override
    public List<ListDto> getListByCategoryPaged(String category, int amount, int offset, String locale) {
        return listMapper.findByCategoryPaged(category, amount, offset, locale);
    }

    @Override
    public List<String> getAllCategories() {
        return listMapper.getAllCategories();
    }
}
