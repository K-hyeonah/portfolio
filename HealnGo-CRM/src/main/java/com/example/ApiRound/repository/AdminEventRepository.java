package com.example.ApiRound.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ApiRound.entity.AdminEvent;

public interface AdminEventRepository extends JpaRepository<AdminEvent, Integer> {
    
    List<AdminEvent> findByCompanyIdOrderByCreatedAtDesc(Integer companyId);
    
    List<AdminEvent> findByCompanyIdAndApprovalStatusOrderByCreatedAtDesc(
        Integer companyId, AdminEvent.ApprovalStatus approvalStatus);
    
    List<AdminEvent> findAllByOrderByCreatedAtDesc();
    
    List<AdminEvent> findByApprovalStatusOrderByCreatedAtDesc(AdminEvent.ApprovalStatus approvalStatus);
    
    long countByCompanyId(Integer companyId);
    
    long countByCompanyIdAndApprovalStatus(Integer companyId, AdminEvent.ApprovalStatus approvalStatus);
    
    @Query("SELECT e FROM AdminEvent e WHERE e.companyId = :companyId " +
           "AND e.startDate <= :date AND e.endDate >= :date " +
           "AND e.approvalStatus = 'APPROVED'")
    List<AdminEvent> findActiveEventsByCompanyAndDate(
        @Param("companyId") Integer companyId, 
        @Param("date") LocalDate date);
}

