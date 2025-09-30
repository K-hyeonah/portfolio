package project1.project1_spring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project1.project1_spring.service.RegionService;

import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/api/region")
public class RegionController {
    private final RegionService regionService;

    public RegionController(RegionService regionService) {
        this.regionService = regionService;
    }

    // 시도 목록
    @GetMapping("/sido")
    public Set<String> getSido() {

        return regionService.getSidoList();
    }

    // 구군 목록
    @GetMapping("/gugun")
    public Set<String> getGugun(@RequestParam String sido) {
        return regionService.getGugunList(sido);
    }

    // 동 목록
    @GetMapping("/dong")
    public List<String> getDong(@RequestParam String sido, @RequestParam String gugun) {
        return regionService.getDongList(sido, gugun);
    }
}
