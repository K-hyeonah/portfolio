package com.example.ApiRound.crm.yoyo;

import com.example.ApiRound.crm.hyeonah.Repository.CompanyUserRepository;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.crm.yoyo.medi.MediServiceEntity;
import com.example.ApiRound.crm.yoyo.medi.MediServiceRepository;
import com.example.ApiRound.crm.yoyo.reservation.Reservation;
import com.example.ApiRound.crm.yoyo.reservation.ReservationRepository;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/company")
@Slf4j
public class CompanyReportController {

    private final ReservationRepository reservationRepository;
    private final MediServiceRepository mediServiceRepository;
    private final CompanyUserRepository companyUserRepository;

    public CompanyReportController(ReservationRepository reservationRepository,
                                   MediServiceRepository mediServiceRepository,
                                   CompanyUserRepository companyUserRepository) {
        this.reservationRepository = reservationRepository;
        this.mediServiceRepository = mediServiceRepository;
        this.companyUserRepository = companyUserRepository;
    }

    /**
     * 리포트 & 통계 페이지 (업체용)
     */
    @GetMapping("/report")
    public String report(Model model, HttpSession session) {
        Integer companyId = (Integer) session.getAttribute("companyId");
        String companyName = (String) session.getAttribute("companyName");

        log.info("업체 리포트 페이지 요청 - companyId: {}, companyName: {}", companyId, companyName);

        if (companyId == null) {
            log.warn("세션에 companyId가 없습니다. 로그인이 필요합니다.");
            return "redirect:/login";
        }

        model.addAttribute("companyId", companyId);
        model.addAttribute("companyName", companyName);

        // 실제 DB에서 통계 데이터 가져오기
        try {
            CompanyUser company = companyUserRepository.findById(companyId).orElse(null);
            if (company == null) {
                log.error("업체 정보를 찾을 수 없습니다: {}", companyId);
                return "redirect:/login";
            }

            // 총 예약 수
            long totalReservations = reservationRepository.countByCompany(company);

            // 총 매출 (예약의 total_amount 합계)
            List<Reservation> allReservations = reservationRepository.findByCompany(company);
            BigDecimal totalRevenue = allReservations.stream()
                    .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // 통계 데이터
            Map<String, Object> reportStats = new HashMap<>();
            reportStats.put("totalRevenue", totalRevenue);
            reportStats.put("totalReservations", totalReservations);

            model.addAttribute("reportStats", reportStats);

            log.info("통계 - 총 예약: {}, 총 매출: {}", totalReservations, totalRevenue);

        } catch (Exception e) {
            log.error("통계 조회 중 오류 발생: ", e);
            Map<String, Object> reportStats = new HashMap<>();
            reportStats.put("totalRevenue", BigDecimal.ZERO);
            reportStats.put("totalReservations", 0L);
            model.addAttribute("reportStats", reportStats);
        }

        // 서비스별 통계 (mediservice 기반)
        try {
            List<Map<String, Object>> serviceStats = getServiceStatistics(companyId);
            model.addAttribute("serviceStats", serviceStats);
            
            log.info("서비스별 통계 조회 완료 - 서비스 수: {}", serviceStats.size());

        } catch (Exception e) {
            log.error("서비스 통계 조회 중 오류 발생: ", e);
            model.addAttribute("serviceStats", new ArrayList<>());
        }

        // HTML 템플릿에 필요한 추가 데이터 (임시 - 나중에 실제 데이터로 대체 가능)
        Map<String, Object> keyIndicators = new HashMap<>();
        keyIndicators.put("totalReservations", reservationRepository.countByCompany(companyUserRepository.findById(companyId).orElse(null)));
        keyIndicators.put("repeatVisits", 0); // 추후 구현
        keyIndicators.put("averageSatisfaction", 0.0); // 추후 구현
        model.addAttribute("keyIndicators", keyIndicators);
        
        // 오늘 날짜의 시간별 예약 데이터 (실제 DB 기반)
        List<Map<String, Object>> hourlyReservationData = getHourlyReservationData(companyId);
        model.addAttribute("dailySalesData", hourlyReservationData);
        log.info("시간별 예약 데이터 조회 완료 - 데이터 수: {}", hourlyReservationData.size());
        
        // ========== 새로 추가: 일일 매출 및 월간 매출 데이터 ==========
        // 일일 매출 데이터 (오늘 시간별 매출)
        List<Map<String, Object>> dailyRevenueData = getDailyRevenueData(companyId);
        model.addAttribute("dailyRevenueData", dailyRevenueData);
        log.info("일일 매출 데이터 조회 완료 - 데이터 수: {}", dailyRevenueData.size());
        
        // 월간 매출 데이터 (최근 30일간 일별 매출)
        List<Map<String, Object>> monthlyRevenueData = getMonthlyRevenueData(companyId);
        model.addAttribute("monthlyRevenueData", monthlyRevenueData);
        log.info("월간 매출 데이터 조회 완료 - 데이터 수: {}", monthlyRevenueData.size());
        
        // 최근 등록한 서비스 활동 (mediService 기준)
        List<Map<String, Object>> recentActivities = getRecentServiceActivities(companyId);
        model.addAttribute("recentActivities", recentActivities);
        log.info("최근 활동 조회 완료 - 활동 수: {}", recentActivities.size());

        return "crm/company_report";
    }
    
