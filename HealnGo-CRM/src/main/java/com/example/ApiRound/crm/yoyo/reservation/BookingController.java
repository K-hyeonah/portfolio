package com.example.ApiRound.crm.yoyo.reservation;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;

import jakarta.servlet.http.HttpSession;

/**
 * 예약 관리 컨트롤러
 * 
 * 사용자의 예약 내역 조회, 상세 정보 조회, 취소 등의 기능을 제공합니다.
 * 모든 작업은 로그인한 사용자 본인의 예약에 대해서만 수행 가능합니다.
 * 
 * @author HealnGo Team
 */
@Controller
public class BookingController {

    // 예약 상태 상수
    private static final String STATUS_CANCELLED = "CANCELLED";
    
    // 세션 속성 키
    private static final String SESSION_USER_ID = "userId";

    private final ReservationRepository reservationRepository;
    private final SocialUsersRepository socialUsersRepository;

    public BookingController(ReservationRepository reservationRepository, 
                           SocialUsersRepository socialUsersRepository) {
        this.reservationRepository = reservationRepository;
        this.socialUsersRepository = socialUsersRepository;
    }

    /**
     * 예약 페이지 조회 (페이징 처리)
     * 로그인한 사용자의 예약 내역을 페이지 단위로 조회하여 화면에 표시합니다.
     * 
     * @param session HTTP 세션 (사용자 인증 정보 포함)
     * @param model   뷰에 전달할 데이터 모델
     * @param page    페이지 번호 (기본값: 1)
     * @return 예약 페이지 뷰 이름 또는 로그인 페이지로 리다이렉트
     */
    @GetMapping("/booking")
    public String booking(HttpSession session, Model model,
                         @RequestParam(defaultValue = "1") int page) {
        Integer userId = (Integer) session.getAttribute(SESSION_USER_ID);
        
        // 로그인 체크
        if (userId == null) {
            return "redirect:/login";
        }
        
        // 사용자 정보 조회
        SocialUsers user = socialUsersRepository.findById(userId).orElse(null);
        if (user == null) {
            return "redirect:/login";
        }
        
        // 페이지 번호는 0부터 시작하므로 -1
        int pageNumber = Math.max(0, page - 1);
        int pageSize = 10; // 한 페이지당 10개
        
        // 페이징 객체 생성
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        
        // 해당 사용자의 예약 내역 조회 (페이징)
        Page<Reservation> reservationPage = reservationRepository.findByUser_UserId(userId, pageable);
        
        // 모델에 데이터 추가
        model.addAttribute("reservations", reservationPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", reservationPage.getTotalPages());
        model.addAttribute("totalElements", reservationPage.getTotalElements());
        model.addAttribute("hasNext", reservationPage.hasNext());
        model.addAttribute("hasPrevious", reservationPage.hasPrevious());
        
        return "crm/booking";
    }
    
    /**
     * 사용자의 예약 목록 조회 API
     * 특정 사용자의 모든 예약 내역을 JSON 형태로 반환합니다.
     * 보안을 위해 본인의 예약만 조회할 수 있습니다.
     * 
     * @param userId  조회할 사용자 ID
     * @param session HTTP 세션
     * @return 예약 목록 (JSON 배열)
     */
    @GetMapping("/api/reservations/user/{userId}")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> getUserReservations(
            @PathVariable Integer userId, HttpSession session) {
        
        Integer sessionUserId = (Integer) session.getAttribute(SESSION_USER_ID);
        
        // 인증 체크
        if (sessionUserId == null) {
            return ResponseEntity.status(401).body(new ArrayList<>());
        }
        
        // 본인 확인
        if (!sessionUserId.equals(userId)) {
            return ResponseEntity.status(403).body(new ArrayList<>());
        }
        
        // 사용자 조회
        SocialUsers user = socialUsersRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        
        // 예약 목록 조회 및 변환
        List<Reservation> reservations = reservationRepository.findByUserOrderByDateDescStartTimeDesc(user);
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Reservation reservation : reservations) {
            result.add(convertReservationToMap(reservation));
        }
        
        return ResponseEntity.ok(result);
    }
    
