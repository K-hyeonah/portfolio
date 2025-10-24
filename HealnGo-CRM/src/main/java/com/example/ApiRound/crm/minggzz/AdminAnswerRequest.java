package com.example.ApiRound.crm.minggzz;

import lombok.Data;

@Data
public class AdminAnswerRequest {
    private Integer inquiryId;
    private String answer;
    private Integer assignedTo; // 선택: 답변과 함께 담당자 지정 가능
}
