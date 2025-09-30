<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>관광 패키지 - HealnGo</title>
    <!-- 부트스트랩 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- 공통 스타일시트 -->
    <link rel="stylesheet" href="/resources/css/styles.css">
    <!-- Font Awesome 5 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="/resources/css/tourism_list.css">
</head>
<body>
<%@include file="/common/header.jsp"%>

<!-- 브레드크럼 -->
<section class="breadcrumb-section">
    <div class="container">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/main">홈</a></li>
                <li class="breadcrumb-item"><a href="/main">메인</a></li>
                                 <li class="breadcrumb-item active"><spring:message code="tourism.breadcrumb"/></li>
            </ol>
        </nav>
    </div>
</section>

<!-- 히어로 섹션 -->
<section class="tourism-hero">
    <div class="banner-slider">
                 <!-- 배너 1 -->
         <div class="banner-slide active" style="background-image: url('/resources/images/패키지배너1.png');">
             <div class="banner-overlay"></div>
             <div class="banner-content">
                 <h1><spring:message code="tourism.title"/></h1>
                 <p><spring:message code="tourism.subtitle"/></p>
             </div>
         </div>

                 <!-- 배너 2 -->
         <div class="banner-slide" style="background-image: url('/resources/images/패키지배너2.png');">
             <div class="banner-overlay"></div>
             <div class="banner-content">
                 <h1><spring:message code="tourism.title"/></h1>
                 <p><spring:message code="tourism.subtitle"/></p>
             </div>
         </div>

                 <!-- 배너 3 -->
         <div class="banner-slide" style="background-image: url('/resources/images/패키지배너3.png');">
             <div class="banner-overlay"></div>
             <div class="banner-content">
                 <h1><spring:message code="tourism.title"/></h1>
                 <p><spring:message code="tourism.subtitle"/></p>
             </div>
         </div>

                 <!-- 배너 4 -->
         <div class="banner-slide" style="background-image: url('/resources/images/패키지배너4.png');">
             <div class="banner-overlay"></div>
             <div class="banner-content">
                 <h1><spring:message code="tourism.title"/></h1>
                 <p><spring:message code="tourism.subtitle"/></p>
             </div>
         </div>

        <!-- 인디케이터 -->
        <div class="banner-indicators">
            <div class="banner-indicator active" data-slide="0"></div>
            <div class="banner-indicator" data-slide="1"></div>
            <div class="banner-indicator" data-slide="2"></div>
            <div class="banner-indicator" data-slide="3"></div>
        </div>
    </div>
</section>



<!-- 인기 패키지 섹션 -->
<section class="package-section">
    <div class="container">
        <div class="section-title">
                         <h2><spring:message code="tourism.best.packages.title"/></h2>
             <p><spring:message code="tourism.best.packages.subtitle"/></p>
        </div>

        <div class="scroll-container">
            <div class="package-grid" id="popular-packages">
            <!-- 인기 패키지 1 -->
            <div class="package-card" data-category="popular package">
                                 <div class="package-image">
                     <img src="/resources/images/화이트닝패키지.png" alt="<spring:message code='tourism.package.whitening.title'/>">
                 </div>
                <div class="package-content">
                                         <h3 class="package-title"><spring:message code="tourism.package.whitening.title"/></h3>
                     <p class="package-description"><spring:message code="tourism.package.whitening.description"/></p>
                                         <div class="package-features">
                         <span class="feature-tag">피부과</span>
                         <span class="feature-tag">치과</span>
                         <span class="feature-tag">왁싱샵</span>
                     </div>
                     <button class="package-button"><spring:message code="tourism.button.detail"/></button>
                </div>
            </div>

            <!-- 인기 패키지 2 -->
            <div class="package-card" data-category="popular package">
                                 <div class="package-image">
                     <img src="/resources/images/시술패키지.png" alt="<spring:message code='tourism.package.procedure.title'/>">
                     <div class="package-badge"><spring:message code="tourism.badge.popular"/></div>
                 </div>
                <div class="package-content">
                                         <h3 class="package-title"><spring:message code="tourism.package.procedure.title"/></h3>
                     <p class="package-description"><spring:message code="tourism.package.procedure.description"/></p>
                                         <div class="package-features">
                         <span class="feature-tag">피부과</span>
                         <span class="feature-tag">한의원</span>
                         <span class="feature-tag">약국</span>
                     </div>
                     <button class="package-button"><spring:message code="tourism.button.detail"/></button>
                </div>
            </div>

            <!-- 인기 패키지 3 -->
            <div class="package-card" data-category="popular package">
                                 <div class="package-image">
                     <img src="/resources/images/밝은미소패키지.jpg" alt="<spring:message code='tourism.package.brightsmile.title'/>">
                     <div class="package-badge"><spring:message code="tourism.badge.popular"/></div>
                 </div>
                <div class="package-content">
                                         <h3 class="package-title"><spring:message code="tourism.package.brightsmile.title"/></h3>
                     <p class="package-description"><spring:message code="tourism.package.brightsmile.description"/></p>
                                         <div class="package-features">
                         <span class="feature-tag">치과</span>
                         <span class="feature-tag">약국</span>
                         <span class="feature-tag">마사지샵</span>
                     </div>
                     <button class="package-button"><spring:message code="tourism.button.detail"/></button>
                </div>
            </div>

            <!-- 인기 패키지 4 -->
            <div class="package-card" data-category="popular package">
                                 <div class="package-image">
                     <img src="/resources/images/자기관리패키지.png" alt="<spring:message code='tourism.package.selfcare.title'/>">
                     <div class="package-badge"><spring:message code="tourism.badge.popular"/></div>
                 </div>
                <div class="package-content">
                                         <h3 class="package-title"><spring:message code="tourism.package.selfcare.title"/></h3>
                     <p class="package-description"><spring:message code="tourism.package.selfcare.description"/></p>
                                         <div class="package-features">
                         <span class="feature-tag">한방병원</span>
                         <span class="feature-tag">피부과</span>
                         <span class="feature-tag">왁싱샵</span>
                         <span class="feature-tag">마사지샵</span>
                     </div>
                     <button class="package-button"><spring:message code="tourism.button.detail"/></button>
                </div>
            </div>
            <!-- 스크롤 버튼 -->
            <button class="scroll-button prev" onclick="scrollPackages('popular-packages', 'left')">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="scroll-button next" onclick="scrollPackages('popular-packages', 'right')">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>
