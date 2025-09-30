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
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import project1.project1_spring.dto.ProfileResponse;
import project1.project1_spring.dto.UpdateProfileRequest;
import project1.project1_spring.service.MypageService;

import java.util.NoSuchElementException;

@Controller
@RequiredArgsConstructor
@SessionAttributes({"userId", "user"})
public class MyPageController {

    private final MypageService mypageService;

    @GetMapping("/mypage")
    public String mypage(@AuthenticationPrincipal User principal,
                         Model model){

        if(model.containsAttribute("updateUser")){
            ProfileResponse updateUser = (ProfileResponse) model.getAttribute("updateUser");
            UpdateProfileRequest updateRequest = null;
            String userId = null;
            if (updateUser != null) {
                userId = updateUser.getUserId();
                updateRequest = mypageService.setInfo(userId, updateUser);
                model.addAttribute("userId", userId);

                model.addAttribute("user", updateRequest);
            }

        } else {
            String userId = principal.getUsername();
            model.addAttribute("userId", userId);

            if (userId == null) {
                return "redirect:/login";
            }

            ProfileResponse user = mypageService.getProfile(userId);
            UpdateProfileRequest updateRequest = mypageService.setInfo(userId, user);

            model.addAttribute("user", updateRequest);
        }
        return "mypage";
    }

    @GetMapping("/editinfo")
    public String editInfoForm(
            @ModelAttribute("userId") String userId,
            @ModelAttribute("user") UpdateProfileRequest req){

        return "editinfo";
    }

    @PostMapping("/editinfo")
    public String editInfo(
            @ModelAttribute("userId") String userId,
            @Valid @ModelAttribute("user") UpdateProfileRequest req,
            BindingResult br,
            SessionStatus status,
            RedirectAttributes ra) {
        if(br.hasErrors()){
            return "mypage";
        }
        try {
            mypageService.updateProfile(userId, req);
            ProfileResponse user = mypageService.getProfile(userId);
            status.setComplete();
            ra.addFlashAttribute("updateUser", user);
            ra.addFlashAttribute("message","정보가 성공적으로 변경되었습니다.");
            return "redirect:/mypage";
        } catch (IllegalArgumentException | NoSuchElementException e) {
            br.reject("error", e.getMessage());
            return "editinfo";
        }
    }
}