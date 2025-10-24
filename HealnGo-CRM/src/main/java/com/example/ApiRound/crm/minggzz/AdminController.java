package com.example.ApiRound.crm.minggzz;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.ApiRound.Service.UserInquiryService;
import com.example.ApiRound.crm.hyeonah.Repository.CompanyUserRepository;
import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;
import com.example.ApiRound.crm.hyeonah.notice.Notice;
import com.example.ApiRound.crm.hyeonah.notice.NoticeService;
import com.example.ApiRound.crm.yoyo.reservation.ReservationRepository;
import com.example.ApiRound.entity.AdminEvent;
import com.example.ApiRound.entity.Marketing;
import com.example.ApiRound.entity.UserInquiry;
import com.example.ApiRound.repository.AdminEventRepository;
import com.example.ApiRound.repository.MarketingRepository;
import com.example.ApiRound.repository.UserInquiryRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final SocialUsersRepository usersRepo;
    private final CompanyUserRepository companyRepo;
    private final ReservationRepository reservationRepo;
    private final NoticeService noticeService;
    private final UserInquiryService userInquiryService;
    private final UserInquiryRepository userInquiryRepository;
    private final AdminEventRepository adminEventRepository;
    private final MarketingRepository marketingRepository;

    /**
     * 관리자 대시보드 메인 페이지
     */
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        // 세션 체크: 관리자로 로그인한 사용자만 접근 가능
        Object managerIdObj = session.getAttribute("managerId");
        Long managerId = null;
        if (managerIdObj instanceof Integer integer) {
            managerId = integer.longValue();
        } else if (managerIdObj instanceof Long longValue) {
            managerId = longValue;
        }
        String userType = (String) session.getAttribute("userType");
        
        if (managerId == null || !"manager".equals(userType)) {
            return "redirect:/crm/crm_login";
        }
        
        // 관리자 정보 추가
        model.addAttribute("managerId", managerId);
        model.addAttribute("managerName", session.getAttribute("managerName"));
        model.addAttribute("managerEmail", session.getAttribute("managerEmail"));

        // 실제 DB 통계 데이터
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", usersRepo.countByIsDeletedFalse());
        stats.put("activeUsers", usersRepo.countByStatusAndIsDeletedFalse("ACTIVE"));
        stats.put("suspendedUsers", usersRepo.countByStatusAndIsDeletedFalse("SUSPENDED"));
        stats.put("totalCompanies", companyRepo.count());
        stats.put("totalReservations", 0); // TODO: 예약 테이블 연동
        stats.put("totalRevenue", 0); // TODO: 결제 테이블 연동

        // 월별 가입자 데이터 (1월~12월) - 실제 DB 데이터 사용
        List<Map<String, Object>> monthlyData = getMonthlyUserData();
        stats.put("monthlyData", monthlyData);

        stats.put("totalUsers", usersRepo.countByIsDeletedFalse());
        stats.put("activeUsers", usersRepo.countByStatusAndIsDeletedFalse("ACTIVE"));
        stats.put("suspendedUsers", usersRepo.countByStatusAndIsDeletedFalse("SUSPENDED"));

        // 업체 관련 통계 - 실제 DB 데이터 사용
        stats.put("totalCompanies", companyRepo.countByApprovalStatus("APPROVED")); // 승인된 업체 수
        stats.put("newThisMonth", companyRepo.countNewCompaniesThisMonth(
                java.time.LocalDate.now().getYear(),
                java.time.LocalDate.now().getMonthValue()
        )); // 이번 달 신규 업체 수
        stats.put("reportsReceived", companyRepo.countByApprovalStatus("REPORTED")); // 신고 접수된 업체 수
        stats.put("underSanction", companyRepo.countByApprovalStatusAndIsActive("SUSPENDED", true)); // 제재 중인 업체 수

        stats.put("totalReservations", 0); // TODO: 예약 테이블 연동
        stats.put("totalRevenue", 0); // TODO: 결제 테이블 연동

        model.addAttribute("stats", stats);
        
        // 최근 활동 데이터
        List<Map<String, Object>> recentActivities = getRecentActivities();
        model.addAttribute("recentActivities", recentActivities);
        
        // 차트 데이터
        Map<String, Object> chartData = getChartData();
        model.addAttribute("chartData", chartData);
        
        // 최근 문의/신고 데이터 (실제 DB에서 조회)
        try {
            Page<UserInquiry> recentInquiriesPage = userInquiryService.getAdminPagedList(1, 5, null);
            model.addAttribute("recentInquiries", recentInquiriesPage.getContent());
        } catch (Exception e) {
            System.err.println("최근 문의/신고 조회 실패: " + e.getMessage());
            model.addAttribute("recentInquiries", new ArrayList<>());
        }

        // 예약 많은 순으로 업체 리스트 (상위 5개)
        List<Map<String, Object>> topCompanies = getTopCompaniesByReservations();
        model.addAttribute("topCompanies", topCompanies);

        return "admin/admin";
    }

    /**
     * 사용자 관리 페이지
     * DB연동, 검색, 정렬, 페이지네이션
     */
    @GetMapping("/users")
    public String users(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) String statusFilter,
            @RequestParam(required = false, defaultValue = "createdAt") String sort,
            @RequestParam(required = false, defaultValue = "desc") String dir,
            Model model, HttpSession session) {

        model.addAttribute("managerName", session.getAttribute("managerName"));

        // 페이지(0based), 사이즈(안전 범위) 보정
        int pageIdx = Math.max(page, 1) - 1;
        int pageSize = Math.min(Math.max(size, 1), 100);

        // UI 정렬 키 > 엔티티 필드 매핑
        String sortProp = switch (sort) {
            case "name" -> "name";
            case "email" -> "email";
            case "joinDate" -> "createdAt";
            default -> "createdAt";
        };

        // Sort 생성
        Sort sortOrder = "asc".equalsIgnoreCase(dir)
                ? Sort.by(sortProp).ascending()
                : Sort.by(sortProp).descending();

        Pageable pageable = PageRequest.of(pageIdx, pageSize, sortOrder);

        // DB에서 사용자 조회 (검색 + 상태 필터)
        Page<SocialUsers> userPage;
        
        if (search != null && !search.trim().isEmpty() && statusFilter != null && !statusFilter.isEmpty()) {
            // 검색 + 상태 필터
            userPage = usersRepo.searchActiveByStatus(search.trim(), statusFilter, pageable);
        } else if (search != null && !search.trim().isEmpty()) {
            // 검색만
            userPage = usersRepo.searchActive(search.trim(), pageable);
        } else if (statusFilter != null && !statusFilter.isEmpty()) {
            // 상태 필터만
            userPage = usersRepo.findByStatusAndIsDeletedFalse(statusFilter, pageable);
        } else {
            // 전체 조회
            userPage = usersRepo.findByIsDeletedFalse(pageable);
        }

        // SocialUsers를 Map으로 변환 (HTML에서 사용하기 쉽게)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<Map<String, Object>> users = userPage.getContent().stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getUserId());
                    map.put("name", user.getName() != null ? user.getName() : "-");
                    map.put("email", user.getEmail());
                    map.put("phone", user.getPhone());
                    map.put("joinDate", user.getCreatedAt() != null ? user.getCreatedAt().format(formatter) : "-");
                    map.put("status", getStatusLabel(user.getStatus(), user.getIsDeleted()));
                    return map;
                })
                .toList();

        model.addAttribute("users", users);

        // 페이지네이션 정보
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", userPage.getTotalPages());
        model.addAttribute("totalUsers", userPage.getTotalElements());
        model.addAttribute("search", search);
        model.addAttribute("statusFilter", statusFilter);
        model.addAttribute("sortBy", sort);
        model.addAttribute("sortDir", dir);

        return "admin/users";
    }

    /**
     * 이벤트/프로모션 관리 페이지
     */
    @GetMapping("/event-promotion")
    public String eventPromotion(
            @RequestParam(value = "status", required = false) String status,
            Model model, HttpSession session) {

        model.addAttribute("managerName", session.getAttribute("managerName"));

        // 노출 요청 (admin_event) 목록 조회
        List<AdminEvent> placements;
        if (status != null && !status.isEmpty()) {
            try {
                AdminEvent.ApprovalStatus approvalStatus = AdminEvent.ApprovalStatus.valueOf(status.toUpperCase());
                placements = adminEventRepository.findByApprovalStatusOrderByCreatedAtDesc(approvalStatus);
            } catch (Exception e) {
                placements = adminEventRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            placements = adminEventRepository.findAllByOrderByCreatedAtDesc();
        }

        // 쿠폰 (marketing) 목록 조회
        List<Marketing> coupons;
        if (status != null && !status.isEmpty()) {
            try {
                Marketing.ApprovalStatus approvalStatus = Marketing.ApprovalStatus.valueOf(status.toUpperCase());
                coupons = marketingRepository.findByApprovalStatusOrderByCreatedAtDesc(approvalStatus);
            } catch (Exception e) {
                coupons = marketingRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            coupons = marketingRepository.findAllByOrderByCreatedAtDesc();
        }

        // 통계 계산
        long totalRequests = placements.size() + coupons.size();
        long pendingCount = placements.stream().filter(p -> p.getApprovalStatus() == AdminEvent.ApprovalStatus.PENDING).count()
                          + coupons.stream().filter(c -> c.getApprovalStatus() == Marketing.ApprovalStatus.PENDING).count();
        long approvedCount = placements.stream().filter(p -> p.getApprovalStatus() == AdminEvent.ApprovalStatus.APPROVED).count()
                           + coupons.stream().filter(c -> c.getApprovalStatus() == Marketing.ApprovalStatus.APPROVED).count();
        long rejectedCount = placements.stream().filter(p -> p.getApprovalStatus() == AdminEvent.ApprovalStatus.REJECTED).count()
                           + coupons.stream().filter(c -> c.getApprovalStatus() == Marketing.ApprovalStatus.REJECTED).count();

        model.addAttribute("placements", placements);
        model.addAttribute("coupons", coupons);
        model.addAttribute("totalRequests", totalRequests);
        model.addAttribute("pendingCount", pendingCount);
        model.addAttribute("approvedCount", approvedCount);
        model.addAttribute("rejectedCount", rejectedCount);
        model.addAttribute("selectedStatus", status);

        return "admin/event_promotion";
    }

    /**
     * Placement 승인 API
     */
    @PostMapping("/api/placement/{id}/approve")
    @ResponseBody
    public ResponseEntity<?> approvePlacement(@PathVariable Integer id, HttpSession session) {
        try {
            Integer managerId = (Integer) session.getAttribute("managerId");
            if (managerId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));
            }

            AdminEvent event = adminEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("항목을 찾을 수 없습니다."));

            event.setApprovalStatus(AdminEvent.ApprovalStatus.APPROVED);
            event.setApprovedAt(LocalDateTime.now());
            event.setApprovedBy(managerId);

            adminEventRepository.save(event);

            return ResponseEntity.ok(Map.of("success", true, "message", "승인되었습니다."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "승인 실패: " + e.getMessage()));
        }
    }

    /**
     * Placement 거부 API
     */
    @PostMapping("/api/placement/{id}/reject")
    @ResponseBody
    public ResponseEntity<?> rejectPlacement(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body,
            HttpSession session) {
        try {
            Integer managerId = (Integer) session.getAttribute("managerId");
            if (managerId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));
            }

            AdminEvent event = adminEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("항목을 찾을 수 없습니다."));

            event.setApprovalStatus(AdminEvent.ApprovalStatus.REJECTED);
            event.setRejectReason(body.get("reason"));

            adminEventRepository.save(event);

            return ResponseEntity.ok(Map.of("success", true, "message", "반려되었습니다."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "반려 실패: " + e.getMessage()));
        }
    }

    /**
     * Coupon 승인 API
     */
    @PostMapping("/api/coupon/{id}/approve")
    @ResponseBody
    public ResponseEntity<?> approveCoupon(@PathVariable Integer id, HttpSession session) {
        try {
            Integer managerId = (Integer) session.getAttribute("managerId");
            if (managerId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));
            }

            Marketing marketing = marketingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("항목을 찾을 수 없습니다."));

            marketing.setApprovalStatus(Marketing.ApprovalStatus.APPROVED);
            marketing.setApprovedAt(LocalDateTime.now());
            marketing.setApprovedBy(managerId);

            marketingRepository.save(marketing);

            return ResponseEntity.ok(Map.of("success", true, "message", "승인되었습니다."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "승인 실패: " + e.getMessage()));
        }
    }

    /**
     * Coupon 거부 API
     */
    @PostMapping("/api/coupon/{id}/reject")
    @ResponseBody
    public ResponseEntity<?> rejectCoupon(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body,
            HttpSession session) {
        try {
            Integer managerId = (Integer) session.getAttribute("managerId");
            if (managerId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "로그인이 필요합니다."));
            }

            Marketing marketing = marketingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("항목을 찾을 수 없습니다."));

            marketing.setApprovalStatus(Marketing.ApprovalStatus.REJECTED);
            marketing.setRejectReason(body.get("reason"));

            marketingRepository.save(marketing);

            return ResponseEntity.ok(Map.of("success", true, "message", "반려되었습니다."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "반려 실패: " + e.getMessage()));
        }
    }


    /**
     * 예약 관리 페이지
     */
    @GetMapping("/reservations")
    public String reservations(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", required = false) String search,
            Model model, HttpSession session) {

        model.addAttribute("managerName", session.getAttribute("managerName"));

        // 예약 목록 데이터 (실제로는 서비스에서 가져와야 함)
        List<Map<String, Object>> reservations = getReservations(page, size, search);
        model.addAttribute("reservations", reservations);

        // 페이지네이션 정보
        int totalReservations = 320; // 실제로는 DB에서 조회
        int totalPages = (int) Math.ceil((double) totalReservations / size);

        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("totalReservations", totalReservations);
        model.addAttribute("search", search);

        return "admin/reservations";
    }

    /**
     * 리포트 & 통계 페이지
     */
    @GetMapping("/report")
    public String report(Model model, HttpSession session) {
        model.addAttribute("managerName", session.getAttribute("managerName"));

        // 통계 데이터 (실제로는 서비스에서 가져와야 함)
        Map<String, Object> reportStats = new HashMap<>();
        reportStats.put("totalRevenue", 0);
        reportStats.put("totalReservations", 0);
        reportStats.put("totalUsers", 0);
        model.addAttribute("reportStats", reportStats);

        return "admin/report";
    }

    /**
     * 문의/신고 접수 페이지 (관리자용)
     */
    @GetMapping("/inquiry-report")
    public String inquiryReport(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "status", required = false) String status,
            Model model, HttpSession session) {

        model.addAttribute("managerName", session.getAttribute("managerName"));

        try {
            // 실제 DB에서 문의/신고 목록 조회
            Page<UserInquiry> inquiryPage = userInquiryService.getAdminPagedList(page, size, status, type);
            model.addAttribute("reports", inquiryPage.getContent());

            // 페이지네이션 정보
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", inquiryPage.getTotalPages());
            model.addAttribute("totalReports", inquiryPage.getTotalElements());
            model.addAttribute("search", search);
            model.addAttribute("type", type);
            model.addAttribute("status", status);
            model.addAttribute("sidebarType", "admin");

            return "admin/inquiry_report";
        } catch (Exception e) {
            System.err.println("문의/신고 목록 조회 실패: " + e.getMessage());
            model.addAttribute("reports", new ArrayList<>());
            model.addAttribute("currentPage", 1);
            model.addAttribute("totalPages", 1);
            model.addAttribute("totalReports", 0);
            model.addAttribute("search", search);
            model.addAttribute("type", type);
            model.addAttribute("status", status);
            model.addAttribute("sidebarType", "admin");
            return "admin/inquiry_report";
        }
    }

    /**
     * 문의/신고 상세 페이지 (관리자용)
     */
    @GetMapping("/inquiry-report/detail/{id}")
    public String inquiryReportDetail(@PathVariable("id") Integer id, Model model, HttpSession session) {
        try {
            UserInquiry inquiry = userInquiryRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("문의/신고를 찾을 수 없습니다."));
            
            model.addAttribute("inquiry", inquiry);
            model.addAttribute("reportId", id);
            model.addAttribute("sidebarType", "admin");
            model.addAttribute("managerName", session.getAttribute("managerName"));

            return "crm/inquiry_detail";
        } catch (Exception e) {
            model.addAttribute("error", "문의/신고를 찾을 수 없습니다.");
            return "crm/inquiry_detail";
        }
    }

    /**
     * 문의/신고 상세 조회 API (관리자용)
     */
    @GetMapping("/api/inquiry-reports/{id}")
    @ResponseBody
    public ResponseEntity<UserInquiry> getInquiryDetail(@PathVariable Integer id) {
        try {
            UserInquiry inquiry = userInquiryRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("문의/신고를 찾을 수 없습니다."));

            return ResponseEntity.ok(inquiry);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 문의/신고 목록 조회 API (관리자용)
     */
    @GetMapping("/api/inquiry-reports")
    @ResponseBody
    public ResponseEntity<List<UserInquiry>> getAllInquiryReports(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "reporterType", required = false) String reporterType) {
        try {
            List<UserInquiry> inquiries = userInquiryService.getAdminPagedList(1, 100, status, reporterType).getContent();
            return ResponseEntity.ok(inquiries);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 문의/신고 상태 변경 API (관리자용)
     */
    @PostMapping("/api/inquiry-reports/{id}/status")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateInquiryStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        try {
            String newStatus = request.get("status");
            Object managerIdObj = session.getAttribute("managerId");
            Integer adminId = null;
            if (managerIdObj instanceof Integer integer) {
                adminId = integer;
            } else if (managerIdObj instanceof Long longValue) {
                adminId = longValue.intValue();
            }

            userInquiryService.updateStatus(id, newStatus, adminId);

            response.put("success", true);
            response.put("message", "상태가 변경되었습니다.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 문의/신고 답변 작성 API (관리자용)
     */
    @PostMapping("/api/inquiry-reports/{id}/reply")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> replyInquiry(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("===== 답변 작성 API 호출 =====");
            System.out.println("inquiry_id: " + id);
            System.out.println("request body: " + request);
            
            String replyText = request.get("reply");

            if (replyText == null || replyText.trim().isEmpty()) {
                System.out.println("답변 내용이 비어있음");
                response.put("success", false);
                response.put("message", "답변 내용을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            Object managerIdObj = session.getAttribute("managerId");
            Integer adminId = null;
            if (managerIdObj instanceof Integer integer) {
                adminId = integer;
            } else if (managerIdObj instanceof Long longValue) {
                adminId = longValue.intValue();
            }
            
            System.out.println("adminId: " + adminId);
            System.out.println("replyText: " + replyText);

            // adminId가 null이면 0으로 처리
            if (adminId == null) {
                System.out.println("adminId가 null, 0으로 처리");
                adminId = 0;
            }

            userInquiryService.answer(id, replyText, adminId);

            response.put("success", true);
            response.put("message", "답변이 전송되었습니다.");
            System.out.println("답변 전송 성공");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("답변 작성 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "답변 작성 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 임시 데이터 생성 메서드들 (실제로는 서비스에서 구현)
    private List<Map<String, Object>> getRecentActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();

        Map<String, Object> activity1 = new HashMap<>();
        activity1.put("type", "user_registration");
        activity1.put("message", "새 사용자가 가입했습니다");
        activity1.put("time", "2분 전");
        activity1.put("icon", "fas fa-user-plus");
        activities.add(activity1);

        Map<String, Object> activity2 = new HashMap<>();
        activity2.put("type", "reservation");
        activity2.put("message", "새로운 예약이 생성되었습니다");
        activity2.put("time", "5분 전");
        activity2.put("icon", "fas fa-calendar-plus");
        activities.add(activity2);
        
        Map<String, Object> activity3 = new HashMap<>();
        activity3.put("type", "company_approval");
        activity3.put("message", "업체 승인이 완료되었습니다");
        activity3.put("time", "10분 전");
        activity3.put("icon", "fas fa-building");
        activities.add(activity3);
        
        return activities;
    }

    private Map<String, Object> getChartData() {
        Map<String, Object> chartData = new HashMap<>();
        
        // 월별 사용자 증가 데이터
        List<Integer> userGrowth = List.of(120, 150, 180, 200, 220, 250);
        chartData.put("userGrowth", userGrowth);
        
        // 월별 예약 데이터
        List<Integer> reservationData = List.of(45, 60, 75, 90, 85, 95);
        chartData.put("reservations", reservationData);

        return chartData;
    }

    // 상태 레이블 헬퍼 메서드
    private String getStatusLabel(String status, Boolean isDeleted) {
        if (isDeleted != null && isDeleted) {
            return "비활성화";
        }
        if ("SUSPENDED".equals(status)) {
            return "정지";
        }
        return "활성";
    }

    private List<Map<String, Object>> getReservations(int page, int size, String search) {
        List<Map<String, Object>> reservations = new ArrayList<>();
        
        // 임시 예약 데이터
        String[] services = {"진료", "미용", "마사지", "치과진료", "한의진료"};
        
        for (int i = 1; i <= size; i++) {
            Map<String, Object> reservation = new HashMap<>();
            reservation.put("id", (page - 1) * size + i);
            reservation.put("userName", "고객" + i);
            reservation.put("companyName", "업체" + i);
            reservation.put("service", services[i % services.length]);
            reservation.put("date", "2024-01-" + String.format("%02d", i % 28 + 1));
            reservation.put("time", String.format("%02d:00", 9 + (i % 8)));
            reservation.put("status", i % 3 == 0 ? "완료" : i % 3 == 1 ? "예약" : "취소");
            reservation.put("amount", 50000 + (i * 10000));
            reservations.add(reservation);
        }
        
        return reservations;
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
        report1.put("companyName", "힝거 피부과");
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
        report2.put("companyName", "서울 성형외과");
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
        report3.put("companyName", "강남 치과");
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
        report4.put("companyName", "제주 한의원");
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
        report5.put("companyName", "부산 피부과");
        report5.put("description", "시술 결과가 만족스럽지 않아 환불을 요청합니다. 계약서에 명시된 환불 정책에 따라 처리해주세요.");
        report5.put("status", "pending");
        report5.put("priority", "high");
        report5.put("createdDate", "2024-01-11 15:30");
        reports.add(report5);
        
        return reports;
    }


    /**
     * 공지사항 & 알림 관리 페이지
     */
    @GetMapping("/notice-notify")
    public String noticeNotify(
            @RequestParam(defaultValue = "1") int page,
            Model model,
            HttpSession session) {

        // 다른 admin 페이지와 동일한 세션 처리
        model.addAttribute("managerName", session.getAttribute("managerName"));

        // 실제 공지사항 목록 조회 (페이지네이션)
        Pageable pageable = PageRequest.of(page - 1, 10);
        Page<Notice> noticePage = noticeService.getAllNotices(pageable);

        int totalPages = Math.max(noticePage.getTotalPages(), 1);
        int startPage = Math.max(1, page - 2);
        int endPage = Math.min(totalPages, page + 2);

        model.addAttribute("notices", noticePage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("totalCount", noticePage.getTotalElements());
        model.addAttribute("now", LocalDateTime.now()); // 현재 시각 추가

        // 알림 목록 (더미 데이터 - 나중에 구현)
        List<Map<String, Object>> notifications = getNotifications();
        model.addAttribute("notifications", notifications);

        // 알림 통계 (더미 데이터 - 나중에 구현)
        Map<String, Object> notifyStats = new HashMap<>();
        notifyStats.put("totalSent", 1234);
        notifyStats.put("delivered", 1180);
        notifyStats.put("pending", 54);
        notifyStats.put("failed", 12);
        model.addAttribute("notifyStats", notifyStats);
        
        return "admin/admin_notice_notify";
    }

    /**
     * 공지사항 작성 API
     */
    @PostMapping("/notice-notify/create")
    @ResponseBody
    public String createNotice(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(defaultValue = "ALL") String audience,
            @RequestParam(defaultValue = "false") Boolean topFixed,
            HttpSession session) {

        // 관리자 ID 가져오기
        Object managerIdObj = session.getAttribute("managerId");
        Integer managerId = null;
        if (managerIdObj instanceof Integer) {
            managerId = (Integer) managerIdObj;
        } else if (managerIdObj instanceof Long) {
            managerId = ((Long) managerIdObj).intValue();
        }

        if (managerId == null) {
            return "login_required";
        }

        try {
            Notice notice = new Notice();
            notice.setTitle(title);
            notice.setBody(content);
            notice.setAudience(Notice.Audience.valueOf(audience));
            notice.setIsPinned(topFixed);
            notice.setCreatedBy(managerId);
            notice.setPublishAt(LocalDateTime.now()); // 즉시 게시
            
            noticeService.createNotice(notice);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

    /**
     * 공지사항 수정 API
     */
    @PostMapping("/notice-notify/update")
    @ResponseBody
    public String updateNotice(
            @RequestParam Integer noticeId,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(defaultValue = "ALL") String audience,
            @RequestParam(defaultValue = "false") Boolean topFixed,
            HttpSession session) {

        // 관리자 권한 확인 (간단히)
        if (session.getAttribute("managerId") == null) {
            return "login_required";
        }

        try {
            Notice notice = noticeService.getNoticeById(noticeId);
            notice.setTitle(title);
            notice.setBody(content);
            notice.setAudience(Notice.Audience.valueOf(audience));
            notice.setIsPinned(topFixed);
            
            noticeService.updateNotice(notice);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

    /**
     * 공지사항 삭제 API
     */
    @PostMapping("/notice-notify/delete")
    @ResponseBody
    public String deleteNotice(
            @RequestParam Integer noticeId,
            HttpSession session) {

        // 관리자 권한 확인 (간단히)
        if (session.getAttribute("managerId") == null) {
            return "login_required";
        }

        try {
            noticeService.deleteNotice(noticeId);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }


    private List<Map<String, Object>> getNotifications() {
        List<Map<String, Object>> notifications = new ArrayList<>();
        
        Map<String, Object> notify1 = new HashMap<>();
        notify1.put("id", 1);
        notify1.put("title", "시스템 점검 안내");
        notify1.put("message", "금일 새벽 2시~4시 시스템 점검이 예정되어 있습니다.");
        notify1.put("type", "all");
        notify1.put("status", "sent");
        notify1.put("date", "2024-10-09 14:30");
        notify1.put("recipients", 5234);
        notifications.add(notify1);
        
        return notifications;
    }

    // ===== REST API 엔드포인트 =====
    
    /**
     * 사용자 상세 조회
     */
    @GetMapping("/api/users/{userId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getUserDetail(@PathVariable Integer userId) {
        return usersRepo.findById(userId)
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", user.getUserId());
                    response.put("name", user.getName() != null ? user.getName() : "-");
                    response.put("email", user.getEmail());
                    response.put("phone", user.getPhone() != null ? user.getPhone() : "");
                    response.put("joinDate", user.getCreatedAt() != null ?
                            user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : "-");
                    response.put("lastLogin", user.getLastLoginAt() != null ?
                            user.getLastLoginAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) : "정보 없음");
                    response.put("status", getStatusLabel(user.getStatus(), user.getIsDeleted()));
                    response.put("totalReservations", 0); // TODO: 예약 테이블과 연동
                    response.put("totalSpent", 0); // TODO: 결제 테이블과 연동
                    response.put("notes", ""); // TODO: 관리자 메모 기능

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 사용자 정보 수정
     */
    @PutMapping("/api/users/{userId}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> updateData) {
        
        return usersRepo.findByUserIdAndIsDeletedFalse(userId)
                .map(user -> {
                    // 수정 가능한 필드 업데이트
                    if (updateData.containsKey("name")) {
                        user.setName(updateData.get("name"));
                    }
                    if (updateData.containsKey("phone")) {
                        user.setPhone(updateData.get("phone"));
                    }
                    if (updateData.containsKey("status")) {
                        String status = updateData.get("status");
                        user.setIsDeleted(!"active".equals(status));
                    }

                    usersRepo.save(user);

                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "사용자 정보가 수정되었습니다.");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "사용자를 찾을 수 없습니다.");
                    return ResponseEntity.notFound().build();
                });
    }
    
    /**
     * 사용자 상태 토글 (활성 → 정지 → 비활성화)
     */
    @PostMapping("/api/users/{userId}/toggle-status")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> toggleUserStatus(@PathVariable Integer userId) {
        return usersRepo.findById(userId)
                .map(user -> {
                    String currentStatus = user.getStatus() != null ? user.getStatus() : "ACTIVE";
                    boolean isDeleted = Boolean.TRUE.equals(user.getIsDeleted());

                    String newStatusLabel;

                    // 상태 토글: 활성 → 정지 → 비활성화 → 활성 (순환)
                    if (isDeleted) {
                        // 비활성화 → 활성
                        user.setIsDeleted(false);
                        user.setStatus("ACTIVE");
                        newStatusLabel = "활성";
                    } else if ("SUSPENDED".equals(currentStatus)) {
                        // 정지 → 비활성화
                        user.setIsDeleted(true);
                        user.setStatus("INACTIVE");
                        newStatusLabel = "비활성화";
                    } else {
                        // 활성 → 정지
                        user.setStatus("SUSPENDED");
                        newStatusLabel = "정지";
                    }

                    usersRepo.save(user);

                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "사용자 상태가 " + newStatusLabel + "(으)로 변경되었습니다.");
                    response.put("newStatus", newStatusLabel);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "사용자를 찾을 수 없습니다.");
                    return ResponseEntity.notFound().build();
                });
    }
    
    /**
     * 일괄 정지 처리
     */
    @PostMapping("/api/users/bulk-suspend")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> bulkSuspend(@RequestBody Map<String, List<Integer>> request) {
        List<Integer> userIds = request.get("userIds");
        
        if (userIds == null || userIds.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "선택된 사용자가 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }
        
        int count = 0;
        for (Integer userId : userIds) {
            usersRepo.findById(userId).ifPresent(user -> {
                user.setStatus("SUSPENDED");
                user.setIsDeleted(false);
                usersRepo.save(user);
            });
            count++;
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", count + "명의 사용자가 정지되었습니다.");
        return ResponseEntity.ok(response);
    }

    // 월별 가입자 데이터 조회
    private List<Map<String, Object>> getMonthlyUserData() {
        List<Map<String, Object>> monthlyData = new ArrayList<>();

        try {
            for (int month = 1; month <= 12; month++) {
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", month);
                monthData.put("totalUsers", usersRepo.countByMonthAndIsDeletedFalse(month));
                monthData.put("activeUsers", usersRepo.countByMonthAndStatusAndIsDeletedFalse(month, "ACTIVE"));
                monthData.put("suspendedUsers", usersRepo.countByMonthAndStatusAndIsDeletedFalse(month, "SUSPENDED"));
                monthlyData.add(monthData);
            }
        } catch (Exception e) {
            // 쿼리 실패 시 더미 데이터로 대체
            System.err.println("월별 데이터 조회 실패, 더미 데이터 사용: " + e.getMessage());
            for (int month = 1; month <= 12; month++) {
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", month);
                monthData.put("totalUsers", 0);
                monthData.put("activeUsers", 0);
                monthData.put("suspendedUsers", 0);
                monthlyData.add(monthData);
            }
        }

        return monthlyData;
    }

    // 예약 많은 순으로 업체 리스트 조회
    private List<Map<String, Object>> getTopCompaniesByReservations() {
        List<Map<String, Object>> topCompanies = new ArrayList<>();

        try {
            // 승인된 업체 목록 조회 (상위 10개)
            Pageable pageable = PageRequest.of(0, 10);
            List<CompanyUser> companies = companyRepo.findTop5ApprovedCompanies(pageable);

            // 각 업체별 예약 수를 계산하고 정렬
            List<Map<String, Object>> companyWithReservations = new ArrayList<>();

            for (CompanyUser company : companies) {
                Long reservationCount = reservationRepo.countByCompany(company);

                Map<String, Object> companyData = new HashMap<>();
                companyData.put("companyId", company.getCompanyId());
                companyData.put("companyName", company.getCompanyName());
                companyData.put("category", company.getCategory());
                companyData.put("reservationCount", reservationCount);
                companyData.put("createdAt", company.getCreatedAt());

                companyWithReservations.add(companyData);
            }

            // 예약 수로 정렬 (내림차순)
            companyWithReservations.sort((a, b) -> {
                Long countA = (Long) a.get("reservationCount");
                Long countB = (Long) b.get("reservationCount");
                return countB.compareTo(countA);
            });

            // 상위 5개만 추출
            topCompanies = companyWithReservations.subList(0, Math.min(5, companyWithReservations.size()));

        } catch (Exception e) {
            System.err.println("업체 리스트 조회 실패: " + e.getMessage());
        }

        return topCompanies;
    }
}
