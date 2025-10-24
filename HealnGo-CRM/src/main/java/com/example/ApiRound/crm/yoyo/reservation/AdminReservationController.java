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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.ApiRound.entity.AdminEvent;
import com.example.ApiRound.entity.Marketing;
import com.example.ApiRound.repository.AdminEventRepository;
import com.example.ApiRound.repository.MarketingRepository;

@Controller
@RequestMapping("/admin")
public class AdminReservationController {

    @Autowired
    private ReservationService reservationService;
    
    @Autowired
    private AdminEventRepository adminEventRepository;
    
    @Autowired
    private MarketingRepository marketingRepository;

    // 관리자 예약 관리 메인 페이지
    @GetMapping("/reservation-management")
    public String adminReservationManagement(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            Model model) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending().and(Sort.by("startTime").descending()));

        Page<ReservationDto> reservations;
        
        if (status != null && !status.isEmpty()) {
            reservations = reservationService.getReservationsByStatus(status, pageable);
        } else {
            reservations = reservationService.getAllReservations(pageable);
        }

        model.addAttribute("reservations", reservations);
        model.addAttribute("currentStatus", status);
        
        // 전체 통계 정보
        model.addAttribute("totalCount", reservations.getTotalElements());
        model.addAttribute("confirmedCount", reservationService.getReservationsByStatus("CONFIRMED", PageRequest.of(0, 1)).getTotalElements());
        model.addAttribute("cancelledCount", reservationService.getReservationsByStatus("CANCELLED", PageRequest.of(0, 1)).getTotalElements());
        model.addAttribute("completedCount", reservationService.getReservationsByStatus("COMPLETED", PageRequest.of(0, 1)).getTotalElements());

        // 이벤트/프로모션 데이터 조회 (승인된 것만)
        LocalDate today = LocalDate.now();
        List<AdminEvent> activeEvents = adminEventRepository.findByApprovalStatusOrderByCreatedAtDesc(AdminEvent.ApprovalStatus.APPROVED);
        List<Marketing> activeCoupons = marketingRepository.findByApprovalStatusOrderByCreatedAtDesc(Marketing.ApprovalStatus.APPROVED);
        
        // 캘린더 통계
        long ongoingEvents = activeEvents.stream()
            .filter(e -> !e.getStartDate().isAfter(today) && !e.getEndDate().isBefore(today))
            .count();
        long ongoingPromotions = activeCoupons.stream()
            .filter(c -> !c.getValidFrom().isAfter(today) && !c.getValidUntil().isBefore(today))
            .count();
        long upcomingEvents = activeEvents.stream()
            .filter(e -> e.getStartDate().isAfter(today))
            .count();
        
        model.addAttribute("placements", activeEvents);
        model.addAttribute("coupons", activeCoupons);
        model.addAttribute("ongoingEvents", ongoingEvents);
        model.addAttribute("ongoingPromotions", ongoingPromotions);
        model.addAttribute("upcomingEvents", upcomingEvents);

        return "admin/reservation-management";
    }

    // 예약 상세 조회 (관리자용)
    @GetMapping("/reservation/{id}")
    public String viewReservationDetail(@PathVariable Long id, Model model) {
        try {
            ReservationDto reservation = reservationService.getReservationWithDetails(id);
            model.addAttribute("reservation", reservation);
            return "admin/reservation_detail";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "admin/reservation-management";
        }
    }

    // 예약 상태 변경 (관리자용)
    @PostMapping("/reservation/{id}/status")
    public String updateReservationStatus(
            @PathVariable Long id,
            @RequestParam String status,
            RedirectAttributes redirectAttributes) {
        
        try {
            reservationService.updateReservationStatus(id, status);
            redirectAttributes.addFlashAttribute("success", "예약 상태가 변경되었습니다.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        
        return "redirect:/admin/reservation-management";
    }

    // 예약 삭제 (관리자용)
    @PostMapping("/reservation/{id}/delete")
    public String deleteReservation(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes) {
        
        try {
            reservationService.deleteReservation(id);
            redirectAttributes.addFlashAttribute("success", "예약이 삭제되었습니다.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        
        return "redirect:/admin/reservation-management";
    }

    // 예약 수정 폼 (관리자용)
    @GetMapping("/reservation/{id}/edit")
    public String editReservationForm(@PathVariable Long id, Model model) {
        try {
            ReservationDto reservation = reservationService.getReservationWithDetails(id);
            model.addAttribute("reservation", reservation);
            return "admin/reservation_edit";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "admin/reservation-management";
        }
    }

    // 예약 수정 처리 (관리자용)
    @PostMapping("/reservation/{id}/edit")
    public String updateReservation(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam String description,
            @RequestParam String location,
            @RequestParam String status,
            @RequestParam String totalAmount,
            RedirectAttributes redirectAttributes) {
        
        try {
            ReservationDto reservationDto = reservationService.getReservationById(id);
            
            reservationDto.setTitle(title);
            reservationDto.setDate(java.time.LocalDate.parse(date));
            reservationDto.setStartTime(java.time.LocalTime.parse(startTime));
            reservationDto.setEndTime(java.time.LocalTime.parse(endTime));
            reservationDto.setDescription(description);
            reservationDto.setLocation(location);
            reservationDto.setStatus(status);
            reservationDto.setTotalAmount(new java.math.BigDecimal(totalAmount));
            
            reservationService.updateReservation(id, reservationDto);
            redirectAttributes.addFlashAttribute("success", "예약이 수정되었습니다.");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        
        return "redirect:/admin/reservation-management";
    }

    // 상태별 예약 조회
    @GetMapping("/reservations/status/{status}")
    public String getReservationsByStatus(
            @PathVariable String status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            Model model) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending().and(Sort.by("startTime").descending()));
        Page<ReservationDto> reservations = reservationService.getReservationsByStatus(status, pageable);
        
        model.addAttribute("reservations", reservations);
        model.addAttribute("currentStatus", status);
        
        return "admin/reservation-management";
    }

    // 전체 예약 목록 (관리자용)
    @GetMapping("/reservations/all")
    public String getAllReservations(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            Model model) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending().and(Sort.by("startTime").descending()));
        Page<ReservationDto> reservations = reservationService.getAllReservations(pageable);
        
        model.addAttribute("reservations", reservations);
        model.addAttribute("currentStatus", null);
        
        return "admin/reservation-management";
    }
}
