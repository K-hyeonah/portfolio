package project1.project1_spring.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordDto {
    @NotBlank (message = "비밀번호를 입력해주세요")
    private String currentPassword;
}