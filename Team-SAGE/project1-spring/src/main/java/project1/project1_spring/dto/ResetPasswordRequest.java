package project1.project1_spring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    private String userId;

    @NotBlank(message = "새 비밀번호를 입력해주세요")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이여야 합니다.")
    private String newPassword;

    @NotBlank(message = "확인용 비밀번호를 입력해주세요")
    private String newPasswordConfirm;
}