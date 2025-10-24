package com.example.ApiRound.Controller;

import com.example.ApiRound.Service.ClickLogService;
import com.example.ApiRound.entity.ClickLog;
import com.example.ApiRound.entity.ItemList;
import com.example.ApiRound.repository.ItemListRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/clicks")
@RequiredArgsConstructor
public class ClickLogController {

    private final ClickLogService clickLogService;
    private final ItemListRepository itemListRepository;

    /** 직접 companyId로 로그 */
    @PostMapping("/{companyId}")
    public ResponseEntity<?> logClick(@PathVariable Long companyId) {
        clickLogService.logClick(companyId);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    /** itemId로 받아서 ownerCompany.companyId 찾아 저장 */
    @PostMapping("/item/{itemId}")
    public ResponseEntity<?> logClickByItem(@PathVariable Long itemId, HttpSession session) {
        Optional<ItemList> opt = itemListRepository.findById(itemId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("ok", false, "message", "item not found"));
        }
        ItemList item = opt.get();
        if (item.getOwnerCompany() == null || item.getOwnerCompany().getCompanyId() == null) {
            return ResponseEntity.status(409).body(Map.of("ok", false, "message", "no owner company for item"));
        }

        Long companyId = item.getOwnerCompany().getCompanyId().longValue();
        Integer userId = (Integer) session.getAttribute("userId");

        ClickLog log = ClickLog.builder()
                .companyId(companyId)
                .itemId(itemId)
                .userId(userId)
                .clickedAt(LocalDateTime.now())
                .build();

        ClickLog saved = clickLogService.saveClickLog(log);
        return ResponseEntity.ok(Map.of("ok", true, "id", saved.getId()));
    }

    /** 최근 7일 회사별 클릭수 */
    @GetMapping("/stats")
    public ResponseEntity<List<Object[]>> getClickCountsLast7Days() {
        return ResponseEntity.ok(clickLogService.getClickCountsLast7Days());
    }
}
