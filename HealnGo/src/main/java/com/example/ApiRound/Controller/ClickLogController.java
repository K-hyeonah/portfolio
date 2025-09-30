
package com.example.ApiRound.Controller;

import com.example.ApiRound.Service.ClickLogService;
import com.example.ApiRound.dto.CompanyClickCountDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clicks")
public class ClickLogController {


    private final ClickLogService clickLogService;

    public ClickLogController(ClickLogService clickLogService) {
        this.clickLogService = clickLogService;
    }

    // 클릭 로그 저장
    @PostMapping("/{companyId}")
    public ResponseEntity<Void> logClick(@PathVariable Long companyId) {
        clickLogService.logClick(companyId);
        return ResponseEntity.ok().build();
    }

    // 최근 7일 클릭 수 통계 조회
    @GetMapping("/stats")
    public ResponseEntity<List<CompanyClickCountDto>> getClickCountsLast7Days() {
        List<CompanyClickCountDto> stats = clickLogService.getClickCountsLast7Days();
        return ResponseEntity.ok(stats);
    }
}
