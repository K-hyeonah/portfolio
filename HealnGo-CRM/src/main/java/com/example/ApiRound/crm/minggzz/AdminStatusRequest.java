package com.example.ApiRound.crm.minggzz;

import lombok.Data;

@Data
public class AdminStatusRequest {
    private Integer inquiryId;
    private String status;    // OPEN, IN_PROGRESS, ANSWERED, CLOSED
}
