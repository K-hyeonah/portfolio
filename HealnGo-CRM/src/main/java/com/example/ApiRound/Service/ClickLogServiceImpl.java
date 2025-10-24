package com.example.ApiRound.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ApiRound.entity.ClickLog;
import com.example.ApiRound.repository.ClickLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ClickLogServiceImpl implements ClickLogService {

    private final ClickLogRepository clickLogRepository;

    @Override
    public void logClick(Long companyId) {
        ClickLog clickLog = new ClickLog(companyId);
        clickLogRepository.save(clickLog);
    }

    @Override
    public List<Object[]> getClickCountsLast7Days() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        return clickLogRepository.findTopCompaniesByClickCount(startDate);
    }

    @Override
    public List<Object[]> getTop3CompaniesLast7Days() {
        // 기간을 30일로 확장해서 테스트
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        System.out.println("🔍 TOP3 조회 시작 - startDate: " + startDate);
        
        List<Object[]> results = clickLogRepository.findTopCompaniesByClickCount(startDate);
        System.out.println("🔍 조회된 결과 개수: " + results.size());
        for (Object[] result : results) {
            System.out.println("  - itemId: " + result[0] + ", clickCount: " + result[1]);
        }
        
        return results;
    }

    @Override
    public ClickLog saveClickLog(ClickLog clickLog) {
        return clickLogRepository.save(clickLog);
    }

    @Override
    public long getClickCountByCompanyIdSince(Long companyId, LocalDateTime since) {
        return clickLogRepository.countByCompanyIdAndClickedAtAfter(companyId, since);
    }

    @Override
    public List<Map<String, Object>> getDailyClicksByCompany(Long companyId, int days) {
        List<Map<String, Object>> dailyStats = new ArrayList<>();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(23, 59, 59);

            long count = clickLogRepository.countByCompanyIdAndClickedAtBetween(
                    companyId, startOfDay, endOfDay);

            Map<String, Object> stat = new HashMap<>();
            stat.put("date", date.toString());
            stat.put("count", count);
            dailyStats.add(stat);
        }
        return dailyStats;
    }
}
