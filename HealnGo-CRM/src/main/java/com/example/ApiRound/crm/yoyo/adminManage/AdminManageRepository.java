package com.example.ApiRound.crm.yoyo.adminManage;

import com.example.ApiRound.crm.hyeonah.entity.CompanyUser;
import com.example.ApiRound.entity.ItemList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminManageRepository extends JpaRepository<ItemList, Long> {

    // 전체 업체 수 조회 (승인된 업체만)
    @Query("SELECT COUNT(i) FROM ItemList i " +
            "JOIN i.ownerCompany c " +
            "WHERE c.approvalStatus = 'APPROVED'")
    long countApprovedCompanies();

    // 이번 달 신규 업체 수 조회
    @Query("SELECT COUNT(i) FROM ItemList i " +
            "JOIN i.ownerCompany c " +
            "WHERE c.approvalStatus = 'APPROVED' " +
            "AND c.createdAt >= :startOfMonth")
    long countNewCompaniesThisMonth(@Param("startOfMonth") LocalDateTime startOfMonth);

    // 신고 접수 수 조회 (임시로 0 반환, 실제 신고 테이블이 있으면 수정)
    @Query("SELECT COUNT(i) FROM ItemList i " +
            "JOIN i.ownerCompany c " +
            "WHERE c.approvalStatus = 'REPORTED'")
    long countReportedCompanies();

    // 제재 중인 업체 수 조회
    @Query("SELECT COUNT(i) FROM ItemList i " +
            "JOIN i.ownerCompany c " +
            "WHERE c.approvalStatus = 'SUSPENDED'")
    long countSuspendedCompanies();

    // 승인된 업체 목록 조회 (페이징 지원)
    @Query("SELECT i FROM ItemList i " +
            "JOIN FETCH i.ownerCompany c " +
            "WHERE c.approvalStatus = 'APPROVED' " +
            "ORDER BY i.createdAt DESC")
    List<ItemList> findApprovedCompanies();

    // 업체명으로 검색
    @Query("SELECT i FROM ItemList i " +
            "JOIN FETCH i.ownerCompany c " +
            "WHERE c.approvalStatus = 'APPROVED' " +
            "AND (i.name LIKE CONCAT('%', :search, '%') OR c.companyName LIKE CONCAT('%', :search, '%')) " +
            "ORDER BY i.createdAt DESC")
    List<ItemList> searchCompaniesByName(@Param("search") String search);

    // 상태별 업체 조회 (ItemList가 없는 경우도 포함)
    @Query("SELECT i FROM ItemList i " +
            "JOIN FETCH i.ownerCompany c " +
            "WHERE c.approvalStatus = :status " +
            "ORDER BY i.createdAt DESC")
    List<ItemList> findCompaniesByStatus(@Param("status") String status);
    
    // 상태별 업체 조회 (CompanyUser만으로도 조회 가능)
    @Query("SELECT c FROM CompanyUser c " +
           "WHERE c.approvalStatus = :status " +
           "ORDER BY c.createdAt DESC")
    List<CompanyUser> findCompaniesByStatusOnly(@Param("status") String status);
    
    // 업체 승인 상태 업데이트
    @Modifying
    @Query("UPDATE CompanyUser c SET c.approvalStatus = :newStatus, c.approvedAt = :approvedAt " +
           "WHERE c.companyId = :companyId")
    int updateCompanyApprovalStatus(@Param("companyId") Integer companyId, 
                                   @Param("newStatus") String newStatus, 
                                   @Param("approvedAt") LocalDateTime approvedAt);
    
    // 업체 존재 여부 확인
    @Query("SELECT COUNT(c) > 0 FROM CompanyUser c WHERE c.companyId = :companyId")
    boolean existsByCompanyId(@Param("companyId") Integer companyId);
    
    // 업체명 조회
    @Query("SELECT c.companyName FROM CompanyUser c WHERE c.companyId = :companyId")
    String getCompanyNameById(@Param("companyId") Integer companyId);
}