    /**
     * 최근 등록한 서비스 활동 조회 (mediService 기준)
     */
    private List<Map<String, Object>> getRecentServiceActivities(Integer companyId) {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        try {
            // 해당 업체의 최근 등록한 서비스 조회 (최대 5개)
            List<MediServiceEntity> recentServices = mediServiceRepository
                    .findActiveByCompanyIdWithFetch(companyId);
            
            log.info("=== 최근 서비스 활동 디버깅 ===");
            log.info("업체 ID: {}, 조회된 서비스 수: {}", companyId, recentServices.size());
            
            // 최근 5개만 추출 (createdAt 기준 정렬되어 있다고 가정)
            int count = 0;
            for (MediServiceEntity service : recentServices) {
                if (count >= 5) break;
                
                Map<String, Object> activity = new HashMap<>();
                activity.put("title", service.getName() + " 서비스 등록");
                activity.put("icon", "fas fa-plus-circle");
                activity.put("color", "blue");
                
                // 등록 시간 계산 (createdAt 기준)
                if (service.getCreatedAt() != null) {
                    java.time.LocalDateTime now = java.time.LocalDateTime.now();
                    java.time.LocalDateTime createdAt = service.getCreatedAt();
                    
                    long minutesAgo = java.time.Duration.between(createdAt, now).toMinutes();
                    long hoursAgo = java.time.Duration.between(createdAt, now).toHours();
                    long daysAgo = java.time.Duration.between(createdAt, now).toDays();
                    
                    String timeAgo;
                    if (minutesAgo < 60) {
                        timeAgo = minutesAgo + "분 전";
                    } else if (hoursAgo < 24) {
                        timeAgo = hoursAgo + "시간 전";
                    } else if (daysAgo < 30) {
                        timeAgo = daysAgo + "일 전";
                    } else {
                        timeAgo = (daysAgo / 30) + "개월 전";
                    }
                    
                    activity.put("time", timeAgo);
                    log.info("서비스: {}, 등록 시간: {} ({})", service.getName(), createdAt, timeAgo);
                } else {
                    activity.put("time", "최근");
                }
                
                activities.add(activity);
                count++;
            }
            
            log.info("최근 활동 데이터 생성 완료: {}", activities.size());
            log.info("================================");
            
        } catch (Exception e) {
            log.error("최근 활동 조회 중 오류 발생: ", e);
        }
        
        return activities;
    }
    
