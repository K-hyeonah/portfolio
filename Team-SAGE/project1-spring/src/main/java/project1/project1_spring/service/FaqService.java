package project1.project1_spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project1.project1_spring.entity.Faq;
import project1.project1_spring.repository.FaqRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FaqService {

    private final FaqRepository faqRepository;

    @Autowired
    public FaqService(FaqRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    public List<Faq> findAll() {
        return faqRepository.findAllByOrderByCreatedAtDesc();
    }

    public Faq findById(Long id) {
        return faqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("FAQ not found: id=" + id));
    }

    public void save(Faq faq) {
        // 필요한 초기값 설정
        if (faq.getWriter() == null) {
            faq.setWriter("관리자");
        }
        if (faq.getCreatedAt()== null) {
            faq.setCreatedAt(LocalDateTime.now());
        }
        if (faq.getPostType() == null) {
            faq.setPostType("FAQ");
        }

        faqRepository.save(faq);
    }

    // 최신 FAQ 조회
    public List<Faq> findRecentFaqs(int limit) {
        List<Faq> allFaqs = faqRepository.findTopByOrderByCreatedAtDesc(limit);
        return allFaqs.stream().limit(limit).toList();
    }

    // 페이징 처리
    public List<Faq> findPaginated(int pageSize, int offset) {
        return faqRepository.findPaginated(pageSize, offset);
    }

    // 전체 게시글 수 조회
    public int getTotalCount() {
        return faqRepository.getTotalCount();
    }
}
