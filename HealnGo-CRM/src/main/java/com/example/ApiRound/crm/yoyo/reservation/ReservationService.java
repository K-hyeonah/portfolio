package com.example.ApiRound.crm.yoyo.reservation;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ReservationService {

    // 예약 생성
    ReservationDto createReservation(ReservationDto reservationDto);

    // 예약 조회 (상세)
    ReservationDto getReservationById(Long id);

    // 예약 조회 (상세 + FK 정보)
    ReservationDto getReservationWithDetails(Long id);

    // 사용자별 예약 목록
    List<ReservationDto> getUserReservations(Integer userId);

    // 업체별 예약 목록
    List<ReservationDto> getCompanyReservations(Integer companyId);

    // 업체별 예약 목록 (페이징)
    Page<ReservationDto> getCompanyReservations(Integer companyId, Pageable pageable);

    // 특정 날짜의 예약 목록
    List<ReservationDto> getCompanyReservationsByDate(Integer companyId, LocalDate date);

    // 예약 상태별 조회 (업체)
    List<ReservationDto> getCompanyReservationsByStatus(Integer companyId, String status);

    // 예약 상태별 조회 (사용자)
    List<ReservationDto> getUserReservationsByStatus(Integer userId, String status);

    // 예약 수정
    ReservationDto updateReservation(Long id, ReservationDto reservationDto);

    // 예약 취소
    ReservationDto cancelReservation(Long id);

    // 예약 완료 처리
    ReservationDto completeReservation(Long id);

    // 예약 상태 변경
    ReservationDto updateReservationStatus(Long id, String status);

    // 예약 가능 시간 확인
    boolean isTimeSlotAvailable(Integer companyId, LocalDate date, LocalTime startTime, LocalTime endTime);

    // 날짜 범위별 예약 조회
    List<ReservationDto> getCompanyReservationsByDateRange(Integer companyId, LocalDate startDate, LocalDate endDate);

    // 예약 통계
    Long getReservationCountByCompanyAndStatus(Integer companyId, String status);

    // 관리자용 - 전체 예약 목록 (페이징)
    Page<ReservationDto> getAllReservations(Pageable pageable);

    // 관리자용 - 상태별 예약 목록 (페이징)
    Page<ReservationDto> getReservationsByStatus(String status, Pageable pageable);

    // 관리자용 - 예약 삭제
    void deleteReservation(Long id);
}
