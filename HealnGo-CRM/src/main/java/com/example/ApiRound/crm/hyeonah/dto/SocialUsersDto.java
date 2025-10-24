package com.example.ApiRound.crm.hyeonah.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialUsersDto {
    private Integer userId;
    private String email;
    private String password;
    private String name;
    private String phone;
}