    /**
     * 오늘 날짜의 시간별 예약 데이터 조회 (created_at 기준)
     */
    private List<Map<String, Object>> getHourlyReservationData(Integer companyId) {
        List<Map<String, Object>> hourlyData = new ArrayList<>();
        
        try {
            CompanyUser company = companyUserRepository.findById(companyId).orElse(null);
            if (company == null) {
                return hourlyData;
            }
            
            // 오늘 날짜 (created_at 기준)
            java.time.LocalDateTime startOfToday = java.time.LocalDate.now().atStartOfDay();
            java.time.LocalDateTime endOfToday = java.time.LocalDate.now().atTime(23, 59, 59);
            
            log.info("=== 시간별 예약 데이터 디버깅 (created_at 기준) ===");
            log.info("업체 ID: {}, 조회 기간: {} ~ {}", companyId, startOfToday, endOfToday);
            
            // 오늘 created_at 기준으로 모든 예약 조회
            List<Reservation> todayReservations = reservationRepository
                    .findByCompanyAndCreatedAtBetween(company, startOfToday, endOfToday);
            log.info("오늘 생성된 예약 총 수: {}", todayReservations.size());
            
            // 시간별로 그룹화 (00시 ~ 23시)
            Map<Integer, Integer> hourlyCount = new HashMap<>();
            for (int hour = 0; hour < 24; hour++) {
                hourlyCount.put(hour, 0);
            }
            
            // 각 예약의 생성 시간(created_at)을 기준으로 시간대별 카운트
            for (Reservation reservation : todayReservations) {
                if (reservation.getCreatedAt() != null) {
                    int hour = reservation.getCreatedAt().getHour();
                    hourlyCount.put(hour, hourlyCount.get(hour) + 1);
                    log.info("예약 ID {}: 생성 시간 {}시 -> 카운트 증가", 
                            reservation.getId(), hour);
                }
            }
            
            // 결과 데이터 생성 (00:00 ~ 23:00)
            for (int hour = 0; hour < 24; hour++) {
                Map<String, Object> data = new HashMap<>();
                data.put("hour", String.format("%02d:00", hour));
                data.put("reservationCount", hourlyCount.get(hour));
                hourlyData.add(data);
            }
            
            log.info("시간별 예약 데이터 생성 완료: {}", hourlyData.size());
            log.info("시간대별 카운트: {}", hourlyCount);
            log.info("================================================");
            
        } catch (Exception e) {
            log.error("시간별 예약 데이터 조회 중 오류 발생: ", e);
        }
        
        return hourlyData;
    }

