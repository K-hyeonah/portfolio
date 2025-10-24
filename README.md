김현아 | Full-Stack Engineer

한 줄 소개
사용자 문제를 데이터로 정의 → 가설 → 구현까지 빠르게 연결하고, Spring/MySQL 기반으로 전환과 흐름 안정 중심으로 검증하는 풀스택 개발자입니다.

연락
이메일: hannah5_1@naver.com
휴대폰: 010-2822-1360
위치: 경기도 화성

링크
GitHub: https://github.com/K-hyeonah

SAGE 데모: https://youtu.be/BcjNaAuBFFU

HealnGo 데모: https://youtu.be/08ERL22AFzg
HealnGo-CRM 데모: https://youtu.be/GRslbEK3NO8
LIVE: http://healngo.store/

GreenHub 데모: https://youtu.be/LCl6jJbButI
LIVE: http://apiround.store
Figma: https://www.figma.com/design/TN6zDkncyCVDMdr0KwzlgL/Kimhyeonah-Portfolio?node-id=0-1

Skills
Backend: Java, Spring Boot, Spring MVC, Spring Security, JPA/MyBatis, Bean Validation, REST

Frontend: HTML/CSS/JavaScript, jQuery, Bootstrap (React/Next.js 도입 준비)

DB: MySQL 8 (모델링·정규화·인덱싱, 키셋 페이지네이션, 조회 전용 뷰)

Cloud & Ops: AWS(EC2/S3/RDS), Apache Tomcat, 환경 분리/배포, GitHub Actions, 기본 로그·모니터링, 롤백

Collab & Design: Git/GitHub, Figma/FigJam, Postman, Maven

AI 도구: ChatGPT, Cursor (코드 리뷰·리팩터·테스트 아이디어 보조)

Projects

1) GreenHub — 농수산물 직거래 (Full-stack) · Live http://apiround.store
문제: 레시피↔상품 연결·가격/재고 마찰로 구매 전환 저하
역할: 도메인 모델링, 상품/주문 핵심 API, 검색/운영 환경 구성
핵심 구현
- 회원·상품·주문 API, 관리자 상품/재고 관리
- 카테고리/태그 검색, 특산품 카탈로그/레시피 페이지 모델링
- AWS EC2/S3 배포, RDS(MySQL) 운영, CSV 적재·정제 파이프라인
Stack: HTML/CSS/JS, jQuery, Spring Boot, MySQL, AWS(EC2/S3/RDS), Apache Tomcat, Kakao Address API, Figma, GitHub
Demo: https://youtu.be/LCl6jJbButI
Repo: https://github.com/K-hyeonah/portfolio.git

2) SAGE — 요양병원/요양시설 비교·상담 (Frontend) · Demo https://youtu.be/BcjNaAuBFFU
문제: 정보 파편화로 비교에서 문의까지 전환이 낮음
역할: 비교 기준 표준화, 온보딩·검색/필터 UI 설계·구현
핵심 구현
- 비교 테이블 + 대화형 온보딩(Figma 프로토타입)
- 지역/등급/비용 비동기 검색·필터(fetch)
- 커뮤니티(게시/댓글)로 경험 공유
Stack: HTML/CSS, JavaScript(Fetch API), Spring Boot, JPA/MySQL, Figma, GitHub
Repo: https://github.com/mingg01zz/Team-SAGE.git

3) HealnGo — 뷰티·의료 관광 매칭 (Full-stack) · Live http://healngo.store
문제: 언어·가격·신뢰 장벽으로 초기 문의 이탈
역할: 문의→견적→예약 흐름 표준화, 공통 UI 컴포넌트 정리, CRM 연동
핵심 구현
- 리스트/커뮤니티/찜 DB 연동, 지도(Google Maps API), YouTube 임베드
- ERD(사용자·판매자·관리자·공지·채팅·리뷰), 조인/페이징 쿼리 최적화
배포/운영
- GitHub Actions → EC2/RDS 자동 배포, 환경 분리, 헬스체크·롤백 스크립트
Stack: HTML/CSS/JS, Spring Boot, Spring Security, MySQL, Bootstrap, Apache Tomcat, Google Maps API, Kakao Address API, Gmail API, AWS, Figma, GitHub
Demo: https://youtu.be/08ERL22AFzg
Repo: https://github.com/APIROUND/project.git

4) HealnGo CRM — 운영/내부 관리 콘솔 (Completed)
목적: 실사용자(업체/사용자/관리자) 역할별 가시성·권한 제어와 운영 업무(승인/목록/문의·신고 처리)를 한 곳에서 수행
역할: 기획·백엔드·프런트 전반(권한·워크플로우·데이터 모델 중심)
핵심 기능
- 권한/보안: RBAC(업체·사용자·관리자), Spring Security, 세션 기반 인증, 역할 배지/메뉴 가드
- 워크플로우: 업체 승인/보류/거절, 공지사항 작성·노출 관리, 문의·신고 접수→상태 전이(열람/처리/종결)
- 리뷰/모더레이션: 리뷰 목록/상세, 필터·검색, 신고 연계, 비공개/공개 전환
- 데이터/지표: 클릭 로그 수집(마케팅 분석 기초), 간단 지표 보드(최근 등록/문의/승인 현황)
- 프로필/계정: 업체/사용자 프로필 관리, 아바타·기본 정보 수정, 비활성/정지
- 알림/통지: Gmail SMTP 연동(승인/거절·문의 처리 결과 알림), 템플릿 기반 메일 발송
데이터 모델/쿼리
- ERD: 사용자·업체·권한·공지·신고·문의·리뷰·로그 스키마 정규화, FK/인덱스 정책
- 쿼리: 페이징·정렬 일관성, 조회 전용 뷰 분리, N+1 제거·조인 최적화
운영/배포
- GitHub Actions 기반 CI/CD(빌드→테스트→EC2 배포), 프로필 분리(dev/prod), 헬스체크·롤백 스크립트
- 보안: 환경변수/시크릿 관리(.properties 미커밋), API 키 도메인 제한
Stack: Java, Spring Boot, Spring Security, MySQL, MyBatis/JPA, Thymeleaf/JSP(운영 화면), Gmail SMTP, AWS(EC2/RDS/S3), GitHub Actions, Figma

Contact
프로젝트/협업/채용 관련 문의는 hannah5_1@naver.com 으로 부탁드립니다.
