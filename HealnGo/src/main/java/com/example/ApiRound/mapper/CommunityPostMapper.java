package com.example.ApiRound.mapper;

import com.example.ApiRound.dto.CommunityPostDto;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CommunityPostMapper {
    List<CommunityPostDto> findAllPosts();
    CommunityPostDto findPostbyId(int postId);
    void insertPost(CommunityPostDto post);
    void updatePost(CommunityPostDto post);
    void softDeletePost(int postId);

    int hasUserLiked(@Param("postId") int postId, @Param("userId") String userId);
    void insertLike(@Param("postId") int postId, @Param("userId") String userId);
    void deleteLike(@Param("postId") int postId, @Param("userId") String userId);
    void incrementLikeCount(@Param("postId") int postId);
    void decrementLikeCount(@Param("postId") int postId);
    int getLikeCount(@Param("postId") int postId);
}