</section>

<!-- 새로운 패키지 섹션 -->
<section class="package-section" style="background: #f8f9fa;">
    <div class="container">
        <div class="section-title">
                         <h2><spring:message code="tourism.new.packages.title"/></h2>
             <p><spring:message code="tourism.new.packages.subtitle"/></p>
        </div>

        <div class="scroll-container">
            <div class="package-grid" id="new-packages">
            <!-- 새로운 패키지 1 -->
            <div class="package-card" data-category="new package">
                                 <div class="package-image">
                     <img src="/resources/images/여름패키지.png" alt="<spring:message code='tourism.package.summer.title'/>">
                     <div class="package-badge"><spring:message code="tourism.badge.new"/></div>
                 </div>
                <div class="package-content">
                                         <h3 class="package-title"><spring:message code="tourism.package.summer.title"/></h3>
                     <p class="package-description"><spring:message code="tourism.package.summer.description"/></p>
                                         <div class="package-features">
                         <span class="feature-tag">피부과</span>
                         <span class="feature-tag">왁싱샵</span>
                         <span class="feature-tag">한의원</span>
                     </div>
                     <button class="package-button"><spring:message code="tourism.button.detail"/></button>
                </div>
            </div>

            <!-- 새로운 패키지 2 -->
            <div class="package-card" data-category="new package">
                                 <div class="package-image">
                     <img src="/resources/images/힐링패키지.jpg" alt="<spring:message code='tourism.package.healing.title'/>">
                     <div class="package-badge"><spring:message code="tourism.badge.new"/></div>
                 </div>
                <div class="package-content">
                                         <h3 class="package-title"><spring:message code="tourism.package.healing.title"/></h3>
                     <p class="package-description"><spring:message code="tourism.package.healing.description"/></p>
                                         <div class="package-features">
                         <span class="feature-tag">마사지샵</span>
                         <span class="feature-tag">성형외과</span>
                         <span class="feature-tag">한의원</span>
                     </div>
                     <button class="package-button"><spring:message code="tourism.button.detail"/></button>
                </div>
            </div>

            <!-- 새로운 패키지 3 -->
            <div class="package-card" data-category="new package">
                                 <div class="package-image">
                     <img src="/resources/images/다이어트패키지.png" alt="<spring:message code='tourism.package.diet.title'/>">
                     <div class="package-badge"><spring:message code="tourism.badge.new"/></div>
                 </div>
                <div class="package-content">
                                         <h3 class="package-title"><spring:message code="tourism.package.diet.title"/></h3>
                     <p class="package-description"><spring:message code="tourism.package.diet.description"/></p>
                                         <div class="package-features">
                         <span class="feature-tag">성형외과</span>
                         <span class="feature-tag">한의원</span>
                         <span class="feature-tag">마사지샵</span>
                     </div>
                     <button class="package-button"><spring:message code="tourism.button.detail"/></button>
                </div>
            </div>

            <!-- 새로운 패키지 4 -->
            <div class="package-card" data-category="new package">
                                 <div class="package-image">
                     <img src="/resources/images/브이라인패키지.png" alt="<spring:message code='tourism.package.vline.title'/>">
                     <div class="package-badge"><spring:message code="tourism.badge.new"/></div>
                 </div>
                <div class="package-content">
                                         <h3 class="package-title"><spring:message code="tourism.package.vline.title"/></h3>
                     <p class="package-description"><spring:message code="tourism.package.vline.description"/></p>
                                         <div class="package-features">
                         <span class="feature-tag">성형외과</span>
                         <span class="feature-tag">치과</span>
                         <span class="feature-tag">마사지샵</span>
                     </div>
                     <button class="package-button"><spring:message code="tourism.button.detail"/></button>
                </div>
            </div>
            <!-- 스크롤 버튼 -->
            <button class="scroll-button prev" onclick="scrollPackages('new-packages', 'left')">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="scroll-button next" onclick="scrollPackages('new-packages', 'right')">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    </div>
