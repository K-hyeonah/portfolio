package com.example.ApiRound.crm.minggzz;



import java.math.BigDecimal;

import java.time.format.DateTimeFormatter;

import java.util.ArrayList;

import java.util.HashMap;

import java.util.List;

import java.util.Map;

import java.util.Optional;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;

import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.ModelAttribute;

import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.ResponseBody;



import com.example.ApiRound.Service.ClickLogService;

import com.example.ApiRound.Service.UserInquiryService;

import com.example.ApiRound.crm.hyeonah.Service.CompanyUserService;

import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;

import com.example.ApiRound.crm.hyeonah.review.UserReviewService;

import com.example.ApiRound.crm.yoyo.medi.MediServiceRepository;

import com.example.ApiRound.crm.yoyo.reservation.Reservation;

import com.example.ApiRound.crm.yoyo.reservation.ReservationRepository;

import com.example.ApiRound.dto.InquirySubmitRequest;

import com.example.ApiRound.entity.AdminEvent;

import com.example.ApiRound.entity.Marketing;

import com.example.ApiRound.entity.UserInquiry;

import com.example.ApiRound.repository.AdminEventRepository;

import com.example.ApiRound.repository.MarketingRepository;
import com.example.ApiRound.repository.UserInquiryRepository;
import com.example.ApiRound.entity.MarketingMessage;
import com.example.ApiRound.Service.MarketingMessageService;
import com.example.ApiRound.repository.MarketingMessageRepository;



import jakarta.servlet.http.HttpSession;



@Controller

@RequestMapping("/company")

public class CompanyController {

    

    private final CompanyUserService companyUserService;

    private final ReservationRepository reservationRepo;

    private final UserInquiryService userInquiryService;

    private final AdminEventRepository adminEventRepository;

    private final MarketingRepository marketingRepository;
    private final UserInquiryRepository userInquiryRepository;
    private final MarketingMessageService marketingMessageService;
    private final MarketingMessageRepository marketingMessageRepository;

    private final ClickLogService clickLogService;

    private final MediServiceRepository mediServiceRepository;

    private final UserReviewService userReviewService;



    @Autowired

    public CompanyController(CompanyUserService companyUserService, 

                            ReservationRepository reservationRepo,

                            UserInquiryService userInquiryService,

                            AdminEventRepository adminEventRepository,

                            MarketingRepository marketingRepository,

                            UserInquiryRepository userInquiryRepository,

                            @Lazy MarketingMessageService marketingMessageService,

                            @Lazy MarketingMessageRepository marketingMessageRepository,

                            ClickLogService clickLogService,

                            MediServiceRepository mediServiceRepository,

                            UserReviewService userReviewService) {

        this.companyUserService = companyUserService;

        this.reservationRepo = reservationRepo;

        this.userInquiryService = userInquiryService;

        this.adminEventRepository = adminEventRepository;

        this.marketingRepository = marketingRepository;

        this.userInquiryRepository = userInquiryRepository;

        this.marketingMessageService = marketingMessageService;

        this.marketingMessageRepository = marketingMessageRepository;

        this.clickLogService = clickLogService;

        this.mediServiceRepository = mediServiceRepository;

        this.userReviewService = userReviewService;

    }



    /**

     * 테스트 엔드포인트

     */

    @GetMapping("/test")

    @ResponseBody

    public String test() {

        return "Company Controller is working!";

    }



    /**

     * 업체 메인페이지 (힝거 피부과)

     */

    @GetMapping("/dashboard")

    public String company(HttpSession session, Model model) {

        // 세션 체크: 업체로 로그인한 사용자만 접근 가능

        Integer companyId = (Integer) session.getAttribute("companyId");

        String userType = (String) session.getAttribute("userType");



        if (companyId == null || !"company".equals(userType)) {

            return "redirect:/crm/crm_login";

        }



        // 업체 정보 추가

        model.addAttribute("companyId", companyId);

        model.addAttribute("companyName", session.getAttribute("companyName"));

        model.addAttribute("companyEmail", session.getAttribute("companyEmail"));

        // 업체 대시보드 데이터 (실제로는 서비스에서 가져와야 함)

        Map<String, Object> companyStats = new HashMap<>();

        companyStats.put("foreignTouristIncrease", "15% 증가");

        companyStats.put("koreanTouristIncrease", "5% 증가");

        companyStats.put("newEventProducts", "4건");



        model.addAttribute("companyStats", companyStats);



        // 예약 차트 데이터 - 실제 DB 데이터 사용

        Optional<CompanyUser> companyOpt = companyUserService.findById(companyId);

        if (companyOpt.isPresent()) {

            Map<String, Object> reservationChartData = getReservationChartData(companyOpt.get());

            model.addAttribute("reservationChartData", reservationChartData);

        } else {

            Map<String, Object> reservationChartData = getReservationChartData(null);

            model.addAttribute("reservationChartData", reservationChartData);

        }



        // 후기 데이터 - 실제 DB에서 조회 (최신 3개)

        try {

            List<Object[]> allReviews = userReviewService.getReviewsByCompanyId(companyId);

            

            // 최신 리뷰 3개만 추출

            List<Map<String, Object>> latestReviews = new ArrayList<>();

            int limit = Math.min(3, allReviews.size());

            

            for (int i = 0; i < limit; i++) {

                Object[] row = allReviews.get(i);

                Map<String, Object> reviewMap = new HashMap<>();

                

                reviewMap.put("reviewId", row[0]);

                reviewMap.put("userId", row[1]);

                reviewMap.put("itemId", row[2]);

                reviewMap.put("bookingId", row[3]);

                reviewMap.put("rating", row[4]);

                reviewMap.put("title", row[5]);

                reviewMap.put("content", row[6]);

                reviewMap.put("imageMime", row[7]);

                reviewMap.put("isPublic", row[8]);

                

                // Timestamp를 LocalDateTime으로 변환

                if (row[9] != null) {

                    if (row[9] instanceof java.sql.Timestamp) {

                        reviewMap.put("createdAt", ((java.sql.Timestamp) row[9]).toLocalDateTime());

                    } else {

                        reviewMap.put("createdAt", row[9]);

                    }

                } else {

                    reviewMap.put("createdAt", null);

                }

                

                if (row[10] != null) {

                    if (row[10] instanceof java.sql.Timestamp) {

                        reviewMap.put("updatedAt", ((java.sql.Timestamp) row[10]).toLocalDateTime());

                    } else {

                        reviewMap.put("updatedAt", row[10]);

                    }

                } else {

                    reviewMap.put("updatedAt", null);

                }

                

                reviewMap.put("itemName", row[11]);

                reviewMap.put("userName", row[12]);

                

                latestReviews.add(reviewMap);

            }

            

            model.addAttribute("latestReviews", latestReviews);

        } catch (Exception e) {

            System.err.println("리뷰 조회 실패: " + e.getMessage());

            e.printStackTrace();

            model.addAttribute("latestReviews", new ArrayList<>());

        }



        // 인기 서비스 데이터 (예약 수 기준)

        List<Map<String, Object>> popularEvents = getPopularEvents(companyId);

        model.addAttribute("popularEvents", popularEvents);



        model.addAttribute("sidebarType", "company");

        addAvatarInfo(model, companyId);

        return "crm/company";

    }