    /**
     * 서비스별 통계 조회 (mediservice 기반)
     */
    private List<Map<String, Object>> getServiceStatistics(Integer companyId) {
        List<Map<String, Object>> serviceStats = new ArrayList<>();

        try {
            CompanyUser company = companyUserRepository.findById(companyId).orElse(null);
            if (company == null) {
                return serviceStats;
            }

            // 해당 업체의 모든 서비스 조회
            List<MediServiceEntity> services = mediServiceRepository.findActiveByCompanyIdWithFetch(companyId);

            log.info("=== 서비스별 통계 디버깅 ===");
            log.info("업체 ID: {}, 서비스 수: {}", companyId, services.size());

            for (MediServiceEntity service : services) {
                // 해당 서비스명으로 예약된 건수 조회 (reservation.title과 매칭)
                List<Reservation> serviceReservations = reservationRepository
                        .findByCompanyAndTitle(company, service.getName());

                long reservationCount = serviceReservations.size();

                // 해당 서비스의 총 매출
                BigDecimal serviceTotalRevenue = serviceReservations.stream()
                        .map(r -> r.getTotalAmount() != null ? r.getTotalAmount() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                Map<String, Object> stat = new HashMap<>();
                stat.put("serviceId", service.getServiceId());
                stat.put("serviceName", service.getName());
                stat.put("category", service.getServiceCategory());
                stat.put("price", service.getPrice());
                stat.put("discountRate", service.getDiscountRate());
                stat.put("targetCountry", service.getTargetCountry());
                stat.put("genderTarget", service.getGenderTarget());
                stat.put("reservationCount", reservationCount);
                stat.put("totalRevenue", serviceTotalRevenue);

                // 평균 예약 금액
                BigDecimal avgRevenue = reservationCount > 0
                        ? serviceTotalRevenue.divide(BigDecimal.valueOf(reservationCount), 2, BigDecimal.ROUND_HALF_UP)
                        : BigDecimal.ZERO;
                stat.put("avgRevenue", avgRevenue);

                serviceStats.add(stat);

                log.info("서비스: {}, 예약 수: {}, 총 매출: {}", service.getName(), reservationCount, serviceTotalRevenue);
            }

            // 예약 수 기준 내림차순 정렬
            serviceStats.sort((a, b) -> {
                Long countA = (Long) a.get("reservationCount");
                Long countB = (Long) b.get("reservationCount");
                return countB.compareTo(countA);
            });

            log.info("==============================");

        } catch (Exception e) {
            log.error("서비스 통계 조회 실패: ", e);
        }

        return serviceStats;
    }
    
    /**
     * 일일 매출 데이터 조회 (오늘 시간별 매출)
     */
    private List<Map<String, Object>> getDailyRevenueData(Integer companyId) {
        List<Map<String, Object>> dailyData = new ArrayList<>();
        
        try {
            CompanyUser company = companyUserRepository.findById(companyId).orElse(null);
            if (company == null) {
                return dailyData;
            }
            
            // 오늘 날짜
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDateTime startOfDay = today.atStartOfDay();
            java.time.LocalDateTime endOfDay = today.atTime(23, 59, 59);
            
            log.info("=== 일일 매출 데이터 디버깅 ===");
            log.info("업체 ID: {}, 조회 날짜: {}", companyId, today);
            
            // 오늘 생성된 모든 예약 조회 (created_at 기준)
            List<Reservation> todayReservations = reservationRepository.findByCompanyAndCreatedAtBetween(
                company, startOfDay, endOfDay
            );
            log.info("오늘 생성된 예약 총 수: {}", todayReservations.size());
            
            // 시간별로 매출 집계 (00시~23시)
            Map<Integer, BigDecimal> hourlyRevenue = new HashMap<>();
            for (int hour = 0; hour < 24; hour++) {
                hourlyRevenue.put(hour, BigDecimal.ZERO);
            }
            
            // 예약별로 시간대 계산 및 매출 집계
            for (Reservation reservation : todayReservations) {
                if (reservation.getCreatedAt() != null) {
                    int hour = reservation.getCreatedAt().getHour();
                    BigDecimal amount = reservation.getTotalAmount() != null 
                        ? reservation.getTotalAmount() 
                        : BigDecimal.ZERO;
                    hourlyRevenue.put(hour, hourlyRevenue.get(hour).add(amount));
                }
            }
            
            // 결과 데이터 생성
            for (int hour = 0; hour < 24; hour++) {
                Map<String, Object> hourData = new HashMap<>();
                hourData.put("hour", String.format("%02d:00", hour));
                hourData.put("revenue", hourlyRevenue.get(hour));
                dailyData.add(hourData);
                
                if (hourlyRevenue.get(hour).compareTo(BigDecimal.ZERO) > 0) {
                    log.info("{}시 매출: {}", hour, hourlyRevenue.get(hour));
                }
            }
            
            log.info("===============================");
            
        } catch (Exception e) {
            log.error("일일 매출 데이터 조회 중 오류 발생: ", e);
        }
        
        return dailyData;
    }
    
    /**
     * 월간 매출 데이터 조회 (최근 30일간 일별 매출)
     */
    private List<Map<String, Object>> getMonthlyRevenueData(Integer companyId) {
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        
        try {
            CompanyUser company = companyUserRepository.findById(companyId).orElse(null);
            if (company == null) {
                return monthlyData;
            }
            
            // 최근 30일 기간 설정
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate startDate = today.minusDays(29); // 오늘 포함 30일
            java.time.LocalDateTime startDateTime = startDate.atStartOfDay();
            java.time.LocalDateTime endDateTime = today.atTime(23, 59, 59);
            
            log.info("=== 월간 매출 데이터 디버깅 ===");
            log.info("업체 ID: {}, 조회 기간: {} ~ {}", companyId, startDate, today);
            
            // 해당 기간의 모든 예약 조회 (created_at 기준)
            List<Reservation> monthReservations = reservationRepository.findByCompanyAndCreatedAtBetween(
                company, startDateTime, endDateTime
            );
            log.info("조회된 예약 총 수: {}", monthReservations.size());
            
            // 일별로 매출 집계
            Map<java.time.LocalDate, BigDecimal> dailyRevenue = new HashMap<>();
            for (int i = 0; i < 30; i++) {
                java.time.LocalDate date = startDate.plusDays(i);
                dailyRevenue.put(date, BigDecimal.ZERO);
            }
            
            // 예약별로 날짜 계산 및 매출 집계
            for (Reservation reservation : monthReservations) {
                if (reservation.getCreatedAt() != null) {
                    java.time.LocalDate date = reservation.getCreatedAt().toLocalDate();
                    BigDecimal amount = reservation.getTotalAmount() != null 
                        ? reservation.getTotalAmount() 
                        : BigDecimal.ZERO;
                    
                    if (dailyRevenue.containsKey(date)) {
                        dailyRevenue.put(date, dailyRevenue.get(date).add(amount));
                    }
                }
            }
            
            // 결과 데이터 생성
            for (int i = 0; i < 30; i++) {
                java.time.LocalDate date = startDate.plusDays(i);
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("day", date.getMonthValue() + "/" + date.getDayOfMonth());
                dayData.put("revenue", dailyRevenue.get(date));
                monthlyData.add(dayData);
                
                if (dailyRevenue.get(date).compareTo(BigDecimal.ZERO) > 0) {
                    log.info("{}일 매출: {}", date, dailyRevenue.get(date));
                }
            }
            
            log.info("===============================");
            
        } catch (Exception e) {
            log.error("월간 매출 데이터 조회 중 오류 발생: ", e);
        }
        
        return monthlyData;
    }
}
