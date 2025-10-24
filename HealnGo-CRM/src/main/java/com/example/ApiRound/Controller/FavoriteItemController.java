package com.example.ApiRound.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.ApiRound.Service.FavoriteItemService;
import com.example.ApiRound.dto.SocialUserDTO;
import com.example.ApiRound.entity.ItemList;
import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;

@Controller
@RequestMapping("/favorite")
public class FavoriteItemController {

    private final FavoriteItemService favoriteItemService;
    private final SocialUsersRepository socialUsersRepository;

    public FavoriteItemController(FavoriteItemService favoriteItemService, SocialUsersRepository socialUsersRepository) {
        this.favoriteItemService = favoriteItemService;
        this.socialUsersRepository = socialUsersRepository;
    }

    // ✅ 즐겨찾기 추가
    @PostMapping("/add/{itemId}")
    @ResponseBody
    public ResponseEntity<?> addFavorite(@PathVariable Long itemId, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.status(401).body("로그인이 필요합니다");

        favoriteItemService.addFavorite(user.getId(), itemId);
        System.out.println("addFavorite 컨트롤러 진입, userId: " + user.getId() + ", itemId: " + itemId);

        return ResponseEntity.ok("즐겨찾기 추가 완료");
    }

    // ✅ 즐겨찾기 제거
    @PostMapping("/remove/{itemId}")
    @ResponseBody
    public ResponseEntity<?> removeFavorite(@PathVariable Long itemId, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.status(401).body("로그인이 필요합니다");

        favoriteItemService.removeFavorite(user.getId(), itemId);
        return ResponseEntity.ok("즐겨찾기 제거 완료");
    }

    // ✅ 해당 아이템이 즐겨찾기인지 확인
    @GetMapping("/check/{itemId}")
    @ResponseBody
    public ResponseEntity<Boolean> isFavorite(@PathVariable Long itemId, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.ok(false);

        boolean isFav = favoriteItemService.isFavorite(user.getId(), itemId);
        return ResponseEntity.ok(isFav);
    }

    // ✅ 전체 즐겨찾기 리스트 (API용)
    @GetMapping("/list")
    @ResponseBody
    public ResponseEntity<?> getFavorites(HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.status(401).body("로그인이 필요합니다");

        List<ItemList> favorites = favoriteItemService.getFavoriteItems(user.getId());
        
        // DTO로 변환하여 반환 (Hibernate 프록시 직렬화 문제 방지)
        List<FavoriteItemDto> favoriteDtos = favorites.stream()
            .map(FavoriteItemDto::from)
            .collect(java.util.stream.Collectors.toList());
        
        return ResponseEntity.ok(favoriteDtos);
    }
    
    // 즐겨찾기 아이템 DTO
    public static class FavoriteItemDto {
        public Long id;
        public String name;
        public String address;
        public String phone;
        public String homepage;
        public String region;
        public String subregion;
        public String category;
        
        public static FavoriteItemDto from(ItemList item) {
            FavoriteItemDto dto = new FavoriteItemDto();
            dto.id = item.getId();
            dto.name = item.getName();
            dto.address = item.getAddress();
            dto.phone = item.getPhone();
            dto.homepage = item.getHomepage();
            dto.region = item.getRegion();
            dto.subregion = item.getSubregion();
            dto.category = item.getCategory();
            return dto;
        }
    }

    // ✅ 찜한 병원 페이지 뷰 렌더링
    @GetMapping
    public String getFavoritesPage(Model model, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        
        if (user != null) {
            // 로그인한 사용자: 실제 즐겨찾기 데이터 표시
            List<ItemList> favorites = favoriteItemService.getFavoritesByUserId(user.getId());
            model.addAttribute("favorites", favorites);
            model.addAttribute("totalCount", favorites.size());
            model.addAttribute("isLoggedIn", true);
        } else {
            // 비로그인 사용자: 빈 즐겨찾기 목록 표시
            model.addAttribute("favorites", new java.util.ArrayList<>());
            model.addAttribute("totalCount", 0);
            model.addAttribute("isLoggedIn", false);
        }

        return "favorite"; // 즐겨찾기 전용 JSP 사용
    }

    // ✅ 비로그인 유저가 localStorage에서 즐겨찾기 전송 (마이그레이션)
    @PostMapping("/batch")
    @ResponseBody
    public ResponseEntity<?> addFavoritesBatch(@RequestBody List<Long> itemIds, HttpSession session) {
        SocialUserDTO user = getLoginUser(session);
        if (user == null) return ResponseEntity.status(401).body("로그인이 필요합니다");

        for (Long itemId : itemIds) {
            favoriteItemService.addFavorite(user.getId(), itemId);
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

    // ✅ 로그인 사용자 가져오기 (헬퍼 메서드) - 상태 검증 포함
    private SocialUserDTO getLoginUser(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return null;
        }
        
        try {
            // DB에서 실제 사용자 정보 조회 및 상태 검증
            Optional<SocialUsers> userOpt = socialUsersRepository.findById(userId);
            if (userOpt.isEmpty()) {
                // 사용자가 DB에서 삭제됨 - 세션 무효화
                session.invalidate();
                return null;
            }
            
            SocialUsers user = userOpt.get();
            
            // 사용자 상태 검증
            if (!"ACTIVE".equals(user.getStatus())) {
                System.out.println("세션 무효화: 사용자 상태가 ACTIVE가 아님 - " + user.getStatus());
                session.invalidate();
                return null;
            }
            
            // 삭제된 사용자 검증
            if (Boolean.TRUE.equals(user.getIsDeleted())) {
                System.out.println("세션 무효화: 삭제된 사용자");
                session.invalidate();
                return null;
            }
            
            // 검증 통과 시 DTO 생성
            SocialUserDTO userDto = new SocialUserDTO();
            userDto.setId(user.getUserId().longValue());
            userDto.setEmail(user.getEmail());
            userDto.setName(user.getName());
            return userDto;
            
        } catch (Exception e) {
            System.err.println("getLoginUser 오류: " + e.getMessage());
            session.invalidate();
            return null;
        }
    }
}
