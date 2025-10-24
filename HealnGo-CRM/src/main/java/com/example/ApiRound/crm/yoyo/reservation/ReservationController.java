package com.example.ApiRound.crm.yoyo.reservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpSession;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

import com.example.ApiRound.entity.ItemList;
import com.example.ApiRound.repository.ItemListRepository;

@Slf4j
@Controller
public class ReservationController {

    @Autowired
    private ReservationService reservationService;
    
    @Autowired
    private ItemListRepository itemListRepository;
    
    @GetMapping("/reservation")
    public String reservation() {
        return "reservation";
    }

    // 예약 저장 API
    @PostMapping("/api/reservation/create")
    @ResponseBody
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequestDto request, HttpSession session) {
        try {
            log.info("========== 예약 생성 요청 시작 ==========");
            log.info("받은 예약 데이터: {}", request);
            
            // 세션에서 사용자 정보 가져오기
            Integer userId = (Integer) session.getAttribute("userId");
            String userEmail = (String) session.getAttribute("userEmail");
            String userName = (String) session.getAttribute("userName");
            
            log.info("세션에서 가져온 사용자 정보 - userId: {}, userEmail: {}, userName: {}", 
                    userId, userEmail, userName);
            
            if (userId == null) {
                log.warn("세션에 userId가 없습니다. 로그인이 필요합니다.");
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "로그인이 필요합니다."
                ));
            }

            // 세션에서 업체 정보 가져오기 (예약하는 병원 정보)
            Integer companyId = (Integer) session.getAttribute("companyId");
            String companyName = (String) session.getAttribute("companyName");
            
            log.info("세션에서 가져온 업체 정보 - companyId: {}, companyName: {}", 
                    companyId, companyName);
            
            // URL 파라미터나 요청 데이터에서 업체 정보가 있다면 우선 사용
            if (request.getCompanyId() != null) {
                companyId = request.getCompanyId();
                log.info("요청 데이터에서 업체 ID 설정: {}", companyId);
            }
            
            // 업체 정보가 없으면 itemId로 companyId 찾기
            if (companyId == null) {
                // 요청 데이터에서 itemId 가져오기
                if (request.getItemId() != null) {
                    try {
                        Long itemId = request.getItemId();
                        log.info("itemId로 ItemList 조회 시작: {}", itemId);
                        
                        ItemList item = itemListRepository.findById(itemId).orElse(null);
                        log.info("조회된 ItemList: {}", item);
                        
                        if (item != null) {
                            log.info("ItemList의 ownerCompany: {}", item.getOwnerCompany());
                            
                            if (item.getOwnerCompany() != null) {
                                companyId = item.getOwnerCompany().getCompanyId();
                                log.info("itemId {}로 companyId 찾음: {}", itemId, companyId);
                            } else {
                                log.error("itemId {}의 ownerCompany가 null입니다. 예약할 수 없습니다.", itemId);
                                return ResponseEntity.status(400).body(Map.of(
                                        "success", false,
                                        "message", "해당 상품의 업체 정보를 찾을 수 없습니다. 관리자에게 문의해주세요."
                                ));
                            }
                        } else {
                            log.error("itemId {}에 해당하는 ItemList를 찾을 수 없습니다.", itemId);
                            return ResponseEntity.status(400).body(Map.of(
                                    "success", false,
                                    "message", "존재하지 않는 상품입니다. 페이지를 새로고침해주세요."
                            ));
                        }
                    } catch (Exception e) {
                        log.error("itemId 처리 오류: ", e);
                        return ResponseEntity.status(500).body(Map.of(
                                "success", false,
                                "message", "예약 처리 중 오류가 발생했습니다. 다시 시도해주세요."
                        ));
                    }
                } else {
                    log.error("예약 요청에 itemId가 없습니다.");
                    return ResponseEntity.status(400).body(Map.of(
                            "success", false,
                            "message", "예약할 상품 정보가 없습니다. 페이지를 새로고침해주세요."
                    ));
                }
            }
            
            // 최종적으로 companyId가 없으면 에러 처리
            if (companyId == null) {
                log.error("업체 정보를 찾을 수 없습니다. 예약할 수 없습니다.");
                return ResponseEntity.status(400).body(Map.of(
                        "success", false,
                        "message", "예약할 병원 정보를 찾을 수 없습니다. 페이지를 새로고침해주세요."
                ));
            }

            request.setUserId(userId);
            request.setCompanyId(companyId);

            log.info("최종 설정된 예약 데이터 - userId: {}, companyId: {}", userId, companyId);
            log.info("전달할 ReservationDto - userId: {}, companyId: {}", request.getUserId(), request.getCompanyId());

            ReservationDto reservationDto = ReservationDto.builder()
                    .title(request.getServiceName())
                    .date(request.getDate())
                    .startTime(request.getStartTime())
                    .endTime(request.getEndTime())
                    .description(request.getDescription())
                    .location(request.getHospitalName())
                    .status("CONFIRMED")
                    .totalAmount(request.getTotalAmount())
                    .serviceId(request.getServiceId())  // serviceId 추가
                    .itemId(request.getItemId())  // itemId 추가
                    .userId(request.getUserId())
                    .companyId(request.getCompanyId())
                    .build();

            log.info("생성된 ReservationDto: {}", reservationDto);

            ReservationDto savedReservation = reservationService.createReservation(reservationDto);

            log.info("예약 생성 성공 - reservationId: {}", savedReservation.getId());
            log.info("========== 예약 생성 요청 완료 ==========");

            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "message", "예약이 완료되었습니다.",
                    "reservationId", savedReservation.getId()
            ));

        } catch (Exception e) {
            log.error("예약 처리 중 오류 발생: ", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "예약 처리 중 오류가 발생했습니다: " + e.getMessage()
            ));
        }
    }

    // 예약 요청 DTO
    public static class ReservationRequestDto {
        private String serviceName;
        private java.time.LocalDate date;
        private java.time.LocalTime startTime;
        private java.time.LocalTime endTime;
        private String description;
        private String hospitalName;
        private java.math.BigDecimal totalAmount;
        private Integer userId;
        private Integer companyId;
        private Long serviceId;
        private Long itemId;

        // Getters and Setters
        public String getServiceName() { return serviceName; }
        public void setServiceName(String serviceName) { this.serviceName = serviceName; }
        
        public java.time.LocalDate getDate() { return date; }
        public void setDate(java.time.LocalDate date) { this.date = date; }
        
        public java.time.LocalTime getStartTime() { return startTime; }
        public void setStartTime(java.time.LocalTime startTime) { this.startTime = startTime; }
        
        public java.time.LocalTime getEndTime() { return endTime; }
        public void setEndTime(java.time.LocalTime endTime) { this.endTime = endTime; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getHospitalName() { return hospitalName; }
        public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
        
        public java.math.BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(java.math.BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        
        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        
        public Integer getCompanyId() { return companyId; }
        public void setCompanyId(Integer companyId) { this.companyId = companyId; }
        
        public Long getServiceId() { return serviceId; }
        public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
        
        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }
    }
}


