package project1.project1_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class InquiryController {

    @GetMapping("/inquiry")
    public String showInquiryPage() {
        return "inquiry";
    }
    
    @GetMapping("/inquiry/write")
    public String showInquiryWritePage() {
        return "inquiry-write";
    }
    
    @PostMapping("/inquiry/write")
    public String createInquiry(@RequestParam("type") String type,
                               @RequestParam("title") String title,
                               @RequestParam("content") String content) {
        // TODO: 문의사항 저장 로직 구현
        // 현재는 문의 내역 페이지로 리다이렉트
        return "redirect:/inquiry";
    }
}