package com.example.ApiRound.crm.hyeonah.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.hyeonah.dto.SocialUsersDto;
import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;

@Service
@Transactional
public class SocialUsersServiceImpl implements SocialUsersService {
    
    private final SocialUsersRepository repository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public SocialUsersServiceImpl(
            SocialUsersRepository repository,
            PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public SocialUsers register(SocialUsersDto dto) {
        // 이메일 중복 확인
        if (repository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        
        SocialUsers user = SocialUsers.builder()
                .email(dto.getEmail())
                .passwordHash(encodedPassword)
                .name(dto.getName())
                .phone(dto.getPhone())
                .isDeleted(false)
                .build();
        
        return repository.save(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<SocialUsers> findByEmail(String email) {
        return repository.findByEmailAndIsDeleted(email, false);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<SocialUsers> login(String email, String password) {
        Optional<SocialUsers> userOpt = repository.findByEmailAndIsDeleted(email, false);
        
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        
        SocialUsers user = userOpt.get();
        
        // 비밀번호 검증
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            return Optional.of(user);
        }
        
        return Optional.empty();
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }
    
    @Override
    public void updateLastLogin(String email) {
        Optional<SocialUsers> userOpt = repository.findByEmail(email);
        userOpt.ifPresent(user -> {
            user.setLastLoginAt(LocalDateTime.now());
            repository.save(user);
        });
    }
    
    @Override
    public void updatePassword(String email, String newPassword) {
        Optional<SocialUsers> userOpt = repository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("해당 이메일로 등록된 사용자를 찾을 수 없습니다.");
        }
        
        SocialUsers user = userOpt.get();
        // 비밀번호 암호화 후 업데이트
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        repository.save(user);
    }
}