</section>

<!-- BEST 플래너 섹션 -->
<section class="planner-section">
    <div class="container">
        <div class="section-title">
                         <h2><spring:message code="tourism.best.planners.title"/></h2>
             <p><spring:message code="tourism.best.planners.subtitle"/></p>
        </div>

        <div class="planner-grid">
            <!-- 플래너 1 -->
            <div class="planner-card" onclick="showPlannerModal('kimhyuna')">
                <div class="planner-image">
                    <img src="/resources/images/김현아.png" alt="<spring:message code='tourism.planner.kimhyuna.name'/>">
                </div>
                <div class="planner-content">
                    <div class="planner-company"><spring:message code="tourism.planner.kimhyuna.company"/></div>
                    <h3 class="planner-name"><spring:message code="tourism.planner.kimhyuna.name"/></h3>
                    <p class="planner-description"><spring:message code="tourism.planner.kimhyuna.description"/></p>
                </div>
            </div>

            <!-- 플래너 2 -->
            <div class="planner-card" onclick="showPlannerModal('kangyukyung')">
                <div class="planner-image">
                    <img src="/resources/images/강유경.png" alt="<spring:message code='tourism.planner.kangyukyung.name'/>">
                </div>
                <div class="planner-content">
                    <div class="planner-company"><spring:message code="tourism.planner.kangyukyung.company"/></div>
                    <h3 class="planner-name"><spring:message code="tourism.planner.kangyukyung.name"/></h3>
                    <p class="planner-description"><spring:message code="tourism.planner.kangyukyung.description"/></p>
                </div>
            </div>

            <!-- 플래너 3 -->
            <div class="planner-card" onclick="showPlannerModal('kimhaemin')">
                <div class="planner-image">
                    <img src="/resources/images/김해민.png" alt="<spring:message code='tourism.planner.kimhaemin.name'/>">
                </div>
                <div class="planner-content">
                    <div class="planner-company"><spring:message code="tourism.planner.kimhaemin.company"/></div>
                    <h3 class="planner-name"><spring:message code="tourism.planner.kimhaemin.name"/></h3>
                    <p class="planner-description"><spring:message code="tourism.planner.kimhaemin.description"/></p>
                </div>
            </div>

            <!-- 플래너 4 -->
            <div class="planner-card" onclick="showPlannerModal('jungminseo')">
                <div class="planner-image">
                    <img src="/resources/images/정민서.png" alt="<spring:message code='tourism.planner.jungminseo.name'/>">
                </div>
                <div class="planner-content">
                    <div class="planner-company"><spring:message code="tourism.planner.jungminseo.company"/></div>
                    <h3 class="planner-name"><spring:message code="tourism.planner.jungminseo.name"/></h3>
                    <p class="planner-description"><spring:message code="tourism.planner.jungminseo.description"/></p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 플래너 팝업 모달 -->
