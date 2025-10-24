package com.example.ApiRound;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.ApiRound.Service.ClickLogService;
import com.example.ApiRound.Service.CommunityPostService;
import com.example.ApiRound.crm.hyeonah.notice.Notice;
import com.example.ApiRound.crm.hyeonah.notice.NoticeService;
import com.example.ApiRound.crm.hyeonah.review.UserReviewDto;
import com.example.ApiRound.crm.hyeonah.review.UserReviewService;
import com.example.ApiRound.entity.CommunityPost;
import com.example.ApiRound.entity.ItemList;
import com.example.ApiRound.repository.ItemListRepository;

@Controller
public class HelloController {

    private final ClickLogService clickLogService;
    private final CommunityPostService communityPostService;
    private final NoticeService noticeService;
    private final UserReviewService userReviewService;
    private final ItemListRepository itemListRepository;

    public HelloController(ClickLogService clickLogService, CommunityPostService communityPostService, 
                          NoticeService noticeService, UserReviewService userReviewService,
                          ItemListRepository itemListRepository) {
        this.clickLogService = clickLogService;
        this.communityPostService = communityPostService;
        this.noticeService = noticeService;
        this.userReviewService = userReviewService;
        this.itemListRepository = itemListRepository;
    }
    @GetMapping({"/", "/main"})
    public String main(Model model) {
        // 클릭로그 기반 TOP3 업체 조회 (Object[] = [companyId, clickCount])
        List<Object[]> topCompaniesData = clickLogService.getTop3CompaniesLast7Days();
        List<CommunityPost> communityPosts = communityPostService.getAllPosts();
        
        // 최신 공지사항 5개 가져오기
        Pageable pageable = PageRequest.of(0, 5);
        List<Notice> recentNotices = noticeService.getPublishedNotices(pageable).getContent();

        // TOP3 업체의 ItemList 정보 가져오기
        List<ItemList> medicalInstitutions = new ArrayList<>();
        for (Object[] data : topCompaniesData) {
            // null 체크 추가
            if (data[0] != null) {
                Long itemId = ((Number) data[0]).longValue();
                // item_list에서 해당 아이템 찾기
                itemListRepository.findById(itemId)
                    .ifPresent(medicalInstitutions::add);
            }
        }
        
        System.out.println("===== 메인 페이지 TOP3 의료기관 =====");
        System.out.println("클릭로그 TOP3 업체 수: " + topCompaniesData.size());
        System.out.println("조회된 의료기관 수: " + medicalInstitutions.size());
        for (ItemList item : medicalInstitutions) {
            System.out.println("의료기관: " + item.getName() + ", 카테고리: " + item.getCategory());
        }

        model.addAttribute("topCompanies", topCompaniesData);
        model.addAttribute("medicalInstitutions", medicalInstitutions);
        model.addAttribute("posts", communityPosts);
        model.addAttribute("notices", recentNotices);

        return "main";
    }

    @GetMapping("/hello")
    public String hello(Model model) {
        model.addAttribute("message", "JSP 테스트 성공!");
        return "hello"; // /WEB-INF/views/hello.jsp로 연결됨
    }

    @GetMapping("/plastic-surgery")
    public String surgery(Model model) {
        return "plastic-surgery"; // /WEB-INF/views/plastic-surgery.jsp로 연결됨
    }

    @GetMapping("/skincare")
    public String skincare(Model model) {
        return "skincare"; // /WEB-INF/views/skincare.jsp로 연결됨
    }

    @GetMapping("/location")
    public String location() {
        return "location";
    }

    @GetMapping("/service/detail/{serviceId}")
    public String serviceDetail(@PathVariable Long serviceId, Model model) {
        model.addAttribute("serviceId", serviceId);
        
        // 리뷰 목록 조회 (serviceId 기반)
        List<UserReviewDto> reviews = userReviewService.getReviewsByServiceId(serviceId);
        model.addAttribute("reviews", reviews);
        
        // 평균 평점 조회
        Double averageRating = userReviewService.getAverageRatingByServiceId(serviceId);
        model.addAttribute("averageRating", averageRating);
        
        // 리뷰 개수 조회
        Long reviewCount = userReviewService.getReviewCountByServiceId(serviceId);
        model.addAttribute("reviewCount", reviewCount);
        
        return "service_detail";
    }

}
