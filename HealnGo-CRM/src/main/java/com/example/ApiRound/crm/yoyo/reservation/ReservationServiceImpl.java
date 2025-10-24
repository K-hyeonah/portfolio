package com.example.ApiRound.crm.yoyo.reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.hyeonah.Repository.CompanyUserRepository;

@Slf4j
@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private SocialUsersRepository socialUsersRepository;

    @Autowired
    private CompanyUserRepository companyUserRepository;

    @Override
    public ReservationDto createReservation(ReservationDto reservationDto) {
        // 사용자와 업체 정보 조회
        SocialUsers user = socialUsersRepository.findById(reservationDto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        log.info("CompanyUser 조회 시작 - companyId: {}", reservationDto.getCompanyId());
        
        // 먼저 company_user 테이블의 모든 레코드 조회해서 확인
        List<CompanyUser> allCompanies = companyUserRepository.findAll();
        log.info("company_user 테이블의 모든 레코드 수: {}", allCompanies.size());
        for (CompanyUser comp : allCompanies) {
            log.info("Company ID: {}, Name: {}", comp.getCompanyId(), comp.getCompanyName());
        }
        
        CompanyUser company;
        try {
            company = companyUserRepository.findById(reservationDto.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다. companyId: " + reservationDto.getCompanyId()));
        } catch (RuntimeException e) {
            // companyId가 존재하지 않으면 첫 번째 company 사용
            if (!allCompanies.isEmpty()) {
                company = allCompanies.get(0);
                log.warn("요청된 companyId {}가 존재하지 않아 첫 번째 company 사용: ID={}, Name={}", 
                        reservationDto.getCompanyId(), company.getCompanyId(), company.getCompanyName());
            } else {
                throw new RuntimeException("company_user 테이블에 데이터가 없습니다.");
            }
        }

        // 시간대 중복 확인
        if (!isTimeSlotAvailable(reservationDto.getCompanyId(), reservationDto.getDate(), 
                                reservationDto.getStartTime(), reservationDto.getEndTime())) {
            throw new RuntimeException("해당 시간대는 이미 예약이 있습니다.");
        }

        // Entity 생성
        Reservation reservation = Reservation.builder()
                .title(reservationDto.getTitle())
                .date(reservationDto.getDate())
                .startTime(reservationDto.getStartTime())
                .endTime(reservationDto.getEndTime())
                .description(reservationDto.getDescription())
                .location(reservationDto.getLocation())
                .status(reservationDto.getStatus() != null ? reservationDto.getStatus() : "CONFIRMED")
                .googleEventId(reservationDto.getGoogleEventId())
                .googleSyncEnabled(reservationDto.getGoogleSyncEnabled() != null ? reservationDto.getGoogleSyncEnabled() : false)
                .totalAmount(reservationDto.getTotalAmount())
                .serviceId(reservationDto.getServiceId())  // serviceId 추가
                .itemId(reservationDto.getItemId())  // itemId 추가
                .user(user)
                .company(company)
                .build();

        // 저장
        Reservation savedReservation = reservationRepository.save(reservation);
        return convertToDto(savedReservation);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservationDto getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        return convertToDto(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservationDto getReservationWithDetails(Long id) {
        Reservation reservation = reservationRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        return convertToDtoWithDetails(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDto> getUserReservations(Integer userId) {
        SocialUsers user = socialUsersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        List<Reservation> reservations = reservationRepository.findByUserOrderByDateDescStartTimeDesc(user);
        return reservations.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDto> getCompanyReservations(Integer companyId) {
        CompanyUser company = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));
        
        List<Reservation> reservations = reservationRepository.findByCompanyOrderByDateDescStartTimeDesc(company);
        return reservations.stream().map(this::convertToDtoWithDetails).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReservationDto> getCompanyReservations(Integer companyId, Pageable pageable) {
        CompanyUser company = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));
        
        Page<Reservation> reservations = reservationRepository.findByCompanyOrderByDateDescStartTimeDesc(company, pageable);
        return reservations.map(this::convertToDtoWithDetails);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDto> getCompanyReservationsByDate(Integer companyId, LocalDate date) {
        CompanyUser company = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));
        
        List<Reservation> reservations = reservationRepository.findByCompanyAndDateOrderByStartTimeAsc(company, date);
        return reservations.stream().map(this::convertToDtoWithDetails).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDto> getCompanyReservationsByStatus(Integer companyId, String status) {
        CompanyUser company = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));
        
        List<Reservation> reservations = reservationRepository.findByCompanyAndStatusOrderByDateDescStartTimeDesc(company, status);
        return reservations.stream().map(this::convertToDtoWithDetails).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDto> getUserReservationsByStatus(Integer userId, String status) {
        SocialUsers user = socialUsersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        List<Reservation> reservations = reservationRepository.findByUserAndStatusOrderByDateDescStartTimeDesc(user, status);
        return reservations.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public ReservationDto updateReservation(Long id, ReservationDto reservationDto) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));

        // 시간대 중복 확인 (자기 자신 제외)
        if (!isTimeSlotAvailable(reservationDto.getCompanyId(), reservationDto.getDate(), 
                                reservationDto.getStartTime(), reservationDto.getEndTime(), id)) {
            throw new RuntimeException("해당 시간대는 이미 예약이 있습니다.");
        }

        // 업데이트
        reservation.setTitle(reservationDto.getTitle());
        reservation.setDate(reservationDto.getDate());
        reservation.setStartTime(reservationDto.getStartTime());
        reservation.setEndTime(reservationDto.getEndTime());
        reservation.setDescription(reservationDto.getDescription());
        reservation.setLocation(reservationDto.getLocation());
        reservation.setStatus(reservationDto.getStatus());
        reservation.setGoogleEventId(reservationDto.getGoogleEventId());
        reservation.setGoogleSyncEnabled(reservationDto.getGoogleSyncEnabled());
        reservation.setTotalAmount(reservationDto.getTotalAmount());
        reservation.setServiceId(reservationDto.getServiceId());  // serviceId 추가
        reservation.setItemId(reservationDto.getItemId());  // itemId 추가

        Reservation savedReservation = reservationRepository.save(reservation);
        return convertToDto(savedReservation);
    }

    @Override
    public ReservationDto cancelReservation(Long id) {
        return updateReservationStatus(id, "CANCELLED");
    }

    @Override
    public ReservationDto completeReservation(Long id) {
        return updateReservationStatus(id, "COMPLETED");
    }

    @Override
    public ReservationDto updateReservationStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        
        reservation.setStatus(status);
        Reservation savedReservation = reservationRepository.save(reservation);
        return convertToDto(savedReservation);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isTimeSlotAvailable(Integer companyId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        return isTimeSlotAvailable(companyId, date, startTime, endTime, null);
    }

    private boolean isTimeSlotAvailable(Integer companyId, LocalDate date, LocalTime startTime, LocalTime endTime, Long excludeId) {
        CompanyUser company = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));
        
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(company, date, startTime, endTime);
        
        // 자기 자신 제외
        if (excludeId != null) {
            overlappingReservations = overlappingReservations.stream()
                    .filter(r -> !r.getId().equals(excludeId))
                    .collect(Collectors.toList());
        }
        
        return overlappingReservations.isEmpty();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDto> getCompanyReservationsByDateRange(Integer companyId, LocalDate startDate, LocalDate endDate) {
        CompanyUser company = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));
        
        // created_at 기준으로 조회 (최근 업데이트용)
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<Reservation> reservations = reservationRepository.findByCompanyAndCreatedAtBetween(company, startDateTime, endDateTime);
        return reservations.stream().map(this::convertToDtoWithDetails).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Long getReservationCountByCompanyAndStatus(Integer companyId, String status) {
        CompanyUser company = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("업체를 찾을 수 없습니다."));
        
        return reservationRepository.countByCompanyAndStatus(company, status);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReservationDto> getAllReservations(Pageable pageable) {
        Page<Reservation> reservations = reservationRepository.findAllWithDetails(pageable);
        return reservations.map(this::convertToDtoWithDetails);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReservationDto> getReservationsByStatus(String status, Pageable pageable) {
        Page<Reservation> reservations = reservationRepository.findByStatusWithDetails(status, pageable);
        return reservations.map(this::convertToDtoWithDetails);
    }

    @Override
    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("예약을 찾을 수 없습니다.");
        }
        reservationRepository.deleteById(id);
    }

    // Entity를 DTO로 변환 (기본)
    private ReservationDto convertToDto(Reservation reservation) {
        return ReservationDto.builder()
                .id(reservation.getId())
                .title(reservation.getTitle())
                .date(reservation.getDate())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .description(reservation.getDescription())
                .location(reservation.getLocation())
                .status(reservation.getStatus())
                .googleEventId(reservation.getGoogleEventId())
                .googleSyncEnabled(reservation.getGoogleSyncEnabled())
                .totalAmount(reservation.getTotalAmount())
                .serviceId(reservation.getServiceId())  // serviceId 추가
                .itemId(reservation.getItemId())  // itemId 추가
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .userId(reservation.getUser().getUserId())
                .companyId(reservation.getCompany().getCompanyId())
                .build();
    }

    // Entity를 DTO로 변환 (FK 정보 포함)
    private ReservationDto convertToDtoWithDetails(Reservation reservation) {
        ReservationDto dto = convertToDto(reservation);
        
        // 고객 정보 설정 (null 체크)
        if (reservation.getUser() != null) {
            dto.setCustomerName(reservation.getUser().getName());
            dto.setCustomerContact(reservation.getUser().getPhone());
        } else {
            dto.setCustomerName("고객 정보 없음");
            dto.setCustomerContact("연락처 없음");
        }
        
        // 업체 정보 설정 (null 체크)
        if (reservation.getCompany() != null) {
            dto.setClinicName(reservation.getCompany().getCompanyName());
        } else {
            dto.setClinicName("업체 정보 없음");
        }
        
        return dto;
    }
}
