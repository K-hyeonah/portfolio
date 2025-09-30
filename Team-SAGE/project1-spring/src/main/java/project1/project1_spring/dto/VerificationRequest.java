package project1.project1_spring.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerificationRequest {
    @NotBlank(message = "아이디를 입력해주세요")
    private String userId;

    @NotBlank(message = "이름을 입력해주세요")
    private String name;

    @NotNull(message = "년도를 선택해주세요")
    @Min(value = 1900, message = "올바른 년도를 선택해주세요")
    @Max(value = 2100, message = "올바른 년도를 선택해주세요")
    private Integer birthYear;

    @NotNull(message = "월을 선택해주세요")
    @Min(value = 1, message = "올바른 월을 선택해주세요")
    @Max(value = 12, message = "올바른 월을 선택해주세요")
    private Integer birthMonth;

    @NotNull(message = "일을 선택해주세요")
    @Min(value = 1, message = "올바른 일을 선택해주세요")
    @Max(value = 31, message = "올바른 일을 선택해주세요")
    private Integer birthDay;
}