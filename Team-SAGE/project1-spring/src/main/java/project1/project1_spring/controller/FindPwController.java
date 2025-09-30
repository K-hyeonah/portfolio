package project1.project1_spring.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import project1.project1_spring.dto.ResetPasswordRequest;
import project1.project1_spring.dto.VerificationRequest;
import project1.project1_spring.service.PasswordService;

import java.util.NoSuchElementException;

@Controller
@RequestMapping("/find-pw")
@SessionAttributes("resetPasswordRequest")
@RequiredArgsConstructor
public class FindPwController {

    private final PasswordService passwordService;

    @GetMapping
    public String findPwForm(Model model) {
        model.addAttribute("verificationRequest", new VerificationRequest());
        return "findpw";
    }

    @PostMapping
    public String findPw(@Valid @ModelAttribute VerificationRequest vreq
            , BindingResult br, Model model, RedirectAttributes ra) {
        try{
            if(br.hasErrors()) {
                return "findpw";
            }

            passwordService.verifyIdentity(vreq);
            ResetPasswordRequest req = new ResetPasswordRequest();
            req.setUserId(vreq.getUserId());
            model.addAttribute("resetPasswordRequest", req);
            return "redirect:/find-pw/reset";
        } catch (Exception e){
            ra.addFlashAttribute("error", e.getMessage());
            return "redirect:/find-pw";
        }
    }

    @GetMapping("/reset")
    public String resetPwForm(@SessionAttribute(value = "verifiedUserId", required = false) String verifiedUserId
            , @ModelAttribute ResetPasswordRequest resetPasswordRequest
            , Model model) {

        if(!model.containsAttribute("resetPasswordRequest")){
            return "redirect:/find-pw";
        }
        return "find-pw-res";
    }

    @PostMapping("/reset")
    public String resetPw(@Valid @ModelAttribute("resetPasswordRequest") ResetPasswordRequest resetPasswordRequest
            , BindingResult br, RedirectAttributes ra, SessionStatus status, Model model) {
        try{
            if(br.hasErrors()) {
                return "find-pw-res";
            }

            passwordService.resetPassword(resetPasswordRequest);
            status.setComplete();
            ra.addFlashAttribute("message", "비밀번호가 성공적으로 변경되었습니다.");
            return "redirect:/login";
        } catch (IllegalArgumentException | NoSuchElementException e){
            br.reject("error", e.getMessage());
            return "/find-pw";
        }
    }
}