package com.example.ApiRound.Service;

import com.example.ApiRound.entity.CommunityPost;

import java.util.List;

public interface CommunityPostService {
    List<CommunityPost> getAllPosts();
    CommunityPost getPostById(Long postId);
    CommunityPost createPost(CommunityPost post);
    CommunityPost updatePost(CommunityPost post);
    void deletePost(Long postId);

    // 좋아요 관련
    boolean hasUserLiked(Long postId, String userName);
    void incrementLikeCount(Long postId);
    void decrementLikeCount(Long postId);
    int getLikeCount(Long postId);
}
