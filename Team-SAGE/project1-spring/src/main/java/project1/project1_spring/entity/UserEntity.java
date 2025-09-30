package project1.project1_spring.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user1")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(nullable = false, unique = true)
    private String userId; // 로그인용 ID

    @Column(nullable = false)
    private String password;  // 비밀번호 (암호화된)

    // 추가된 회원가입 필드들
    @Column(nullable = false)
    private String name;  // 이름

    @Column(length = 1)
    private String gender;  // 성별 ('M' or 'F')

    private Integer birthYear;  // 생년
    private Integer birthMonth;  // 생월
    private Integer birthDay;  // 생일

    private String province;  // 시/도
    private String city;  // 시/군/구
    private String detailAddress;  // 상세주소
    private String yyGrade;

    @Column(name = "agree_marketing", columnDefinition = "CHAR(1)", nullable = false)
    @Builder.Default
    private String agreeMarketing = "Y";  // 마케팅 수신 동의 ('Y' or 'N')

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
