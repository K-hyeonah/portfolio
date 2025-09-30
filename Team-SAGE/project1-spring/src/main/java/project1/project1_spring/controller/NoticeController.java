package project1.project1_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import project1.project1_spring.entity.Notice;
import project1.project1_spring.service.NoticeService;

import java.util.List;

@Controller
@RequestMapping("/notice")
public class NoticeController {

    private final NoticeService noticeService;

    @Autowired
    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    // 공지 목록 조회 (페이징)
    @GetMapping
    public String showNoticePage(@RequestParam(defaultValue = "1") int page, Model model) {
        int pageSize = 10; // 한 페이지당 10개
        int offset = (page - 1) * pageSize;
        
        List<Notice> noticeList = noticeService.findPaginated(pageSize, offset);
        int totalNotices = noticeService.getTotalCount();
        int totalPages = (int) Math.ceil((double) totalNotices / pageSize);
        
        model.addAttribute("noticeList", noticeList);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("totalNotices", totalNotices);
        
        return "notice"; // notice.html
    }

    // 글쓰기 폼 이동
    @GetMapping("/write")
    public String showNoticeWritePage() {
        return "notice-noticewrite"; // 글쓰기 폼
    }

    // 글 저장 처리
    @PostMapping("/write")
    public String saveNotice(@RequestParam("title") String title,
                             @RequestParam("content") String content) {
        noticeService.saveNotice(title, content);
        return "redirect:/notice";
    }

    // 상세 페이지
    @GetMapping("/{id}")
    public String showNoticeDetailPage(@PathVariable("id") Long id, Model model) {
        Notice notice = noticeService.findById(id);
        model.addAttribute("notice", notice);
        return "notice-detail"; // 상세 페이지
    }
}
