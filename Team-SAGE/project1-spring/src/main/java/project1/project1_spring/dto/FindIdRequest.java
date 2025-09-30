package project1.project1_spring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindIdRequest {
    private String name;
    private Integer birthYear;
    private Integer birthMonth;
    private Integer birthDay;
}