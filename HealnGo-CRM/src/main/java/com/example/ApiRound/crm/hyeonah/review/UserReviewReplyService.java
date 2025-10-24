package com.example.ApiRound.crm.hyeonah.review;

import java.util.List;

public interface UserReviewReplyService {
    
    // 답글 작성
    UserReviewReplyDto createReply(UserReviewReplyDto replyDto);
    
    // 답글 수정
    UserReviewReplyDto updateReply(Integer replyId, UserReviewReplyDto replyDto);
    
    // 답글 삭제
    void deleteReply(Integer replyId);
    
    // 특정 리뷰의 모든 답글 조회
    List<UserReviewReplyDto> getRepliesByReviewId(Integer reviewId);
    
    // 특정 리뷰의 공개된 답글만 조회
    List<UserReviewReplyDto> getPublicRepliesByReviewId(Integer reviewId);
    
    // 특정 업체의 모든 답글 조회
    List<UserReviewReplyDto> getRepliesByCompanyId(Integer companyId);
    
    // 답글 상세 조회
    UserReviewReplyDto getReplyById(Integer replyId);
    
    // 답글 공개/비공개 설정
    void toggleReplyVisibility(Integer replyId);
    
    // 특정 업체가 특정 리뷰에 답글을 달았는지 확인
    boolean hasCompanyReplied(Integer reviewId, Integer companyId);
    
    // 특정 리뷰의 답글 개수
    long getReplyCountByReviewId(Integer reviewId);
    
    // 특정 리뷰의 공개된 답글 개수
    long getPublicReplyCountByReviewId(Integer reviewId);
}