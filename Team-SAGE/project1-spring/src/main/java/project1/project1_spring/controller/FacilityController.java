package project1.project1_spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import project1.project1_spring.domain.Facility;
import project1.project1_spring.domain.FacilityDetail;
import project1.project1_spring.repository.FacilityDetailRepository;
import project1.project1_spring.service.FacilityService;

@Controller
public class FacilityController {

    private final FacilityService facilityService;
    private final FacilityDetailRepository facilityDetailRepository;

    @Autowired
    public FacilityController(FacilityService facilityService, FacilityDetailRepository facilityDetailRepository) {
        this.facilityService = facilityService;
        this.facilityDetailRepository = facilityDetailRepository;
    }

    @GetMapping("/facilities")
    public String getFacilities(Model model) {
        List<Facility> facilityList = facilityService.findAllFacilities();
        model.addAttribute("facilityList", facilityList);
        return "index";
    }
    
    @GetMapping("/api/facility/search")
    public ResponseEntity<Facility> searchFacilityByName(@RequestParam String name) {
        Facility facility = facilityService.findByName(name);
        if (facility != null) {
            return ResponseEntity.ok(facility);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/facility-detail/{id}")
    public String getFacilityDetail(@PathVariable Long id, Model model) {
        // FacilityDetail에서 상세 정보 조회
        var facilityDetailOpt = facilityDetailRepository.findById(id);
        if (facilityDetailOpt.isPresent()) {
            FacilityDetail detail = facilityDetailOpt.get();
            model.addAttribute("detail", detail);
            return "facility-detail";
        } else {
            // 상세 정보가 없으면 기본 Facility 정보로 대체
            Facility facility = facilityService.findById(id);
            if (facility != null) {
                model.addAttribute("detail", facility);
                return "facility-detail";
            } else {
                return "redirect:/facilities";
            }
        }
    }
}