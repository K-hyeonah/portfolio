package com.example.ApiRound.Controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.ApiRound.Service.ItemListService;
import com.example.ApiRound.entity.ItemList;

@Controller
public class TourismController {

    private final ItemListService itemListService;

    @Autowired
    public TourismController(ItemListService itemListService) {
        this.itemListService = itemListService;
    }

    @GetMapping("/tourism")
    public String tourismList(Model model) {
        // 현재 로케일 정보
        String locale = LocaleContextHolder.getLocale().getLanguage();
        if (locale == null || locale.isEmpty() || locale.equals("ko")) {
            locale = "ko"; // 기본값
        }

        try {
            // 인기 패키지 (예시: tourism 카테고리)
            List<ItemList> popularPackages = itemListService.getListByCategory("tourism");

            // 신규 패키지 (예시: package 카테고리)
            List<ItemList> newPackages = itemListService.getListByCategory("package");

            // 전체 패키지
            List<ItemList> allPackages = itemListService.getAllList();

            model.addAttribute("popularPackages", popularPackages);
            model.addAttribute("newPackages", newPackages);
            model.addAttribute("allPackages", allPackages);
            model.addAttribute("currentLocale", locale);

            System.out.println("=== Tourism Controller Debug ===");
            System.out.println("Current Locale: " + locale);
            System.out.println("Popular Packages Count: " + (popularPackages != null ? popularPackages.size() : 0));
            System.out.println("New Packages Count: " + (newPackages != null ? newPackages.size() : 0));
            System.out.println("All Packages Count: " + (allPackages != null ? allPackages.size() : 0));

        } catch (Exception e) {
            System.err.println("Error loading tourism packages: " + e.getMessage());
            e.printStackTrace();

            // 오류 시 빈 리스트
            model.addAttribute("popularPackages", Collections.emptyList());
            model.addAttribute("newPackages", Collections.emptyList());
            model.addAttribute("allPackages", Collections.emptyList());
            model.addAttribute("currentLocale", locale);
        }

        return "tourism_list";
    }
}
