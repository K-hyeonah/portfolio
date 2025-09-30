package com.example.ApiRound.Service;

import com.example.ApiRound.dto.CompanyClickCountDto;

import java.util.List;

public interface ClickLogService {
    void logClick(Long companyId);
    List<CompanyClickCountDto> getClickCountsLast7Days();
    List<CompanyClickCountDto> getTop3CompaniesLast7Days();

}