package com.example.ApiRound.crm.hyeonah.review;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface UserReviewService {
    
    // 리뷰 작성
    UserReview createReview(UserReview review, MultipartFile image);
    
    // 리뷰 수정
    UserReview updateReview(Integer reviewId, UserReview review, MultipartFile image);
    
    // 리뷰 삭제
    void deleteReview(Integer reviewId);
    
    // 리뷰 상세 조회
    UserReviewDto getReviewById(Integer reviewId);
    
    // 아이템별 리뷰 목록 조회
    List<UserReviewDto> getReviewsByItemId(Long itemId);
    
    // 서비스별 리뷰 목록 조회
    List<UserReviewDto> getReviewsByServiceId(Long serviceId);
    
    // 사용자별 리뷰 목록 조회
    List<UserReviewDto> getReviewsByUserId(Integer userId);
    
    // 예약 ID로 리뷰 조회 (Reservation ID 사용)
    UserReview getReviewByReservationId(Long reservationId);
    
    // 예약에 대한 리뷰 작성 가능 여부 확인 (Reservation ID 사용)
    boolean canWriteReview(Long reservationId);
    
    // 아이템 평균 평점 조회
    Double getAverageRatingByItemId(Long itemId);
    
    // 서비스 평균 평점 조회
    Double getAverageRatingByServiceId(Long serviceId);
    
    // 아이템 리뷰 개수 조회
    Long getReviewCountByItemId(Long itemId);
    
    // 서비스 리뷰 개수 조회
    Long getReviewCountByServiceId(Long serviceId);
    
    // 아이템 평점별 리뷰 개수 조회
    Map<Byte, Long> getRatingStatsByItemId(Long itemId);
    
    // 서비스 평점별 리뷰 개수 조회
    Map<Byte, Long> getRatingStatsByServiceId(Long serviceId);
    
    // 리뷰 이미지 조회
    byte[] getReviewImage(Integer reviewId);
    
    // 리뷰 공개/비공개 설정
    void toggleReviewVisibility(Integer reviewId);
    
    // 업체별 리뷰 목록 조회
    List<Object[]> getReviewsByCompanyId(Integer companyId);
    
    // UserReview 엔티티를 DTO로 변환
    UserReviewDto convertToDto(UserReview review);
}

