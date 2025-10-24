package com.example.ApiRound.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.ApiRound.entity.MarketingMessage;
import com.example.ApiRound.entity.MarketingMessage.Status;

@Repository
public interface MarketingMessageRepository extends JpaRepository<MarketingMessage, Integer> {
    
    // 업체별 메시지 조회
    List<MarketingMessage> findByCompany_CompanyIdOrderByCreatedAtDesc(Integer companyId);
    
    Page<MarketingMessage> findByCompany_CompanyId(Integer companyId, Pageable pageable);
    
    // 상태별 조회
    List<MarketingMessage> findByStatus(Status status);
    
    // 예약 발송 대기 메시지 조회
    @Query("SELECT m FROM MarketingMessage m WHERE m.sendType = 'SCHEDULED' AND m.status = 'PENDING' AND m.scheduledAt <= :now")
    List<MarketingMessage> findScheduledMessagesToSend(@Param("now") LocalDateTime now);
    
    // 업체별 발송 통계
    @Query("SELECT COUNT(m), SUM(m.targetCount), SUM(m.successCount) FROM MarketingMessage m WHERE m.company.companyId = :companyId AND m.status = 'SENT'")
    Object[] getMessageStats(@Param("companyId") Integer companyId);
}

