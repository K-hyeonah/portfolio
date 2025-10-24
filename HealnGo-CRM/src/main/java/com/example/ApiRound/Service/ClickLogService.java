package com.example.ApiRound.Service;

import com.example.ApiRound.entity.ClickLog;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface ClickLogService {
    void logClick(Long companyId);
    List<Object[]> getClickCountsLast7Days();
    List<Object[]> getTop3CompaniesLast7Days();
    ClickLog saveClickLog(ClickLog clickLog);

    long getClickCountByCompanyIdSince(Long companyId, LocalDateTime since);
    List<Map<String, Object>> getDailyClicksByCompany(Long companyId, int days);
}