    /**

     * 이벤트 등록 페이지

     */

    @GetMapping("/event-registration")

    public String eventRegistration(HttpSession session, Model model) {

        Integer companyId = (Integer) session.getAttribute("companyId");

        model.addAttribute("sidebarType", "company");

        model.addAttribute("companyName", session.getAttribute("companyName"));

        model.addAttribute("companyId", companyId);

        addAvatarInfo(model, companyId);

        return "crm/event_registration";

    }



    /**

     * 문의 & 채팅 페이지

     */

    @GetMapping("/inquiry-chat")

    public String inquiryChat(HttpSession session, Model model) {

        Integer companyId = (Integer) session.getAttribute("companyId");

        List<Map<String, Object>> inquiries = getInquiries();

        model.addAttribute("inquiries", inquiries);

        model.addAttribute("companyName", session.getAttribute("companyName"));

        model.addAttribute("companyId", companyId);

        model.addAttribute("sidebarType", "company");

        addAvatarInfo(model, companyId);

        return "crm/company_inquiry_chat";

    }



    /**

     * 문의/신고 접수 페이지

     */

    @GetMapping("/inquiry-report")

    public String inquiryReport(HttpSession session, Model model) {

        Integer companyId = (Integer) session.getAttribute("companyId");

        List<Map<String, Object>> reports = getInquiryReports();

        model.addAttribute("reports", reports);

        model.addAttribute("sidebarType", "company");

        model.addAttribute("companyName", session.getAttribute("companyName"));

        model.addAttribute("companyId", companyId);

        addAvatarInfo(model, companyId);

        return "crm/company_report";

    }



    /**

     * 문의/신고 상세 페이지 (업체용)

     */

    @GetMapping("/inquiry-report/detail/{id}")

    public String inquiryReportDetail(@PathVariable("id") Long id, Model model, HttpSession session) {

        Integer companyId = (Integer) session.getAttribute("companyId");

        Map<String, Object> report = getInquiryReportById(id);

        model.addAttribute("report", report);

        model.addAttribute("sidebarType", "company");

        model.addAttribute("companyName", session.getAttribute("companyName"));

        model.addAttribute("companyId", companyId);

        addAvatarInfo(model, companyId);

        return "crm/inquiry_detail";

    }



    /**

     * 마케팅 페이지 (업체용)

     */

    @GetMapping("/marketing")

    public String marketing(Model model, HttpSession session) {

        Integer companyId = (Integer) session.getAttribute("companyId");



        // DB에서 실제 통계 데이터 조회

        long totalImpressions = 0;  // 노출수

        long totalClicks = 0;

        long totalReservations = 0;

        int totalMedicalServices = 0;

        List<Map<String, Object>> clickChartData = new ArrayList<>();



        if (companyId != null) {

            // 노출수 조회 (승인된 AdminEvent 개수)

            totalImpressions = adminEventRepository.countByCompanyIdAndApprovalStatus(

                companyId, com.example.ApiRound.entity.AdminEvent.ApprovalStatus.APPROVED);

            

            // 클릭 수 조회 (최근 30일)

            java.time.LocalDateTime thirtyDaysAgo = java.time.LocalDateTime.now().minusDays(30);

            totalClicks = clickLogService.getClickCountByCompanyIdSince(companyId.longValue(), thirtyDaysAgo);



            // 예약 수 조회

            Optional<CompanyUser> companyOpt = companyUserService.findById(companyId);

            if (companyOpt.isPresent()) {

                totalReservations = reservationRepo.countByCompany(companyOpt.get());

            }

            

            // 의료서비스 개수 조회

            totalMedicalServices = mediServiceRepository.countActiveServicesByCompanyId(companyId);

            

            // 클릭 추이 차트 데이터 (최근 30일)

            clickChartData = clickLogService.getDailyClicksByCompany(companyId.longValue(), 30);

        }



        model.addAttribute("totalImpressions", totalImpressions);

        model.addAttribute("totalClicks", totalClicks);

        model.addAttribute("totalReservations", totalReservations);

        model.addAttribute("totalMedicalServices", totalMedicalServices);

        model.addAttribute("clickChartData", clickChartData);

        model.addAttribute("companyName", session.getAttribute("companyName"));

        model.addAttribute("companyId", companyId);



        // 이벤트/광고 배치 목록 (admin_event 테이블)

        List<AdminEvent> events = companyId != null ?

            adminEventRepository.findByCompanyIdOrderByCreatedAtDesc(companyId) : new ArrayList<>();

        model.addAttribute("placements", events);



        // 쿠폰/마케팅 목록 (marketing 테이블)

        List<Marketing> marketingList = companyId != null ?

            marketingRepository.findByCompanyIdOrderByCreatedAtDesc(companyId) : new ArrayList<>();

        model.addAttribute("coupons", marketingList);

        

        // 의료서비스 목록 조회 (인기 콘텐츠 표시용)

        List<com.example.ApiRound.crm.yoyo.medi.MediServiceEntity> medicalServices = companyId != null ?

            mediServiceRepository.findActiveByCompanyIdWithFetch(companyId) : new ArrayList<>();

        model.addAttribute("medicalServices", medicalServices);



        model.addAttribute("sidebarType", "company");

        addAvatarInfo(model, companyId);

        return "crm/company_marketing";

    }



    /**

     * 마케팅 통계 API - 클릭 수 추이 (최근 30일)

     */

    @GetMapping("/api/marketing/click-stats")

    @ResponseBody

    public ResponseEntity<?> getClickStats(HttpSession session) {

        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest().body(Map.of("error", "로그인 필요"));

            }



            // 최근 30일간의 클릭 수 데이터

