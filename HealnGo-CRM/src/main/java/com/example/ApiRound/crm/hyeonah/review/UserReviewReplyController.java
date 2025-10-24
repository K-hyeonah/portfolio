package com.example.ApiRound.crm.hyeonah.review;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/review/reply")
public class UserReviewReplyController {
    
    @Autowired
    private UserReviewReplyService userReviewReplyService;
    
    // 답글 작성
    @PostMapping
    @ResponseBody
    public ResponseEntity<UserReviewReplyDto> createReply(
            @RequestParam Integer reviewId,
            @RequestParam Integer companyId,
            @RequestParam String body,
            @RequestParam(defaultValue = "true") Boolean isPublic) {
        
        try {
            UserReviewReplyDto replyDto = new UserReviewReplyDto();
            replyDto.setReviewId(reviewId);
            replyDto.setCompanyId(companyId);
            replyDto.setBody(body);
            replyDto.setIsPublic(isPublic);
            
            UserReviewReplyDto createdReply = userReviewReplyService.createReply(replyDto);
            return ResponseEntity.ok(createdReply);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 답글 수정
    @PutMapping("/{replyId}")
    @ResponseBody
    public ResponseEntity<UserReviewReplyDto> updateReply(
            @PathVariable Integer replyId,
            @RequestParam String body,
            @RequestParam(defaultValue = "true") Boolean isPublic) {
        
        try {
            UserReviewReplyDto replyDto = new UserReviewReplyDto();
            replyDto.setBody(body);
            replyDto.setIsPublic(isPublic);
            
            UserReviewReplyDto updatedReply = userReviewReplyService.updateReply(replyId, replyDto);
            return ResponseEntity.ok(updatedReply);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 답글 삭제
    @DeleteMapping("/{replyId}")
    @ResponseBody
    public ResponseEntity<Void> deleteReply(@PathVariable Integer replyId) {
        try {
            userReviewReplyService.deleteReply(replyId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 특정 리뷰의 모든 답글 조회
    @GetMapping("/review/{reviewId}")
    @ResponseBody
    public ResponseEntity<List<UserReviewReplyDto>> getRepliesByReviewId(@PathVariable Integer reviewId) {
        try {
            List<UserReviewReplyDto> replies = userReviewReplyService.getRepliesByReviewId(reviewId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 특정 리뷰의 공개된 답글만 조회
    @GetMapping("/review/{reviewId}/public")
    @ResponseBody
    public ResponseEntity<List<UserReviewReplyDto>> getPublicRepliesByReviewId(@PathVariable Integer reviewId) {
        try {
            List<UserReviewReplyDto> replies = userReviewReplyService.getPublicRepliesByReviewId(reviewId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 특정 업체의 모든 답글 조회
    @GetMapping("/company/{companyId}")
    @ResponseBody
    public ResponseEntity<List<UserReviewReplyDto>> getRepliesByCompanyId(@PathVariable Integer companyId) {
        try {
            List<UserReviewReplyDto> replies = userReviewReplyService.getRepliesByCompanyId(companyId);
            return ResponseEntity.ok(replies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 답글 상세 조회
    @GetMapping("/{replyId}")
    @ResponseBody
    public ResponseEntity<UserReviewReplyDto> getReplyById(@PathVariable Integer replyId) {
        try {
            UserReviewReplyDto reply = userReviewReplyService.getReplyById(replyId);
            return ResponseEntity.ok(reply);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 답글 공개/비공개 설정
    @PatchMapping("/{replyId}/toggle-visibility")
    @ResponseBody
    public ResponseEntity<Void> toggleReplyVisibility(@PathVariable Integer replyId) {
        try {
            userReviewReplyService.toggleReplyVisibility(replyId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 특정 업체가 특정 리뷰에 답글을 달았는지 확인
    @GetMapping("/check/{reviewId}/{companyId}")
    @ResponseBody
    public ResponseEntity<Boolean> hasCompanyReplied(
            @PathVariable Integer reviewId,
            @PathVariable Integer companyId) {
        try {
            boolean hasReplied = userReviewReplyService.hasCompanyReplied(reviewId, companyId);
            return ResponseEntity.ok(hasReplied);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 특정 리뷰의 답글 개수
    @GetMapping("/count/{reviewId}")
    @ResponseBody
    public ResponseEntity<Long> getReplyCountByReviewId(@PathVariable Integer reviewId) {
        try {
            long count = userReviewReplyService.getReplyCountByReviewId(reviewId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // 특정 리뷰의 공개된 답글 개수
    @GetMapping("/count/{reviewId}/public")
    @ResponseBody
    public ResponseEntity<Long> getPublicReplyCountByReviewId(@PathVariable Integer reviewId) {
        try {
            long count = userReviewReplyService.getPublicReplyCountByReviewId(reviewId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
