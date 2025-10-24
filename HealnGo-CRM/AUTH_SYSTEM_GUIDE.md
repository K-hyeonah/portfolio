# HealnGo 인증 시스템 가이드

## 📋 개요

HealnGo 프로젝트에 **이메일 인증** 기반의 **멀티 시큐리티 설정**이 구현되었습니다.
- **일반 사용자(SocialUsers)**: `/auth/user/**` 경로
- **업체 사용자(CompanyUser)**: `/crm/**` 경로

## 🗂️ 프로젝트 구조

```
src/main/java/com/example/ApiRound/
├── auth/
│   ├── entity/
│   │   ├── SocialUsers.java          # 일반 사용자 엔티티
│   │   └── CompanyUser.java          # 업체 사용자 엔티티
│   ├── repository/
│   │   ├── SocialUsersRepository.java
│   │   └── CompanyUserRepository.java
│   ├── service/
│   │   ├── EmailVerificationService.java         # 이메일 인증 서비스
│   │   ├── EmailVerificationServiceImpl.java
│   │   ├── SocialUsersService.java
│   │   ├── SocialUsersServiceImpl.java
│   │   ├── CompanyUserService.java
│   │   └── CompanyUserServiceImpl.java
│   ├── controller/
│   │   ├── SocialUsersAuthController.java    # 사용자 인증 컨트롤러
│   │   ├── CompanyAuthController.java        # 업체 인증 컨트롤러
│   │   └── GoogleOAuthController.java        # Google OAuth2
│   └── dto/
│       ├── SocialUsersDto.java
│       ├── CompanyUserDto.java
│       └── EmailVerificationDto.java
└── config/
    └── SecurityConfig.java                    # 멀티 시큐리티 설정
```

## 🔐 인증 시스템

### 1. 멀티 시큐리티 설정 (SecurityConfig.java)

두 개의 독립적인 SecurityFilterChain 사용:

#### CRM (업체) 보안 설정 - Order(1)
- **경로**: `/crm/**`
- **로그인**: `/crm/crm_login`
- **성공 시**: `/crm/company`
- **공개 경로**:
  - `/crm/crm_login`
  - `/crm/company_signup`
  - `/crm/send-code`
  - `/crm/verify-code`
  - `/crm/register`

#### 사용자 보안 설정 - Order(2)
- **경로**: `/**` (나머지 모든 경로)
- **로그인**: `/auth/user/login`
- **성공 시**: `/main`
- **공개 경로**:
  - `/`, `/main`
  - `/auth/user/login`, `/auth/user/signup`
  - `/login`, `/user-signup`
  - `/list`, `/detail/**`
  - `/oauth/**`, `/api/**`

### 2. 이메일 인증 시스템

#### EmailVerificationService
- **코드 생성**: 6자리 영숫자 (A-Z, 0-9)
- **유효 시간**: 5분
- **저장 방식**: ConcurrentHashMap (운영 환경에서는 Redis 권장)

#### 인증 플로우
1. 사용자가 이메일 입력
2. `POST /auth/user/send-code` 또는 `POST /crm/send-code` 호출
3. 6자리 코드가 이메일로 전송됨
4. 사용자가 코드 입력
5. `POST /auth/user/verify-code` 또는 `POST /crm/verify-code` 호출
6. 인증 성공 시 회원가입 진행

### 3. Google OAuth2 인증

#### 설정 (application.properties)
```properties
google.client-id=268930941505-94e6k5ft8770u8dfooaoqqca5en01m3i.apps.googleusercontent.com
google.client-secret=${GOOGLE_CLIENT_SECRET:}
google.redirect-uri=http://localhost:8080/oauth/google/callback
```

#### OAuth2 플로우
1. `/oauth/google/login` 접속
2. Google 로그인 페이지로 리다이렉트
3. 사용자 로그인 후 `/oauth/google/callback`으로 리다이렉트
4. Access Token 획득
5. 사용자 정보 조회
6. DB에 사용자 저장 또는 업데이트
7. 세션에 사용자 정보 저장
8. `/main`으로 리다이렉트

## 📊 데이터베이스 스키마

