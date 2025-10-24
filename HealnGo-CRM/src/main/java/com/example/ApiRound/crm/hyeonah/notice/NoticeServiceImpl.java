package com.example.ApiRound.crm.hyeonah.notice;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeServiceImpl implements NoticeService {
    
    private final NoticeRepository noticeRepository;
    
    @Override
    @Transactional(readOnly = true)
    public Page<Notice> getPublishedNotices(Pageable pageable) {
        return noticeRepository.findAllPublishedOrderByPinnedAndPublishAt(LocalDateTime.now(), pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Notice> getPublishedNoticesByAudience(Notice.Audience audience, Pageable pageable) {
        return noticeRepository.findByAudienceOrderByPinnedAndPublishAt(audience, LocalDateTime.now(), pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Notice> getAllNotices(Pageable pageable) {
        return noticeRepository.findAllOrderByPinnedAndCreatedAt(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Notice getNoticeById(Integer noticeId) {
        return noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지사항을 찾을 수 없습니다."));
    }
    
    @Override
    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }
    
    @Override
    public Notice updateNotice(Notice notice) {
        Notice existingNotice = getNoticeById(notice.getNoticeId());
        existingNotice.setTitle(notice.getTitle());
        existingNotice.setBody(notice.getBody());
        existingNotice.setAudience(notice.getAudience());
        existingNotice.setIsPinned(notice.getIsPinned());
        existingNotice.setPublishAt(notice.getPublishAt());
        return noticeRepository.save(existingNotice);
    }
    
    @Override
    public void deleteNotice(Integer noticeId) {
        noticeRepository.deleteById(noticeId);
    }
}

