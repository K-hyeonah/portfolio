package com.example.ApiRound.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ApiRound.entity.UserInquiry;
import com.example.ApiRound.entity.UserInquiry.ReporterType;
import com.example.ApiRound.entity.UserInquiry.Status;

public interface UserInquiryRepository extends JpaRepository<UserInquiry, Integer> {
    Page<UserInquiry> findByStatus(Status status, Pageable pageable);
    Page<UserInquiry> findByReporterType(ReporterType reporterType, Pageable pageable);
    Page<UserInquiry> findByStatusAndReporterType(Status status, ReporterType reporterType, Pageable pageable);
    Page<UserInquiry> findByReporterSocialId(Integer reporterSocialId, Pageable pageable);
    Page<UserInquiry> findByReporterCompanyId(Integer reporterCompanyId, Pageable pageable);
    Page<UserInquiry> findByReporterCompanyIdAndReporterType(Integer reporterCompanyId, ReporterType reporterType, Pageable pageable);
    Page<UserInquiry> findByStatusAndAssignedTo(Status status, Integer assignedTo, Pageable pageable);
    long countByStatus(Status status);
}