### social_users 테이블
```sql
CREATE TABLE social_users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(100),
    phone VARCHAR(30),
    avatar_blob LONGBLOB,
    avatar_mime VARCHAR(50),
    avatar_updated_at DATETIME,
    last_login_at DATETIME,
    is_deleted TINYINT(1) DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME
);
```

### company_user 테이블
```sql
CREATE TABLE company_user (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    company_name VARCHAR(150),
    biz_no VARCHAR(40),
    phone VARCHAR(30),
    address VARCHAR(255),
    avatar_blob LONGBLOB,
    avatar_mime VARCHAR(50),
    avatar_updated_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME
);
```

## 🌐 API 엔드포인트

### 일반 사용자 API

#### 회원가입
```http
POST /auth/user/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

#### 로그인
```http
POST /auth/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 이메일 인증 코드 전송
```http
POST /auth/user/send-code
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 인증 코드 확인
```http
POST /auth/user/verify-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "A1B2C3"
}
```

### 업체 사용자 API

#### 회원가입
```http
POST /crm/register
Content-Type: application/json

{
  "email": "company@example.com",
  "password": "password123",
  "companyName": "힐앤고 병원",
  "bizNo": "123-45-67890",
  "phone": "02-1234-5678",
  "address": "서울시 강남구"
}
```

#### 로그인
```http
POST /crm/login
Content-Type: application/json

{
  "email": "company@example.com",
  "password": "password123"
}
```

## 🎨 HTML 페이지

### 일반 사용자
- **로그인**: `/auth/user/login` → `templates/login.html`
- **회원가입**: `/auth/user/signup` → `templates/user-signup.html`

### 업체 사용자
- **로그인**: `/crm/crm_login` → `templates/crm/crm_login.html`
- **회원가입**: `/crm/company_signup` → `templates/crm/company_signup.html`

## 🔧 설정 방법

### 1. Google OAuth2 Client Secret 설정

#### 환경 변수로 설정 (권장)
```bash
export GOOGLE_CLIENT_SECRET=your_client_secret_here
```

#### application.properties에 직접 설정 (개발 환경만)
```properties
google.client-secret=your_client_secret_here
```

### 2. Gmail SMTP 설정 (이미 설정됨)
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=hannah6394@gmail.com
spring.mail.password=zgywaxqbbsoivdjv
```

## 📝 세션 정보

### 일반 사용자 로그인 시
```java
session.setAttribute("userId", user.getUserId());
session.setAttribute("userEmail", user.getEmail());
session.setAttribute("userName", user.getName());
session.setAttribute("userType", "social");
```

### 업체 사용자 로그인 시
```java
session.setAttribute("companyId", company.getCompanyId());
session.setAttribute("companyEmail", company.getEmail());
session.setAttribute("companyName", company.getCompanyName());
session.setAttribute("userType", "company");
```

## 🚀 실행 방법

1. **프로젝트 빌드**
```bash
mvn clean package
```

2. **애플리케이션 실행**
```bash
java -jar target/ApiRound-0.0.1-SNAPSHOT.jar
```

3. **접속**
- 일반 사용자 로그인: http://localhost:8080/auth/user/login
- 업체 로그인: http://localhost:8080/crm/crm_login
- 메인 페이지: http://localhost:8080/main

## ⚠️ 주의사항

1. **CSRF 보호**: 현재 개발 편의를 위해 비활성화되어 있습니다. 운영 환경에서는 활성화 필요
2. **비밀번호 암호화**: BCryptPasswordEncoder 사용
3. **이메일 인증 저장소**: 현재 메모리 사용, 운영 환경에서는 Redis 권장
4. **Google Client Secret**: 환경 변수로 관리 (버전 관리에 포함하지 않음)

## 🔄 확장 가능성

### Redis 이메일 인증 코드 저장
```java
@Autowired
private RedisTemplate<String, String> redisTemplate;

public void sendVerificationCode(String email, String userType) {
    String code = generateCode();
    redisTemplate.opsForValue().set(
        "verification:" + email, 
        code, 
        5, 
        TimeUnit.MINUTES
    );
    // 이메일 전송
}
```

### JWT 토큰 인증
- 세션 대신 JWT 토큰 사용
- Refresh Token 구현
- 토큰 기반 인증으로 확장 가능

## 📞 문의

- 개발자: HealnGo 개발팀
- 이메일: hannah6394@gmail.com

