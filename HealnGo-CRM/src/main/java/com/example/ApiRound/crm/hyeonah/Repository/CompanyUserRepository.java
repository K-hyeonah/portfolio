package com.example.ApiRound.crm.hyeonah.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;

@Repository
public interface CompanyUserRepository extends JpaRepository<CompanyUser, Integer> {
    
    Optional<CompanyUser> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    Optional<CompanyUser> findByEmailAndIsActive(String email, Boolean isActive);
    
    // 승인 상태별 업체 수 조회
    long countByApprovalStatus(String approvalStatus);
    
    // 활성화된 업체 수 조회
    long countByIsActiveTrue();
    
    // 이번 달 신규 업체 수 조회
    @Query("SELECT COUNT(c) FROM CompanyUser c WHERE c.approvalStatus = 'APPROVED' AND YEAR(c.createdAt) = :year AND MONTH(c.createdAt) = :month")
    long countNewCompaniesThisMonth(@Param("year") int year, @Param("month") int month);
    
    // 신고 접수된 업체 수 조회
    long countByApprovalStatusAndIsActiveTrue(String approvalStatus);
    
    // 제재 중인 업체 수 조회 (SUSPENDED 상태)
    long countByApprovalStatusAndIsActive(String approvalStatus, Boolean isActive);
    
    // 승인된 업체 목록 조회 (최신순)
    @Query("SELECT c FROM CompanyUser c WHERE c.approvalStatus = 'APPROVED' AND c.isActive = true ORDER BY c.createdAt DESC")
    List<CompanyUser> findTop5ApprovedCompanies(Pageable pageable);

}

