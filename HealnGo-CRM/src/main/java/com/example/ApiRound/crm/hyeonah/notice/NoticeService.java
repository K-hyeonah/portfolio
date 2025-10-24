package com.example.ApiRound.crm.hyeonah.notice;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NoticeService {
    
    // 공지사항 목록 조회 (사용자용 - 발행된 것만)
    Page<Notice> getPublishedNotices(Pageable pageable);
    
    // 대상별 공지사항 조회
    Page<Notice> getPublishedNoticesByAudience(Notice.Audience audience, Pageable pageable);
    
    // 관리자용 전체 공지사항 조회
    Page<Notice> getAllNotices(Pageable pageable);
    
    // 공지사항 상세 조회
    Notice getNoticeById(Integer noticeId);
    
    // 공지사항 작성
    Notice createNotice(Notice notice);
    
    // 공지사항 수정
    Notice updateNotice(Notice notice);
    
    // 공지사항 삭제
    void deleteNotice(Integer noticeId);
}

