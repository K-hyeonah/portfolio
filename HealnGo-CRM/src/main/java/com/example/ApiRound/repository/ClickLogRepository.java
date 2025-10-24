package com.example.ApiRound.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.ApiRound.entity.ClickLog;

@Repository
public interface ClickLogRepository extends JpaRepository<ClickLog, Long> {

    // 최근 기간 내 아이템별 클릭 상위
    @Query("""
           SELECT c.itemId AS itemId, COUNT(c) AS clickCount
             FROM ClickLog c
            WHERE c.clickedAt >= :startDate
            GROUP BY c.itemId
            ORDER BY clickCount DESC
           """)
    List<Object[]> findTopCompaniesByClickCount(@Param("startDate") LocalDateTime startDate);

    long countByCompanyIdAndClickedAtAfter(Long companyId, LocalDateTime clickedAt);
    long countByCompanyIdAndClickedAtBetween(Long companyId, LocalDateTime start, LocalDateTime end);
}
