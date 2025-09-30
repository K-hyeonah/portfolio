package com.example.ApiRound.Service;

import com.example.ApiRound.dto.TourPackageDto;
import com.example.ApiRound.dto.TourPackageItemDto;

import java.util.List;

public interface TourPackageService {
    List<TourPackageDto> getAllPackages();
    TourPackageDto getPackageWithItems(Long packageId);
}
