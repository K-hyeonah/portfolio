package project1.project1_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import project1.project1_spring.entity.Faq;
import project1.project1_spring.service.FaqService;

import java.util.List;

@Controller
@RequestMapping("/faq")
public class FaqController {

    private final FaqService faqService;

    @Autowired
    public FaqController(FaqService faqService) {
        this.faqService = faqService;
    }

    @GetMapping
    public String showFaqPage(@RequestParam(defaultValue = "1") int page, Model model) {
        int pageSize = 10; // 한 페이지당 10개
        int offset = (page - 1) * pageSize;
        
        List<Faq> faqList = faqService.findPaginated(pageSize, offset);
        int totalFaqs = faqService.getTotalCount();
        int totalPages = (int) Math.ceil((double) totalFaqs / pageSize);
        
        model.addAttribute("faqList", faqList);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("totalFaqs", totalFaqs);
        
        return "faq";
    }

    @GetMapping("/write")
    public String showFaqWritePage() {
        return "faq-faqwrite";
    }

    @PostMapping("/write")
    public String createFaq(Faq faqDto) {
        faqService.save(faqDto);
        return "redirect:/faq";
    }

    @GetMapping("/{id}")
    public String showFaqDetailPage(@PathVariable("id") Long id, Model model) {
        Faq faq = faqService.findById(id);
        model.addAttribute("faq", faq);
        return "faq-detail";
    }


}