            List<Map<String, Object>> clickStats = clickLogService.getDailyClicksByCompany(companyId.longValue(), 30);



            return ResponseEntity.ok(clickStats);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));

        }

    }



    /**

     * 마케팅 통계 API - 예약 수 추이 (최근 30일)

     */

    @GetMapping("/api/marketing/reservation-stats")

    @ResponseBody

    public ResponseEntity<?> getReservationStats(HttpSession session) {

        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest().body(Map.of("error", "로그인 필요"));

            }



            Optional<CompanyUser> companyOpt = companyUserService.findById(companyId);

            if (!companyOpt.isPresent()) {

                return ResponseEntity.badRequest().body(Map.of("error", "업체 정보 없음"));

            }



            // 최근 30일간의 예약 수 데이터

            List<Map<String, Object>> reservationStats = new ArrayList<>();



            for (int i = 29; i >= 0; i--) {

                java.time.LocalDate date = java.time.LocalDate.now().minusDays(i);

                // TODO: countByCompanyAndDate 메서드 구현 필요

                long count = 0;



                Map<String, Object> stat = new HashMap<>();

                stat.put("date", date.toString());

                stat.put("count", count);

                reservationStats.add(stat);

            }



            return ResponseEntity.ok(reservationStats);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));

        }

    }



    /**

     * 새 노출 요청 제출 API

     */

    @PostMapping("/api/marketing/placement/submit")

    @ResponseBody

    public ResponseEntity<?> submitPlacement(

            @RequestParam String target,

            @RequestParam String slot,

            @RequestParam String startDate,

            @RequestParam String endDate,

            @RequestParam String priority,

            @RequestParam(required = false) String landingUrl,

            @RequestParam(required = false) org.springframework.web.multipart.MultipartFile bannerImage,

            HttpSession session) {



        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest()

                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));

            }



            // AdminEvent 엔티티 생성

            AdminEvent event = AdminEvent.builder()

                    .companyId(companyId)

                    .target(target)

                    .slot(AdminEvent.Slot.valueOf(slot))

                    .startDate(java.time.LocalDate.parse(startDate))

                    .endDate(java.time.LocalDate.parse(endDate))

                    .priority(AdminEvent.Priority.valueOf(priority))

                    .landingUrl(landingUrl)

                    .approvalStatus(AdminEvent.ApprovalStatus.PENDING)

                    .clicks(0)

                    .build();



            // TODO: 배너 이미지 파일 저장 로직 (필요시 구현)

            // if (bannerImage != null && !bannerImage.isEmpty()) {

            //     String path = saveFile(bannerImage);

            //     event.setBannerImagePath(path);

            // }



            AdminEvent saved = adminEventRepository.save(event);



            return ResponseEntity.ok(Map.of("success", true, "id", saved.getId()));

        } catch (Exception e) {

            System.err.println("노출 요청 제출 에러: " + e.getMessage());

            e.printStackTrace();

            return ResponseEntity.internalServerError()

                .body(Map.of("success", false, "message", "제출 실패: " + e.getMessage()));

        }

    }



    /**

     * Placement 조회 API

     */

    @GetMapping("/api/marketing/placement/{id}")

    @ResponseBody

    public ResponseEntity<?> getPlacement(@PathVariable Integer id, HttpSession session) {

        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest().body(Map.of("error", "로그인이 필요합니다."));

            }



            Optional<AdminEvent> eventOpt = adminEventRepository.findById(id);

            if (!eventOpt.isPresent()) {

                return ResponseEntity.notFound().build();

            }



            AdminEvent event = eventOpt.get();

            

            // 본인의 placement만 조회 가능

            if (!event.getCompanyId().equals(companyId)) {

                return ResponseEntity.status(403).body(Map.of("error", "권한이 없습니다."));

            }



            return ResponseEntity.ok(event);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));

        }

    }



    /**

     * Placement 업데이트 API

     */

    @PutMapping("/api/marketing/placement/{id}")

    @ResponseBody

    public ResponseEntity<?> updatePlacement(

            @PathVariable Integer id,

            @RequestBody Map<String, Object> updates,

            HttpSession session) {

        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest()

                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));

            }



            Optional<AdminEvent> eventOpt = adminEventRepository.findById(id);

            if (!eventOpt.isPresent()) {

                return ResponseEntity.status(404)

                    .body(Map.of("success", false, "message", "항목을 찾을 수 없습니다."));

            }



            AdminEvent event = eventOpt.get();

            

            // 본인의 placement만 수정 가능

            if (!event.getCompanyId().equals(companyId)) {

                return ResponseEntity.status(403)

                    .body(Map.of("success", false, "message", "권한이 없습니다."));

            }



            // 업데이트 적용

            if (updates.containsKey("target")) {

                event.setTarget((String) updates.get("target"));

            }

            if (updates.containsKey("slot")) {

                event.setSlot(AdminEvent.Slot.valueOf((String) updates.get("slot")));

            }

            if (updates.containsKey("startDate")) {

                event.setStartDate(java.time.LocalDate.parse((String) updates.get("startDate")));

            }

            if (updates.containsKey("endDate")) {

                event.setEndDate(java.time.LocalDate.parse((String) updates.get("endDate")));

            }

            if (updates.containsKey("priority")) {

                event.setPriority(AdminEvent.Priority.valueOf((String) updates.get("priority")));

            }

            if (updates.containsKey("landingUrl")) {

                event.setLandingUrl((String) updates.get("landingUrl"));

            }



            adminEventRepository.save(event);



            return ResponseEntity.ok(Map.of("success", true));

        } catch (Exception e) {

            System.err.println("Placement 업데이트 에러: " + e.getMessage());

            e.printStackTrace();

            return ResponseEntity.internalServerError()

                .body(Map.of("success", false, "message", "수정 실패: " + e.getMessage()));

        }

    }



    /**

     * Placement 삭제 API

     */

    @DeleteMapping("/api/marketing/placement/{id}")

    @ResponseBody

    public ResponseEntity<?> deletePlacement(@PathVariable Integer id, HttpSession session) {

        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest()

                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));

            }



            Optional<AdminEvent> eventOpt = adminEventRepository.findById(id);

            if (!eventOpt.isPresent()) {

                return ResponseEntity.status(404)

                    .body(Map.of("success", false, "message", "항목을 찾을 수 없습니다."));

            }



            AdminEvent event = eventOpt.get();

            

            // 본인의 placement만 삭제 가능

            if (!event.getCompanyId().equals(companyId)) {

                return ResponseEntity.status(403)

                    .body(Map.of("success", false, "message", "권한이 없습니다."));

            }



            adminEventRepository.delete(event);



            return ResponseEntity.ok(Map.of("success", true));

        } catch (Exception e) {

            System.err.println("Placement 삭제 에러: " + e.getMessage());

            e.printStackTrace();

            return ResponseEntity.internalServerError()

                .body(Map.of("success", false, "message", "삭제 실패: " + e.getMessage()));

        }

    }



    /**

     * 새 쿠폰 생성 제출 API

     */

    @PostMapping("/api/marketing/coupon/submit")

    @ResponseBody

    public ResponseEntity<?> submitCoupon(

            @RequestParam String name,

            @RequestParam String description,

            @RequestParam String couponType,

            @RequestParam String discountValue,

            @RequestParam(required = false) String minPaymentAmount,

            @RequestParam(required = false) String issueLimit,

            @RequestParam String validFrom,

            @RequestParam String validUntil,

            HttpSession session) {



        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest()

                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));

            }



            // Marketing 엔티티 생성

            Marketing marketing = Marketing.builder()

                    .companyId(companyId)

                    .name(name)

                    .description(description)

                    .couponType(Marketing.CouponType.valueOf(couponType))

                    .discountValue(new java.math.BigDecimal(discountValue))

                    .minPaymentAmount(minPaymentAmount != null ? Integer.parseInt(minPaymentAmount) : null)

                    .issueLimit(issueLimit != null ? Integer.parseInt(issueLimit) : null)

                    .validFrom(java.time.LocalDate.parse(validFrom))

                    .validUntil(java.time.LocalDate.parse(validUntil))

                    .approvalStatus(Marketing.ApprovalStatus.PENDING)

                    .build();



            Marketing saved = marketingRepository.save(marketing);



            return ResponseEntity.ok(Map.of("success", true, "id", saved.getId()));

        } catch (Exception e) {

            System.err.println("쿠폰 생성 에러: " + e.getMessage());

            e.printStackTrace();

            return ResponseEntity.internalServerError()

                .body(Map.of("success", false, "message", "제출 실패: " + e.getMessage()));

        }

    }



    /**

     * Coupon 조회 API

     */

    @GetMapping("/api/marketing/coupon/{id}")

    @ResponseBody

    public ResponseEntity<?> getCoupon(@PathVariable Integer id, HttpSession session) {

        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest().body(Map.of("error", "로그인이 필요합니다."));

            }



            Optional<Marketing> marketingOpt = marketingRepository.findById(id);

            if (!marketingOpt.isPresent()) {

                return ResponseEntity.notFound().build();

            }



            Marketing marketing = marketingOpt.get();

            

            // 본인의 coupon만 조회 가능

            if (!marketing.getCompanyId().equals(companyId)) {

                return ResponseEntity.status(403).body(Map.of("error", "권한이 없습니다."));

            }



            return ResponseEntity.ok(marketing);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));

        }

    }



    /**

     * Coupon 업데이트 API

     */

    @PutMapping("/api/marketing/coupon/{id}")

    @ResponseBody

    public ResponseEntity<?> updateCoupon(

            @PathVariable Integer id,

            @RequestBody Map<String, Object> updates,

            HttpSession session) {

        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest()

                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));

            }



            Optional<Marketing> marketingOpt = marketingRepository.findById(id);

            if (!marketingOpt.isPresent()) {

                return ResponseEntity.status(404)

                    .body(Map.of("success", false, "message", "항목을 찾을 수 없습니다."));

            }



            Marketing marketing = marketingOpt.get();

            

            // 본인의 coupon만 수정 가능

            if (!marketing.getCompanyId().equals(companyId)) {

                return ResponseEntity.status(403)

                    .body(Map.of("success", false, "message", "권한이 없습니다."));

            }



            // 업데이트 적용

            if (updates.containsKey("name")) {

                marketing.setName((String) updates.get("name"));

            }

            if (updates.containsKey("couponType")) {

                marketing.setCouponType(Marketing.CouponType.valueOf((String) updates.get("couponType")));

            }

            if (updates.containsKey("discountValue")) {

                Object discountObj = updates.get("discountValue");

                if (discountObj != null) {

                    marketing.setDiscountValue(new java.math.BigDecimal(discountObj.toString()));

                }

            }

            if (updates.containsKey("minPaymentAmount")) {

                Object minPaymentObj = updates.get("minPaymentAmount");

                if (minPaymentObj != null && !minPaymentObj.toString().isEmpty()) {

                    marketing.setMinPaymentAmount(Integer.parseInt(minPaymentObj.toString()));

                } else {

                    marketing.setMinPaymentAmount(null);

                }

            }

            if (updates.containsKey("description")) {

                marketing.setDescription((String) updates.get("description"));

            }

            if (updates.containsKey("issueLimit")) {

                Object issueLimitObj = updates.get("issueLimit");

                if (issueLimitObj != null && !issueLimitObj.toString().isEmpty()) {

                    marketing.setIssueLimit(Integer.parseInt(issueLimitObj.toString()));

                } else {

                    marketing.setIssueLimit(null);

                }

            }

            if (updates.containsKey("validFrom")) {

                marketing.setValidFrom(java.time.LocalDate.parse((String) updates.get("validFrom")));

            }

            if (updates.containsKey("validUntil")) {

                marketing.setValidUntil(java.time.LocalDate.parse((String) updates.get("validUntil")));

            }



            marketingRepository.save(marketing);



            return ResponseEntity.ok(Map.of("success", true));

        } catch (Exception e) {

            System.err.println("Coupon 업데이트 에러: " + e.getMessage());

            e.printStackTrace();

            return ResponseEntity.internalServerError()

                .body(Map.of("success", false, "message", "수정 실패: " + e.getMessage()));

        }

    }



    /**

     * Coupon 삭제 API

     */

    @DeleteMapping("/api/marketing/coupon/{id}")

    @ResponseBody

    public ResponseEntity<?> deleteCoupon(@PathVariable Integer id, HttpSession session) {

        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            if (companyId == null) {

                return ResponseEntity.badRequest()

                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));

            }



            Optional<Marketing> marketingOpt = marketingRepository.findById(id);

            if (!marketingOpt.isPresent()) {

                return ResponseEntity.status(404)

                    .body(Map.of("success", false, "message", "항목을 찾을 수 없습니다."));

            }



            Marketing marketing = marketingOpt.get();

            

            // 본인의 coupon만 삭제 가능

            if (!marketing.getCompanyId().equals(companyId)) {

                return ResponseEntity.status(403)

                    .body(Map.of("success", false, "message", "권한이 없습니다."));

            }



            marketingRepository.delete(marketing);



            return ResponseEntity.ok(Map.of("success", true));

        } catch (Exception e) {

            System.err.println("Coupon 삭제 에러: " + e.getMessage());

            e.printStackTrace();

            return ResponseEntity.internalServerError()

                .body(Map.of("success", false, "message", "삭제 실패: " + e.getMessage()));

        }

    }



    /**

     * 도움말/고객센터 페이지 (업체용)

     */

    @GetMapping("/help-support")

    public String helpSupport(Model model, HttpSession session) {

        Integer companyId = (Integer) session.getAttribute("companyId");
        
        System.out.println("helpSupport: companyId from session = " + companyId);
        System.out.println("helpSupport: all session attributes = " + session.getAttributeNames());

        List<Map<String, Object>> requests = getHelpRequestsByCompanyId(companyId);

        model.addAttribute("requests", requests);

        model.addAttribute("sidebarType", "company");

        model.addAttribute("companyName", session.getAttribute("companyName"));

        model.addAttribute("companyId", companyId);

        addAvatarInfo(model, companyId);

        return "crm/company_help_support";

    }

    

    /**

     * 업체 도움말/고객센터 - 새 요청 제출 API

     */

    @PostMapping("/api/help-support/submit")

    @ResponseBody

    public ResponseEntity<?> submitHelpRequest(@ModelAttribute InquirySubmitRequest req, HttpSession session) {

        try {

            Integer companyId = (Integer) session.getAttribute("companyId");

            

            if (companyId == null) {

                return ResponseEntity.badRequest()

                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));

            }

            

            Integer inquiryId = userInquiryService.submitCompanyRequest(req, companyId);

            

            return ResponseEntity.ok(Map.of("success", true, "id", inquiryId));

        } catch (Exception e) {

            System.err.println("업체 요청 제출 에러: " + e.getMessage());

            e.printStackTrace();

            return ResponseEntity.internalServerError()

                .body(Map.of("success", false, "message", "제출 실패: " + e.getMessage()));

        }

    }



    /**

     * 도움말/고객센터 상세 페이지 (업체용)

     */

    @GetMapping("/help-support/detail/{id}")

    public String helpSupportDetail(@PathVariable("id") Long id, Model model, HttpSession session) {

        Integer companyId = (Integer) session.getAttribute("companyId");

        Map<String, Object> request = getHelpRequestById(id);

        model.addAttribute("request", request);

        model.addAttribute("sidebarType", "company");

        model.addAttribute("companyName", session.getAttribute("companyName"));

        model.addAttribute("companyId", companyId);

        addAvatarInfo(model, companyId);

        return "crm/company_help_support_detail";

    }

    

    /**

     * 아바타 정보 추가 헬퍼 메서드

     */

    private void addAvatarInfo(Model model, Integer companyId) {

        if (companyId != null) {

            Optional<CompanyUser> companyOpt = companyUserService.findById(companyId);

            boolean hasAvatar = companyOpt.isPresent() && 

                               companyOpt.get().getAvatarBlob() != null && 

                               companyOpt.get().getAvatarBlob().length > 0;

            model.addAttribute("hasAvatar", hasAvatar);

        } else {

            model.addAttribute("hasAvatar", false);

        }

    }



    // 업체 페이지용 데이터 생성 메서드들

    private Map<String, Object> getReservationChartData(CompanyUser company) {

        Map<String, Object> chartData = new HashMap<>();



        if (company == null) {

            // 업체 정보가 없을 경우 빈 데이터

            chartData.put("days", new ArrayList<>());

            chartData.put("reservations", new ArrayList<>());

            chartData.put("currentMonth", java.time.LocalDate.now().getMonthValue() + "월");

            return chartData;

        }



        // 현재 날짜 기준으로 이번 달의 일별 예약 데이터 조회

        java.time.LocalDate now = java.time.LocalDate.now();

        java.time.LocalDate startOfMonth = now.withDayOfMonth(1);

        java.time.LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        

        // 이번 달 시작과 끝의 LocalDateTime 생성

        java.time.LocalDateTime startDateTime = startOfMonth.atStartOfDay();

        java.time.LocalDateTime endDateTime = endOfMonth.atTime(23, 59, 59);

        

        System.out.println("=== 예약 차트 데이터 디버깅 ===");

        System.out.println("업체 ID: " + company.getCompanyId());

        System.out.println("업체명: " + company.getCompanyName());

        System.out.println("조회 기간 (created_at): " + startDateTime + " ~ " + endDateTime);

        

        // 이번 달의 모든 예약 조회 (created_at 기준)

        List<Reservation> monthReservations = reservationRepo.findByCompanyAndCreatedAtBetween(company, startDateTime, endDateTime);

        System.out.println("조회된 예약 수: " + monthReservations.size());

        

        // 일별 데이터 집계

        List<String> days = new ArrayList<>();

        List<Integer> dailyReservations = new ArrayList<>();

        

        // 이번 달의 모든 날짜에 대해 예약 수 집계 (1일부터 오늘까지)

        for (int day = 1; day <= now.getDayOfMonth(); day++) {

            java.time.LocalDate date = now.withDayOfMonth(day);

            days.add(day + "일");

            

            // 해당 날짜에 생성된 예약 수 계산 (created_at 기준)

            long count = monthReservations.stream()

                .filter(r -> r.getCreatedAt() != null && r.getCreatedAt().toLocalDate().equals(date))

                .count();

            

            if (count > 0) {

                System.out.println(day + "일 예약 생성 수: " + count);

            }

            

            dailyReservations.add((int) count);

        }

        

        System.out.println("최종 예약 데이터: " + dailyReservations);

        System.out.println("===============================");

        

        chartData.put("days", days);

        chartData.put("reservations", dailyReservations);

        chartData.put("currentMonth", now.getMonthValue() + "월");



        return chartData;

    }



    private List<Map<String, Object>> getCompanyReviews() {

        List<Map<String, Object>> reviews = new ArrayList<>();



        // 브이라인 리프팅 리뷰

        Map<String, Object> review1 = new HashMap<>();

        review1.put("name", "브이라인 리프팅");

        review1.put("productId", "PN0001265");

        review1.put("rating", "4.8★(288)");

        review1.put("price", "290,000원");

        review1.put("text", "한국어 리뷰 텍스트...\nEnglish review text...\n일본어 리뷰 텍스트...");

        reviews.add(review1);



        // 울쎄라피 프라임 리뷰

        Map<String, Object> review2 = new HashMap<>();

        review2.put("name", "울쎄라피 프라임");

        review2.put("productId", "PN0001265");

        review2.put("rating", "4.9★(140)");

        review2.put("price", "1,290,000원");

        review2.put("text", "한국어 리뷰 텍스트...\nEnglish review text...\n일본어 리뷰 텍스트...");

        reviews.add(review2);



        // 힝거 어깨필러 리뷰

        Map<String, Object> review3 = new HashMap<>();

        review3.put("name", "힝거 어깨필러");

        review3.put("productId", "PN0001265");

        review3.put("rating", "4.9★(49)");

        review3.put("price", "1,100,000원");

        review3.put("text", "일본어 리뷰 텍스트...\n한국어 리뷰 텍스트...");

        reviews.add(review3);



        return reviews;

    }



    private List<Map<String, Object>> getPopularEvents(Integer companyId) {

        List<Map<String, Object>> services = new ArrayList<>();



        try {

            if (companyId == null) {

                System.err.println("companyId가 null입니다. 인기 서비스를 조회할 수 없습니다.");

                return services;

            }



            System.out.println("=== 인기 서비스 조회 시작 ===");

            System.out.println("업체 ID: " + companyId);



            // DB에서 예약 수 기준 인기 서비스 조회 (상위 5개)

            List<Object[]> topServices = reservationRepo.findTopServicesByCompany(companyId, 5);

            System.out.println("조회된 인기 서비스 수: " + topServices.size());



            for (Object[] row : topServices) {

                String serviceName = (String) row[0];

                Long reservationCount = ((Number) row[1]).longValue();

                BigDecimal avgPrice = row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO;



                Map<String, Object> service = new HashMap<>();

                service.put("name", serviceName);

                service.put("price", String.format("%,d원", avgPrice.intValue()));

                service.put("count", reservationCount + "건");

                service.put("trend", "up"); // 예약 수만 표시하므로 trend는 up으로 고정



                services.add(service);



                System.out.println("서비스명: " + serviceName + ", 예약수: " + reservationCount + ", 평균가격: " + avgPrice);

            }



            System.out.println("===============================");



        } catch (Exception e) {

            System.err.println("인기 서비스 조회 실패: " + e.getMessage());

            e.printStackTrace();

        }



        return services;

    }



    private List<Map<String, Object>> getMedicalServices() {

        List<Map<String, Object>> services = new ArrayList<>();



        // 브이라인 리프팅 1

        Map<String, Object> service1 = new HashMap<>();

        service1.put("productCode", "PN0001265");

        service1.put("name", "브이라인 리프팅");

        service1.put("rating", "4.8★(288)");

        service1.put("eventPrice", "이벤트 가 290,000원");

        service1.put("category", "lifting");

        services.add(service1);



        // 브이라인 리프팅 2

        Map<String, Object> service2 = new HashMap<>();

        service2.put("productCode", "PN0001265");

        service2.put("name", "브이라인 리프팅");

        service2.put("rating", "4.9★(140)");

        service2.put("eventPrice", "이벤트 가 1,290,000원");

        service2.put("category", "lifting");

        services.add(service2);



        // 브이라인 리프팅 3

        Map<String, Object> service3 = new HashMap<>();

        service3.put("productCode", "PN0001265");

        service3.put("name", "브이라인 리프팅");

        service3.put("rating", "4.9★(49)");

        service3.put("eventPrice", "이벤트 가 1,100,000원");

        service3.put("category", "lifting");

        services.add(service3);



        // 모공주사

        Map<String, Object> service4 = new HashMap<>();

        service4.put("productCode", "PN0001265");

        service4.put("name", "모공주사");

        service4.put("rating", "4.9★(128)");

        service4.put("eventPrice", "이벤트 가 380,000원");

        service4.put("category", "pore");

        services.add(service4);



        return services;

    }



    private List<Map<String, Object>> getInquiries() {

        List<Map<String, Object>> inquiries = new ArrayList<>();



        // 김민수 문의

        Map<String, Object> inquiry1 = new HashMap<>();

        inquiry1.put("id", 1);

        inquiry1.put("userName", "김민수");

        inquiry1.put("time", "2분 전");

        inquiry1.put("preview", "안녕하세요. 브이라인 리프팅에 대해 문의드립니다. 가격과 시술 시간이 궁금합니다.");

        inquiry1.put("status", "new");

        inquiry1.put("unreadCount", 3);

        inquiries.add(inquiry1);



        // 이영희 문의

        Map<String, Object> inquiry2 = new HashMap<>();

        inquiry2.put("id", 2);

        inquiry2.put("userName", "이영희");

        inquiry2.put("time", "1시간 전");

        inquiry2.put("preview", "예약 변경 요청드립니다. 다음 주로 연기하고 싶습니다.");

        inquiry2.put("status", "in-progress");

        inquiry2.put("unreadCount", 0);

        inquiries.add(inquiry2);



        // 박준호 문의

        Map<String, Object> inquiry3 = new HashMap<>();

        inquiry3.put("id", 3);

        inquiry3.put("userName", "박준호");

        inquiry3.put("time", "3시간 전");

        inquiry3.put("preview", "시술 후 주의사항에 대해 알려주세요.");

        inquiry3.put("status", "resolved");

        inquiry3.put("unreadCount", 0);

        inquiries.add(inquiry3);



        // 최수진 문의

        Map<String, Object> inquiry4 = new HashMap<>();

        inquiry4.put("id", 4);

        inquiry4.put("userName", "최수진");

        inquiry4.put("time", "1일 전");

        inquiry4.put("preview", "울쎄라피 시술에 대해 상담받고 싶습니다.");

        inquiry4.put("status", "new");

        inquiry4.put("unreadCount", 1);

        inquiries.add(inquiry4);



        // 정다은 문의

        Map<String, Object> inquiry5 = new HashMap<>();

        inquiry5.put("id", 5);

        inquiry5.put("userName", "정다은");

        inquiry5.put("time", "2일 전");

        inquiry5.put("preview", "예약 취소 요청드립니다.");

        inquiry5.put("status", "in-progress");

        inquiry5.put("unreadCount", 0);

        inquiries.add(inquiry5);



        return inquiries;

    }



    private List<Map<String, Object>> getInquiryReports() {

        List<Map<String, Object>> reports = new ArrayList<>();



        // 시술 후 부작용 문의

        Map<String, Object> report1 = new HashMap<>();

        report1.put("id", 1);

        report1.put("type", "inquiry");

        report1.put("title", "시술 후 부작용 문의");

        report1.put("reporterName", "김민수");

        report1.put("reporterPhone", "010-1234-5678");

        report1.put("reporterEmail", "kim@example.com");

        report1.put("description", "브이라인 리프팅 시술을 받은 후 얼굴이 부어오르고 통증이 있습니다. 정상적인 반응인지 확인하고 싶습니다.");

        report1.put("status", "pending");

        report1.put("priority", "high");

        report1.put("createdDate", "2024-01-15 14:30");

        reports.add(report1);



        // 의료진 태도 문제 신고

        Map<String, Object> report2 = new HashMap<>();

        report2.put("id", 2);

        report2.put("type", "report");

        report2.put("title", "의료진 태도 문제 신고");

        report2.put("reporterName", "이영희");

        report2.put("reporterPhone", "010-2345-6789");

        report2.put("reporterEmail", "lee@example.com");

        report2.put("description", "시술 중 의료진이 불친절하고 무성의한 태도로 시술을 진행했습니다. 환자에 대한 기본적인 예의가 부족했습니다.");

        report2.put("status", "processing");

        report2.put("priority", "medium");

        report2.put("createdDate", "2024-01-14 16:45");

        reports.add(report2);



        // 예약 변경 요청

        Map<String, Object> report3 = new HashMap<>();

        report3.put("id", 3);

        report3.put("type", "inquiry");

        report3.put("title", "예약 변경 요청");

        report3.put("reporterName", "박준호");

        report3.put("reporterPhone", "010-3456-7890");

        report3.put("reporterEmail", "park@example.com");

        report3.put("description", "개인 사정으로 인해 예약된 시술 일정을 다음 주로 변경하고 싶습니다. 가능한지 확인 부탁드립니다.");

        report3.put("status", "resolved");

        report3.put("priority", "low");

        report3.put("createdDate", "2024-01-13 10:20");

        reports.add(report3);



        // 시설 청결도 문제 신고

        Map<String, Object> report4 = new HashMap<>();

        report4.put("id", 4);

        report4.put("type", "report");

        report4.put("title", "시설 청결도 문제 신고");

        report4.put("reporterName", "최수진");

        report4.put("reporterPhone", "010-4567-8901");

        report4.put("reporterEmail", "choi@example.com");

        report4.put("description", "병원 내부 시설이 불결하고 위생상 문제가 있다고 생각됩니다. 정기적인 청소와 소독이 필요합니다.");

        report4.put("status", "rejected");

        report4.put("priority", "medium");

        report4.put("createdDate", "2024-01-12 09:15");

        reports.add(report4);



        // 시술 비용 환불 요청

        Map<String, Object> report5 = new HashMap<>();

        report5.put("id", 5);

        report5.put("type", "inquiry");

        report5.put("title", "시술 비용 환불 요청");

        report5.put("reporterName", "정다은");

        report5.put("reporterPhone", "010-5678-9012");

        report5.put("reporterEmail", "jung@example.com");

        report5.put("description", "시술 결과가 만족스럽지 않아 환불을 요청합니다. 계약서에 명시된 환불 정책에 따라 처리해주세요.");

        report5.put("status", "pending");

        report5.put("priority", "high");

        report5.put("createdDate", "2024-01-11 15:30");

        reports.add(report5);



        return reports;

    }



    private Map<String, Object> getInquiryReportById(Long id) {

        // 실제로는 DB에서 조회해야 함

        List<Map<String, Object>> reports = getInquiryReports();



        return reports.stream()

                .filter(report -> report.get("id").equals(id.intValue()))

                .findFirst()

                .orElse(new HashMap<>());

    }



    private List<Map<String, Object>> getHelpRequests() {

        List<Map<String, Object>> requests = new ArrayList<>();

        

        // DB에서 업체의 문의/요청 내역 조회

        // 임시로 더미 데이터 사용 (실제로는 세션에서 companyId 가져와서 DB 조회)

        

        return requests;

    }

    

    private List<Map<String, Object>> getHelpRequestsByCompanyId(Integer companyId) {

        List<Map<String, Object>> requests = new ArrayList<>();

        

        try {

            if (companyId == null) {

                System.out.println("getHelpRequestsByCompanyId: companyId is null");
                return requests;

            }

            System.out.println("getHelpRequestsByCompanyId: companyId = " + companyId);

            // 디버깅: 전체 문의 조회
            List<UserInquiry> allInquiries = userInquiryService.getAdminPagedList(1, 1000, null).getContent();
            System.out.println("전체 문의 수: " + allInquiries.size());
            for (UserInquiry inquiry : allInquiries) {
                System.out.println("전체 문의 - ID: " + inquiry.getInquiryId() + 
                                 ", reporterCompanyId: " + inquiry.getReporterCompanyId() + 
                                 ", reporterType: " + inquiry.getReporterType() + 
                                 ", subject: " + inquiry.getSubject());
            }

            // DB에서 해당 업체의 문의/요청 조회 (직접 repository 사용)
            List<UserInquiry> inquiries = userInquiryRepository.findAll().stream()
                .filter(inquiry -> inquiry.getReporterId() != null && 
                                 inquiry.getReporterId().equals(companyId) && 
                                 inquiry.getReporterType() == UserInquiry.ReporterType.COMPANY)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(java.util.stream.Collectors.toList());
            
            System.out.println("getHelpRequestsByCompanyId: found " + inquiries.size() + " inquiries");

            

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            

            // RequestType을 한글로 매핑

            Map<String, String> typeMap = new HashMap<>();

            typeMap.put("PROMOTION", "프로모션");

            typeMap.put("CUSTOMER_REPORT", "고객신고");

            typeMap.put("TECH_SUPPORT", "기술지원");

            typeMap.put("SETTLEMENT", "정산");

            typeMap.put("ACCOUNT", "계정관리");

            typeMap.put("OTHER", "기타");

            

            // Status를 한글로 매핑

            Map<String, String> statusMap = new HashMap<>();

            statusMap.put("OPEN", "처리중");

            statusMap.put("ANSWERED", "완료");

            statusMap.put("CLOSED", "반려");

            

            // Priority를 한글로 매핑

            Map<String, String> priorityMap = new HashMap<>();

            priorityMap.put("NORMAL", "일반");

            priorityMap.put("URGENT", "긴급");

            

            for (UserInquiry inquiry : inquiries) {

                Map<String, Object> request = new HashMap<>();

                request.put("id", inquiry.getInquiryId());

                request.put("title", inquiry.getSubject());

                request.put("type", inquiry.getRequestType() != null ? 

                    typeMap.getOrDefault(inquiry.getRequestType().name(), "기타") : "기타");

                request.put("status", inquiry.getStatus() != null ? 

                    statusMap.getOrDefault(inquiry.getStatus().name(), "처리중") : "처리중");

                request.put("priority", inquiry.getPriority() != null ? 

                    priorityMap.getOrDefault(inquiry.getPriority().name(), "일반") : "일반");

                request.put("createdDate", inquiry.getCreatedAt() != null ? 

                    inquiry.getCreatedAt().format(formatter) : "-");

                request.put("answeredDate", inquiry.getAnsweredAt() != null ? 

                    inquiry.getAnsweredAt().format(formatter) : null);

                request.put("content", inquiry.getContent());

                request.put("attachment", inquiry.getAttachmentPath());

                request.put("adminAnswer", inquiry.getAdminAnswer());

                

                requests.add(request);

            }

        } catch (Exception e) {

            System.err.println("업체 요청 목록 조회 실패: " + e.getMessage());

            e.printStackTrace();

        }

        

        return requests;

    }



    private Map<String, Object> getHelpRequestById(Long id) {

        // 실제로는 DB에서 조회해야 함

        List<Map<String, Object>> requests = getHelpRequests();



        return requests.stream()

                .filter(request -> request.get("id").equals(id.intValue()))

                .findFirst()

                .orElse(new HashMap<>());

    }



    private List<Map<String, Object>> getPlacementRequests() {

        List<Map<String, Object>> placements = new ArrayList<>();



        Map<String, Object> p1 = new HashMap<>();

        p1.put("id", 1);

        p1.put("title", "브이라인 리프팅 홈 배너");

        p1.put("slot", "홈 히어로");

        p1.put("target", "브이라인 리프팅");

        p1.put("startDate", "2025-10-01");

        p1.put("endDate", "2025-10-31");

        p1.put("status", "승인완료");

        p1.put("priority", "높음");

        p1.put("clicks", 2450);

        placements.add(p1);



        Map<String, Object> p2 = new HashMap<>();

        p2.put("id", 2);

        p2.put("title", "울쎄라피 카테고리 노출");

        p2.put("slot", "카테고리");

        p2.put("target", "울쎄라피 프라임");

        p2.put("startDate", "2025-10-10");

        p2.put("endDate", "2025-11-10");

        p2.put("status", "대기중");

        p2.put("priority", "보통");

        p2.put("clicks", 0);

        placements.add(p2);



        return placements;

    }



    private List<Map<String, Object>> getCoupons() {

        List<Map<String, Object>> coupons = new ArrayList<>();



        Map<String, Object> c1 = new HashMap<>();

        c1.put("id", 1);

        c1.put("name", "가을맞이 10% 할인");

        c1.put("type", "정율");

        c1.put("discount", "10%");

        c1.put("target", "전체 서비스");

        c1.put("validUntil", "2025-10-31");

        c1.put("issued", 500);

        c1.put("used", 87);

        c1.put("status", "진행중");

        coupons.add(c1);



        Map<String, Object> c2 = new HashMap<>();

        c2.put("id", 2);

        c2.put("name", "첫 방문 20,000원 할인");

        c2.put("type", "정액");

        c2.put("discount", "20,000원");

        c2.put("target", "첫 구매 고객");

        c2.put("validUntil", "2025-12-31");

        c2.put("issued", 1000);

        c2.put("used", 234);

        c2.put("status", "진행중");

        coupons.add(c2);



        return coupons;

    }

    // ===== 마케팅 메시지 발송 API =====

    /**
     * 메시지 발송 요청 API
     */
    @PostMapping("/api/marketing/message/send")
    @ResponseBody
    public ResponseEntity<?> sendMarketingMessage(@RequestBody Map<String, String> request, HttpSession session) {
        try {
            Integer companyId = (Integer) session.getAttribute("companyId");
            if (companyId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));
            }

            System.out.println("===== 마케팅 메시지 발송 요청 =====");
            System.out.println("companyId: " + companyId);
            System.out.println("request: " + request);

            // 요청 데이터 파싱
            String targetSegment = request.getOrDefault("targetSegment", "ALL");
            String targetChannel = request.getOrDefault("targetChannel", "PUSH");
            String title = request.get("title");
            String content = request.get("content");
            String linkUrl = request.get("linkUrl");
            String sendType = request.getOrDefault("sendType", "IMMEDIATE");
            String scheduledAt = request.get("scheduledAt");

            // 필수 값 검증
            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "제목을 입력해주세요."));
            }
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "내용을 입력해주세요."));
            }

            // MarketingMessage 엔티티 생성
            MarketingMessage message = MarketingMessage.builder()
                .targetSegment(MarketingMessage.TargetSegment.valueOf(targetSegment))
                .targetChannel(MarketingMessage.TargetChannel.valueOf(targetChannel))
                .title(title)
                .content(content)
                .linkUrl(linkUrl)
                .sendType(MarketingMessage.SendType.valueOf(sendType))
                .build();

            // 예약 발송인 경우 시간 설정
            if ("SCHEDULED".equals(sendType) && scheduledAt != null) {
                message.setScheduledAt(java.time.LocalDateTime.parse(scheduledAt));
            }

            // 메시지 발송
            MarketingMessage savedMessage = marketingMessageService.sendMessage(companyId, message);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "messageId", savedMessage.getMessageId(),
                "status", savedMessage.getStatus().name(),
                "targetCount", savedMessage.getTargetCount(),
                "message", "메시지가 발송되었습니다."
            ));

        } catch (Exception e) {
            System.err.println("메시지 발송 에러: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "발송 실패: " + e.getMessage()));
        }
    }

    /**
     * 업체별 메시지 발송 내역 조회 API
     */
    @GetMapping("/api/marketing/messages")
    @ResponseBody
    public ResponseEntity<?> getMarketingMessages(HttpSession session) {
        try {
            Integer companyId = (Integer) session.getAttribute("companyId");
            if (companyId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));
            }

            List<MarketingMessage> messages = marketingMessageService.getMessagesByCompany(companyId);
            return ResponseEntity.ok(messages);

        } catch (Exception e) {
            System.err.println("메시지 목록 조회 에러: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "조회 실패: " + e.getMessage()));
        }
    }

}