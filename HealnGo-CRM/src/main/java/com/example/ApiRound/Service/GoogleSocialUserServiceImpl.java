package com.example.ApiRound.Service;

import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GoogleSocialUserServiceImpl {

    private final SocialUsersRepository socialUsersRepository;

    /**
     * 구글 로그인 결과로 사용자 upsert
     * - 스키마에 존재하는 컬럼만 사용 (email, name, last_login_at, updated_at 등)
     * - provider/providerId 없이 이메일 기준으로 upsert
     */
    @Transactional
    public SocialUsers upsertFromGoogle(String email, String name) {
        SocialUsers user = socialUsersRepository.findByEmail(email)
                .orElseGet(() -> {
                    SocialUsers u = new SocialUsers();
                    u.setEmail(email);
                    u.setIsDeleted(false);
                    u.setStatus("ACTIVE"); // 신규 사용자는 ACTIVE로 설정
                    LocalDateTime now = LocalDateTime.now();
                    u.setCreatedAt(now);
                    u.setUpdatedAt(now);
                    u.setLastLoginAt(now);
                    return u;
                });

        // 기존 사용자 상태 검증
        if (user.getUserId() != null) {
            if (!"ACTIVE".equals(user.getStatus())) {
                System.out.println("Google 로그인 거부: 사용자 상태가 ACTIVE가 아님 - " + user.getStatus());
                throw new RuntimeException("계정이 비활성화되었습니다.");
            }
            
            if (Boolean.TRUE.equals(user.getIsDeleted())) {
                System.out.println("Google 로그인 거부: 삭제된 사용자");
                throw new RuntimeException("계정이 삭제되었습니다.");
            }
        }

        // 이름 갱신(빈 문자열이면 기존 유지)
        if (name != null && !name.isBlank()) {
            user.setName(name);
        }

        // 로그인/업데이트 시간 갱신
        user.setLastLoginAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return socialUsersRepository.save(user);
    }
}
