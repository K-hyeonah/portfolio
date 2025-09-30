package project1.project1_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import project1.project1_spring.domain.FacilityDetail;
import project1.project1_spring.service.FacilityDetailService;

import java.util.Optional;

@Controller
public class FacilityDetailController {

    private final FacilityDetailService facilityDetailService;

    @Autowired
    public FacilityDetailController(FacilityDetailService facilityDetailService) {
        this.facilityDetailService = facilityDetailService;
    }

    @GetMapping("/facilities/{id}")
    public String getFacilityDetail(@PathVariable("id") Long id, Model model) {
        Optional<FacilityDetail> facilityDetail = facilityDetailService.findFacilityDetailById(id);

        if (facilityDetail.isPresent()) {
            model.addAttribute("detail", facilityDetail.get());
            return "facility-detail";
        } else {
            // 시설을 찾지 못했을 경우 에러 페이지 또는 목록 페이지로 리다이렉트
            return "redirect:/facilities";
        }
    }
}