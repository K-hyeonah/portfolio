package com.example.ApiRound.Service;

import com.example.ApiRound.entity.CommunityPost;
import com.example.ApiRound.repository.CommunityPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CommunityPostServiceImpl implements CommunityPostService {
    
    @Autowired
    private CommunityPostRepository communityPostRepository;
    
    @Override
    public List<CommunityPost> getAllPosts() {
        return communityPostRepository.findAllActivePosts();
    }
    
    @Override
    public CommunityPost getPostById(Long postId) {
        return communityPostRepository.findById(postId).orElse(null);
    }
    
    @Override
    public CommunityPost createPost(CommunityPost post) {
        return communityPostRepository.save(post);
    }
    
    @Override
    public CommunityPost updatePost(CommunityPost post) {
        return communityPostRepository.save(post);
    }
    
    @Override
    public void deletePost(Long postId) {
        communityPostRepository.deleteById(postId);
    }
    
    @Override
    public boolean hasUserLiked(Long postId, String userName) {
        // TODO: 좋아요 관련 로직 구현
        return false;
    }
    
    @Override
    public void incrementLikeCount(Long postId) {
        CommunityPost post = communityPostRepository.findById(postId).orElse(null);
        if (post != null) {
            post.setLikeCount(post.getLikeCount() + 1);
            communityPostRepository.save(post);
        }
    }
    
    @Override
    public void decrementLikeCount(Long postId) {
        CommunityPost post = communityPostRepository.findById(postId).orElse(null);
        if (post != null) {
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            communityPostRepository.save(post);
        }
    }
    
    @Override
    public int getLikeCount(Long postId) {
        CommunityPost post = communityPostRepository.findById(postId).orElse(null);
        return post != null ? post.getLikeCount() : 0;
    }
}