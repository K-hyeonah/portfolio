package com.example.ApiRound.Service;

import com.example.ApiRound.dto.TourPackageDto;
import com.example.ApiRound.dto.TourPackageItemDto;
import com.example.ApiRound.mapper.TourPackageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourPackageServiceImpl implements TourPackageService {

    private final TourPackageMapper tourPackageMapper;

    @Override
    public List<TourPackageDto> getAllPackages() {

        return tourPackageMapper.getAllPackages();
    }

    @Override
    public TourPackageDto getPackageWithItems(Long packageId) {
        TourPackageDto tourPackage = tourPackageMapper.getPackageById(packageId);
        List<TourPackageItemDto> items = tourPackageMapper.getItemsByPackageId(packageId);
        tourPackage.setItems(items.stream().map(TourPackageItemDto::getListDto).toList());
        return tourPackage;
    }
}
