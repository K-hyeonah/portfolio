package com.example.ApiRound.crm.hyeonah.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.ApiRound.crm.hyeonah.entity.SocialUsers;

@Repository
public interface SocialUsersRepository extends JpaRepository<SocialUsers, Integer> {

    Optional<SocialUsers> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<SocialUsers> findByEmailAndIsDeleted(String email, Boolean isDeleted);

    // 통계용 카운트
    long countByIsDeletedFalse();
    long countByStatusAndIsDeletedFalse(String status);
    
    // 월별 통계 - 네이티브 쿼리 사용 (데이터베이스 호환성)
    @Query(value = "SELECT COUNT(*) FROM social_users WHERE MONTH(created_at) = :month AND is_deleted = false", nativeQuery = true)
    long countByMonthAndIsDeletedFalse(@Param("month") int month);
    
    @Query(value = "SELECT COUNT(*) FROM social_users WHERE MONTH(created_at) = :month AND status = :status AND is_deleted = false", nativeQuery = true)
    long countByMonthAndStatusAndIsDeletedFalse(@Param("month") int month, @Param("status") String status);

    // admin 사용자 관리 메서드
    // 목록/페이지네이션
    Page<SocialUsers> findByIsDeletedFalse(Pageable pageable);

    // 검색
    @Query("""
            SELECT u FROM SocialUsers u
            WHERE u.isDeleted = false
            AND (
             lower(u.name) LIKE lower(concat('%', :q, '%'))
                OR lower(u.email) LIKE lower(concat('%', :q, '%')) 
                )
            """)
    Page<SocialUsers> searchActive(@Param("q") String q, Pageable pageable);

    // 상태별 조회
    Page<SocialUsers> findByStatusAndIsDeletedFalse(String status, Pageable pageable);

    // 검색 + 상태 필터
    @Query("""
            SELECT u FROM SocialUsers u
            WHERE u.isDeleted = false
            AND u.status = :status
            AND (
             lower(u.name) LIKE lower(concat('%', :q, '%'))
                OR lower(u.email) LIKE lower(concat('%', :q, '%')) 
                )
            """)
    Page<SocialUsers> searchActiveByStatus(@Param("q") String q, @Param("status") String status, Pageable pageable);

    // 상세 수정용 조회
    Optional<SocialUsers> findByUserIdAndIsDeletedFalse(Integer userId);
    
    // 마케팅 메시지용: 장기 미방문 고객 (90일 이상 로그인하지 않음)
    long countByLastLoginAtBeforeAndIsDeletedFalse(LocalDateTime lastLoginBefore);

}