    /**
     * 예약 상세 정보 조회 API
     * 특정 예약의 상세 정보를 조회합니다.
     * 본인의 예약만 조회할 수 있습니다.
     * 
     * @param id      조회할 예약 ID
     * @param session HTTP 세션
     * @return 예약 상세 정보 (JSON)
     */
    @GetMapping("/api/reservations/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getReservationDetail(
            @PathVariable Long id, HttpSession session) {
        
        Integer userId = (Integer) session.getAttribute(SESSION_USER_ID);
        
        // 인증 체크
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "로그인이 필요합니다."
            ));
        }
        
        // 예약 조회
        Reservation reservation = reservationRepository.findByIdWithDetails(id).orElse(null);
        if (reservation == null) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "예약 정보를 찾을 수 없습니다."
            ));
        }
        
        // 본인 예약 확인
        if (reservation.getUser() == null || !reservation.getUser().getUserId().equals(userId)) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "message", "접근 권한이 없습니다."
            ));
        }
        
        // 예약 데이터 변환
        Map<String, Object> reservationData = convertReservationToDetailMap(reservation);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "reservation", reservationData
        ));
    }
    
    /**
     * 예약 취소 API
     * 예약을 취소 상태로 변경합니다.
     * 본인의 예약만 취소할 수 있으며, 이미 취소된 예약은 다시 취소할 수 없습니다.
     * 
     * @param id      취소할 예약 ID
     * @param session HTTP 세션
     * @return 취소 결과 메시지 (JSON)
     */
    @PostMapping("/api/reservations/{id}/cancel")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> cancelReservation(
            @PathVariable Long id, HttpSession session) {
        
        Integer userId = (Integer) session.getAttribute(SESSION_USER_ID);
        
        // 인증 체크
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "로그인이 필요합니다."
            ));
        }
        
        // 예약 조회
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "예약 정보를 찾을 수 없습니다."
            ));
        }
        
        // 본인 예약 확인
        if (reservation.getUser() == null || !reservation.getUser().getUserId().equals(userId)) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "message", "접근 권한이 없습니다."
            ));
        }
        
        // 취소 가능 여부 확인
        if (STATUS_CANCELLED.equals(reservation.getStatus())) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "이미 취소된 예약입니다."
            ));
        }
        
        // 예약 취소 처리
        reservation.setStatus(STATUS_CANCELLED);
        reservationRepository.save(reservation);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "예약이 취소되었습니다."
        ));
    }
    
    // ========== Private Helper Methods ==========
    
    /**
     * Reservation 객체를 Map으로 변환 (목록용)
     * 
     * @param reservation 변환할 예약 객체
     * @return Map 형태의 예약 데이터
     */
    private Map<String, Object> convertReservationToMap(Reservation reservation) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", reservation.getId());
        data.put("title", reservation.getTitle());
        data.put("companyName", reservation.getCompany() != null ? 
                reservation.getCompany().getCompanyName() : "");
        data.put("date", reservation.getDate() != null ? 
                reservation.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : "");
        data.put("start_time", reservation.getStartTime() != null ? 
                reservation.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "");
        data.put("end_time", reservation.getEndTime() != null ? 
                reservation.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "");
        data.put("location", reservation.getLocation());
        data.put("status", reservation.getStatus());
        data.put("totalAmount", reservation.getTotalAmount());
        data.put("service_id", reservation.getServiceId());  // serviceId 전달
        data.put("item_id", reservation.getItemId());  // itemId 전달
        data.put("description", reservation.getDescription());
        return data;
    }
    
    /**
     * Reservation 객체를 Map으로 변환 (상세용)
     * 
     * @param reservation 변환할 예약 객체
     * @return Map 형태의 예약 상세 데이터
     */
    private Map<String, Object> convertReservationToDetailMap(Reservation reservation) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", reservation.getId());
        data.put("title", reservation.getTitle());
        data.put("companyName", reservation.getCompany() != null ? 
                reservation.getCompany().getCompanyName() : null);
        data.put("date", reservation.getDate() != null ? 
                reservation.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : null);
        data.put("startTime", reservation.getStartTime() != null ? 
                reservation.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) : null);
        data.put("endTime", reservation.getEndTime() != null ? 
                reservation.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")) : null);
        data.put("location", reservation.getLocation());
        data.put("status", reservation.getStatus());
        data.put("totalAmount", reservation.getTotalAmount());
        data.put("description", reservation.getDescription());
        return data;
    }
}
