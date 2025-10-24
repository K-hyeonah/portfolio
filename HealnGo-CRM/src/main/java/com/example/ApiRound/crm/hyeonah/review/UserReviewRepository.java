package com.example.ApiRound.crm.hyeonah.review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReviewRepository extends JpaRepository<UserReview, Integer> {
    
    // 특정 아이템의 리뷰 목록 조회
    List<UserReview> findByItemIdAndIsPublicTrueOrderByCreatedAtDesc(Long itemId);
    
    // 특정 서비스의 리뷰 목록 조회
    List<UserReview> findByServiceIdAndIsPublicTrueOrderByCreatedAtDesc(Long serviceId);
    
    // 특정 서비스의 모든 리뷰 조회 (공개/비공개 구분 없이)
    List<UserReview> findByServiceIdOrderByCreatedAtDesc(Long serviceId);
    
    // 특정 사용자의 리뷰 목록 조회
    List<UserReview> findByUserIdOrderByCreatedAtDesc(Integer userId);
    
    // booking_id로 리뷰 조회
    UserReview findByBookingId(Long bookingId);
    
    // 특정 아이템의 평균 평점 조회
    @Query("SELECT AVG(r.rating) FROM UserReview r WHERE r.itemId = :itemId AND r.isPublic = true")
    Double findAverageRatingByItemId(@Param("itemId") Long itemId);
    
    // 특정 서비스의 평균 평점 조회
    @Query("SELECT AVG(r.rating) FROM UserReview r WHERE r.serviceId = :serviceId AND r.isPublic = true")
    Double findAverageRatingByServiceId(@Param("serviceId") Long serviceId);
    
    // 특정 아이템의 리뷰 개수 조회
    Long countByItemIdAndIsPublicTrue(Long itemId);
    
    // 특정 서비스의 리뷰 개수 조회
    Long countByServiceIdAndIsPublicTrue(Long serviceId);
    
    // 특정 평점의 리뷰 개수 조회
    @Query("SELECT COUNT(r) FROM UserReview r WHERE r.itemId = :itemId AND r.rating = :rating AND r.isPublic = true")
    Long countByItemIdAndRating(@Param("itemId") Long itemId, @Param("rating") Byte rating);
    
    // 특정 서비스의 특정 평점 리뷰 개수 조회
    @Query("SELECT COUNT(r) FROM UserReview r WHERE r.serviceId = :serviceId AND r.rating = :rating AND r.isPublic = true")
    Long countByServiceIdAndRating(@Param("serviceId") Long serviceId, @Param("rating") Byte rating);
    
    // booking_id로 리뷰 존재 여부 확인
    boolean existsByBookingId(Long bookingId);
    
    // 업체별 리뷰 조회 (reservations 경로, 프론트 매핑과 동일한 13컬럼 순서)
    @Query(value =
    "SELECT ur.review_id, ur.user_id, ur.item_id, ur.booking_id, ur.rating, " +
    "       ur.title, ur.content, ur.image_mime, ur.is_public, ur.created_at, ur.updated_at, " +
    "       r.title AS item_name, su.name AS user_name " +
    "FROM user_review ur " +
    "JOIN reservations r ON r.id = ur.booking_id " +   
    "LEFT JOIN item_list il ON il.id = ur.item_id " +
    "LEFT JOIN social_users su ON su.user_id = ur.user_id " +
    "WHERE r.company_id = :companyId " +
    "ORDER BY ur.created_at DESC",
    nativeQuery = true)
List<Object[]> findByCompanyId(@Param("companyId") Integer companyId);




}

