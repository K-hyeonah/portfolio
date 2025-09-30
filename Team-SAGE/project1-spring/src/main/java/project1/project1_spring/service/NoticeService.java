package project1.project1_spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project1.project1_spring.entity.Notice;
import project1.project1_spring.repository.NoticeRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @Autowired
    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // 전체 목록 조회 (최신순)
    public List<Notice> findAll() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    // 상세 조회
    public Notice findById(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 공지사항이 존재하지 않습니다. ID: " + id));
    }

    // 저장
    public void saveNotice(String title, String content) {
        Notice newNotice = new Notice();
        newNotice.setTitle(title);
        newNotice.setContent(content);
        newNotice.setWriter("관리자");
        newNotice.setViewCount(0);
        newNotice.setPostType("NOTICE");
        newNotice.setCreatedAt(LocalDateTime.now());

        noticeRepository.save(newNotice);
    }

    // 최신 공지사항 조회
    public List<Notice> findRecentNotices(int limit) {
        List<Notice> allNotices = noticeRepository.findTopByOrderByCreatedAtDesc(limit);
        return allNotices.stream().limit(limit).toList();
    }

    // 페이징 처리
    public List<Notice> findPaginated(int pageSize, int offset) {
        return noticeRepository.findPaginated(pageSize, offset);
    }

    // 전체 게시글 수 조회
    public int getTotalCount() {
        return noticeRepository.getTotalCount();
    }
}
