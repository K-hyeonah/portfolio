package com.example.ApiRound.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CommunityPostDto {
    private int postId;
    private String userId;
    private String authorName;  // 추가: 작성자 이름
    private String title;
    private String content;
    private Timestamp createAt;
    private int likeCount;
    private String category;
    private String isDeleted;
    private String isUpdate;
    private String profileImage; // SOCIAL_USER.PROFILE_IMAGE 매핑 필드
        private boolean likedByCurrentUser; // 현재 로그인 사용자의 좋아요 여부(뷰 렌더링용)

}
