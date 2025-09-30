<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><spring:message code="main.title"/></title>
    <!-- 부트스트랩 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- 공통 스타일시트 -->
    <link rel="stylesheet" href="/resources/css/styles.css">
    <!-- 카테고리 버튼 스타일시트 -->
    <link rel="stylesheet" href="/resources/css/category-buttons.css">
    <!-- 인기 도시 스타일시트 -->
    <link rel="stylesheet" href="/resources/css/popular-cities.css">
    <!-- Font Awesome 5 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <!-- 트립비토즈 스타일 추가 -->
    <style>

        .popular-content-wrapper {
            margin-top: 30px;
        }
        /* Community Comments (Left Box) */
        .community-comments {
            flex: 0 0 420px;
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 8px 30px rgba(67, 120, 67, 0.08);
            display: flex;               /* Header + List vertical layout */
            flex-direction: column;
            max-height: 480px;           /* Height limit to align with TOP3 and bottom line */
            overflow: hidden;            /* Hide container overflow */
        }
        .community-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .community-header .title {
            font-size: 18px;
            font-weight: 700;
            color: #2f3a3a;
        }
        .community-header .more-link {
            font-size: 12px;
            color: #2a7a5b;
            text-decoration: none;
        }
        .community-header .more-link:hover {
            text-decoration: underline;
        }
        .comments-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            flex: 1 1 auto;      /* Take remaining space to become scroll area */
            overflow-y: auto;    /* Internal scroll */
        }
        .comment-card {
            border: 1px solid #f0f2f4;
            border-radius: 10px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: box-shadow .2s ease, transform .2s ease;
            background: #fff;
        }
        .comment-card:hover {
            box-shadow: 0 6px 18px rgba(0,0,0,0.06);
            transform: translateY(-2px);
        }
        .comment-card .user {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .comment-card .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            background: #f2f4f6;
        }
        .comment-card .meta {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .comment-card .nickname {
            font-size: 13px;
            font-weight: 600;
            color: #2b2f33;
        }
        .comment-card .date {
            font-size: 11px;
            color: #8a8f94;
        }
        .comment-card .content .tag {
            display: inline-block;
            margin-bottom: 6px;
            padding: 2px 8px;
            font-size: 11px;
            background: #eef7f1;
            color: #2a7a5b;
            border-radius: 999px;
            font-weight: 600;
        }
        .comment-card .content .text {
            font-size: 14px;
            color: #3b4045;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .comment-card .actions {
            display: flex;
            gap: 14px;
            font-size: 12px;
            color: #6b7278;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
            .popular-content-wrapper { gap: 24px; }
        }
        @media (max-width: 1024px) {
            .popular-content-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center; /* Center align internal elements horizontally */
            }
            .community-comments {
                flex: 0 1 auto;      /* Override desktop 420px fixed width */
                margin-top: 0;
                max-height: none;
                overflow: visible;
                width: 100%;
                max-width: 720px;    /* Maximum width for readability */
                margin-left: auto;   /* Center alignment */
                margin-right: auto;  /* Center alignment */
            }
            .content-divider { display: none; }
            .company-cards-wrapper {
                width: 100%;
                max-width: 980px;    /* Maintain center alignment feeling for card grid */
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Responsive card grid */
                gap: 16px;
                justify-content: center;
                align-items: stretch;
            }
            .company-cards-wrapper .company-card {
                width: 100%;
                max-width: 420px; /* Maintain card shape */
                margin: 0 auto;
                display: block;
            }
            /* Ensure fixed ratio and same height for TOP3 card images */
            .company-cards-wrapper .company-card .card-image {
                position: relative;
                width: 100%;
                aspect-ratio: 3 / 2; /* Unify to 3:2 ratio */
                overflow: hidden;
            }
            .company-cards-wrapper .company-card .card-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
        }

            /* Right TOP3 container and title */
            .popular-right {
                display: flex;
                flex-direction: column;
                flex: 1 1 auto;
            }
            .popular-title {
                margin-bottom: 12px; /* Space below title */
            }
            .popular-title h2 {
                font-size: 22px;
                font-weight: 700;
                color: #2f3a3a;
                margin: 0;
            }
            .popular-title p {
                font-size: 13px;
                color: #6b7278;
                margin: 4px 0 0;
            }

        /* Popular TOP3 Title Block */
        .popular-title {
            margin-bottom: 12px; /* Space below title */
            text-align: center;  /* Center align card container */
        }
        .popular-title h2 {
            font-size: 22px;
            font-weight: 700;
            color: #2f3a3a;
            margin: 0;
        }
        .popular-title p {
            font-size: 13px;
            color: #6b7278;
            margin: 4px 0 0;
        }
        /* Move cards slightly down to secure space */
        .company-cards-wrapper {
            margin-top: 8px;
        }

    </style>
