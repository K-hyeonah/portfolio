package project1.project1_spring.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank @Size(max = 20)
    private String name;

    @NotNull @Min(1900) @Max(2100)
    private Integer birthYear;

    @NotNull @Min(1) @Max(12)
    private Integer birthMonth;

    @NotNull @Min(1) @Max(31)
    private Integer birthDay;

    @NotBlank @Size(max=50)
    private String province;

    @NotBlank @Size(max=50)
    private String city;

    @NotBlank @Size(max=200)
    private String detailAddress;

    private String yyGrade;
}