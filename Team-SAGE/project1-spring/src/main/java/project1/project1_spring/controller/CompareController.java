package project1.project1_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import project1.project1_spring.domain.FacilityDetail;
import project1.project1_spring.service.FacilityDetailService;

import java.util.List;

@Controller
public class CompareController {

    private final FacilityDetailService facilityDetailService;


    public CompareController(FacilityDetailService facilityDetailService) {
        this.facilityDetailService = facilityDetailService;
    }

    @GetMapping("/compare")
    public String compareFacilities(@RequestParam(name = "ids") List<Long> facilityIds, Model model) {

        List<FacilityDetail> facilitiesToCompare = facilityDetailService.getFacilitiesByIds(facilityIds);

        model.addAttribute("facilities", facilitiesToCompare);

        return "compare";
    }
}