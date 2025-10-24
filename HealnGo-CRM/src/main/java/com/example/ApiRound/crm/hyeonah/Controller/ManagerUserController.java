package com.example.ApiRound.crm.hyeonah.Controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.ApiRound.crm.hyeonah.Service.ManagerUserService;

@Controller
@RequestMapping("/admin")
public class ManagerUserController {

    private final ManagerUserService managerUserService;

    public ManagerUserController(ManagerUserService managerUserService) {
        this.managerUserService = managerUserService;
    }
    
    /**
     * 사용자 관리 페이지 (새로운 UI)
     */
    @GetMapping("/manager-user")
    public String managerUser(
            @RequestParam(value = "pageNo", defaultValue = "1") int pageNo,
            @RequestParam(value = "amount", defaultValue = "10") int amount,
            @RequestParam(value = "search", required = false) String search,
            Model model) {
        
        try {
            // 사용자 목록 조회
            List<Map<String, Object>> users = managerUserService.getUserList(pageNo, amount, search);
            model.addAttribute("users", users);
            
            // 전체 사용자 수 조회
            int totalUsers = managerUserService.getTotalUserCount(search);
            model.addAttribute("totalUsers", totalUsers);
            
            // 페이지네이션 계산
            int totalPages = (int) Math.ceil((double) totalUsers / amount);
            model.addAttribute("totalPages", totalPages);
            model.addAttribute("pageNo", pageNo);
            model.addAttribute("amount", amount);
            
            // 페이지네이션 시작/끝 페이지 계산
            int startPage = Math.max(1, pageNo - 2);
            int endPage = Math.min(totalPages, pageNo + 2);
            model.addAttribute("startPage", startPage);
            model.addAttribute("endPage", endPage);
            
            // 검색어
            model.addAttribute("search", search);
            
            // 페이지네이션을 위한 baseUrl
            String baseUrl = "/admin/manager-user";
            if (search != null && !search.trim().isEmpty()) {
                try {
                    baseUrl += "?search=" + URLEncoder.encode(search, "UTF-8");
                } catch (UnsupportedEncodingException e) {
                    baseUrl += "?search=" + search;
                }
            }
            model.addAttribute("baseUrl", baseUrl);
            
            return "crm/manager_user";
            
        } catch (Exception e) {
            model.addAttribute("error", "사용자 목록을 불러오는 중 오류가 발생했습니다.");
            return "crm/manager_user";
        }
    }
}