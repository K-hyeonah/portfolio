package project1.project1_spring.service;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import project1.project1_spring.domain.Facility;
import project1.project1_spring.repository.FacilityRepository;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    @Autowired
    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    public List<Facility> findAllFacilities() {
        List<Facility> facilities = facilityRepository.findAll();

        return facilities;
    }

    public Facility findByName(String name) {
        return facilityRepository.findByName(name);
    }

    public Facility findById(Long id) {
        return facilityRepository.findById(id);
    }

    public List<Facility> findFacilities() {
        return facilityRepository.findAll();
    }

    // 이 메서드가 있어야 합니다.
    public List<Facility> searchFacilitiesByRegionAndKeyword(String sido, String gugun, String dong, String keyword) {
        return facilityRepository.searchByRegionAndKeyword(sido, gugun, dong, keyword);
    }

    public List<String> findMatchingFacilityIds(String sido, String gugun, String dong, String keyword) {
        List<Facility> facilities = facilityRepository.searchByRegionAndKeyword(sido, gugun, dong, keyword);
        return facilities.stream()
                .map(Facility::getId)
                .map(String::valueOf)
                .collect(Collectors.toList());
    }
}