</head>
<body>
<%@include file = "/common/header.jsp"%>

<main class="main-content">
    <section class="hero-section" style="--bg:url('/resources/images/bannerimg.jpg')">
        <img src="/resources/images/bannerimg.jpg" alt="HealnGo Main Visual" class="hero-image">
      </section>

    <section class="category-buttons-section">
        <div class="category-buttons-container">
            <div class="category-buttons-title">
                <h2><spring:message code="main.category.title"/></h2>
                <p><spring:message code="main.category.subtitle"/></p>
            </div>

            <div class="category-buttons-grid">
                <!-- 카테고리 버튼 1: 관광 -->
                <a href="/tourism" class="category-button hot">
                    <div class="category-button-icon">
                        <i class="fas fa-plane"></i>
                    </div>
                    <h3><spring:message code="main.category.tourism"/></h3>
                    <p><spring:message code="main.category.tourism.desc"/></p>
                </a>

                <!-- 카테고리 버튼 2: 성형 -->
                <a href="/location?category=<spring:message code='main.category.link.plastic'/>" class="category-button new">
                    <div class="category-button-icon">
                        <i class="fas fa-hospital"></i>
                    </div>
                    <h3><spring:message code="main.category.plastic"/></h3>
                    <p><spring:message code="main.category.plastic.desc"/></p>
                </a>

                   <!-- 카테고리 버튼 3: 피부 -->
                            <a href="/location?category=피부" class="category-button hot">
                                <div class="category-button-icon">
                                    <img src="/resources/images/mask.png" alt="<spring:message code='main.category.skincare'/>">
                                </div>
                                <h3><spring:message code="main.category.skincare"/></h3>
                                <p><spring:message code="main.category.skincare.desc"/></p>
                            </a>


                <!-- 카테고리 버튼 4: 치과 -->
                <a href="/location?category=<spring:message code='main.category.link.dental'/>" class="category-button">
                    <div class="category-button-icon">
                        <i class="fas fa-tooth"></i>
                    </div>
                    <h3><spring:message code="main.category.dental"/></h3>
                    <p><spring:message code="main.category.dental.desc"/></p>
                </a>

                <!-- 카테고리 버튼 5: 약국 -->
                <a href="/location?category=<spring:message code='main.category.link.pharmacy'/>" class="category-button">
                    <div class="category-button-icon">
                        <i class="fas fa-pills"></i>
                    </div>
                    <h3><spring:message code="main.category.pharmacy"/></h3>
                    <p><spring:message code="main.category.pharmacy.desc"/></p>
                </a>

                <!-- 카테고리 버튼 6: 한의학 -->
                <a href="/location?category=<spring:message code='main.category.link.oriental'/>" class="category-button new">
                    <div class="category-button-icon">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <h3><spring:message code="main.category.korean.medicine"/></h3>
                    <p><spring:message code="main.category.korean.medicine.desc"/></p>
                </a>

                <!-- 카테고리 버튼 7: 마사지 -->
                <a href="/location?category=<spring:message code='main.category.link.massage'/>" class="category-button hot">
                    <div class="category-button-icon">
                        <img src="/resources/images/massage.png" alt="<spring:message code='main.category.massage'/>">
                    </div>
                    <h3><spring:message code="main.category.massage"/></h3>
                    <p><spring:message code="main.category.massage.desc"/></p>
                </a>

                <!-- 카테고리 버튼 8: 왁싱 -->
                <a href="/location?category=<spring:message code='main.category.link.waxing'/>" class="category-button">
                    <div class="category-button-icon">
                        <img src="/resources/images/waxing.png" alt="<spring:message code='main.category.waxing'/>">
                    </div>
                    <h3><spring:message code="main.category.waxing"/></h3>
                    <p><spring:message code="main.category.waxing.desc"/></p>
                </a>
            </div>
        </div>
    </section>

                <!-- 인기 도시 및 TOP3 의료기관 섹션 -->
                <section class="popular-section">
                    <div class="container">
            

            <div class="popular-content-wrapper">
                <!-- 왼쪽: 커뮤니티 코멘트 (디자인 전용) -->
                <div class="community-comments">
                    <div class="community-header">
                        <div class="title"><spring:message code="main.popular.community"/></div>
                        <a href="/community" class="more-link"><spring:message code="main.popular.more"/><i class="fas fa-chevron-right"></i></a>
                    </div>

                   <div class="comments-list">
                       <c:forEach var="post" items="${posts}" begin="0" end="4">
                           <div class="comment-card">
                               <div class="user">
                                   <img class="avatar" src="${empty post.profileImage ? 'https://i.pravatar.cc/72?img=1' : post.profileImage}"
                                        alt="<spring:message code='main.community.comment.avatar'/>"
                                        onerror="this.onerror=null;this.src='https://i.pravatar.cc/72?img=1';">
                                   <div class="meta">
                                       <div class="nickname">${post.userId}</div>
                                       <div class="date">
                                           <fmt:formatDate value="${post.createAt}" pattern="yyyy-MM-dd" />
                                       </div>
                                   </div>
                               </div>
                               <div class="content">
                                   <span class="tag">${post.category}</span>
                                   <div class="text">${post.content}</div>
                               </div>
                               <div class="actions">
                                   <span><i class="far fa-thumbs-up"></i> ${post.likeCount}</span>
                               </div>
                           </div>
                       </c:forEach>
                   </div>

                </div>

                <!-- Center divider -->
                <div class="content-divider"></div>

                <!-- Right: TOP3 Medical Institutions -->
                <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

                <c:set var="company1" value="${topCompanies[0]}" />
                <c:set var="company2" value="${topCompanies[1]}" />
                <c:set var="company3" value="${topCompanies[2]}" />

                <div class="popular-right">
                    <div class="popular-title">
                        <h2><spring:message code="main.popular.title"/></h2>
                        <p><spring:message code="main.popular.subtitle"/></p>
                    </div>

                    <div class="company-cards-wrapper">
                                        <!-- 인기 업체 1 -->
                                        <a href="/list?category=${company1.category}&region=${company1.region}&Id=${company1.companyId}&name=${company1.companyName}" class="company-card">
                                            <div class="card-image">
                                                <img src="" alt="<spring:message code='main.popular.company.image.alt'/>: ${company1.companyName}" data-gquery="${company1.companyName} ${empty company1.subregion ? company1.region : company1.subregion}" loading="lazy" onerror="this.onerror=null;this.src='/resources/images/dump.jpg';">
                                                <div class="card-badge"><spring:message code="main.top.badge.1"/></div>
                                            </div>
                                            <div class="card-content">
                                                <h4 class="company-name">${company1.companyName}</h4>
                                                <div class="company-details">
                                                    <span class="location"><i class="fas fa-map-marker-alt"></i> <spring:message code="main.popular.company.location"/>: ${empty company1.subregion ? company1.region : company1.subregion}</span>
                                                </div>
                                                <span class="specialty-tag"><spring:message code="main.popular.company.specialty"/>: ${company1.category}</span>
                                            </div>
                                        </a>

                                        <!-- 인기 업체 2 -->
                                        <a href="/list?category=${company2.category}&region=${company2.region}&Id=${company2.companyId}&name=${company2.companyName}" class="company-card">
                                            <div class="card-image">
                                                <img src="" alt="<spring:message code='main.popular.company.image.alt'/>: ${company2.companyName}" data-gquery="${company2.companyName} ${empty company2.subregion ? company2.region : company2.subregion}" loading="lazy" onerror="this.onerror=null;this.src='/resources/images/dump.jpg';">
                                                <div class="card-badge"><spring:message code="main.top.badge.2"/></div>
                                            </div>
                                            <div class="card-content">
                                                <h4 class="company-name">${company2.companyName}</h4>
                                                <div class="company-details">
                                                    <span class="location"><i class="fas fa-map-marker-alt"></i> <spring:message code="main.popular.company.location"/>: ${empty company2.subregion ? company2.region : company2.subregion}</span>
                                                </div>
                                                <span class="specialty-tag"><spring:message code="main.popular.company.specialty"/>: ${company2.category}</span>
                                            </div>
                                        </a>

                                        <!-- 인기 업체 3 -->
                                        <a href="/list?category=${company3.category}&region=${company3.region}&Id=${company3.companyId}&name=${company3.companyName}" class="company-card">
                                            <div class="card-image">
                                                <img src="" alt="<spring:message code='main.popular.company.image.alt'/>: ${company3.companyName}" data-gquery="${company3.companyName} ${empty company3.subregion ? company3.region : company3.subregion}" loading="lazy" onerror="this.onerror=null;this.src='/resources/images/dump.jpg';">
                                                <div class="card-badge"><spring:message code="main.top.badge.3"/></div>
                                            </div>
                                            <div class="card-content">
                                                <h4 class="company-name">${company3.companyName}</h4>
                                                <div class="company-details">
                                                    <span class="location"><i class="fas fa-map-marker-alt"></i> <spring:message code="main.popular.company.location"/>: ${empty company3.subregion ? company3.region : company3.subregion}</span>
                                                </div>
                                                 <span class="specialty-tag"><spring:message code="main.popular.company.specialty"/>: ${company3.category}</span>
                                            </div>
                                        </a>
                                    </div>
                </div>



                    </div>
                    </div>
                </section>

                <!-- 유튜브 영상 매거진 -->
                <section class="youtube-section mt-5">
                    <div class="container">
                        <div class="section-title">
                            <h2><spring:message code="main.youtube.recommendation"/></h2>
                            <p><spring:message code="main.youtube.comment"/></p>
                        </div>

                        <div class="scroll-container">
                            <div class="youtube-grid" id="youtube-videos">
                                <!-- YouTube 영상 1 -->
                                <div class="youtube-card">
                                    <div class="youtube-image">
                                        <img src="https://img.youtube.com/vi/hC9h4AzbwLw/maxresdefault.jpg" alt="소개 영상 1">
                                        <div class="play-button">
                                            <i class="fas fa-play"></i>
                                        </div>
                                        <div class="youtube-badge"><spring:message code="main.youtube.badge.recommend"/></div>
                                    </div>
                                    <div class="youtube-content">
                                        <h3 class="youtube-title"><spring:message code="main.youtube.video1.title"/></h3>
                                        <p class="youtube-description"><spring:message code="main.youtube.video1.description"/></p>
                                        <div class="youtube-features">
                                            <span class="feature-tag"><spring:message code="main.youtube.video1.feature1"/></span>
                                            <span class="feature-tag"><spring:message code="main.youtube.video1.feature2"/></span>
                                        </div>
                                        <button class="youtube-button"
                                                data-video="hC9h4AzbwLw"
                                                onclick="(function(id){
                                          var m=document.getElementById('youtubeModal'),
                                              f=document.getElementById('youtubeIframe');
                                          f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
                                          m.style.display='block';
                                          document.body.style.overflow='hidden';
                                          if(!window._ytEscBind){ window._ytEscBind=true;
                                            document.addEventListener('keydown',function(e){
                                              if(e.key==='Escape'){ f.src=''; m.style.display='none'; document.body.style.overflow=''; }
                                            });
                                          }
                                          m.onclick=function(e){ if(e.target===m){ f.src=''; m.style.display='none'; document.body.style.overflow=''; } };
                                          // X 버튼 클릭 이벤트 추가
                                          var closeBtn = m.querySelector('.close');
                                          if(closeBtn) {
                                            closeBtn.onclick = function() {
                                              f.src='';
                                              m.style.display='none';
                                              document.body.style.overflow='';
                                            };
                                          }
                                        })(this.dataset.video)">
                                          <spring:message code="main.youtube.button.watch"/>
                                        </button>
                                    </div>
                                </div>

                                <!-- YouTube 영상 2 -->
                                <div class="youtube-card">
                                    <div class="youtube-image">
                                        <img src="https://img.youtube.com/vi/cmn3J6E2PaA/maxresdefault.jpg" alt="소개 영상 2">
                                        <div class="play-button">
                                            <i class="fas fa-play"></i>
                                        </div>
                                        <div class="youtube-badge"><spring:message code="main.youtube.badge.popular"/></div>
                                    </div>
                                    <div class="youtube-content">
                                        <h3 class="youtube-title"><spring:message code="main.youtube.video2.title"/></h3>
                                        <p class="youtube-description"><spring:message code="main.youtube.video2.description"/></p>
                                        <div class="youtube-features">
                                            <span class="feature-tag"><spring:message code="main.youtube.video2.feature1"/></span>
                                            <span class="feature-tag"><spring:message code="main.youtube.video2.feature2"/></span>
                                        </div>
                                            <button class="youtube-button"
                                              onclick="(function(id){
                                                var m=document.getElementById('youtubeModal'),
                                                    f=document.getElementById('youtubeIframe');
                                                f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
                                                m.style.display='block';
                                                document.body.style.overflow='hidden';
                                                if(!window._ytEscBind){ window._ytEscBind=true;
                                                  document.addEventListener('keydown',function(e){
                                                    if(e.key==='Escape'){ f.src=''; m.style.display='none'; document.body.style.overflow=''; }
                                                  });
                                                }
                                                m.onclick=function(e){ if(e.target===m){ f.src=''; m.style.display='none'; document.body.style.overflow=''; } };
                                                // X 버튼 클릭 이벤트 추가
                                                var closeBtn = m.querySelector('.close');
                                                if(closeBtn) {
                                                  closeBtn.onclick = function() {
                                                    f.src='';
                                                    m.style.display='none';
                                                    document.body.style.overflow='';
                                                  };
                                                }
                                              })('cmn3J6E2PaA')">
                                              <spring:message code="main.youtube.button.watch"/>
                                            </button>
                                            </div>
                                </div>

                                <!-- YouTube 영상 3 -->
                                <div class="youtube-card">
                                    <div class="youtube-image">
                                        <img src="https://img.youtube.com/vi/f5Hit9JQCkY/maxresdefault.jpg" alt="소개 영상 3">
                                        <div class="play-button">
                                            <i class="fas fa-play"></i>
                                        </div>
                                        <div class="youtube-badge"><spring:message code="main.youtube.badge.new"/></div>
                                    </div>
                                    <div class="youtube-content">
                                        <h3 class="youtube-title"><spring:message code="main.youtube.video3.title"/></h3>
                                        <p class="youtube-description"><spring:message code="main.youtube.video3.description"/></p>
                                        <div class="youtube-features">
                                            <span class="feature-tag"><spring:message code="main.youtube.video3.feature1"/></span>
                                            <span class="feature-tag"><spring:message code="main.youtube.video3.feature2"/></span>
                                        </div>
                                        <button class="youtube-button"
                                          onclick="(function(id){
                                            var m=document.getElementById('youtubeModal'),
                                                f=document.getElementById('youtubeIframe');
                                            f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
                                            m.style.display='block';
                                            document.body.style.overflow='hidden';
                                            if(!window._ytEscBind){ window._ytEscBind=true;
                                              document.addEventListener('keydown',function(e){
                                                if(e.key==='Escape'){ f.src=''; m.style.display='none'; document.body.style.overflow=''; }
                                              });
                                            }
                                            m.onclick=function(e){ if(e.target===m){ f.src=''; m.style.display='none'; document.body.style.overflow=''; } };
                                            // X 버튼 클릭 이벤트 추가
                                            var closeBtn = m.querySelector('.close');
                                            if(closeBtn) {
                                              closeBtn.onclick = function() {
                                                f.src='';
                                                m.style.display='none';
                                                document.body.style.overflow='';
                                              };
                                            }
                                          })('f5Hit9JQCkY')">
                                          <spring:message code="main.youtube.button.watch"/>
                                        </button>
                                    </div>
                                </div>

                                <!-- YouTube 영상 4 -->
                                <div class="youtube-card">
                                    <div class="youtube-image">
                                        <img src="https://img.youtube.com/vi/8I-08wGeZIE/maxresdefault.jpg" alt="소개 영상 4">
                                        <div class="play-button">
                                            <i class="fas fa-play"></i>
                                        </div>
                                        <div class="youtube-badge"><spring:message code="main.youtube.badge.recommend"/></div>
                                    </div>
                                    <div class="youtube-content">
                                        <h3 class="youtube-title"><spring:message code="main.youtube.video4.title"/></h3>
                                        <p class="youtube-description"><spring:message code="main.youtube.video4.description"/></p>
                                        <div class="youtube-features">
                                            <span class="feature-tag"><spring:message code="main.youtube.video4.feature1"/></span>
                                            <span class="feature-tag"><spring:message code="main.youtube.video4.feature2"/></span>
                                        </div>
                                        <button class="youtube-button"
                                          onclick="(function(id){
                                            var m=document.getElementById('youtubeModal'),
                                                f=document.getElementById('youtubeIframe');
                                            f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
                                            m.style.display='block';
                                            document.body.style.overflow='hidden';
                                            if(!window._ytEscBind){ window._ytEscBind=true;
                                              document.addEventListener('keydown',function(e){
                                                if(e.key==='Escape'){ f.src=''; m.style.display='none'; document.body.style.overflow=''; }
                                              });
                                            }
                                            m.onclick=function(e){ if(e.target===m){ f.src=''; m.style.display='none'; document.body.style.overflow=''; } };
                                            // X 버튼 클릭 이벤트 추가
                                            var closeBtn = m.querySelector('.close');
                                            if(closeBtn) {
                                              closeBtn.onclick = function() {
                                                f.src='';
                                                m.style.display='none';
                                                document.body.style.overflow='';
                                              };
                                            }
                                          })('8I-08wGeZIE')">
                                          <spring:message code="main.youtube.button.watch"/>
                                        </button>
                                    </div>
                                </div>

                                <!-- YouTube 영상 5 -->
                                <div class="youtube-card">
                                    <div class="youtube-image">
                                        <img src="https://img.youtube.com/vi/Dy7X4dEed1I/maxresdefault.jpg" alt="소개 영상 5">
                                        <div class="play-button">
                                            <i class="fas fa-play"></i>
                                        </div>
                                        <div class="youtube-badge"><spring:message code="main.youtube.badge.popular"/></div>
                                    </div>
                                    <div class="youtube-content">
                                        <h3 class="youtube-title"><spring:message code="main.youtube.video5.title"/></h3>
                                        <p class="youtube-description"><spring:message code="main.youtube.video5.description"/></p>
                                        <div class="youtube-features">
                                            <span class="feature-tag"><spring:message code="main.youtube.video5.feature1"/></span>
                                            <span class="feature-tag"><spring:message code="main.youtube.video5.feature2"/></span>
                                        </div>
                                        <button class="youtube-button"
                                          onclick="(function(id){
                                            var m=document.getElementById('youtubeModal'),
                                                f=document.getElementById('youtubeIframe');
                                            f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
                                            m.style.display='block';
                                            document.body.style.overflow='hidden';
                                            if(!window._ytEscBind){ window._ytEscBind=true;
                                              document.addEventListener('keydown',function(e){
                                                if(e.key==='Escape'){ f.src=''; m.style.display='none'; document.body.style.overflow=''; }
                                              });
                                            }
                                            m.onclick=function(e){ if(e.target===m){ f.src=''; m.style.display='none'; document.body.style.overflow=''; } };
                                            // X 버튼 클릭 이벤트 추가
                                            var closeBtn = m.querySelector('.close');
                                            if(closeBtn) {
                                              closeBtn.onclick = function() {
                                                f.src='';
                                                m.style.display='none';
                                                document.body.style.overflow='';
                                              };
                                            }
                                          })('Dy7X4dEed1I')">
                                          <spring:message code="main.youtube.button.watch"/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- 스크롤 버튼 -->
                            <button class="scroll-button prev" onclick="scrollYouTube('left')" title="<spring:message code='main.youtube.scroll.prev'/>">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="scroll-button next" onclick="scrollYouTube('right')" title="<spring:message code='main.youtube.scroll.next'/>">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- YouTube 모달 -->
                <div id="youtubeModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onclick="closeYouTubeModal()">&times;</span>
                        <div class="youtube-video-container">
                            <iframe id="youtubeIframe" src="" frameborder="0" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>


                </main>


