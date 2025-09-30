package com.example.ApiRound.Service;

import com.example.ApiRound.dto.CommunityPostDto;
import com.example.ApiRound.mapper.CommunityPostMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommunityPostServiceImpl implements CommunityPostService {

    private final CommunityPostMapper mapper;

    // 생성자 주입 (필드 @Autowired 대신 깔끔하고 컴파일 안전)
    public CommunityPostServiceImpl(CommunityPostMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public List<CommunityPostDto> getAllPosts() {
        return mapper.findAllPosts();
    }

    @Override
    public CommunityPostDto getPostbyId(int postId) {
        return mapper.findPostbyId(postId);
    }

    @Override
    @Transactional
    public void createPost(CommunityPostDto post) {
        if (post == null) return;
        // 세션에서 못 채우면 익명으로
        if (post.getUserId() == null || post.getUserId().trim().isEmpty()) {
            post.setUserId("익명");
        }
        // POST_ID는 트리거가 채우게 null 유지
        mapper.insertPost(post);
    }

    @Override
    @Transactional
    public void updatePost(CommunityPostDto post) {
        // 컨트롤러에서 postId, title, content만 채워서 보내면
        // 매퍼 XML에서 title/content만 업데이트 하도록 이미 구성
        if (post == null) return;
        mapper.updatePost(post);
    }

    @Override
    @Transactional
    public void deletePost(int postId) {
        mapper.softDeletePost(postId);
    }
    @Override
    public boolean hasUserLiked(int postId, String userName) {
        return mapper.hasUserLiked(postId, userName) > 0;
    }

    @Override
    @Transactional
    public void incrementLikeCount(int postId) {
        mapper.incrementLikeCount(postId);
    }

    @Override
    @Transactional
    public void decrementLikeCount(int postId) {
        mapper.decrementLikeCount(postId);
    }

    @Override
    public int getLikeCount(int postId) {
        return mapper.getLikeCount(postId);
    }
}
