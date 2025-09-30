package project1.project1_spring.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserJoinDto {
    private String userId;
    private String password;
    private String name;
    private String gender;

    private Integer birthYear;
    private Integer birthMonth;
    private Integer birthDay;

    private String province;
    private String city;
    private String detailAddress;

    // 문자열로 동의 여부 수신 ("Y", "true", 등)
    @JsonProperty("agreeMarketing")
    private String marketingConsent;

    public boolean isMarketingConsent() {
        return "Y".equalsIgnoreCase(marketingConsent) || "true".equalsIgnoreCase(marketingConsent);
    }

    public String getAgreeMarketingYn() {

        return isMarketingConsent() ? "Y" : "N";
    }
}