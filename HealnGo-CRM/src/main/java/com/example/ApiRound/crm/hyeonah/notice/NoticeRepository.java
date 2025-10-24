package com.example.ApiRound.crm.hyeonah.notice;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Integer> {
    
    // 공지사항 목록 조회 (고정 공지 먼저, 발행일 최신순)
    @Query("SELECT n FROM Notice n WHERE n.publishAt <= :now ORDER BY n.isPinned DESC, n.publishAt DESC")
    Page<Notice> findAllPublishedOrderByPinnedAndPublishAt(@Param("now") LocalDateTime now, Pageable pageable);
    
    // 대상별 공지사항 조회
    @Query("SELECT n FROM Notice n WHERE n.publishAt <= :now AND (n.audience = :audience OR n.audience = 'ALL') ORDER BY n.isPinned DESC, n.publishAt DESC")
    Page<Notice> findByAudienceOrderByPinnedAndPublishAt(@Param("audience") Notice.Audience audience, @Param("now") LocalDateTime now, Pageable pageable);
    
    // 관리자용 전체 공지사항 조회 (발행 예정 포함)
    @Query("SELECT n FROM Notice n ORDER BY n.isPinned DESC, n.createdAt DESC")
    Page<Notice> findAllOrderByPinnedAndCreatedAt(Pageable pageable);
}

