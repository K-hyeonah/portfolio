package project1.project1_spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project1.project1_spring.domain.FacilityDetail;
import project1.project1_spring.repository.FacilityDetailRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FacilityDetailService {

    private final FacilityDetailRepository facilityDetailRepository;

    @Autowired
    public FacilityDetailService(FacilityDetailRepository facilityDetailRepository) {
        this.facilityDetailRepository = facilityDetailRepository;
    }

    public Optional<FacilityDetail> findFacilityDetailById(Long id) {
        return facilityDetailRepository.findById(id);
    }

    public List<FacilityDetail> getFacilitiesByIds(List<Long> facilityIds) {
        return facilityDetailRepository.findAllById(facilityIds);
    }
}