package com.example.ApiRound.crm.hyeonah.review;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserReviewReplyServiceImpl implements UserReviewReplyService {
    
    @Autowired
    private UserReviewReplyRepository userReviewReplyRepository;
    
    @Autowired
    private UserReviewRepository userReviewRepository;
    
    @Override
    public UserReviewReplyDto createReply(UserReviewReplyDto replyDto) {
        UserReviewReply reply = new UserReviewReply();
        reply.setCompanyId(replyDto.getCompanyId());
        reply.setBody(replyDto.getBody());
        reply.setIsPublic(replyDto.getIsPublic() != null ? replyDto.getIsPublic() : true);
        
        // UserReview 엔티티 조회 및 설정
        UserReview review = userReviewRepository.findById(replyDto.getReviewId())
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        reply.setReview(review);
        
        UserReviewReply savedReply = userReviewReplyRepository.save(reply);
        return convertToDto(savedReply);
    }
    
    @Override
    public UserReviewReplyDto updateReply(Integer replyId, UserReviewReplyDto replyDto) {
        UserReviewReply reply = userReviewReplyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("답글을 찾을 수 없습니다."));
        
        reply.setBody(replyDto.getBody());
        reply.setIsPublic(replyDto.getIsPublic());
        
        UserReviewReply updatedReply = userReviewReplyRepository.save(reply);
        return convertToDto(updatedReply);
    }
    
    @Override
    public void deleteReply(Integer replyId) {
        if (!userReviewReplyRepository.existsById(replyId)) {
            throw new RuntimeException("답글을 찾을 수 없습니다.");
        }
        userReviewReplyRepository.deleteById(replyId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserReviewReplyDto> getRepliesByReviewId(Integer reviewId) {
        List<UserReviewReply> replies = userReviewReplyRepository.findByReview_ReviewIdOrderByCreatedAtAsc(reviewId);
        return replies.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserReviewReplyDto> getPublicRepliesByReviewId(Integer reviewId) {
        List<UserReviewReply> replies = userReviewReplyRepository.findByReview_ReviewIdAndIsPublicTrueOrderByCreatedAtAsc(reviewId);
        return replies.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UserReviewReplyDto> getRepliesByCompanyId(Integer companyId) {
        List<UserReviewReply> replies = userReviewReplyRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);
        return replies.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserReviewReplyDto getReplyById(Integer replyId) {
        UserReviewReply reply = userReviewReplyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("답글을 찾을 수 없습니다."));
        return convertToDto(reply);
    }
    
    @Override
    public void toggleReplyVisibility(Integer replyId) {
        UserReviewReply reply = userReviewReplyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("답글을 찾을 수 없습니다."));
        reply.setIsPublic(!reply.getIsPublic());
        userReviewReplyRepository.save(reply);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean hasCompanyReplied(Integer reviewId, Integer companyId) {
        return userReviewReplyRepository.existsByReview_ReviewIdAndCompanyId(reviewId, companyId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long getReplyCountByReviewId(Integer reviewId) {
        return userReviewReplyRepository.countByReview_ReviewId(reviewId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long getPublicReplyCountByReviewId(Integer reviewId) {
        return userReviewReplyRepository.countByReview_ReviewIdAndIsPublicTrue(reviewId);
    }
    
    private UserReviewReplyDto convertToDto(UserReviewReply reply) {
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