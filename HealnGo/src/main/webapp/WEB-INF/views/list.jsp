
<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>
<head>
    <title>HealnGo - 병원 목록</title>
    <link rel="stylesheet" href="/resources/css/styles.css">
    <link rel="stylesheet" href="/resources/css/list.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <c:if test="${not empty _csrf}">
        <meta name="_csrf" content="${_csrf.token}"/>
        <meta name="_csrf_header" content="${_csrf.headerName}"/>
    </c:if>
    <script>
        window.APP_CTX = '<c:out value="${pageContext.request.contextPath}"/>' || '';
    </script>
</head>
<body>
<%@include file="/common/header.jsp"%>

<!-- ✅ main-container 바로 아래에 left/right 가 오도록 -->
<div class="main-container">

        <!-- 왼쪽: 필터 + 목록 -->
        <div class="left-panel">

            <!-- 지역 정보 -->
            <div class="region-info">
                <h2><spring:message code="list.selected.region"/>: ${region}</h2>
            </div>

            <!-- 결과 정보 -->
            <div class="result-info">
                <!-- 총 건수: 서버가 내려준 totalCount만 보여주도록 -->
                <div class="total-count" data-total-count="${totalCount}">
                  <spring:message code="list.total.count" arguments="${totalCount}"/>
                </div>

            </div>

         <!-- 병원 목록 (DB 데이터) -->
         <div class="hospital-list">
             <c:forEach var="h" items="${lists}">
                 <div class="hospital-item"
                      data-item-id="${h.id}"
                      data-hospital="${not empty h.nameLabel ? h.nameLabel : h.name}"
                      data-address="${not empty h.addressLabel ? h.addressLabel : h.address}"
                      data-phone="${h.phone}"
                      data-homepage="${h.homepage}"
                      data-region="${h.region}"
                      data-subregion="${h.subregion}">

                     <!-- ❤️ 하트 버튼만 클릭 시 찜 기능 실행 -->
                     <div class="hospital-heart">
                         <i class="far fa-heart"></i>
                     </div>

                     <!-- 병원 이름 등 정보 출력 (번역 우선, 없으면 원문) -->
                     <div class="hospital-name">
                         ${not empty h.nameLabel ? h.nameLabel : h.name}
                     </div>
                 </div>
             </c:forEach>

             <c:if test="${empty lists}">
                 <div class="detail-empty">
                     <i class="empty"></i>
                     <p>표시할 결과가 없습니다.</p>
                 </div>
             </c:if>
         </div>

       <c:if test="${totalPages > 1}">
         <div class="pagination">
           <c:choose>

             <%-- ① 카테고리(전국) 모드 --%>
             <c:when test="${mode == 'category'}">
               <c:url var="catBase" value="/list/category/${category}" />
               <c:if test="${pageNo > 1}">
                 <c:url var="uFirst" value="${catBase}">
                   <c:param name="pageNo" value="1"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link" href="${uFirst}">&laquo;</a>

                 <c:url var="uPrev" value="${catBase}">
                   <c:param name="pageNo" value="${pageNo - 1}"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link" href="${uPrev}">&lt;</a>
               </c:if>

               <c:forEach var="p" begin="${startPage}" end="${endPage}">
                 <c:url var="uP" value="${catBase}">
                   <c:param name="pageNo" value="${p}"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link ${p == pageNo ? 'active' : ''}" href="${uP}">${p}</a>
               </c:forEach>

               <c:if test="${pageNo < totalPages}">
                 <c:url var="uNext" value="${catBase}">
                   <c:param name="pageNo" value="${pageNo + 1}"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link" href="${uNext}">&gt;</a>

                 <c:url var="uLast" value="${catBase}">
                   <c:param name="pageNo" value="${totalPages}"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link" href="${uLast}">&raquo;</a>
               </c:if>
             </c:when>

             <%-- ② 지역+카테고리 검색 모드 --%>
             <c:otherwise>
               <c:url var="searchBase" value="/list" />
               <c:if test="${pageNo > 1}">
                 <c:url var="sFirst" value="${searchBase}">
                   <c:param name="region" value="${region}"/>
                   <c:param name="subRegion" value="${subRegion}"/>
                   <c:param name="category" value="${category}"/>
                   <c:param name="pageNo" value="1"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link" href="${sFirst}">&laquo;</a>

                 <c:url var="sPrev" value="${searchBase}">
                   <c:param name="region" value="${region}"/>
                   <c:param name="subRegion" value="${subRegion}"/>
                   <c:param name="category" value="${category}"/>
                   <c:param name="pageNo" value="${pageNo - 1}"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link" href="${sPrev}">&lt;</a>
               </c:if>

               <c:forEach var="p" begin="${startPage}" end="${endPage}">
                 <c:url var="sP" value="${searchBase}">
                   <c:param name="region" value="${region}"/>
                   <c:param name="subRegion" value="${subRegion}"/>
                   <c:param name="category" value="${category}"/>
                   <c:param name="pageNo" value="${p}"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link ${p == pageNo ? 'active' : ''}" href="${sP}">${p}</a>
               </c:forEach>

               <c:if test="${pageNo < totalPages}">
                 <c:url var="sNext" value="${searchBase}">
                   <c:param name="region" value="${region}"/>
                   <c:param name="subRegion" value="${subRegion}"/>
                   <c:param name="category" value="${category}"/>
                   <c:param name="pageNo" value="${pageNo + 1}"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link" href="${sNext}">&gt;</a>

                 <c:url var="sLast" value="${searchBase}">
                   <c:param name="region" value="${region}"/>
                   <c:param name="subRegion" value="${subRegion}"/>
                   <c:param name="category" value="${category}"/>
                   <c:param name="pageNo" value="${totalPages}"/>
                   <c:param name="amount" value="${amount}"/>
                 </c:url>
                 <a class="page-link" href="${sLast}">&raquo;</a>
               </c:if>
             </c:otherwise>

           </c:choose>
         </div>
       </c:if>




        </div><!-- /.left-panel -->

        <!-- 오른쪽: 상세 패널 -->
        <div class="right-panel">
            <div class="detail-container">
                <div class="detail-placeholder">
                    <i class="fas fa-hospital"></i>
                    <p><spring:message code="list.hospital.select.message"/></p>
                </div>
                <div class="detail-content" style="display: none;">
                    <!-- AJAX로 상세 정보가 표시됩니다 -->
                </div>
            </div>
        </div><!-- /.right-panel -->

</div><!-- /.main-container -->

<!-- 구글맵 API 스크립트 -->
<script async
        src="https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap">
</script>
<script>
// Google Maps API 로드 확인
window.addEventListener('load', function() {
  if (typeof google !== 'undefined' && google.maps) {
    console.log('Google Maps API 로드 완료');
    console.log('Places 라이브러리 사용 가능:', !!google.maps.places);
  } else {
    console.error('Google Maps API 로드 실패');
  }
});
</script>
<script src="/resources/js/map.js"></script>
<script src="/resources/js/list.js"></script>

<%@include file="/common/footer.jsp"%>
</body>
</html>
