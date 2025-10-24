package com.example.ApiRound.crm.hyeonah.notice;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.ApiRound.Service.CommunityPostService;
import com.example.ApiRound.dto.SocialUserDTO;
import com.example.ApiRound.entity.CommunityPost;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/notice")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;
    private final CommunityPostService communityPostService;

    /**
     * 공지사항 목록 페이지 (사용자용)
     * GET /notice
     */
    @GetMapping({"", "/"})
    public String noticePage(
            @RequestParam(defaultValue = "1") int page,
            Model model) {

        // 페이지네이션 설정 (한 페이지에 10개)
        Pageable pageable = PageRequest.of(page - 1, 10);
        Page<Notice> noticePage = noticeService.getPublishedNotices(pageable);

        // 페이지네이션 정보 계산
        int totalPages = Math.max(noticePage.getTotalPages(), 1);
        int startPage = Math.max(1, page - 2);
        int endPage = Math.min(totalPages, page + 2);

        model.addAttribute("notices", noticePage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("totalCount", noticePage.getTotalElements());

        return "notice";
    }

    /**
     * 공지사항 상세 페이지
     * GET /notice/view/{noticeId}
     */
    @GetMapping("/view/{noticeId}")
    public String viewNotice(@PathVariable Integer noticeId, Model model) {
        Notice notice = noticeService.getNoticeById(noticeId);
        model.addAttribute("notice", notice);

        return "notice_view";
    }

    // ========== 커뮤니티 게시글 기능 (기존 CommunityPostController) ==========

    /**
     * 커뮤니티 게시글 목록
     * GET /notice/posts
     */
    @GetMapping("/posts")
    public String listPosts(Model model, HttpSession session){
        List<CommunityPost> posts = communityPostService.getAllPosts();
        SocialUserDTO loginUser = (SocialUserDTO) session.getAttribute("loginUser");
        if (loginUser != null) {
            for (CommunityPost p : posts) {
                boolean liked = communityPostService.hasUserLiked(p.getPostId(), loginUser.getName());
                // Entity에는 setLikedByCurrentUser 메서드가 없으므로 별도 처리 필요
            }
        }
        model.addAttribute("posts", posts);
        return "notice/posts";
    }

    @GetMapping("/posts/view/{postId}")
    public String viewPost(@PathVariable Long postId, Model model){
        CommunityPost post = communityPostService.getPostById(postId);
        model.addAttribute("post", post);
        return "notice/view";
    }

    @GetMapping("/posts/write")
    public String writeForm(Model model){
        model.addAttribute("post", new CommunityPost());
        return "notice/write";
    }

    @PostMapping("/posts/write")
    public String submitWrite(@ModelAttribute CommunityPost post){
        communityPostService.createPost(post);
        return "redirect:/notice/posts";
    }

    // 글 작성 (fetch POST)
    @PostMapping(value="/posts/write/fetch", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseBody
    public String writeFetch(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam String category,
            HttpSession session
    ) {
        SocialUserDTO loginUser = (SocialUserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return "login_required";
        }

        CommunityPost post = new CommunityPost();
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        post.setUserId(loginUser.getName());

        try {
            communityPostService.createPost(post);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

    @PostMapping(value="/posts/edit/fetch", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseBody
    public String editFetch(
            @RequestParam Long postId,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam String category,
            HttpSession session
    ) {
        SocialUserDTO loginUser = (SocialUserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return "login_required";
        }

        if (postId <= 0 || title == null || title.isBlank()
                || content == null || content.isBlank()
                || category == null || category.isBlank()) {
            return "invalid";
        }

        CommunityPost existingPost = communityPostService.getPostById(postId);
        if (existingPost == null) {
            return "post_not_found";
        }

        if (!loginUser.getName().equals(existingPost.getUserId())) {
            return "unauthorized";
        }

        existingPost.setTitle(title);
        existingPost.setContent(content);
        existingPost.setCategory(category);

        try {
            communityPostService.updatePost(existingPost);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

    @GetMapping("/posts/edit/{postId}")
    public String editForm(@PathVariable Long postId, Model model){
        CommunityPost post = communityPostService.getPostById(postId);
        model.addAttribute("post", post);
        return "notice/edit";
    }

    @PostMapping("/posts/edit")
    public String submitEdit(@ModelAttribute CommunityPost post) {
        communityPostService.updatePost(post);
        return "redirect:/notice/posts/view/" + post.getPostId();
    }

    // fetch 전용 삭제
    @PostMapping("/posts/delete")
    @ResponseBody
    public String deletePostFetch(@RequestParam Long postId, HttpSession session) {
        SocialUserDTO loginUser = (SocialUserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            return "login_required";
        }

        CommunityPost existingPost = communityPostService.getPostById(postId);
        if (existingPost == null) {
            return "post_not_found";
        }

        if (!loginUser.getName().equals(existingPost.getUserId())) {
            return "unauthorized";
        }

        try {
            communityPostService.deletePost(postId);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }

    @PostMapping("/posts/insert")
    @ResponseBody
    public String insertPost(@RequestParam String title, @RequestParam String content) {
        CommunityPost post = new CommunityPost();
        post.setTitle(title);
        post.setContent(content);
        communityPostService.createPost(post);
        return "success";
    }

    // 좋아요 토글
    @PostMapping(value="/posts/like/toggle", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseBody
    public Map<String, Object> toggleLike(@RequestParam Long postId, HttpSession session) {
        Map<String, Object> resp = new HashMap<>();
        SocialUserDTO loginUser = (SocialUserDTO) session.getAttribute("loginUser");
        if (loginUser == null) {
            resp.put("status", "login_required");
            return resp;
        }

        Object likedAttr = session.getAttribute("likedPosts");
        Set<Long> likedPosts;
        if (likedAttr instanceof Set) {
            likedPosts = (Set<Long>) likedAttr;
        } else {
            likedPosts = new HashSet<>();
            session.setAttribute("likedPosts", likedPosts);
        }

        boolean alreadyLiked = likedPosts.contains(postId);
        try {
            if (alreadyLiked) {
                communityPostService.decrementLikeCount(postId);
                likedPosts.remove(postId);
            } else {
                communityPostService.incrementLikeCount(postId);
                likedPosts.add(postId);
            }
            int newCount = communityPostService.getLikeCount(postId);
            resp.put("status", "success");
            resp.put("liked", !alreadyLiked);
            resp.put("likeCount", newCount);
        } catch (Exception e) {
            e.printStackTrace();
            resp.put("status", "fail");
        }
        return resp;
    }
}

