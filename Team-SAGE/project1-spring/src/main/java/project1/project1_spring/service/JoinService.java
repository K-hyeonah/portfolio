package project1.project1_spring.service;

import project1.project1_spring.domain.*;
import project1.project1_spring.domain.UserJoinDto;
import project1.project1_spring.entity.UserEntity;
import project1.project1_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class JoinService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 사용자 ID 중복 검사
     */
    public boolean isUserIdDuplicate(String userId) {
        return userRepository.existsByUserId(userId);
    }

    /**
     * 회원 가입 처리
     */
    @Transactional
    public UserEntity registerUser(UserJoinDto dto) {
        if (isUserIdDuplicate(dto.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 ID입니다.");
        }

        UserEntity user = UserEntity.builder()
                .userId(dto.getUserId())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .gender(dto.getGender())
                .birthYear(dto.getBirthYear())
                .birthMonth(dto.getBirthMonth())
                .birthDay(dto.getBirthDay())
                .province(dto.getProvince())
                .city(dto.getCity())
                .detailAddress(dto.getDetailAddress())
                .agreeMarketing(dto.getAgreeMarketingYn())
                //.createdAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    public UserJoinDto getUserByUserId(String userId) {
        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다."));

        return UserJoinDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .gender(user.getGender())
                .birthYear(user.getBirthYear())
                .birthMonth(user.getBirthMonth())
                .birthDay(user.getBirthDay())
                .province(user.getProvince())
                .city(user.getCity())
                .detailAddress(user.getDetailAddress())
                .marketingConsent(user.getAgreeMarketing())
                .build();
    }
}
