package com.example.ApiRound.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ApiRound.entity.Marketing;

public interface MarketingRepository extends JpaRepository<Marketing, Integer> {
    
    List<Marketing> findByCompanyIdOrderByCreatedAtDesc(Integer companyId);
    
    List<Marketing> findByCompanyIdAndApprovalStatusOrderByCreatedAtDesc(
        Integer companyId, Marketing.ApprovalStatus approvalStatus);
    
    List<Marketing> findAllByOrderByCreatedAtDesc();
    
    List<Marketing> findByApprovalStatusOrderByCreatedAtDesc(Marketing.ApprovalStatus approvalStatus);
    
    long countByCompanyId(Integer companyId);
    
    long countByCompanyIdAndApprovalStatus(Integer companyId, Marketing.ApprovalStatus approvalStatus);
    
    @Query("SELECT m FROM Marketing m WHERE m.companyId = :companyId " +
           "AND m.validFrom <= :date AND m.validUntil >= :date " +
           "AND m.approvalStatus = 'APPROVED'")
    List<Marketing> findActiveCouponsByCompanyAndDate(
        @Param("companyId") Integer companyId, 
        @Param("date") LocalDate date);
}

