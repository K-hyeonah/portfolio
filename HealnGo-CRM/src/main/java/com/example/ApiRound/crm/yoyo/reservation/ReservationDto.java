package com.example.ApiRound.crm.yoyo.reservation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDto {

    private Long id;
    private String title;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String description;
    private String location;
    private String status;
    private String googleEventId;
    private Boolean googleSyncEnabled;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // FK 정보
    private Integer userId;
    private Integer companyId;
    private Long serviceId;
    private Long itemId;

    // 조인된 정보 (예약 확인 화면용)
    private String customerName;    // SocialUsers.name
    private String customerContact; // SocialUsers.phone
    private String clinicName;      // CompanyUser.companyName
}
