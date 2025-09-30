<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<link rel="stylesheet" href="/resources/css/styles.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/css/flag-icons.min.css">
<header id="main-header">
    <div class="header-container">
        <a href="/main" class="logo">
                            <img src="/resources/images/HealnGo_logo.png" alt="HealnGo 로고" class="logo-image">
        </a>
        <div class="user-actions">
                  <div class="button-icon" id="zzim">
                  <a href="/favorite"><i class="fa-solid fa-heart"></i></a>
                  </div>
            <div class="dropdown">
                <button class="lang_btn"><spring:message code="button.translate"/></button>
                <div class="dropdown-content">
                    <a href="javascript:void(0);" class="lang-item" data-lang="ko"><span class="fi fi-kr"></span> 한국어/Korea</a>
                    <a href="javascript:void(0);" class="lang-item" data-lang="en"><span class="fi fi-us"></span> English</a>
                    <a href="javascript:void(0);" class="lang-item" data-lang="ja"><span class="fi fi-jp"></span> Japanese</a>
                    <a href="javascript:void(0);" class="lang-item" data-lang="zh"><span class="fi fi-cn"></span> Chinese</a>
                </div>
            </div>

            <%
                //로그인 상태가 캐시로 인해 안 바뀌는 현상을 방지
                response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                response.setHeader("Pragma", "no-cache");
                response.setDateHeader("Expires", 0);
            %>

        <%
            com.example.ApiRound.dto.SocialUserDTO loginUser = (com.example.ApiRound.dto.SocialUserDTO) session.getAttribute("loginUser");
        %>

       <% if (loginUser == null) { %>
           <!-- 로그인 상태 아님 -->
           <a href="/login" class="login-btn"><spring:message code="header.login"/></a>
       <% } else { %>
           <!-- 로그인 상태 -->
           <a href="/logout" class="login-btn"><spring:message code="header.logout"/></a>
       <% } %>



          </div>
     </div>
</header>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const logo = document.querySelector('.logo');
        logo.addEventListener('click', function() {
            window.location.href = '/';
        });

        // 드롭다운 메뉴 토글 기능
        const dropdownToggle = document.querySelector('.lang_btn');
        const dropdownContent = document.querySelector('.dropdown-content');

        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownContent.classList.toggle('show');
        });

        // 언어 선택 시 해당 언어로 변경
        const langItems = document.querySelectorAll('.lang-item');
        langItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const langCode = this.getAttribute('data-lang');
                window.location.href = '/lang?code=' + langCode;
            });
        });

        // 외부 클릭시 드롭다운 닫기 (언어 항목 클릭은 제외)
        document.addEventListener('click', function(e) {
            if (!e.target.matches('.lang_btn') &&
                !e.target.closest('.dropdown-content')) {
                dropdownContent.classList.remove('show');
            }
        });

        // 마우스 오버 효과
        logo.addEventListener('mouseover', function() {
            this.classList.add('logo-hover');
        });

        logo.addEventListener('mouseout', function() {
            this.classList.remove('logo-hover');
        });
    });
</script>