<%@include file = "/common/footer.jsp"%>

<!-- 부트스트랩 JS 및 의존성 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<!-- 카테고리 버튼 JS -->
<script src="/resources/js/category-buttons.js"></script>

<!-- YouTube 섹션 JavaScript -->
<script>
// YouTube 스크롤 기능
function scrollYouTube(direction) {
    const grid = document.getElementById('youtube-videos');
    const scrollAmount = 300;

    if (direction === 'left') {
        grid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else {
        grid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// YouTube 모달 열기
function openYouTubeModal(videoId) {
    const modal = document.getElementById('youtubeModal');
    const iframe = document.getElementById('youtubeIframe');

    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.style.display = 'block';

    // 모달 외부 클릭 시 닫기
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeYouTubeModal();
        }
    };
}

// YouTube 모달 닫기
function closeYouTubeModal() {
    const modal = document.getElementById('youtubeModal');
    const iframe = document.getElementById('youtubeIframe');

    iframe.src = '';
    modal.style.display = 'none';
    // 스크롤 복원
    document.body.style.overflow = '';
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeYouTubeModal();
    }
});
</script>

<!-- Google Maps Places API: TOP3 업체 이미지 자동 교체 -->
<script>
  // Google Places에서 사진을 찾아 카드 이미지에 세팅
  function initTopCompaniesPhotos() {
    try {
      const imgs = document.querySelectorAll('.company-cards-wrapper .company-card .card-image img[data-gquery]');
      if (!imgs.length) {
        return;
      }
      // 구글 API 미로딩 시: 구글 이미지를 가져올 수 없으므로 기본 이미지로 대체
      if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        imgs.forEach(function(img) {
          if (!img.getAttribute('src')) {
            img.src = '/resources/images/dump.jpg';
          }
        });
        return;
      }
      // 보이지 않는 맵 컨테이너 (PlacesService를 위한 의존성)
      const holder = document.createElement('div');
      holder.style.display = 'none';
      document.body.appendChild(holder);
      const map = new google.maps.Map(holder);
      const service = new google.maps.places.PlacesService(map);

      imgs.forEach(function(img) {
        const query = img.getAttribute('data-gquery');
        if (!query) return;
        service.findPlaceFromQuery(
          { query: query, fields: ['photos'] },
          function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK &&
                results && results.length &&
                results[0].photos && results[0].photos.length) {
              try {
                const url = results[0].photos[0].getUrl({ maxWidth: 560, maxHeight: 380 });
                if (url) img.src = url;
              } catch (e) {
                console.warn('사진 URL 생성 실패:', e);
                img.src = '/resources/images/dump.jpg';
              }
            } else {
              // 구글 사진이 없을 때만 기본 이미지로 표시
              img.src = '/resources/images/dump.jpg';
            }
          }
        );
      });
    } catch (e) {
      console.error('TOP3 사진 초기화 실패:', e);
    }
  }

  // API가 이미 로드된 경우 대비
  if (typeof google !== 'undefined' && google.maps && google.maps.places) {
    initTopCompaniesPhotos();
  }
</script>
<script async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQVKpyFKKbsxbwSkllx6uLr41-OM6ga44&libraries=places&callback=initTopCompaniesPhotos">
</script>
</body>
</html>
