package project1.project1_spring.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import project1.project1_spring.domain.UserJoinDto;
import project1.project1_spring.service.JoinService;

@Controller
@RequiredArgsConstructor
public class SignUpController {

    private final JoinService joinService;
    /**
     * 회원가입 화면
     */
    @GetMapping("/signup")
    public String form(Model model){
        if(!model.containsAttribute("userJoinDto")){
            model.addAttribute("userJoinDto", new UserJoinDto());
        }
        return "signup";
    }


    /**
     * 회원가입 처리
     */
    @PostMapping("/signup")
    public String signup(@ModelAttribute("userJoinDto") UserJoinDto userJoinDto, Model model) {
        try {
            joinService.registerUser(userJoinDto);
            return "redirect:/login";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "signup";
        } catch (Exception e) {
            model.addAttribute("error", "회원가입 중 서버 오류가 발생했습니다.");
            return "signup";
        }
    }
}