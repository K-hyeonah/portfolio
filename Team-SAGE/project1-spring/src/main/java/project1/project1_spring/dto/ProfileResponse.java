package project1.project1_spring.dto;

import lombok.Getter;
import project1.project1_spring.entity.UserEntity;

@Getter
public class ProfileResponse {
    private final String userId;
    private final String name;
    private final Integer birthYear;
    private final Integer birthMonth;
    private final Integer birthDay;
    private final String province;
    private final String city;
    private final String detailAddress;
    private final String yyGrade;

    public ProfileResponse(UserEntity u) {
        this.userId = u.getUserId();
        this.name = u.getName();
        this.birthYear = u.getBirthYear();
        this.birthMonth = u.getBirthMonth();
        this.birthDay = u.getBirthDay();
        this.province = u.getProvince();
        this.city = u.getCity();
        this.detailAddress = u.getDetailAddress();
        this.yyGrade = u.getYyGrade();
    }
}