
package com.example.ApiRound.Service;

import com.example.ApiRound.dto.CompanyClickCountDto;
import com.example.ApiRound.mapper.ClickLogMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClickLogServiceImpl implements ClickLogService {


    private final ClickLogMapper clickLogMapper;

    public ClickLogServiceImpl(ClickLogMapper clickLogMapper) {
        this.clickLogMapper = clickLogMapper;
    }

    @Transactional
    @Override
    public void logClick(Long companyId) {
        System.out.println(">>> 클릭된 업체 ID: " + companyId);
        clickLogMapper.insertClickLog(companyId);
    }


    @Override
    public List<CompanyClickCountDto> getClickCountsLast7Days() {
        return clickLogMapper.getClickCountsLast7Days();
    }

    @Override
    public List<CompanyClickCountDto> getTop3CompaniesLast7Days() {
        return clickLogMapper.getTop3CompaniesLast7Days();
    }

}
