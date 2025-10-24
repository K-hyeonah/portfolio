package com.example.ApiRound.repository;

import com.example.ApiRound.entity.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    
    // 삭제되지 않은 모든 게시글 조회 (최신순)
    @Query("SELECT p FROM CommunityPost p WHERE p.isDeleted = 'N' ORDER BY p.createAt DESC")
    List<CommunityPost> findAllActivePosts();
    
    // 사용자별 게시글 조회
    List<CommunityPost> findByUserIdAndIsDeleted(String userId, String isDeleted);
    
    // 카테고리별 게시글 조회
    List<CommunityPost> findByCategoryAndIsDeleted(String category, String isDeleted);
}
