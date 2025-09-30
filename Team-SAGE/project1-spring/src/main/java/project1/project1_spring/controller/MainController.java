package project1.project1_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import project1.project1_spring.entity.Faq;
import project1.project1_spring.entity.Notice;
import project1.project1_spring.service.FaqService;
import project1.project1_spring.service.NoticeService;

import java.util.List;

@Controller
public class MainController {

    private final NoticeService noticeService;
    private final FaqService faqService;

    @Autowired
    public MainController(NoticeService noticeService, FaqService faqService) {
        this.noticeService = noticeService;
        this.faqService = faqService;
    }

    @GetMapping("/")
    public String showMainPage(Model model) {
        // 최신 공지사항 3개 가져오기
        List<Notice> recentNotices = noticeService.findRecentNotices(3);
        model.addAttribute("recentNotices", recentNotices);
        
        // 최신 FAQ 3개 가져오기
        List<Faq> recentFaqs = faqService.findRecentFaqs(3);
        model.addAttribute("recentFaqs", recentFaqs);
        
        return "main";
    }
}