package com.example.ApiRound.crm.hyeonah.review;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/review")
public class UserReviewController {

    private final UserReviewService userReviewService;

    // ========== 페이지 ==========

    @GetMapping
    public String reviewPage(Model model) {
        return "crm/review";
    }

    // ========== 리뷰 API ==========

    // 리뷰 작성
    @PostMapping
    @ResponseBody
    public ResponseEntity<UserReviewDto> createReview(
            @RequestParam Integer userId,
            @RequestParam(required = false) Long itemId,
            @RequestParam(required = false) Long serviceId,
            @RequestParam Long bookingId,  // reservations.id
            @RequestParam Byte rating,
            @RequestParam String title,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(defaultValue = "true") Boolean isPublic) {

        try {
            System.out.println("🔍 리뷰 작성 요청 - userId: " + userId + ", itemId: " + itemId + ", serviceId: " + serviceId + ", bookingId: " + bookingId);
            
            UserReview review = new UserReview();
            review.setUserId(userId);
            // itemId 설정 (프론트에서 전달된 경우)
            if (itemId != null) {
                review.setItemId(itemId);
                System.out.println("🔍 itemId 설정: " + itemId);
            }
            // serviceId 설정 (프론트에서 전달된 경우)
            if (serviceId != null) {
                review.setServiceId(serviceId);
                System.out.println("🔍 serviceId 설정: " + serviceId);
            } else {
                System.out.println("⚠️ serviceId가 null입니다!");
            }
            review.setBookingId(bookingId);  // bookingId 직접 설정
            review.setRating(rating);
            review.setTitle(title);
            review.setContent(content);
            review.setIsPublic(isPublic);

            UserReview createdReview = userReviewService.createReview(review, image);

            // DTO로 변환하여 반환 (직렬화 문제 방지)
            UserReviewDto dto = userReviewService.getReviewById(createdReview.getReviewId());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            throw new RuntimeException("리뷰 등록 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    // 리뷰 수정
    @PutMapping("/{reviewId}")
    @ResponseBody
    public ResponseEntity<UserReviewDto> updateReview(
            @PathVariable Integer reviewId,
            @RequestParam Byte rating,
            @RequestParam String title,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(defaultValue = "true") Boolean isPublic) {

        try {
            UserReview review = new UserReview();
            review.setRating(rating);
            review.setTitle(title);
            review.setContent(content);
            review.setIsPublic(isPublic);

            UserReview updatedReview = userReviewService.updateReview(reviewId, review, image);

            // DTO로 변환하여 반환 (직렬화 문제 방지)
            UserReviewDto dto = userReviewService.getReviewById(updatedReview.getReviewId());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            throw new RuntimeException("리뷰 수정 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    @ResponseBody
    public ResponseEntity<Void> deleteReview(@PathVariable Integer reviewId) {
        userReviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }

    // 리뷰 상세 조회
    @GetMapping("/{reviewId}")
    @ResponseBody
    public ResponseEntity<UserReviewDto> getReview(@PathVariable Integer reviewId) {
        UserReviewDto review = userReviewService.getReviewById(reviewId);
        return ResponseEntity.ok(review);
    }

    // 아이템별 리뷰 목록 조회
    @GetMapping("/item/{itemId}")
    @ResponseBody
    public ResponseEntity<List<UserReviewDto>> getReviewsByItem(@PathVariable Long itemId) {
        List<UserReviewDto> reviews = userReviewService.getReviewsByItemId(itemId);
        return ResponseEntity.ok(reviews);
    }

    // 사용자별 리뷰 목록 조회
    @GetMapping("/user/{userId}")
    @ResponseBody
    public ResponseEntity<List<UserReviewDto>> getReviewsByUser(@PathVariable Integer userId) {
        List<UserReviewDto> reviews = userReviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    // 예약 ID로 리뷰 조회 (reservations.id 사용)
    @GetMapping("/booking/{reservationId}")
    @ResponseBody
    public ResponseEntity<UserReviewDto> getReviewByBooking(@PathVariable Long reservationId) {
        UserReview review = userReviewService.getReviewByReservationId(reservationId);
        if (review != null) {
            UserReviewDto dto = userReviewService.convertToDto(review);
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    // 리뷰 작성 가능 여부 확인 (reservations.id 사용)
    @GetMapping("/booking/{reservationId}/can-write")
    @ResponseBody
    public ResponseEntity<Boolean> canWriteReview(@PathVariable Long reservationId) {
        boolean canWrite = userReviewService.canWriteReview(reservationId);
        return ResponseEntity.ok(canWrite);
    }

    // 아이템 평균 평점 조회
    @GetMapping("/item/{itemId}/average-rating")
    @ResponseBody
    public ResponseEntity<Double> getAverageRating(@PathVariable Long itemId) {
        Double average = userReviewService.getAverageRatingByItemId(itemId);
        return ResponseEntity.ok(average);
    }

    // 아이템 리뷰 개수 조회
    @GetMapping("/item/{itemId}/count")
    @ResponseBody
    public ResponseEntity<Long> getReviewCount(@PathVariable Long itemId) {
        Long count = userReviewService.getReviewCountByItemId(itemId);
        return ResponseEntity.ok(count);
    }

    // 아이템 평점별 통계 조회
    @GetMapping("/item/{itemId}/rating-stats")
    @ResponseBody
    public ResponseEntity<Map<Byte, Long>> getRatingStats(@PathVariable Long itemId) {
        Map<Byte, Long> stats = userReviewService.getRatingStatsByItemId(itemId);
        return ResponseEntity.ok(stats);
    }


    // 리뷰 공개/비공개 설정
    @PatchMapping("/{reviewId}/toggle-visibility")
    @ResponseBody
    public ResponseEntity<Void> toggleReviewVisibility(@PathVariable Integer reviewId) {
        userReviewService.toggleReviewVisibility(reviewId);
        return ResponseEntity.ok().build();
    }


    // 리뷰 이미지 조회
    @GetMapping("/{reviewId}/image")
    @ResponseBody
    public ResponseEntity<byte[]> getReviewImage(@PathVariable Integer reviewId) {
        try {
            byte[] imageData = userReviewService.getReviewImage(reviewId);
            if (imageData != null && imageData.length > 0) {
                UserReviewDto review = userReviewService.getReviewById(reviewId);
                String mimeType = review.getImageMime() != null ? review.getImageMime() : "image/jpeg";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(mimeType));
                headers.setContentLength(imageData.length);
                headers.setCacheControl("max-age=3600"); // 1시간 캐시

                return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("리뷰 이미지 조회 오류 - reviewId: " + reviewId + ", 오류: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }


}

