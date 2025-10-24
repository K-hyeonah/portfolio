package com.example.ApiRound.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ApiRound.crm.hyeonah.Repository.CompanyUserRepository;
import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;
import com.example.ApiRound.crm.yoyo.reservation.ReservationRepository;
import com.example.ApiRound.entity.MarketingMessage;
import com.example.ApiRound.repository.MarketingMessageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketingMessageService {

    private final MarketingMessageRepository marketingMessageRepository;
    private final CompanyUserRepository companyUserRepository;
    private final SocialUsersRepository socialUsersRepository;
    private final ReservationRepository reservationRepository;
    private final JavaMailSender mailSender;

    /**
     * 메시지 발송 요청
     */
    @Transactional
    public MarketingMessage sendMessage(Integer companyId, MarketingMessage message) {
        log.info("===== 마케팅 메시지 발송 시작 =====");
        log.info("companyId: {}, 제목: {}", companyId, message.getTitle());

        // 업체 정보 조회
        CompanyUser company = companyUserRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다."));

        message.setCompany(company);
        message.setCreatedAt(LocalDateTime.now());
        message.setUpdatedAt(LocalDateTime.now());

        // 즉시 발송인 경우
        if (message.getSendType() == MarketingMessage.SendType.IMMEDIATE) {
            // 대상 고객 수 계산 및 발송 처리
            boolean sendResult = false;
            int targetCount = 0;
            
            if (message.getTargetChannel() == MarketingMessage.TargetChannel.EMAIL) {
                // 이메일 발송
                sendResult = sendEmailToCustomers(message);
                targetCount = message.getTargetCount(); // sendEmailToCustomers에서 설정됨
            } else {
                // 푸시 알림 발송
                targetCount = calculateTargetCount(message.getTargetSegment());
                message.setTargetCount(targetCount);
                sendResult = sendPushNotification(message);
            }

            if (sendResult) {
                message.setStatus(MarketingMessage.Status.SENT);
                message.setSentAt(LocalDateTime.now());
                log.info("메시지 발송 성공 - 채널: {}, 대상: {}명", message.getTargetChannel(), targetCount);
            } else {
                message.setStatus(MarketingMessage.Status.FAILED);
                message.setFailCount(targetCount);
                log.error("메시지 발송 실패");
            }
        } else {
            // 예약 발송
            message.setStatus(MarketingMessage.Status.PENDING);
            log.info("예약 발송 등록 - 예약 시간: {}", message.getScheduledAt());
        }

        MarketingMessage saved = marketingMessageRepository.save(message);
        log.info("메시지 저장 완료 - ID: {}", saved.getMessageId());

        return saved;
    }

    /**
     * 대상 세그먼트에 따른 고객 수 계산
     */
    private int calculateTargetCount(MarketingMessage.TargetSegment segment) {
        return switch (segment) {
            case ALL -> (int) socialUsersRepository.countByIsDeletedFalse();
            case RECENT_30DAYS -> calculateRecent30DaysCustomers();
            case VIP -> calculateVipCustomers();
            case INACTIVE -> calculateInactiveCustomers();
            case FIRST_TIME -> calculateFirstTimeCustomers();
        };
    }

    private int calculateRecent30DaysCustomers() {
        // 최근 30일 이내에 예약한 사용자
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        // 최근 30일 예약 고객의 고유 사용자 수 계산
        Long count = reservationRepository.countDistinctUsersByDateAfter(thirtyDaysAgo);
        return count != null ? count.intValue() : 0;
    }

    private int calculateVipCustomers() {
        // VIP 고객: 총 예약 건수가 3회 이상인 고객
        Long count = reservationRepository.countUsersWithReservationsGreaterThan(3);
        return count != null ? count.intValue() : 0;
    }

    private int calculateInactiveCustomers() {
        // 장기 미방문 고객: 90일 이상 로그인하지 않은 고객
        LocalDateTime ninetyDaysAgo = LocalDateTime.now().minusDays(90);
        long count = socialUsersRepository.countByLastLoginAtBeforeAndIsDeletedFalse(ninetyDaysAgo);
        return (int) count;
    }

    private int calculateFirstTimeCustomers() {
        // 첫 방문 고객: 예약을 한 번도 하지 않은 사용자
        Long count = reservationRepository.countUsersWithNoReservations();
        return count != null ? count.intValue() : 0;
    }

    /**
     * 이메일 발송
     */
    private boolean sendEmailToCustomers(MarketingMessage message) {
        log.info("===== 이메일 발송 시작 =====");
        log.info("제목: {}", message.getTitle());
        log.info("내용: {}", message.getContent());
        log.info("대상 세그먼트: {}", message.getTargetSegment());

        try {
            // 대상 고객 조회
            List<SocialUsers> targetUsers = getTargetUsers(message.getTargetSegment());
            log.info("대상 고객 수: {}명", targetUsers.size());
            
            message.setTargetCount(targetUsers.size());
            
            int successCount = 0;
            int failCount = 0;

            // 각 고객에게 이메일 발송
            for (SocialUsers user : targetUsers) {
                if (user.getEmail() == null || user.getEmail().isEmpty()) {
                    failCount++;
                    continue;
                }

                try {
                    SimpleMailMessage mailMessage = new SimpleMailMessage();
                    mailMessage.setTo(user.getEmail());
                    mailMessage.setSubject("[HealnGo] " + message.getTitle());
                    
                    // 이메일 본문 구성
                    StringBuilder emailBody = new StringBuilder();
                    emailBody.append("안녕하세요, ").append(user.getName() != null ? user.getName() : "고객").append("님\n\n");
                    emailBody.append(message.getContent()).append("\n\n");
                    
                    if (message.getLinkUrl() != null && !message.getLinkUrl().isEmpty()) {
                        emailBody.append("자세히 보기: ").append(message.getLinkUrl()).append("\n\n");
                    }
                    
                    emailBody.append("---\n");
                    emailBody.append("발신: ").append(message.getCompany().getCompanyName()).append("\n");
                    emailBody.append("이 메일은 HealnGo 마케팅 수신 동의 고객에게 발송되었습니다.\n");
                    
                    mailMessage.setText(emailBody.toString());
                    mailMessage.setFrom("hannah6394@gmail.com");

                    mailSender.send(mailMessage);
                    successCount++;
                    
                    log.debug("이메일 발송 성공 - {}", user.getEmail());
                } catch (Exception e) {
                    failCount++;
                    log.error("이메일 발송 실패 - {}: {}", user.getEmail(), e.getMessage());
                }
            }

            message.setSuccessCount(successCount);
            message.setFailCount(failCount);

            log.info("이메일 발송 완료 - 성공: {}명, 실패: {}명", successCount, failCount);
            
            return successCount > 0;

        } catch (Exception e) {
            log.error("이메일 발송 중 오류 발생", e);
            return false;
        }
    }

    /**
     * 대상 세그먼트에 따른 사용자 목록 조회
     */
    private List<SocialUsers> getTargetUsers(MarketingMessage.TargetSegment segment) {
        return switch (segment) {
            case ALL -> socialUsersRepository.findAll().stream()
                    .filter(u -> !u.getIsDeleted())
                    .toList();
            case RECENT_30DAYS -> getRecent30DaysUsers();
            case VIP -> getVipUsers();
            case INACTIVE -> getInactiveUsers();
            case FIRST_TIME -> getFirstTimeUsers();
        };
    }

    private List<SocialUsers> getRecent30DaysUsers() {
        // TODO: 최근 30일 예약한 사용자 목록
        return List.of();
    }

    private List<SocialUsers> getVipUsers() {
        // TODO: 예약 3회 이상 사용자 목록
        return List.of();
    }

    private List<SocialUsers> getInactiveUsers() {
        LocalDateTime ninetyDaysAgo = LocalDateTime.now().minusDays(90);
        return socialUsersRepository.findAll().stream()
                .filter(u -> !u.getIsDeleted())
                .filter(u -> u.getLastLoginAt() != null && u.getLastLoginAt().isBefore(ninetyDaysAgo))
                .toList();
    }

    private List<SocialUsers> getFirstTimeUsers() {
        // TODO: 예약 없는 사용자 목록
        return List.of();
    }

    /**
     * 실제 푸시 알림 발송
     * TODO: Firebase Cloud Messaging 또는 다른 푸시 서비스 연동
     */
    private boolean sendPushNotification(MarketingMessage message) {
        log.info("===== 푸시 알림 발송 =====");
        log.info("제목: {}", message.getTitle());
        log.info("내용: {}", message.getContent());
        log.info("대상 세그먼트: {}", message.getTargetSegment());
        log.info("대상 고객 수: {}", message.getTargetCount());

        // TODO: 실제 푸시 알림 전송 로직 구현
        // 예시:
        // 1. Firebase Admin SDK 초기화
        // 2. 대상 고객의 FCM 토큰 조회
        // 3. 푸시 메시지 전송
        // 4. 결과 반환

        // 현재는 시뮬레이션 (항상 성공)
        log.info("푸시 알림 발송 완료 (시뮬레이션)");
        return true;
    }

    /**
     * 업체별 메시지 목록 조회
     */
    @Transactional(readOnly = true)
    public List<MarketingMessage> getMessagesByCompany(Integer companyId) {
        return marketingMessageRepository.findByCompany_CompanyIdOrderByCreatedAtDesc(companyId);
    }

    /**
     * 업체별 메시지 페이징 조회
     */
    @Transactional(readOnly = true)
    public Page<MarketingMessage> getMessagesByCompanyPaged(Integer companyId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return marketingMessageRepository.findByCompany_CompanyId(companyId, pageable);
    }

    /**
     * 예약 발송 처리 (스케줄러에서 호출)
     */
    @Transactional
    public void processScheduledMessages() {
        List<MarketingMessage> scheduledMessages = 
            marketingMessageRepository.findScheduledMessagesToSend(LocalDateTime.now());

        for (MarketingMessage message : scheduledMessages) {
            try {
                int targetCount = calculateTargetCount(message.getTargetSegment());
                message.setTargetCount(targetCount);

                boolean sendResult = sendPushNotification(message);

                if (sendResult) {
                    message.setStatus(MarketingMessage.Status.SENT);
                    message.setSentAt(LocalDateTime.now());
                    message.setSuccessCount(targetCount);
                } else {
                    message.setStatus(MarketingMessage.Status.FAILED);
                    message.setFailCount(targetCount);
                }

                marketingMessageRepository.save(message);
            } catch (Exception e) {
                log.error("예약 메시지 발송 실패 - messageId: {}", message.getMessageId(), e);
            }
        }
    }

    /**
     * 메시지 발송 통계
     */
    @Transactional(readOnly = true)
    public Object[] getMessageStats(Integer companyId) {
        return marketingMessageRepository.getMessageStats(companyId);
    }
}