<div id="plannerModal" class="planner-modal">
    <div class="planner-modal-content">
        <span class="planner-modal-close" onclick="closePlannerModal()">&times;</span>

        <!-- 첫 번째 화면: 업체 이미지 -->
        <div id="companyImageScreen" class="modal-screen">
            <div class="company-image-container">
                <img id="companyImage" src="" alt="<spring:message code='planner.modal.alt.company'/>" onclick="showPlannerInfo()">
            </div>
        </div>

        <!-- 두 번째 화면: 플래너 정보 -->
        <div id="plannerInfoScreen" class="modal-screen" style="display: none;">
            <div class="planner-info-container">
                <div class="planner-info-left">
                    <div class="planner-profile">
                        <img id="plannerProfileImage" src="" alt="<spring:message code='planner.modal.alt.profile'/>">
                    </div>
                    <div class="planner-details">
                        <div class="planner-company-info" id="plannerCompanyInfo"></div>
                        <h2 class="planner-name-info" id="plannerNameInfo"></h2>
                        <div class="planner-contact">
                            <div class="contact-item">
                                <i class="fas fa-phone" style="color: #FFD700;"></i>
                                <span id="plannerPhone">010-1234-1234</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-envelope" style="color: #6c757d;"></i>
                                <span id="plannerEmail">mallangping33@gmail.com</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-heart" style="color: #dc3545;"></i>
                                <span id="plannerWebsite">www.mallangping.co.kr</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="planner-info-right">
                    <div class="service-categories">
                        <div class="service-category"><spring:message code="planner.modal.service.skin"/></div>
                        <div class="service-category"><spring:message code="planner.modal.service.dental"/></div>
                        <div class="service-category"><spring:message code="planner.modal.service.diet"/></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 패키지 상세 모달 -->
<div id="packageModal" class="planner-modal">
    <div class="planner-modal-content">
        <span class="planner-modal-close" onclick="closePackageModal()">&times;</span>

        <div class="package-modal-header">
            <h2 id="packageModalTitle" class="package-name"></h2>
        </div>

        <div class="package-modal-body">

            <!-- 이미지 타일 3개 -->
            <div class="package-images-section">
              <div class="package-image-grid">
                <div class="tile-card" data-category="waxing">
                  <img src="/resources/images/packages/packagewaxing.png" alt="왁싱" class="tile-img">
                  <div class="tile-caption">왁싱</div>
                </div>
                <div class="tile-card" data-category="plasticsurgery">
                  <img src="/resources/images/packages/packageplastic.png" alt="성형외과" class="tile-img">
                  <div class="tile-caption">성형외과</div>
                </div>
                <div class="tile-card" data-category="dermatology">
                  <img src="/resources/images/packages/packageph.png" alt="피부과" class="tile-img">
                  <div class="tile-caption">피부과</div>
                </div>
              </div>
            </div>

            <!-- 서비스 목록 -->
            <div class="service-list-section">
              <div class="service-list" id="serviceList"></div>
            </div>
          </div>

    </div>
</div>


<%@include file="/common/footer.jsp"%>

