<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>
<head>
    <title>HealnGo 상세페이지</title>
    <link rel="stylesheet" href="/resources/css/detail.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <%@include file = "/common/header.jsp"%>

    <div class="hospital-list-container">
        <!-- 게시글 목록 -->
        <div class="hospital-item">
            <div class="hospital-header">
                <div class="hospital-image">
                    <img src="/resources/images/detail/hospital.jpg" alt="병원">
                </div>
                <div class="hospital-info">
                    <h3 class="hospital-title">
                        ${not empty list.nameLabel ? list.nameLabel : list.name}
                    </h3>
                    <p class="hospital-address">
                        ${not empty list.addressLabel ? list.addressLabel : list.address}
                    </p>
                    <div class="hospital-tags">
                        <span class="tag">성형외과</span>
                        <span class="tag">리프팅</span>
                        <span class="tag">지방성형</span>
                    </div>
                </div>
                <div class="hospital-arrow">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>

            <!-- 상세내용 (처음에는 숨김) -->
            <div class="hospital-detail" style="display: none;">
                <div class="detail-content">
                    <div class="hospital-container">
                        <div class="detail-hospital">
                            <img src="/resources/images/detail/hospital.jpg" alt="병원">
                        </div>
                        <h2 class="hospital_title">
                            ${not empty list.nameLabel ? list.nameLabel : list.name}
                        </h2>
                    </div>

                    <table border="1">
                        <tr>
                            <th>상담가능언어</th>
                            <td>영어, 중국어, 일본어, 프랑스어</td>
                        </tr>
                        <tr>
                            <th>특화진료</th>
                            <td>리프팅, 지방성형(다이어트), 쁘띠(필러, 보톡스 등), 흉터제거, 레이저제모</td>
                        </tr>
                        <tr>
                            <th>시설정보</th>
                            <td>의료진 수: 5명, 병상 수: 2병상</td>
                        </tr>
                        <tr>
                            <th>운영시간</th>
                            <td class="hospital_time"></td>
                        </tr>
                        <tr>
                            <th>홈페이지</th>
                            <td class="hospital_website"></td>
                        </tr>
                        <tr>
                            <th>연락처</th>
                            <td class="hospital_phonenumber"></td>
                        </tr>
                        <tr>
                            <th>위치 및 교통정보</th>
                            <td class="hospital_address">서울 서초구 서초대로73길 42 강남역리가스퀘어 3층</td>
                        </tr>
                        <tr>
                            <th>지하철</th>
                            <td class="location"></td>
                        </tr>
                    </table>
                    <div id="map" class="map"></div>
                </div>
            </div>
        </div>

        <!-- 추가 게시글 예시 -->
        <div class="hospital-item">
            <div class="hospital-header">
                <div class="hospital-image">
                    <img src="/resources/images/detail/hospital.jpg" alt="병원">
                </div>
                <div class="hospital-info">
                    <h3 class="hospital-title">강남성형외과의원</h3>
                    <p class="hospital-address">서울 강남구 테헤란로 123</p>
                    <div class="hospital-tags">
                        <span class="tag">성형외과</span>
                        <span class="tag">눈성형</span>
                        <span class="tag">코성형</span>
                    </div>
                </div>
                <div class="hospital-arrow">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>

            <div class="hospital-detail" style="display: none;">
                <div class="detail-content">
                    <div class="hospital-container">
                        <div class="detail-hospital">
                            <img src="/resources/images/detail/hospital.jpg" alt="병원">
                        </div>
                        <h2 class="hospital_title">강남성형외과의원</h2>
                    </div>

                    <table border="1">
                        <tr>
                            <th>상담가능언어</th>
                            <td>한국어, 영어</td>
                        </tr>
                        <tr>
                            <th>특화진료</th>
                            <td>눈성형, 코성형, 턱성형, 지방이식</td>
                        </tr>
                        <tr>
                            <th>시설정보</th>
                            <td>의료진 수: 3명, 병상 수: 1병상</td>
                        </tr>
                        <tr>
                            <th>운영시간</th>
                            <td class="hospital_time"></td>
                        </tr>
                        <tr>
                            <th>홈페이지</th>
                            <td class="hospital_website"></td>
                        </tr>
                        <tr>
                            <th>연락처</th>
                            <td class="hospital_phonenumber"></td>
                        </tr>
                        <tr>
                            <th>위치 및 교통정보</th>
                            <td class="hospital_address">서울 강남구 테헤란로 123</td>
                        </tr>
                        <tr>
                            <th>지하철</th>
                            <td class="location"></td>
                        </tr>
                    </table>
                    <div id="map" class="map"></div>
                </div>
            </div>
        </div>

        <!-- 추가 게시글 예시 2 -->
        <div class="hospital-item">
            <div class="hospital-header">
                <div class="hospital-image">
                    <img src="/resources/images/detail/hospital.jpg" alt="병원">
                </div>
                <div class="hospital-info">
                    <h3 class="hospital-title">부산치과병원</h3>
                    <p class="hospital-address">부산 해운대구 해운대로 456</p>
                    <div class="hospital-tags">
                        <span class="tag">치과</span>
                        <span class="tag">임플란트</span>
                        <span class="tag">교정</span>
                    </div>
                </div>
                <div class="hospital-arrow">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>

            <div class="hospital-detail" style="display: none;">
                <div class="detail-content">
                    <div class="hospital-container">
                        <div class="detail-hospital">
                            <img src="/resources/images/detail/hospital.jpg" alt="병원">
                        </div>
                        <h2 class="hospital_title">부산치과의원</h2>
                    </div>

                    <table border="1">
                        <tr>
                            <th>상담가능언어</th>
                            <td>한국어, 영어, 일본어</td>
                        </tr>
                        <tr>
                            <th>특화진료</th>
                            <td>임플란트, 교정, 보철, 치주치료</td>
                        </tr>
                        <tr>
                            <th>시설정보</th>
                            <td>의료진 수: 4명, 병상 수: 0병상</td>
                        </tr>
                        <tr>
                            <th>운영시간</th>
                            <td class="hospital_time"></td>
                        </tr>
                        <tr>
                            <th>홈페이지</th>
                            <td class="hospital_website"></td>
                        </tr>
                        <tr>
                            <th>연락처</th>
                            <td class="hospital_phonenumber"></td>
                        </tr>
                        <tr>
                            <th>위치 및 교통정보</th>
                            <td class="hospital_address">부산 해운대구 해운대로 456</td>
                        </tr>
                        <tr>
                            <th>지하철</th>
                            <td class="location"></td>
                        </tr>
                    </table>
                    <div id="map" class="map"></div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=703e2573e79d7de26254a05a83ea0f4c&libraries=services,clusterer"></script>
    <script src="/resources/js/map.js"></script>
    <script src="/resources/js/detail.js"></script>

    <%@include file = "/common/footer.jsp"%>
</body>
</html>
