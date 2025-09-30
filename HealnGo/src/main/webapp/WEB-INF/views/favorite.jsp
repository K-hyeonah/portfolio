<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <title><spring:message code="favorite.title"/></title>
    <link rel="stylesheet" href="/resources/css/favorite.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<%@include file = "/common/header.jsp"%>

<div class="favorite-container">
    <!-- 상단 제목 섹션 -->
    <div class="favorite-header">
        <div class="favorite-icon">
            <i class="fas fa-heart"></i>
        </div>
        <h1 class="favorite-title"><spring:message code="favorite.header.title"/></h1>
    </div>

    <!-- 즐겨찾기 목록 -->
    <div class="favorite-list">
        <c:choose>
            <c:when test="${empty favorites}">
                <div class="empty-favorites">
                    <div class="empty-icon">
                        <i class="fas fa-heart"></i>
                        <i class="fas fa-plus empty-plus"></i>
                    </div>
                    <div class="empty-content">
                        <h3><spring:message code="favorite.empty.title"/></h3>
                        <p class="empty-description"><spring:message code="favorite.empty.description"/></p>
                    </div>
                    <div class="empty-actions">
                        <a href="/main" class="btn-primary"><spring:message code="favorite.empty.button"/></a>
                    </div>
                </div>
            </c:when>
            <c:otherwise>
                <c:forEach var="favorite" items="${favorites}" varStatus="status">
                    <div class="favorite-item" data-id="${favorite.id}" data-hospital="${favorite.name}">
                        <div class="item-banner">
                            <span class="day-number">${status.count}</span>
                        </div>
                        <div class="item-content">
                            <div class="item-info">
                                <h3 class="hospital-name">${favorite.name}</h3>
                                <div class="hospital-details">
                                    <p class="hospital-address">
                                        <i class="fas fa-map-marker-alt"></i>
                                            ${not empty favorite.address ? favorite.address : '<spring:message code="favorite.item.address.info"/>'}
                                    </p>
                                    <p class="hospital-phone">
                                        <i class="fas fa-phone"></i>
                                            ${not empty favorite.phone ? favorite.phone : '<spring:message code="favorite.item.phone.info"/>'}
                                    </p>
                                    <p class="hospital-hours">
                                        <i class="fas fa-clock"></i>
                                        <spring:message code="favorite.item.hours.info"/>
                                    </p>
                                </div>
                                <div class="hospital-tags">
                                    <span class="tag">${favorite.region}</span>
                                    <span class="tag">${favorite.subregion}</span>
                                    <c:if test="${not empty favorite.category}">
                                        <span class="tag">${favorite.category}</span>
                                    </c:if>
                                </div>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="btn-detail" onclick="showDetail(${favorite.id})"><spring:message code="favorite.item.detail.button"/></button>
                            <button class="btn-remove" title="<spring:message code='favorite.item.remove.button'/>">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </c:forEach>
            </c:otherwise>
        </c:choose>
    </div>
</div>

<!-- 상세보기 모달 -->
<div id="detailModal" class="modal">
    <div class="modal-content">
        <span class="close" title="<spring:message code='favorite.modal.close'/>">&times;</span>
        <div id="modalBody">
            <!-- 상세 내용이 여기에 동적으로 로드됩니다 -->
        </div>
    </div>
</div>

<script src="/resources/js/favorite.js"></script>
<%@include file = "/common/footer.jsp"%>
</body>
</html>
