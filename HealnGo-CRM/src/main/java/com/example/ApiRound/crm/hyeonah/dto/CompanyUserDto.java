package com.example.ApiRound.crm.hyeonah.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyUserDto {
    private Integer companyId;
    private String email;
    private String password;
    private String companyName;
    private String bizNo;
    private String representative;
    private String mainPhone;
    private String phone;
    private String fax;
    private String postcode;
    private String address;
    private String detailAddress;
    private String category;
    private String companyIntroduction;
    private String website;
}

