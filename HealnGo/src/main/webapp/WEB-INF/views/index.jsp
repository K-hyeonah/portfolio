
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title><spring:message code="global.title"/></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
  <header style="display:flex; gap:12px; align-items:center; padding:12px; border-bottom:1px solid #eee;">
    <nav style="display:flex; gap:10px;">
      <a href="/"><spring:message code="menu.home"/></a>
      <a href="/about"><spring:message code="menu.about"/></a>
    </nav>
    <div style="margin-left:auto">
      <%@ include file="/WEB-INF/views/common/lang-switcher.jspf" %>
    </div>
  </header>

  <main style="padding:24px;">
    <h1><spring:message code="index.heading"/></h1>
    <p><spring:message code="index.lead"/></p>
    <p><a href="/about"><spring:message code="index.about_link"/></a></p>
  </main>
</body>
</html>
