package project1.project1_spring.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import project1.project1_spring.dto.FindIdRequest;
import project1.project1_spring.service.IdService;

import java.util.NoSuchElementException;

@Controller
@SessionAttributes("findIdRequest")
@RequiredArgsConstructor
public class FindIdController {

    private final IdService idService;

    @GetMapping("/findid")
    public String findIdForm(Model model) {
        model.addAttribute("findIdRequest", new FindIdRequest());
        return "findid";
    }

    @PostMapping("/findid")
    public String findId(@ModelAttribute FindIdRequest idReq, BindingResult br, RedirectAttributes ra) {
        try {
            String userId = idService.findUserId(idReq);
            ra.addFlashAttribute("findUserId", userId);
            return "redirect:/find-id-res";
        } catch (IllegalArgumentException | NoSuchElementException e) {
            br.reject("error", e.getMessage());
            return "findid";
        }
    }

    @GetMapping("/find-id-res")
    public String findIdRes() {
        return "find-id-res";
    }
}