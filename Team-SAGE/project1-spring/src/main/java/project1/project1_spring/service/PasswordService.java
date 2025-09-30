package project1.project1_spring.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project1.project1_spring.dto.ResetPasswordRequest;
import project1.project1_spring.dto.VerificationRequest;
import project1.project1_spring.entity.UserEntity;
import project1.project1_spring.repository.UserRepository;

import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class PasswordService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public void verifyIdentity(VerificationRequest req) {
        boolean exists = userRepository
                .existsByUserIdAndNameAndBirthYearAndBirthMonthAndBirthDay(
                        req.getUserId(), req.getName()
                        , req.getBirthYear(), req.getBirthMonth(), req.getBirthDay()
                );
        if (!exists) {
            throw new NoSuchElementException("일치하는 회원 정보가 없습니다.");
        }
    }

    public void resetPassword(ResetPasswordRequest req) {

        if(!req.getNewPassword().equals(req.getNewPasswordConfirm())) {
            throw new IllegalArgumentException("새 비밀번호가 일치하지 않습니다.");
        }
        UserEntity user = userRepository.findByUserId(req.getUserId())
                .orElseThrow(() -> new NoSuchElementException("회원이 존재하지 않습니다."));
        if(passwordEncoder.matches(req.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호와 다르게 설정해주세요.");
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}