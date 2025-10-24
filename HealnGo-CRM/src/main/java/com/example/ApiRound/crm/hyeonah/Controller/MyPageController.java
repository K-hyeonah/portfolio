package com.example.ApiRound.crm.hyeonah.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.ApiRound.crm.yoyo.reservation.ReservationService;
import com.example.ApiRound.crm.yoyo.reservation.ReservationDto;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class MyPageController {
    
    @Autowired
    private ReservationService reservationService;
    
    @GetMapping("/mypage")
    public String mypage(HttpSession session, Model model) {
        Integer userId = (Integer) session.getAttribute("userId");
        
        if (userId == null) {
            return "redirect:/login";
        }
        
        log.info("마이페이지 요청 - userId: {}", userId);
        
        // 사용자 정보를 모델에 추가
        model.addAttribute("userId", userId);
        model.addAttribute("userName", session.getAttribute("userName"));
        model.addAttribute("userEmail", session.getAttribute("userEmail"));
        
        // 사용자별 예약 내역 조회
        try {
            List<ReservationDto> userReservations = reservationService.getUserReservations(userId);
            log.info("사용자 {}의 예약 내역 조회 완료 - 예약 수: {}", userId, userReservations.size());
            
            // 최근 3개만 표시 (더 많은 예약은 "View all"에서 확인)
            List<ReservationDto> recentReservations = userReservations.stream()
                    .limit(3)
                    .toList();
            
            model.addAttribute("userReservations", recentReservations);
            model.addAttribute("totalReservationCount", userReservations.size());
        } catch (Exception e) {
            log.error("예약 내역 조회 중 오류 발생: ", e);
            model.addAttribute("userReservations", List.of());
            model.addAttribute("totalReservationCount", 0);
        }
        
        return "crm/mypage";
    }
}
