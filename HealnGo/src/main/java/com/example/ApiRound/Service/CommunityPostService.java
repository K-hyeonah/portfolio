package com.example.ApiRound.Service;

import com.example.ApiRound.dto.CommunityPostDto;

import java.util.List;

public interface CommunityPostService {
    List<CommunityPostDto> getAllPosts();
    CommunityPostDto getPostbyId(int postId);
    void createPost(CommunityPostDto post);
    void updatePost(CommunityPostDto post);
    void deletePost(int postId);

    // 좋아요 관련
    boolean hasUserLiked(int postId, String userName);
    void incrementLikeCount(int postId);
    void decrementLikeCount(int postId);
    int getLikeCount(int postId);
}
