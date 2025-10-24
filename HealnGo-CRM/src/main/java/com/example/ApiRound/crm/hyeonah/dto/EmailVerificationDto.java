package com.example.ApiRound.crm.hyeonah.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerificationDto {
    private String email;
    private String code;
    private String userType; // "social" or "company"
}

