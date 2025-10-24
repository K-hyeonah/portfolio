package com.example.ApiRound.crm.hyeonah.review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserReviewReplyRepository extends JpaRepository<UserReviewReply, Integer> {
    
    // 특정 리뷰의 모든 답글 조회
    List<UserReviewReply> findByReview_ReviewIdOrderByCreatedAtAsc(Integer reviewId);
    
    // 특정 리뷰의 공개된 답글만 조회
    List<UserReviewReply> findByReview_ReviewIdAndIsPublicTrueOrderByCreatedAtAsc(Integer reviewId);
    
    // 특정 업체가 특정 리뷰에 답글을 달았는지 확인
    boolean existsByReview_ReviewIdAndCompanyId(Integer reviewId, Integer companyId);
    
    // 특정 업체의 모든 답글 조회
    List<UserReviewReply> findByCompanyIdOrderByCreatedAtDesc(Integer companyId);
    
    // 특정 리뷰의 답글 개수
    long countByReview_ReviewId(Integer reviewId);
    
    // 특정 리뷰의 공개된 답글 개수
    long countByReview_ReviewIdAndIsPublicTrue(Integer reviewId);
}