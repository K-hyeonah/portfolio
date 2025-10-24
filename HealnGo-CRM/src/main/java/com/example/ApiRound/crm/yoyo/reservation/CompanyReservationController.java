package com.example.ApiRound.crm.yoyo.reservation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/company")
public class CompanyReservationController {

    @Autowired
    private ReservationService reservationService;

    // 업체 예약 관리 메인 페이지
    @GetMapping("/company_reservation_management")
    public String companyReservationManagement(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "100") int size,
            HttpSession session,
            Model model) {

        // 세션에서 companyId 가져오기
        Integer companyId = (Integer) session.getAttribute("companyId");
        String companyName = (String) session.getAttribute("companyName");
        
        log.info("업체 예약 관리 페이지 요청 - companyId: {}, companyName: {}", companyId, companyName);
        
        if (companyId == null) {
            log.warn("세션에 companyId가 없습니다. 로그인이 필요합니다.");
            return "redirect:/crm/login";
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending().and(Sort.by("startTime").descending()));

        Page<ReservationDto> reservations;
        
        try {
            if (status != null && !status.isEmpty()) {
                log.info("상태별 예약 조회 - status: {}", status);
                reservations = reservationService.getCompanyReservationsByStatus(companyId, status)
                        .stream()
                        .skip(page * size)
                        .limit(size)
                        .collect(java.util.stream.Collectors.collectingAndThen(
                                java.util.stream.Collectors.toList(),
                                list -> new org.springframework.data.domain.PageImpl<>(list, pageable, list.size())
                        ));
            } else if (date != null && !date.isEmpty()) {
                log.info("날짜별 예약 조회 - date: {}", date);
                LocalDate filterDate = LocalDate.parse(date);
                List<ReservationDto> dateFiltered = reservationService.getCompanyReservationsByDate(companyId, filterDate);
                reservations = new org.springframework.data.domain.PageImpl<>(dateFiltered, pageable, dateFiltered.size());
            } else {
                log.info("전체 예약 조회");
                reservations = reservationService.getCompanyReservations(companyId, pageable);
            }
            
            log.info("조회된 예약 수: {}", reservations.getTotalElements());
            
        } catch (Exception e) {
            log.error("예약 조회 중 오류 발생: ", e);
            reservations = Page.empty();
        }

        model.addAttribute("reservations", reservations);
        model.addAttribute("companyId", companyId);
        model.addAttribute("companyName", companyName);
        model.addAttribute("currentStatus", status);
        model.addAttribute("currentDate", date);
        
        // 통계 정보
        try {
            long totalCount = reservationService.getReservationCountByCompanyAndStatus(companyId, null);
            long confirmedCount = reservationService.getReservationCountByCompanyAndStatus(companyId, "CONFIRMED");
            long cancelledCount = reservationService.getReservationCountByCompanyAndStatus(companyId, "CANCELLED");
            long completedCount = reservationService.getReservationCountByCompanyAndStatus(companyId, "COMPLETED");
            
            model.addAttribute("totalCount", totalCount);
            model.addAttribute("confirmedCount", confirmedCount);
            model.addAttribute("cancelledCount", cancelledCount);
            model.addAttribute("completedCount", completedCount);
            
            log.info("통계 - 전체: {}, 확정: {}, 취소: {}, 완료: {}", totalCount, confirmedCount, cancelledCount, completedCount);
            
        } catch (Exception e) {
            log.error("통계 조회 중 오류 발생: ", e);
            model.addAttribute("totalCount", 0L);
            model.addAttribute("confirmedCount", 0L);
            model.addAttribute("cancelledCount", 0L);
            model.addAttribute("completedCount", 0L);
        }
        
        // 최근 업데이트 (최근 일주일간의 예약)
        try {
            LocalDate now = LocalDate.now();
            LocalDate weekAgo = now.minusDays(7);
            
            List<ReservationDto> weekReservations = reservationService.getCompanyReservationsByDateRange(
                companyId, weekAgo, now);
            
            model.addAttribute("recentReservations", weekReservations);
            
            log.info("========== 최근 업데이트 디버깅 ==========");
            log.info("조회 기간: {} ~ {}", weekAgo, now);
            log.info("일주일간 예약 수: {}", weekReservations.size());
            weekReservations.forEach(r -> {
                log.info("예약 ID: {}, 고객명: {}, 생성일: {}", r.getId(), r.getCustomerName(), r.getCreatedAt());
            });
            log.info("=========================================");
            
        } catch (Exception e) {
            log.error("최근 예약 조회 중 오류 발생: ", e);
            model.addAttribute("recentReservations", java.util.Collections.emptyList());
        }
        
        // 현재 월의 모든 예약 데이터 (캘린더용)
        try {
            LocalDate now = LocalDate.now();
            LocalDate startOfMonth = now.withDayOfMonth(1);
            LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());
            
            List<ReservationDto> monthReservations = reservationService.getCompanyReservationsByDateRange(
                companyId, startOfMonth, endOfMonth);
            
            model.addAttribute("reservationList", monthReservations);
            log.info("캘린더용 월간 예약 수: {}", monthReservations.size());
            
        } catch (Exception e) {
            log.error("월간 예약 조회 중 오류 발생: ", e);
            model.addAttribute("reservationList", java.util.Collections.emptyList());
        }

        return "crm/company_reservation_management";
    }

    // 예약 상세 조회
    @GetMapping("/reservation/{id}")
    public String viewReservation(@PathVariable Long id, Model model) {
        try {
            ReservationDto reservation = reservationService.getReservationWithDetails(id);
            model.addAttribute("reservation", reservation);
            return "crm/reservation_detail";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "crm/company_reservation_management";
        }
    }

    // 예약 상태 변경
    @PostMapping("/reservation/{id}/status")
    public String updateReservationStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(value = "companyId") Integer companyId,
            RedirectAttributes redirectAttributes) {
        
        try {
            reservationService.updateReservationStatus(id, status);
            redirectAttributes.addFlashAttribute("success", "예약 상태가 변경되었습니다.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        
        return "redirect:/company/company_reservation_management?companyId=" + companyId;
    }

    // 예약 취소
    @PostMapping("/reservation/{id}/cancel")
    public String cancelReservation(
            @PathVariable Long id,
            @RequestParam(value = "companyId") Integer companyId,
            RedirectAttributes redirectAttributes) {
        
        try {
            reservationService.cancelReservation(id);
            redirectAttributes.addFlashAttribute("success", "예약이 취소되었습니다.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        
        return "redirect:/company/company_reservation_management?companyId=" + companyId;
    }

    // 예약 완료 처리
    @PostMapping("/reservation/{id}/complete")
    public String completeReservation(
            @PathVariable Long id,
            @RequestParam(value = "companyId") Integer companyId,
            RedirectAttributes redirectAttributes) {
        
        try {
            reservationService.completeReservation(id);
            redirectAttributes.addFlashAttribute("success", "예약이 완료 처리되었습니다.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        
        return "redirect:/company/company_reservation_management?companyId=" + companyId;
    }

    // 날짜별 예약 조회
    @GetMapping("/reservations/date")
    public String getReservationsByDate(
            @RequestParam Integer companyId,
            @RequestParam String date,
            Model model) {
        
        try {
            LocalDate filterDate = LocalDate.parse(date);
            List<ReservationDto> reservations = reservationService.getCompanyReservationsByDate(companyId, filterDate);
            model.addAttribute("reservations", reservations);
            model.addAttribute("companyId", companyId);
            model.addAttribute("selectedDate", date);
            return "crm/company_reservation_management";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "crm/company_reservation_management";
        }
    }
    
    // API: 예약 완료 처리 (JSON 응답)
    @PostMapping("/api/reservations/{id}/complete")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> completeReservationApi(
            @PathVariable Long id,
            HttpSession session) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 세션에서 업체 ID 확인
            Integer companyId = (Integer) session.getAttribute("companyId");
            
            if (companyId == null) {
                response.put("success", false);
                response.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(401).body(response);
            }
            
            // 예약 완료 처리
            reservationService.completeReservation(id);
            
            response.put("success", true);
            response.put("message", "예약이 완료 처리되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("예약 완료 처리 중 오류 발생: ", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
