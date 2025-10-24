package com.example.ApiRound.Controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.ApiRound.Service.ItemListService;
import com.example.ApiRound.crm.hyeonah.review.UserReviewDto;
import com.example.ApiRound.crm.hyeonah.review.UserReviewService;
import com.example.ApiRound.entity.ItemList;
import com.example.ApiRound.repository.ItemListRepository;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ListController {

    private final ItemListService itemListService;
    private final ItemListRepository itemListRepository;
    private final UserReviewService userReviewService;

    /** "전국" / "전체" / "" / null  -> 검색조건 미적용(null)로 통일 */
    private String norm(String v) {
        if (v == null) return null;
        String s = v.trim();
        if (s.isEmpty()) return null;
        if ("전국".equals(s) || "전체".equals(s) || "all".equalsIgnoreCase(s)) return null;
        return s;
    }

    /** SSR 목록 */
    @GetMapping("/list")
    public String getAllItems(Model model,
                              @RequestParam(required = false) String region,
                              @RequestParam(required = false, name = "subRegion") String subRegion,
                              @RequestParam(required = false) String category,
                              @RequestParam(defaultValue = "1") int pageNo,
                              @RequestParam(defaultValue = "15") int amount) {

        // ✅ 정규화
        String nRegion    = norm(region);
        String nSubRegion = norm(subRegion);
        String nCategory  = norm(category);

        Pageable pageable = PageRequest.of(pageNo - 1, amount, Sort.by(Sort.Direction.DESC, "id"));

        Page<ItemList> page;
        long totalCount;

        boolean hasRegionOrSub = (nRegion != null) || (nSubRegion != null);
        boolean hasCategory    = (nCategory != null);

        System.out.println("===== ListController.getAllItems 디버깅 =====");
        System.out.println("region: " + nRegion + ", subRegion: " + nSubRegion + ", category: " + nCategory);

        if (hasRegionOrSub) {
            page = itemListService.getItemsByRegionAndCategory(nRegion, nSubRegion, nCategory, pageable);
            totalCount = itemListService.countByRegionAndCategory(nRegion, nSubRegion, nCategory);
        } else if (hasCategory) {
            page = itemListService.getItemsByCategory(nCategory, pageable);
            totalCount = itemListService.countByCategory(nCategory);
        } else {
            // 전체
            page = itemListService.getItemsByCategory(null, pageable);
            totalCount = itemListService.countByCategory(null);
        }
        
        System.out.println("조회된 아이템 수: " + page.getContent().size());
        System.out.println("전체 카운트: " + totalCount);
        for (ItemList item : page.getContent()) {
            System.out.println("Item ID: " + item.getId() + 
                             ", Name: " + item.getName() + 
                             ", Category: " + item.getCategory() + 
                             ", OwnerCompany: " + (item.getOwnerCompany() != null ? 
                                 "ID=" + item.getOwnerCompany().getCompanyId() + 
                                 ", Active=" + item.getOwnerCompany().getIsActive() + 
                                 ", Status=" + item.getOwnerCompany().getApprovalStatus() : "NULL"));
        }

        int totalPages = Math.max(page.getTotalPages(), 1);
        int startPage = Math.max(1, pageNo - 2);
        int endPage = Math.min(totalPages, pageNo + 2);

        model.addAttribute("lists", page.getContent());
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("pageNo", pageNo);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("amount", amount);

        model.addAttribute("mode", hasRegionOrSub ? "search" : (hasCategory ? "category" : "all"));

        // 표기용 값
        model.addAttribute("region", (nRegion == null ? "전국" : nRegion));
        model.addAttribute("subRegion", nSubRegion);
        model.addAttribute("category", nCategory);

        return "list";
    }

    /** AJAX 목록(JSON) */
    @GetMapping(value = "/api/list", produces = "application/json")
    @ResponseBody
    public ListResponse getListApi(@RequestParam(required = false) String region,
                                   @RequestParam(required = false, name = "subRegion") String subRegion,
                                   @RequestParam(required = false) String category,
                                   @RequestParam(defaultValue = "1") int pageNo,
                                   @RequestParam(defaultValue = "15") int amount) {

        // ✅ 동일 정규화
        String nRegion    = norm(region);
        String nSubRegion = norm(subRegion);
        String nCategory  = norm(category);

        Pageable pageable = PageRequest.of(pageNo - 1, amount, Sort.by(Sort.Direction.DESC, "id"));

        Page<ItemList> page;
        long totalCount;

        boolean hasRegionOrSub = (nRegion != null) || (nSubRegion != null);
        boolean hasCategory    = (nCategory != null);

        if (hasRegionOrSub) {
            page = itemListService.getItemsByRegionAndCategory(nRegion, nSubRegion, nCategory, pageable);
            totalCount = itemListService.countByRegionAndCategory(nRegion, nSubRegion, nCategory);
        } else if (hasCategory) {
            page = itemListService.getItemsByCategory(nCategory, pageable);
            totalCount = itemListService.countByCategory(nCategory);
        } else {
            page = itemListService.getItemsByCategory(null, pageable);
            totalCount = itemListService.countByCategory(null);
        }

        int totalPages = Math.max(page.getTotalPages(), 1);
        int startPage = Math.max(1, pageNo - 2);
        int endPage = Math.min(totalPages, pageNo + 2);

        return new ListResponse(
                page.getContent(),
                totalCount,
                pageNo,
                totalPages,
                startPage,
                endPage,
                amount
        );
    }

    @Data
    @AllArgsConstructor
    public static class ListResponse {
        private java.util.List<ItemList> lists;
        private long totalCount;
        private int pageNo;
        private int totalPages;
        private int startPage;
        private int endPage;
        private int amount;
    }

    // ========== 리뷰 시스템용 API ==========

    /**
     * 업체의 아이템 목록 조회
     * GET /api/review/company-items/{companyId}
     */
    @GetMapping("/api/review/company-items/{companyId}")
    @ResponseBody
    public ResponseEntity<List<com.example.ApiRound.dto.ItemListDto>> getItemsByCompany(@PathVariable Integer companyId) {
        List<com.example.ApiRound.entity.ItemList> items = itemListRepository.findByOwnerCompany_CompanyId(companyId);
        List<com.example.ApiRound.dto.ItemListDto> itemDtos = items.stream()
                .map(com.example.ApiRound.dto.ItemListDto::from)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(itemDtos);
    }

    /**
     * 아이템 상세 조회 (리뷰용)
     * GET /api/review/item/{itemId}
     */
    @GetMapping("/api/review/item/{itemId}")
    @ResponseBody
    public ResponseEntity<ItemList> getItemByIdForReview(@PathVariable Long itemId) {
        return itemListRepository.findById(itemId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 업체의 모든 리뷰 조회 (user_review.booking_id -> reservations.id -> reservations.company_id)
     * GET /api/review/company-reviews/{companyId}
     */
    @GetMapping("/api/review/company-reviews/{companyId}")
    @ResponseBody
    public ResponseEntity<List<Object[]>> getCompanyReviews(@PathVariable Integer companyId) {
        try {
            // user_review.booking_id를 통해 예약(reservations)과 연결하여 업체의 리뷰 조회
            List<Object[]> reviews = userReviewService.getReviewsByCompanyId(companyId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 서비스별 리뷰 조회
     * GET /api/review/service/{serviceId}
     */
    @GetMapping("/api/review/service/{serviceId}")
    @ResponseBody
    public ResponseEntity<List<UserReviewDto>> getServiceReviews(@PathVariable Long serviceId) {
        try {
            System.out.println("🔍 서비스별 리뷰 조회 - serviceId: " + serviceId);
            List<UserReviewDto> reviews = userReviewService.getReviewsByServiceId(serviceId);
            System.out.println("🔍 조회된 리뷰 개수: " + reviews.size());
            for (UserReviewDto review : reviews) {
                System.out.println("  - reviewId: " + review.getReviewId() + ", title: " + review.getTitle() + ", isPublic: " + review.getIsPublic());
            }
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            System.err.println("❌ 서비스별 리뷰 조회 오류: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 서비스별 평균 평점 조회
     * GET /api/review/service/{serviceId}/average-rating
     */
    @GetMapping("/api/review/service/{serviceId}/average-rating")
    @ResponseBody
    public ResponseEntity<Double> getServiceAverageRating(@PathVariable Long serviceId) {
        try {
            Double averageRating = userReviewService.getAverageRatingByServiceId(serviceId);
            return ResponseEntity.ok(averageRating != null ? averageRating : 0.0);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 서비스별 리뷰 개수 조회
     * GET /api/review/service/{serviceId}/count
     */
    @GetMapping("/api/review/service/{serviceId}/count")
    @ResponseBody
    public ResponseEntity<Long> getServiceReviewCount(@PathVariable Long serviceId) {
        try {
            Long count = userReviewService.getReviewCountByServiceId(serviceId);
            return ResponseEntity.ok(count != null ? count : 0L);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
