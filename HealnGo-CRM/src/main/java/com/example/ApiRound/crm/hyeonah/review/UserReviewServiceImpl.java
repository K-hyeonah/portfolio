package com.example.ApiRound.crm.hyeonah.review;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.ApiRound.crm.hyeonah.Repository.SocialUsersRepository;
import com.example.ApiRound.crm.yoyo.reservation.Reservation;
import com.example.ApiRound.crm.yoyo.reservation.ReservationRepository;
import com.example.ApiRound.repository.ItemListRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserReviewServiceImpl implements UserReviewService {
    
    private final UserReviewRepository userReviewRepository;
    private final UserReviewReplyRepository userReviewReplyRepository;
    private final ItemListRepository itemListRepository;
    private final SocialUsersRepository socialUsersRepository;
    private final ReservationRepository reservationRepository;
    
    @Override
    public UserReview createReview(UserReview review, MultipartFile image) {
        // bookingId가 설정되어 있는지 확인
        if (review.getBookingId() == null) {
            throw new RuntimeException("예약 정보가 없습니다.");
        }
        
        // 이미 리뷰가 작성되었는지 확인
        if (userReviewRepository.existsByBookingId(review.getBookingId())) {
            throw new RuntimeException("이미 해당 예약에 대한 리뷰가 작성되었습니다.");
        }
        
        // 예약 정보에서 service_id와 item_id 자동으로 가져오기
        Reservation reservation = reservationRepository.findById(review.getBookingId())
                .orElseThrow(() -> new RuntimeException("예약 정보를 찾을 수 없습니다."));
        
        // serviceId가 설정되지 않았다면 예약 정보에서 가져오기
        if (review.getServiceId() == null && reservation.getServiceId() != null) {
            review.setServiceId(reservation.getServiceId());
        }
        
        // itemId가 설정되지 않았다면 예약 정보에서 가져오기
        if (review.getItemId() == null && reservation.getItemId() != null) {
            review.setItemId(reservation.getItemId());
        }
        
        // serviceId와 itemId 중 하나는 반드시 있어야 함
        if (review.getServiceId() == null && review.getItemId() == null) {
            throw new RuntimeException("예약에 연결된 서비스/아이템 정보가 없습니다.");
        }
        
        // 이미지 처리
        if (image != null && !image.isEmpty()) {
            try {
                review.setImageBlob(image.getBytes());
                review.setImageMime(image.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("이미지 업로드 중 오류가 발생했습니다.", e);
            }
        }
        
        return userReviewRepository.save(review);
    }
    
    @Override
    public UserReview updateReview(Integer reviewId, UserReview review, MultipartFile image) {
        UserReview existingReview = userReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        existingReview.setRating(review.getRating());
        existingReview.setTitle(review.getTitle());
        existingReview.setContent(review.getContent());
        existingReview.setIsPublic(review.getIsPublic());
        
        // 새 이미지가 있으면 업데이트
        if (image != null && !image.isEmpty()) {
            try {
                existingReview.setImageBlob(image.getBytes());
                existingReview.setImageMime(image.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("이미지 업로드 중 오류가 발생했습니다.", e);
            }
        }
        
        return userReviewRepository.save(existingReview);
    }
    
    @Override
    public void deleteReview(Integer reviewId) {
        if (!userReviewRepository.existsById(reviewId)) {
            throw new RuntimeException("리뷰를 찾을 수 없습니다.");
        }
        userReviewRepository.deleteById(reviewId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserReviewDto getReviewById(Integer reviewId) {
        UserReview review = userReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        
        return convertToDto(review);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserReviewDto> getReviewsByItemId(Long itemId) {
        List<UserReview> reviews = userReviewRepository.findByItemIdAndIsPublicTrueOrderByCreatedAtDesc(itemId);
        return reviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserReviewDto> getReviewsByServiceId(Long serviceId) {
        System.out.println("🔍 UserReviewServiceImpl.getReviewsByServiceId - serviceId: " + serviceId);
        
        // 모든 리뷰 조회 (공개/비공개 구분 없이)
        List<UserReview> allReviews = userReviewRepository.findByServiceIdOrderByCreatedAtDesc(serviceId);
        System.out.println("🔍 전체 리뷰 개수: " + allReviews.size());
        for (UserReview review : allReviews) {
            System.out.println("  - reviewId: " + review.getReviewId() + ", isPublic: " + review.getIsPublic() + ", title: " + review.getTitle());
        }
        
        // 공개 리뷰만 조회
        List<UserReview> publicReviews = userReviewRepository.findByServiceIdAndIsPublicTrueOrderByCreatedAtDesc(serviceId);
        System.out.println("🔍 공개 리뷰 개수: " + publicReviews.size());
        
        return publicReviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserReviewDto> getReviewsByUserId(Integer userId) {
        List<UserReview> reviews = userReviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserReview getReviewByReservationId(Long reservationId) {
        return userReviewRepository.findByBookingId(reservationId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean canWriteReview(Long reservationId) {
        return !userReviewRepository.existsByBookingId(reservationId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Double getAverageRatingByItemId(Long itemId) {
        Double average = userReviewRepository.findAverageRatingByItemId(itemId);
        return average != null ? Math.round(average * 10) / 10.0 : 0.0;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Double getAverageRatingByServiceId(Long serviceId) {
        Double average = userReviewRepository.findAverageRatingByServiceId(serviceId);
        return average != null ? Math.round(average * 10) / 10.0 : 0.0;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Long getReviewCountByItemId(Long itemId) {
        return userReviewRepository.countByItemIdAndIsPublicTrue(itemId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Long getReviewCountByServiceId(Long serviceId) {
        return userReviewRepository.countByServiceIdAndIsPublicTrue(serviceId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Map<Byte, Long> getRatingStatsByItemId(Long itemId) {
        Map<Byte, Long> stats = new HashMap<>();
        for (byte rating = 1; rating <= 5; rating++) {
            Long count = userReviewRepository.countByItemIdAndRating(itemId, rating);
            stats.put(rating, count);
        }
        return stats;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Map<Byte, Long> getRatingStatsByServiceId(Long serviceId) {
        Map<Byte, Long> stats = new HashMap<>();
        for (byte rating = 1; rating <= 5; rating++) {
            Long count = userReviewRepository.countByServiceIdAndRating(serviceId, rating);
            stats.put(rating, count);
        }
        return stats;
    }
    
    @Override
    @Transactional(readOnly = true)
    public byte[] getReviewImage(Integer reviewId) {
        UserReview review = userReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        return review.getImageBlob();
    }
    
    @Override
    public void toggleReviewVisibility(Integer reviewId) {
        UserReview review = userReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        review.setIsPublic(!review.getIsPublic());
        userReviewRepository.save(review);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Object[]> getReviewsByCompanyId(Integer companyId) {
        try {
            return userReviewRepository.findByCompanyId(companyId);
        } catch (Exception e) {
            System.err.println("getReviewsByCompanyId 오류 - companyId: " + companyId + ", 오류: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    // DTO 변환 헬퍼 메서드
    @Override
    public UserReviewDto convertToDto(UserReview review) {
        UserReviewDto dto = new UserReviewDto();
        dto.setReviewId(review.getReviewId());
        dto.setUserId(review.getUserId());
        dto.setItemId(review.getItemId());
        dto.setServiceId(review.getServiceId());  // serviceId 추가
        dto.setBookingId(review.getBookingId());
        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setContent(review.getContent());
        dto.setImageMime(review.getImageMime());
        dto.setIsPublic(review.getIsPublic());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        
        // 사용자 이름 조회
        if (review.getUserId() != null) {
            socialUsersRepository.findById(review.getUserId())
                    .ifPresent(user -> dto.setUserName(user.getName()));
        }
        
        // 이미지가 있으면 URL 설정
        if (review.getImageBlob() != null) {
            dto.setImageUrl("/review/" + review.getReviewId() + "/image");
        }
        
        // 답글 조회
        List<UserReviewReply> replies = userReviewReplyRepository.findByReview_ReviewIdAndIsPublicTrueOrderByCreatedAtAsc(review.getReviewId());
        dto.setReplies(replies.stream()
                .map(this::convertReplyToDto)
                .collect(Collectors.toList()));
        dto.setReplyCount((long) replies.size());
        
        return dto;
    }
    
    private UserReviewReplyDto convertReplyToDto(UserReviewReply reply) {
        UserReviewReplyDto dto = new UserReviewReplyDto();
        dto.setReplyId(reply.getReplyId());
        dto.setReviewId(reply.getReview().getReviewId());
        dto.setCompanyId(reply.getCompanyId());
        dto.setBody(reply.getBody());
        dto.setIsPublic(reply.getIsPublic());
        dto.setCreatedAt(reply.getCreatedAt());
        dto.setUpdatedAt(reply.getUpdatedAt());
        return dto;
    }
}

