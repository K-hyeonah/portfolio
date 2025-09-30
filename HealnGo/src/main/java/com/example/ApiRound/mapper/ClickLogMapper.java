package com.example.ApiRound.mapper;

import com.example.ApiRound.dto.CompanyClickCountDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ClickLogMapper {

    void insertClickLog(@Param("companyId") Long companyId);

    List<CompanyClickCountDto> getClickCountsLast7Days();

    List<CompanyClickCountDto> getTop3CompaniesLast7Days();

}