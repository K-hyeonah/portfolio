package com.example.ApiRound.Controller;

import com.example.ApiRound.dto.TourPackageDto;
import com.example.ApiRound.Service.TourPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class TourPackageController {

    private final TourPackageService tourPackageService;

    @GetMapping("/packages/list")
    public String showPackageList(Model model) {
        List<TourPackageDto> packages = tourPackageService.getAllPackages();
        model.addAttribute("packages", packages);
        return "packages/list";  // → /WEB-INF/views/packages/list.jsp
    }

    // 전체 패키지 목록
    @GetMapping
    public List<TourPackageDto> getAllPackages() {
        return tourPackageService.getAllPackages();
    }

    // 패키지 상세 + 포함된 아이템 목록
    @GetMapping("/{id}")
    public TourPackageDto getPackageWithItems(@PathVariable Long id) {
        return tourPackageService.getPackageWithItems(id);
    }
}
