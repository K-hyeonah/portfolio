package com.example.ApiRound.crm.hyeonah.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ApiRound.crm.hyeonah.Repository.CompanyUserRepository;
import com.example.ApiRound.crm.hyeonah.dto.CompanyUserDto;
import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;

@Service
@Transactional
public class CompanyUserServiceImpl implements CompanyUserService {
    
    private final CompanyUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public CompanyUserServiceImpl(
            CompanyUserRepository repository,
            PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public CompanyUser register(CompanyUserDto dto) {
        // 이메일 중복 확인
        if (repository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        
        CompanyUser company = CompanyUser.builder()
                .email(dto.getEmail())
                .passwordHash(encodedPassword)
                .companyName(dto.getCompanyName())
                .bizNo(dto.getBizNo())
                .representative(dto.getRepresentative())
                .mainPhone(dto.getMainPhone())
                .phone(dto.getPhone())
                .fax(dto.getFax())
                .postcode(dto.getPostcode())
                .address(dto.getAddress())
                .detailAddress(dto.getDetailAddress())
                .category(dto.getCategory())
                .companyIntroduction(dto.getCompanyIntroduction())
                .website(dto.getWebsite())
                .isActive(true)
                .approvalStatus("PENDING")  // 테스트를 위해 자동 승인
                .build();
        
        return repository.save(company);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<CompanyUser> findById(Integer companyId) {
        return repository.findById(companyId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<CompanyUser> findByEmail(String email) {
        return repository.findByEmailAndIsActive(email, true);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<CompanyUser> login(String email, String password) {
        Optional<CompanyUser> companyOpt = repository.findByEmailAndIsActive(email, true);
        
        if (companyOpt.isEmpty()) {
            return Optional.empty();
        }
        
        CompanyUser company = companyOpt.get();
        
        // 비밀번호 검증
        if (passwordEncoder.matches(password, company.getPasswordHash())) {
            return Optional.of(company);
        }
        
        return Optional.empty();
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }
    
    @Override
    public void updatePassword(String email, String newPassword) {
        Optional<CompanyUser> companyOpt = repository.findByEmail(email);
        
        if (companyOpt.isEmpty()) {
            throw new IllegalArgumentException("업체를 찾을 수 없습니다.");
        }
        
        CompanyUser company = companyOpt.get();
        String encodedPassword = passwordEncoder.encode(newPassword);
        company.setPasswordHash(encodedPassword);
        repository.save(company);
    }
    
    @Override
    public CompanyUser update(Integer companyId, CompanyUserDto dto) {
        Optional<CompanyUser> companyOpt = repository.findById(companyId);
        
        if (companyOpt.isEmpty()) {
            throw new IllegalArgumentException("업체를 찾을 수 없습니다.");
        }
        
        CompanyUser company = companyOpt.get();
        
        // 업데이트 가능한 필드만 수정
        if (dto.getCompanyName() != null) company.setCompanyName(dto.getCompanyName());
        if (dto.getBizNo() != null) company.setBizNo(dto.getBizNo());
        if (dto.getRepresentative() != null) company.setRepresentative(dto.getRepresentative());
        if (dto.getMainPhone() != null) company.setMainPhone(dto.getMainPhone());
        if (dto.getPhone() != null) company.setPhone(dto.getPhone());
        if (dto.getFax() != null) company.setFax(dto.getFax());
        if (dto.getPostcode() != null) company.setPostcode(dto.getPostcode());
        if (dto.getAddress() != null) company.setAddress(dto.getAddress());
        if (dto.getDetailAddress() != null) company.setDetailAddress(dto.getDetailAddress());
        if (dto.getCategory() != null) company.setCategory(dto.getCategory());
        if (dto.getCompanyIntroduction() != null) company.setCompanyIntroduction(dto.getCompanyIntroduction());
        if (dto.getWebsite() != null) company.setWebsite(dto.getWebsite());
        
        return repository.save(company);
    }
    
    @Override
    public void updateAvatar(Integer companyId, byte[] imageData, String mimeType) {
        Optional<CompanyUser> companyOpt = repository.findById(companyId);
        
        if (companyOpt.isEmpty()) {
            throw new IllegalArgumentException("업체를 찾을 수 없습니다.");
        }
        
        CompanyUser company = companyOpt.get();
        company.setAvatarBlob(imageData);
        company.setAvatarMime(mimeType);
        company.setAvatarUpdatedAt(java.time.LocalDateTime.now());
        
        repository.save(company);
    }
}

