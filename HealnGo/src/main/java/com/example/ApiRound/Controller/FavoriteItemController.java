package com.example.ApiRound.Controller;

import com.example.ApiRound.Service.FavoriteItemService;
import com.example.ApiRound.dto.ListDto;
import com.example.ApiRound.dto.SocialUserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/favorite")
public class FavoriteItemController {

    private final FavoriteItemService favoriteItemService;

    public FavoriteItemController(FavoriteItemService favoriteItemService) {
        this.favoriteItemService = favoriteItemService;
    }

    // ✅ 즐겨찾기 추가
    @PostMapping("/add/{itemId}")
    @ResponseBody
    public ResponseEntity<?> addFavorite(@PathVariable Long itemId, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.status(401).body("로그인이 필요합니다");

        favoriteItemService.addFavorite(user.getUserId(), itemId);
        System.out.println("addFavorite 컨트롤러 진입, userId: " + user.getUserId() + ", itemId: " + itemId);

        return ResponseEntity.ok("즐겨찾기 추가 완료");
    }

    // ✅ 즐겨찾기 제거
    @PostMapping("/remove/{itemId}")
    @ResponseBody
    public ResponseEntity<?> removeFavorite(@PathVariable Long itemId, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.status(401).body("로그인이 필요합니다");

        favoriteItemService.removeFavorite(user.getUserId(), itemId);
        return ResponseEntity.ok("즐겨찾기 제거 완료");
    }

    // ✅ 해당 아이템이 즐겨찾기인지 확인
    @GetMapping("/check/{itemId}")
    @ResponseBody
    public ResponseEntity<Boolean> isFavorite(@PathVariable Long itemId, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.ok(false);

        boolean isFav = favoriteItemService.isFavorite(user.getUserId(), itemId);
        return ResponseEntity.ok(isFav);
    }

    // ✅ 전체 즐겨찾기 리스트 (API용)
    @GetMapping("/list")
    @ResponseBody
    public ResponseEntity<?> getFavorites(HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.status(401).body("로그인이 필요합니다");

        List<ListDto> favorites = favoriteItemService.getFavoriteItems(user.getUserId());
        return ResponseEntity.ok(favorites);
    }

    // ✅ 찜한 병원 페이지 뷰 렌더링
    @GetMapping
    public String getFavoritesPage(Model model, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return "redirect:/login";

        List<ListDto> favorites = favoriteItemService.getFavoritesByUserId(user.getUserId());

        model.addAttribute("favorites", favorites);
        model.addAttribute("totalCount", favorites.size());

        return "favorite"; // 즐겨찾기 전용 JSP 사용
    }

    // ✅ 비로그인 유저가 localStorage에서 즐겨찾기 전송 (마이그레이션)
    @PostMapping("/batch")
    @ResponseBody
    public ResponseEntity<?> addFavoritesBatch(@RequestBody List<Long> itemIds, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.status(401).body("로그인이 필요합니다");

        for (Long itemId : itemIds) {
            favoriteItemService.addFavorite(user.getUserId(), itemId);
        }

        return ResponseEntity.ok("찜 항목 일괄 등록 완료");
    }

    // ✅ 로그인 상태 확인 API
    @GetMapping("/check-login")
    @ResponseBody
    public ResponseEntity<Boolean> checkLogin(HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        return ResponseEntity.ok(user != null);
    }

    // ✅ 로그인 사용자 가져오기 (헬퍼 메서드)
    private SocialUserDTO getLoginUser(HttpSession session) {
        return (SocialUserDTO) session.getAttribute("loginUser");
    }
}
