# 🏥 HealnGo - K-Medical Tourism Platform

<div align="center">

**한국 의료 관광을 위한 통합 플랫폼**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[데모](#) | [문서](#documentation) | [API 가이드](#api-endpoints)

</div>

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [API 엔드포인트](#-api-엔드포인트)
- [데이터베이스 스키마](#-데이터베이스-스키마)
- [상세 가이드](#-상세-가이드)
- [라이선스](#-라이선스)

---

## 🌟 프로젝트 소개

**HealnGo**는 외국인 의료 관광객과 한국 의료 기관을 연결하는 종합 플랫폼입니다.

### 핵심 가치

- 🌏 **글로벌 접근성**: 다국어 지원 (한국어, 영어, 중국어, 일본어)
- 🏥 **신뢰성**: 검증된 의료 기관 정보 제공
- 💼 **편리성**: 예약부터 결제까지 원스톱 서비스
- 🔒 **보안성**: 멀티 시큐리티 설정 및 이메일 인증

### 대상 사용자

1. **일반 사용자 (SocialUsers)**: 의료 관광을 원하는 외국인
2. **업체 (CompanyUser)**: 의료 기관 및 서비스 제공자
3. **관리자 (Admin)**: 플랫폼 관리 및 운영

---

## ✨ 주요 기능

### 👤 일반 사용자 기능

#### 🔐 인증 & 계정
- 이메일 인증 기반 회원가입
- Google OAuth2 소셜 로그인
- 카카오 소셜 로그인
- 비밀번호 찾기/재설정

#### 🔍 의료 서비스 검색 & 예약
- 카테고리별 검색 (성형, 피부, 치과, 한의학, 마사지, 왁싱 등)
- 지역별 검색 (서울, 부산, 제주 등)
- 의료 기관 상세 정보 조회
- 실시간 예약 시스템
- Google Calendar 연동

#### 💬 커뮤니티 & 리뷰
- 후기 작성 및 조회
- 평점 시스템
- 커뮤니티 게시판
- 실시간 1:1 채팅 (WebSocket)

#### 🎁 투어 패키지
- K-Medical Tour 패키지 조회
- 패키지별 상세 정보
- 관광지 연계 서비스

#### ⭐ 기타
- 즐겨찾기 관리
- 마이페이지 (예약 내역, 리뷰 관리)
- 다국어 지원 (i18n)

---

### 🏢 업체 (CRM) 기능

#### 📊 대시보드
- 예약 현황 통계
- 매출 분석
- 클릭 로그 분석
- 실시간 알림

#### 🗓️ 예약 관리
- 예약 조회 및 상태 관리
- Google Calendar 자동 동기화
- 예약 확인/취소 처리

#### 🏥 서비스 관리
- 의료 서비스 등록/수정/삭제
- 카테고리별 분류
- 가격 및 재고 관리

#### 💬 고객 관리
- 1:1 채팅 (실시간 WebSocket)
- 문의 내역 관리
- 고객 리뷰 관리 및 답변

#### 📢 마케팅
- 이벤트 등록
- 프로모션 관리
- 마케팅 메시지 발송

#### 📈 리포트
- 예약 통계
- 매출 리포트
- 고객 분석

---

### 👨‍💼 관리자 기능

#### 👥 사용자 관리
- 일반 사용자 조회/수정/정지
- 페이징 및 검색 기능
- 상태별 필터링
- 일괄 정지 처리

#### 🏢 업체 관리
- 업체 승인/거부 시스템
- 업체 정보 수정
- 승인 상태 관리 (PENDING, APPROVED, REJECTED, INACTIVE)

#### 📢 공지사항 관리
- 공지사항 작성/수정/삭제
- 게시 예약 기능
- 대상 사용자 지정 (전체/일반/업체)
- 고정 공지사항 설정

#### 📊 통계 & 모니터링
- 전체 예약 현황
- 매출 통계
- 클릭 로그 분석
- 문의 내역 관리

---

## 🛠 기술 스택

### Backend
- **Framework**: Spring Boot 3.5.5
- **Language**: Java 17
- **Security**: Spring Security (Multi Security Config)
- **ORM**: Spring Data JPA + Hibernate
- **Template Engine**: Thymeleaf
- **Build Tool**: Maven
- **WebSocket**: Spring WebSocket (STOMP)

### Database
- **RDBMS**: MySQL 8.0
- **Connection Pool**: HikariCP

### External APIs
- **OAuth2**: Google OAuth2, Kakao OAuth2
- **Calendar**: Google Calendar API
- **Email**: Gmail SMTP
- **Maps**: Google Maps API

### Frontend
- **HTML5/CSS3/JavaScript**
- **Thymeleaf Templates**
- **Responsive Design**

### Libraries & Tools
- **Lombok**: 코드 간소화
- **BCrypt**: 비밀번호 암호화
- **Jackson**: JSON 처리
- **MyBatis**: 복잡한 쿼리 처리 (선택적)

---

## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ User Portal  │  │  CRM Portal  │  │ Admin Portal │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────┬───────────────┬────────────────┬───────────────┘
             │               │                │
             │               │                │
┌────────────▼───────────────▼────────────────▼───────────────┐
│              Spring Boot Application Server                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Multi Security Configuration                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐   │   │
│  │  │ User Chain  │  │  CRM Chain  │  │ Admin Auth │   │   │
│  │  └─────────────┘  └─────────────┘  └────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Controller Layer                         │   │
│  │  • UserController  • CompanyController • AdminCtrl   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Service Layer                           │   │
│  │  • AuthService  • ReservationService  • ReviewSvc    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Repository Layer (JPA)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────┬─────────────────────────────────────────────────┘
             │
┌────────────▼─────────────────────────────────────────────────┐
│                    MySQL Database                             │
│  • social_users  • company_user  • reservations              │
│  • medical_service  • user_review  • click_logs              │
│  • item_list  • notice  • chat_message  • etc.               │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                     External Services                          │
│  • Google OAuth2  • Kakao OAuth  • Google Calendar            │
│  • Gmail SMTP  • Google Maps API                              │
└───────────────────────────────────────────────────────────────┘
```

---

## 🚀 시작하기

### 사전 요구사항

- **Java 17** 이상
- **Maven 3.6** 이상
- **MySQL 8.0** 이상
- **Git**

### 설치 및 실행

#### 1. 레포지토리 클론
```bash
git clone https://github.com/your-org/HealnGo.git
cd HealnGo
```

#### 2. 환경 변수 설정

`.env` 파일 또는 시스템 환경 변수에 다음 값을 설정합니다:

```bash
# Google OAuth2
export GOOGLE_CLIENT_SECRET=your_google_client_secret

# Kakao API
export KAKAO_REST_API_KEY=your_kakao_api_key

# Google Maps
export GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### 3. 데이터베이스 설정

**현재 프로젝트는 AWS RDS MySQL을 사용합니다:**

```properties
# application.properties에 이미 설정되어 있음
spring.datasource.url=jdbc:mysql://greenhubdb.c9i2ysgs4qdu.ap-northeast-2.rds.amazonaws.com:3306/healngo
spring.datasource.username=healngo
spring.datasource.password=1234
```

**로컬 MySQL을 사용하려면:**

1. MySQL 데이터베이스 생성:
```sql
CREATE DATABASE healngo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. `application.properties` 수정:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healngo
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. 샘플 데이터 삽입 (선택):
```bash
mysql -u your_username -p healngo < sample_hospital_data.sql
mysql -u your_username -p healngo < sample_i18n_data.sql
```

#### 4. application.properties 확인

`src/main/resources/application.properties` 파일에서 데이터베이스 연결 정보를 확인합니다.

**기본 설정 (AWS RDS):**
```properties
spring.datasource.url=jdbc:mysql://greenhubdb.c9i2ysgs4qdu.ap-northeast-2.rds.amazonaws.com:3306/healngo
spring.datasource.username=healngo
spring.datasource.password=1234
```

#### 5. 빌드 및 실행

```bash
# 빌드 (테스트 생략)
mvn clean install -DskipTests

# 실행
mvn spring-boot:run
```

또는 JAR 파일로 실행:

```bash
java -jar target/ApiRound-0.0.1-SNAPSHOT.jar
```

#### 6. 브라우저에서 접속

```
일반 사용자:  http://localhost:8080/main
CRM 로그인:   http://localhost:8080/crm/crm_login
관리자:       http://localhost:8080/admin
```

---

## 📁 프로젝트 구조

```
HealnGo/
├── src/
│   ├── main/
│   │   ├── java/com/example/ApiRound/
│   │   │   ├── config/                    # 설정 파일
│   │   │   │   ├── SecurityConfig.java   # Multi Security 설정
│   │   │   │   ├── WebConfig.java        # Web 설정
│   │   │   │   ├── I18nConfig.java       # 다국어 설정
│   │   │   │   └── WebSocketConfig.java  # WebSocket 설정
│   │   │   │
│   │   │   ├── Controller/                # 컨트롤러
│   │   │   │   ├── ListController.java   # 목록/검색
│   │   │   │   ├── LoginController.java  # 인증
│   │   │   │   ├── GoogleOAuthController.java
│   │   │   │   └── KakaoOAuthController.java
│   │   │   │
│   │   │   ├── crm/                       # CRM 모듈
│   │   │   │   ├── hyeonah/              # 사용자 관리
│   │   │   │   │   ├── Controller/
│   │   │   │   │   ├── Service/
│   │   │   │   │   ├── Repository/
│   │   │   │   │   ├── entity/
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── notice/          # 공지사항
│   │   │   │   │   └── review/          # 리뷰 관리
│   │   │   │   │
│   │   │   │   ├── minggzz/             # 관리자 기능
│   │   │   │   │   ├── AdminController.java
│   │   │   │   │   └── CompanyApprovalService.java
│   │   │   │   │
│   │   │   │   └── yoyo/                # 예약 관리
│   │   │   │       ├── reservation/
│   │   │   │       └── medi/
│   │   │   │
│   │   │   ├── Service/                  # 서비스 계층
│   │   │   ├── repository/               # 레포지토리
│   │   │   ├── entity/                   # 엔티티
│   │   │   └── dto/                      # DTO
│   │   │
│   │   └── resources/
│   │       ├── application.properties    # 애플리케이션 설정
│   │       ├── messages*.properties      # 다국어 메시지
│   │       │
│   │       ├── static/                   # 정적 리소스
│   │       │   ├── resources/            # 사용자 페이지
│   │       │   │   ├── css/
│   │       │   │   ├── js/
│   │       │   │   └── images/
│   │       │   │
│   │       │   ├── crm/                  # CRM 페이지
│   │       │   │   ├── css/
│   │       │   │   ├── js/
│   │       │   │   └── images/
│   │       │   │
│   │       │   └── admin/                # 관리자 페이지
│   │       │
│   │       └── templates/                # Thymeleaf 템플릿
│   │           ├── main.html
│   │           ├── list.html
│   │           ├── detail.html
│   │           ├── login.html
│   │           ├── crm/                  # CRM 템플릿
│   │           ├── admin/                # 관리자 템플릿
│   │           └── common/               # 공통 컴포넌트
│   │
│   └── test/                             # 테스트 코드
│
├── pom.xml                               # Maven 설정
├── README.md                             # 프로젝트 설명
├── QUICK_START.md                        # 빠른 시작 가이드
├── AUTH_SYSTEM_GUIDE.md                  # 인증 시스템 가이드
├── ADMIN_USERS_GUIDE.md                  # 관리자 가이드
├── APPROVAL_STATUS_GUIDE.md              # 승인 상태 가이드
└── *.sql                                 # 데이터베이스 스크립트
```

---

## 🔌 API 엔드포인트

### 일반 사용자 API

#### 인증
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/user/send-code` | 이메일 인증 코드 전송 |
| `POST` | `/auth/user/verify-code` | 인증 코드 확인 |
| `POST` | `/auth/user/register` | 회원가입 |
| `POST` | `/auth/user/login` | 로그인 |
| `POST` | `/auth/user/logout` | 로그아웃 |
| `GET` | `/oauth/google/login` | Google 소셜 로그인 |
| `GET` | `/oauth/kakao/login` | Kakao 소셜 로그인 |

#### 서비스 검색
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/list` | 의료 서비스 목록 |
| `GET` | `/detail/{itemId}` | 의료 기관 상세 |
| `GET` | `/service/detail/{serviceId}` | 서비스 상세 |
| `GET` | `/api/services/category/{category}` | 카테고리별 조회 |
| `GET` | `/api/services/search` | 검색 |

#### 예약
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/reservations` | 예약 생성 |
| `GET` | `/api/reservations/user/{userId}` | 내 예약 목록 |
| `PUT` | `/api/reservations/{id}` | 예약 수정 |
| `DELETE` | `/api/reservations/{id}` | 예약 취소 |

#### 리뷰
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/review` | 리뷰 작성 |
| `GET` | `/api/review/service/{serviceId}` | 서비스 리뷰 조회 |
| `GET` | `/api/review/service/{serviceId}/average-rating` | 평균 평점 |
| `GET` | `/api/review/service/{serviceId}/count` | 리뷰 개수 |

#### 즐겨찾기
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/favorites` | 즐겨찾기 추가 |
| `DELETE` | `/api/favorites/{id}` | 즐겨찾기 삭제 |
| `GET` | `/api/favorites/user/{userId}` | 내 즐겨찾기 |

---

### 업체 (CRM) API

#### 인증
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/crm/send-code` | 이메일 인증 코드 전송 |
| `POST` | `/crm/verify-code` | 인증 코드 확인 |
| `POST` | `/crm/register` | 업체 회원가입 |
| `POST` | `/crm/login` | 업체 로그인 |
| `POST` | `/crm/logout` | 로그아웃 |

#### 예약 관리
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/crm/reservations` | 예약 목록 조회 |
| `PUT` | `/api/crm/reservations/{id}/status` | 예약 상태 변경 |
| `GET` | `/api/crm/reservations/statistics` | 예약 통계 |

#### 서비스 관리
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/crm/medical-services` | 서비스 등록 |
| `PUT` | `/api/crm/medical-services/{id}` | 서비스 수정 |
| `DELETE` | `/api/crm/medical-services/{id}` | 서비스 삭제 |
| `GET` | `/api/crm/medical-services` | 서비스 목록 |

#### 리뷰 관리
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/review/company/{companyId}` | 업체 리뷰 조회 |
| `POST` | `/api/review/{reviewId}/reply` | 리뷰 답변 |

#### 채팅
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/chat/threads/company/{companyId}` | 채팅방 목록 |
| `GET` | `/api/chat/messages/{threadId}` | 채팅 메시지 조회 |
| `WS` | `/ws/chat` | WebSocket 채팅 |

---

### 관리자 API

#### 사용자 관리
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/api/users` | 사용자 목록 (페이징) |
| `GET` | `/admin/api/users/{userId}` | 사용자 상세 |
| `PUT` | `/admin/api/users/{userId}` | 사용자 수정 |
| `POST` | `/admin/api/users/{userId}/toggle-status` | 상태 토글 |
| `POST` | `/admin/api/users/bulk-suspend` | 일괄 정지 |

#### 업체 관리
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/api/companies` | 업체 목록 |
| `GET` | `/admin/api/companies/{companyId}` | 업체 상세 |
| `PUT` | `/admin/api/companies/{companyId}/approval-status` | 승인 상태 변경 |
| `POST` | `/admin/api/companies/bulk-approve` | 일괄 승인 |

#### 공지사항
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/api/notices` | 공지사항 작성 |
| `PUT` | `/admin/api/notices/{id}` | 공지사항 수정 |
| `DELETE` | `/admin/api/notices/{id}` | 공지사항 삭제 |
| `GET` | `/admin/api/notices` | 공지사항 목록 |

---

## 🗄 데이터베이스 스키마

### 주요 테이블

#### social_users (일반 사용자)
```sql
CREATE TABLE social_users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(100),
    phone VARCHAR(30),
    avatar_blob LONGBLOB,
    avatar_mime VARCHAR(50),
    last_login_at DATETIME,
    is_deleted TINYINT(1) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### company_user (업체)
```sql
CREATE TABLE company_user (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    company_name VARCHAR(150),
    biz_no VARCHAR(40),
    phone VARCHAR(30),
    address VARCHAR(255),
    approval_status VARCHAR(20) DEFAULT 'PENDING',
    approved_by BIGINT,
    approved_at DATETIME,
    rejection_reason VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### item_list (의료 기관)
```sql
CREATE TABLE item_list (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500),
    phone VARCHAR(50),
    category VARCHAR(50),
    image_url VARCHAR(500),
    logo_url VARCHAR(500),
    rating DECIMAL(3,2),
    review_count INT DEFAULT 0,
    company_id INT,
    created_at DATETIME,
    updated_at DATETIME
);
```

#### medical_service (의료 서비스)
```sql
CREATE TABLE medical_service (
    service_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    service_category VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'KRW',
    target_country VARCHAR(50),
    gender_target VARCHAR(20),
    tags VARCHAR(500),
    is_refundable BOOLEAN DEFAULT TRUE,
    vat_included BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (item_id) REFERENCES item_list(id)
);
```

#### reservations (예약)
```sql
CREATE TABLE reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    service_id BIGINT,
    item_id BIGINT,
    title VARCHAR(200),
    date DATE,
    start_time TIME,
    end_time TIME,
    description TEXT,
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'PENDING',
    total_amount DECIMAL(10,2),
    google_event_id VARCHAR(100),
    google_sync_enabled TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### user_review (리뷰)
```sql
CREATE TABLE user_review (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id BIGINT,
    service_id BIGINT,
    booking_id BIGINT,
    rating TINYINT NOT NULL,
    title VARCHAR(200),
    content TEXT,
    image_blob LONGBLOB,
    image_mime VARCHAR(50),
    is_public TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### click_logs (클릭 로그)
```sql
CREATE TABLE click_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    item_id BIGINT,
    user_id INT,
    clicked_at DATETIME NOT NULL
);
```

#### notice (공지사항)
```sql
CREATE TABLE notice (
    notice_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    audience VARCHAR(20) DEFAULT 'ALL',
    is_pinned TINYINT(1) DEFAULT 0,
    publish_at DATETIME,
    created_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 📚 상세 가이드

프로젝트의 주요 기능에 대한 상세 가이드는 다음 문서를 참조하세요:

- **[빠른 시작 가이드](QUICK_START.md)**: 프로젝트 설치 및 실행
- **[인증 시스템 가이드](AUTH_SYSTEM_GUIDE.md)**: 멀티 시큐리티, OAuth2, 이메일 인증
- **[관리자 가이드](ADMIN_USERS_GUIDE.md)**: 사용자 관리, 업체 관리
- **[승인 상태 가이드](APPROVAL_STATUS_GUIDE.md)**: 업체 승인 프로세스
- **[회원가입 이메일 인증](SIGNUP_EMAIL_VERIFICATION.md)**: 이메일 인증 플로우
- **[CRM 비밀번호 찾기](CRM_FORGOT_PASSWORD_GUIDE.md)**: 비밀번호 재설정
- **[OAuth 설정 가이드](OAUTH_SETUP_GUIDE.md)**: Google, Kakao OAuth 설정

---

## 🔧 주요 설정

### application.properties

```properties
# 서버 설정
server.port=8080
spring.application.name=ApiRound

# 데이터베이스 (AWS RDS MySQL)
spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&characterEncoding=utf8&serverTimezone=Asia/Seoul
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Thymeleaf
spring.thymeleaf.cache=false

# 이메일 (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# Google OAuth2
google.client-id=your-client-id
google.client-secret=${GOOGLE_CLIENT_SECRET}
google.redirect-uri=http://localhost:8080/oauth/google/callback

# Kakao OAuth
kakao.client-id=your-kakao-client-id
kakao.redirect-uri=http://localhost:8080/oauth/kakao/callback

# 관리자 초대 코드
admin.invite.code=HEALNGO2024ADMIN
```

---

## 🌍 다국어 지원

HealnGo는 다음 언어를 지원합니다:

- 🇰🇷 **한국어** (기본)
- 🇺🇸 **영어** (English)
- 🇨🇳 **중국어** (简体中文)
- 🇯🇵 **일본어** (日本語)

언어 전환은 페이지 상단의 언어 선택 버튼을 통해 가능합니다.

---

## 🔒 보안 기능

### 인증 & 인가
- ✅ Multi Security Configuration (사용자/업체/관리자 분리)
- ✅ BCrypt 비밀번호 암호화
- ✅ Session 기반 인증
- ✅ Google OAuth2 소셜 로그인
- ✅ Kakao OAuth 소셜 로그인
- ✅ 이메일 인증 (6자리 코드, 5분 유효)

### 데이터 보호
- ✅ SQL Injection 방지 (JPA Prepared Statements)
- ✅ XSS 방지 (Thymeleaf Escaping)
- ⚠️ CSRF 보호 (개발 중 비활성화, 운영 시 활성화 필요)

### 접근 제어
- ✅ 역할 기반 접근 제어 (RBAC)
- ✅ URL 경로별 권한 설정
- ✅ 업체 승인 시스템 (PENDING → APPROVED)

---

## 📊 주요 통계 기능

### 클릭 로그 분석
- 최근 7일/30일간 인기 의료 기관 TOP3
- Item 기반 클릭 수 집계
- 실시간 클릭 로그 저장

### 예약 통계
- 업체별 예약 현황
- 기간별 예약 통계
- 매출 분석

### 리뷰 통계
- 평균 평점 계산
- 리뷰 개수 집계
- 서비스별 리뷰 분석

---

## 🧪 테스트

### 단위 테스트
```bash
mvn test
```

### 통합 테스트
```bash
mvn verify
```

### 테스트 커버리지
```bash
mvn jacoco:report
```

---

## 📦 배포

### JAR 파일 생성
```bash
mvn clean package -DskipTests
```

### Docker 이미지 빌드 (선택)
```bash
docker build -t healngo:latest .
docker run -p 8080:8080 healngo:latest
```

### AWS/Cloud 배포
- **환경 변수** 설정 필수
- **HTTPS** 활성화 권장
- **데이터베이스** RDS 또는 외부 MySQL 사용
- **정적 리소스** CDN 사용 권장

---

## 🤝 기여하기

기여를 환영합니다! 다음 절차를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 📞 문의

- **이메일**: hannah6394@gmail.com
- **GitHub**: [HealnGo Repository](https://github.com/your-org/HealnGo)

---

## 🙏 감사의 말

HealnGo 프로젝트를 방문해 주셔서 감사합니다!

---

<div align="center">

**Made with ❤️ by HealnGo Team**

⭐️ 이 프로젝트가 유용하다면 Star를 눌러주세요!

</div>
