package project1.project1_spring.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import project1.project1_spring.dto.PasswordDto;
import project1.project1_spring.service.VerifyService;

import java.util.NoSuchElementException;

@Controller
@RequiredArgsConstructor
@SessionAttributes("verifiedUserId")
public class VerifyPasswordController {

    private final VerifyService verifyService;

    // 비밀번호 확인 폼
    @GetMapping("/verify")
    public String verifyPasswordForm(Model model){
        model.addAttribute("passwordDto", new PasswordDto());
        return "verify-password";
    }

    // 비밀번호 검증
    @PostMapping("/verify")
    public String verifyPassword(@AuthenticationPrincipal User principal,
                                 @ModelAttribute("passwordDto") @Valid PasswordDto dto,
                                 BindingResult br,
                                 Model model){
        if(br.hasErrors()){
            return "verify-password";
        }

        try{
            verifyService.verifyPassword(principal.getUsername(), dto.getCurrentPassword());
            model.addAttribute("verifiedUserId",principal.getUsername());
            return "redirect:/editinfo";
        } catch(IllegalArgumentException | NoSuchElementException e){
            br.reject("error", e.getMessage());
            return "verify-password";
        }
    }
}