<!-- 부트스트랩 JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<!-- 번역 데이터를 JavaScript로 전달 -->
<script>
// Spring i18n 메시지를 JavaScript에서 사용할 수 있도록 전달
window.i18nMessages = {
    // 플래너 모달 번역
    'planner.modal.alt.company': '<spring:message code="planner.modal.alt.company" javaScriptEscape="true"/>',
    'planner.modal.alt.profile': '<spring:message code="planner.modal.alt.profile" javaScriptEscape="true"/>',
    'planner.modal.service.skin': '<spring:message code="planner.modal.service.skin" javaScriptEscape="true"/>',
    'planner.modal.service.dental': '<spring:message code="planner.modal.service.dental" javaScriptEscape="true"/>',
    'planner.modal.service.diet': '<spring:message code="planner.modal.service.diet" javaScriptEscape="true"/>',
    
    // 패키지 모달 번역
    'package.modal.category.waxing': '<spring:message code="package.modal.category.waxing" javaScriptEscape="true"/>',
    'package.modal.category.plasticsurgery': '<spring:message code="package.modal.category.plasticsurgery" javaScriptEscape="true"/>',
    'package.modal.category.dermatology': '<spring:message code="package.modal.category.dermatology" javaScriptEscape="true"/>',
    'package.modal.category.dental': '<spring:message code="package.modal.category.dental" javaScriptEscape="true"/>',
    'package.modal.category.pharmacy': '<spring:message code="package.modal.category.pharmacy" javaScriptEscape="true"/>',
    'package.modal.category.massage': '<spring:message code="package.modal.category.massage" javaScriptEscape="true"/>',
    'package.modal.category.oriental': '<spring:message code="package.modal.category.oriental" javaScriptEscape="true"/>',
    'package.modal.category.orientalHospital': '<spring:message code="package.modal.category.orientalHospital" javaScriptEscape="true"/>',
    
    // 서비스 데이터 번역
    'service.waxing.leg5.title': '<spring:message code="service.waxing.leg5.title" javaScriptEscape="true"/>',
    'service.waxing.leg5.description': '<spring:message code="service.waxing.leg5.description" javaScriptEscape="true"/>',
    'service.waxing.thigh5.title': '<spring:message code="service.waxing.thigh5.title" javaScriptEscape="true"/>',
    'service.waxing.thigh5.description': '<spring:message code="service.waxing.thigh5.description" javaScriptEscape="true"/>',
    
    'service.plasticsurgery.signature.color.title': '<spring:message code="service.plasticsurgery.signature.color.title" javaScriptEscape="true"/>',
    'service.plasticsurgery.signature.color.description': '<spring:message code="service.plasticsurgery.signature.color.description" javaScriptEscape="true"/>',
    'service.plasticsurgery.signature.pore.title': '<spring:message code="service.plasticsurgery.signature.pore.title" javaScriptEscape="true"/>',
    'service.plasticsurgery.signature.pore.description': '<spring:message code="service.plasticsurgery.signature.pore.description" javaScriptEscape="true"/>',
    
    'service.dermatology.cryocell.title': '<spring:message code="service.dermatology.cryocell.title" javaScriptEscape="true"/>',
    'service.dermatology.cryocell.description': '<spring:message code="service.dermatology.cryocell.description" javaScriptEscape="true"/>',
    'service.dermatology.dualtone.title': '<spring:message code="service.dermatology.dualtone.title" javaScriptEscape="true"/>',
    'service.dermatology.dualtone.description': '<spring:message code="service.dermatology.dualtone.description" javaScriptEscape="true"/>',
    
    'service.dental.scaling.title': '<spring:message code="service.dental.scaling.title" javaScriptEscape="true"/>',
    'service.dental.scaling.description': '<spring:message code="service.dental.scaling.description" javaScriptEscape="true"/>',
    'service.dental.whitening.title': '<spring:message code="service.dental.whitening.title" javaScriptEscape="true"/>',
    'service.dental.whitening.description': '<spring:message code="service.dental.whitening.description" javaScriptEscape="true"/>',
    
    'service.pharmacy.travel.title': '<spring:message code="service.pharmacy.travel.title" javaScriptEscape="true"/>',
    'service.pharmacy.travel.description': '<spring:message code="service.pharmacy.travel.description" javaScriptEscape="true"/>',
    'service.pharmacy.skin.title': '<spring:message code="service.pharmacy.skin.title" javaScriptEscape="true"/>',
    'service.pharmacy.skin.description': '<spring:message code="service.pharmacy.skin.description" javaScriptEscape="true"/>',
    
    'service.massage.aroma.title': '<spring:message code="service.massage.aroma.title" javaScriptEscape="true"/>',
    'service.massage.aroma.description': '<spring:message code="service.massage.aroma.description" javaScriptEscape="true"/>',
    'service.massage.foot.title': '<spring:message code="service.massage.foot.title" javaScriptEscape="true"/>',
    'service.massage.foot.description': '<spring:message code="service.massage.foot.description" javaScriptEscape="true"/>',
    
    'service.oriental.diet.title': '<spring:message code="service.oriental.diet.title" javaScriptEscape="true"/>',
    'service.oriental.diet.description': '<spring:message code="service.oriental.diet.description" javaScriptEscape="true"/>',
    'service.oriental.shape.title': '<spring:message code="service.oriental.shape.title" javaScriptEscape="true"/>',
    'service.oriental.shape.description': '<spring:message code="service.oriental.shape.description" javaScriptEscape="true"/>',
    
    'service.orientalHospital.pain.title': '<spring:message code="service.orientalHospital.pain.title" javaScriptEscape="true"/>',
    'service.orientalHospital.pain.description': '<spring:message code="service.orientalHospital.pain.description" javaScriptEscape="true"/>',
    'service.orientalHospital.rehab.title': '<spring:message code="service.orientalHospital.rehab.title" javaScriptEscape="true"/>',
    'service.orientalHospital.rehab.description': '<spring:message code="service.orientalHospital.rehab.description" javaScriptEscape="true"/>'
};

// 번역 함수
function getMessage(key) {
    return window.i18nMessages[key] || key;
}
</script>

<script src="/resources/js/tourism_list.js"></script>
</body>
</html>