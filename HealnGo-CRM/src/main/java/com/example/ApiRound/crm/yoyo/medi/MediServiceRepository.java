package com.example.ApiRound.crm.yoyo.medi;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MediServiceRepository extends JpaRepository<MediServiceEntity, Long> {

    // 회사별 의료 서비스 조회 (활성만)
    @Query("SELECT m FROM MediServiceEntity m " +
            "JOIN FETCH m.item i " +
            "JOIN FETCH i.ownerCompany c " +
            "WHERE c.companyId = :companyId AND m.deletedAt IS NULL")
    List<MediServiceEntity> findActiveByCompanyIdWithFetch(@Param("companyId") Integer companyId);
    
    // 회사별 의료 서비스 조회 (삭제된 것 포함 - 관리자용)
    @Query("SELECT m FROM MediServiceEntity m " +
            "JOIN FETCH m.item i " +
            "JOIN FETCH i.ownerCompany c " +
            "WHERE c.companyId = :companyId")
    List<MediServiceEntity> findAllByCompanyIdWithFetch(@Param("companyId") Integer companyId);
    
    // Item ID로 의료 서비스 조회 (삭제되지 않은 것만, 내림차순)
    @Query("SELECT m FROM MediServiceEntity m " +
           "WHERE m.item.id = :itemId AND m.deletedAt IS NULL " +
           "ORDER BY m.serviceId DESC")
    List<MediServiceEntity> findAllByItem_IdOrderByServiceIdDesc(@Param("itemId") Long itemId);
    
    // 회사별 활성 의료 서비스 개수 조회
    @Query("SELECT COUNT(m) FROM MediServiceEntity m " +
           "JOIN m.item i " +
           "JOIN i.ownerCompany c " +
           "WHERE c.companyId = :companyId AND m.deletedAt IS NULL")
    int countActiveServicesByCompanyId(@Param("companyId") Integer companyId);
}
