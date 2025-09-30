<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<%
    String kakaoClientId = "c7ceeb58d858498a39068ce0c31eade5";
    String kakaoRedirectUri = "http://localhost:8080/oauth/kakao/callback";
    String kakaoLoginUrl = "https://kauth.kakao.com/oauth/authorize"
            + "?client_id=" + kakaoClientId
            + "&redirect_uri=" + kakaoRedirectUri
            + "&response_type=code"
            + "&prompt=login";

    String googleClientId = "188733059918-dr0fa08okh76n7omc55h8get2rbsehb2.apps.googleusercontent.com";
    String googleRedirectUri = "http://localhost:8080/oauth/google/callback";
    String googleLoginUrl = "https://accounts.google.com/o/oauth2/v2/auth?"
            + "client_id=" + googleClientId
            + "&redirect_uri=" + googleRedirectUri
            + "&response_type=code"
            + "&scope=openid%20email%20profile";
%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><spring:message code="login.title"/></title>
    <link rel="stylesheet" href="/resources/css/styles.css">
    <style>
        body {
            font-family: 'Nanum Gothic', 'Arial', sans-serif;
            background-color: #f9f9f9;
            margin: 0; padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .login-page-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            padding: 40px 0;
        }
        .login-container {
            background: white;
            padding: 60px 50px;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            width: 450px;
            text-align: center;
        }
        .login-container h1 {
            font-size: 32px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .login-container p {
            color: #555;
            margin-bottom: 40px;
            font-size: 16px;
        }
        .login-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 18px 0;
            margin-bottom: 25px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 30px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s;
        }
        /* Kakao */
        .kakao-btn {
            background-color: #FEE500;
            color: #000000;
            border: none;
        }
        .kakao-btn:hover {
            background-color: #ffde00;
        }
        .kakao-icon {
            width: 24px;
            height: 24px;
            margin-right: 12px;
        }
        /* Google */
        .google-btn {
            background-color: white;
            color: #444;
            border: 1px solid #ddd;
        }
        .google-btn:hover {
            background-color: #f7f7f7;
        }
        .google-icon {
            width: 22px;
            height: 22px;
            margin-right: 12px;
        }
        /* 헤더 스타일 오버라이드 */
        #main-header .user-actions {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
        }
        #main-header .dropdown {
            display: inline-block !important;
        }
        #main-header .lang_btn {
            display: inline-block !important;
            white-space: nowrap !important;
            width: auto !important;
            flex-direction: row !important;
        }
        #main-header .header-container {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
        }
        /* 헤더 전체 폰트 크기 통일 */
        #main-header * {
            font-size: 14px !important;
        }
        #main-header .login-btn {
            font-size: 14px !important;
            padding: 8px 16px !important;
            width: auto !important;
            margin-bottom: 0 !important;
        }
        #main-header .dropdown-content a {
            font-size: 14px !important;
            padding: 10px 15px !important;
        }
    </style>
</head>
<body>
    <%@ include file="/common/header.jsp" %>

    <div class="login-page-wrapper">
        <div class="login-container">
            <h1><spring:message code="login.brand"/></h1>
            <p><spring:message code="login.subtitle"/></p>

            <!-- 카카오 로그인 -->
            <a href="<%= kakaoLoginUrl %>" class="login-btn kakao-btn">
                <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="Kakao" class="kakao-icon" />
                <spring:message code="login.kakao.button"/>
            </a>

            <!-- 구글 로그인 -->
            <a href="<%= googleLoginUrl %>" class="login-btn google-btn">
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="google-icon" />
                <spring:message code="login.google.button"/>
            </a>
        </div>
    </div>

    <%@ include file="/common/footer.jsp" %>
</body>
</html>
