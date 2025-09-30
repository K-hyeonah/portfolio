<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<link rel="stylesheet" href="/resources/css/styles.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

<footer id="main-footer" style="padding-bottom: 0; margin-bottom: 0;">
    <div class="footer-container">
        <div class="footer-top">
            <div class="footer-logo">
                <img src="/resources/images/HealnGo_logo.png" alt="HealnGo 로고">
                <p><spring:message code="footer.description"/></p>
            </div>
            <div class="footer-links">
                <div class="link-column">
                    <h4><spring:message code="footer.company.title"/></h4>
                    <ul>
                        <li><a href="/about"><spring:message code="footer.company.info"/></a></li>
                        <li><a href="/about/team"><spring:message code="footer.company.team"/></a></li>
                        <li><a href="/contact"><spring:message code="footer.company.contact"/></a></li>
                    </ul>
                </div>
                <div class="link-column">
                    <h4><spring:message code="footer.service.title"/></h4>
                    <ul>
                        <li><a href="/tourism"><spring:message code="footer.service.tourism"/></a></li>
                        <li><a href="/medical"><spring:message code="footer.service.medical"/></a></li>
                        <li><a href="/packages"><spring:message code="footer.service.packages"/></a></li>
                    </ul>
                </div>
                <div class="link-column">
                    <h4><spring:message code="footer.support.title"/></h4>
                    <ul>
                        <li><a href="/faq"><spring:message code="footer.support.faq"/></a></li>
                        <li><a href="/terms"><spring:message code="footer.support.terms"/></a></li>
                        <li><a href="/privacy"><spring:message code="footer.support.privacy"/></a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p><spring:message code="footer.copyright"/></p>
            <div class="social-icons">
                <a href="#"><i class="fab fa-facebook-f"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
            </div>
        </div>
    </div>
</footer>
