# 🚀 HealnGo 인증 시스템 Quick Start

## ✅ 완료된 작업

### 1. Entity 클래스 생성 ✓
- `SocialUsers` (일반 사용자)
- `CompanyUser` (업체 사용자)

### 2. Repository 생성 ✓
- `SocialUsersRepository`
- `CompanyUserRepository`

### 3. Service 계층 구현 ✓
- **이메일 인증**: `EmailVerificationService`
  - 6자리 코드 생성 및 전송
  - 5분 유효 시간
- **사용자 인증**: `SocialUsersService`, `CompanyUserService`
  - 회원가입, 로그인, 이메일 중복 확인

### 4. Controller 구현 ✓
- **일반 사용자**: `SocialUsersAuthController` → `/auth/user/**`
- **업체**: `CompanyAuthController` → `/crm/**`
- **Google OAuth2**: `GoogleOAuthController` → `/oauth/google/**`

### 5. MultiSecurityConfig 설정 ✓
- 두 개의 독립적인 SecurityFilterChain
- 경로별 보안 정책 분리

### 6. HTML 페이지 생성 ✓
- **CRM 로그인**: `templates/crm/crm_login.html`
- **일반 로그인**: `templates/login.html` (업데이트)

### 7. Google OAuth2 통합 ✓
- Access Token 획득
- 사용자 정보 조회
- 자동 회원가입/로그인

## 📍 주요 경로

| 사용자 타입 | 로그인 페이지 | 회원가입 | 로그인 후 |
|-----------|--------------|---------|----------|
| 일반 사용자 | `/auth/user/login` | `/user-signup` | `/main` |
| 업체 | `/crm/crm_login` | `/crm/company_signup` | `/crm/company` |

## 🔌 API 엔드포인트

### 일반 사용자
```
POST /auth/user/send-code      # 이메일 인증 코드 전송
POST /auth/user/verify-code    # 인증 코드 확인
POST /auth/user/register       # 회원가입
POST /auth/user/login          # 로그인
POST /auth/user/logout         # 로그아웃
GET  /oauth/google/login       # Google 로그인
```

### 업체 사용자
```
POST /crm/send-code      # 이메일 인증 코드 전송
POST /crm/verify-code    # 인증 코드 확인
POST /crm/register       # 회원가입
POST /crm/login          # 로그인
POST /crm/logout         # 로그아웃
```

## 🗄️ 데이터베이스

### social_users 테이블
- user_id, email, password_hash, name, phone
- avatar_blob, avatar_mime, avatar_updated_at
- last_login_at, is_deleted, created_at, updated_at

### company_user 테이블
- company_id, email, password_hash, company_name
- biz_no, phone, address
- avatar_blob, avatar_mime, avatar_updated_at
- is_active, created_at, updated_at

## ⚙️ 설정 필요 사항

### 1. Google OAuth2 Client Secret
```bash
# 환경 변수로 설정
export GOOGLE_CLIENT_SECRET=your_secret_here
```

### 2. application.properties 확인
```properties
# Gmail SMTP (이미 설정됨)
spring.mail.username=hannah6394@gmail.com
spring.mail.password=zgywaxqbbsoivdjv

# Google OAuth2
google.client-id=268930941505-94e6k5ft8770u8dfooaoqqca5en01m3i.apps.googleusercontent.com
google.client-secret=${GOOGLE_CLIENT_SECRET:}
google.redirect-uri=http://localhost:8080/oauth/google/callback
```

## 🏃 실행 방법

### 1. 프로젝트 빌드
```bash
mvn clean install -DskipTests
```

### 2. 애플리케이션 실행
```bash
mvn spring-boot:run
```

또는

```bash
java -jar target/ApiRound-0.0.1-SNAPSHOT.jar
```

### 3. 브라우저에서 접속
```
일반 사용자: http://localhost:8080/auth/user/login
업체 로그인: http://localhost:8080/crm/crm_login
```

## 🧪 테스트 방법

### 1. 회원가입 테스트
```bash
# 일반 사용자
curl -X POST http://localhost:8080/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "테스트",
    "phone": "010-1234-5678"
  }'

# 업체
curl -X POST http://localhost:8080/crm/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "company@example.com",
    "password": "password123",
    "companyName": "테스트병원",
    "bizNo": "123-45-67890",
    "phone": "02-1234-5678",
    "address": "서울시 강남구"
  }'
```

### 2. 이메일 인증 테스트
```bash
# 인증 코드 전송
curl -X POST http://localhost:8080/auth/user/send-code \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 인증 코드 확인
curl -X POST http://localhost:8080/auth/user/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "A1B2C3"
  }'
```

### 3. 로그인 테스트
```bash
# 일반 사용자
curl -X POST http://localhost:8080/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 업체
curl -X POST http://localhost:8080/crm/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "company@example.com",
    "password": "password123"
  }'
```

## 📝 세션 정보

로그인 후 세션에 저장되는 정보:

### 일반 사용자
```java
userId (Integer)
userEmail (String)
userName (String)
userType = "social"
```

### 업체 사용자
```java
companyId (Integer)
companyEmail (String)
companyName (String)
userType = "company"
```

## 🔐 보안 기능

- ✅ BCrypt 비밀번호 암호화
- ✅ 이메일 인증 (5분 유효)
- ✅ 멀티 시큐리티 설정
- ✅ 세션 기반 인증
- ✅ Google OAuth2 통합
- ⚠️ CSRF 보호 (개발 중 비활성화, 운영 시 활성화 필요)

## ⚠️ 주의사항

1. **Google Client Secret**: 반드시 환경 변수로 설정
2. **운영 환경**: CSRF 보호 활성화 필요
3. **이메일 인증 저장소**: 운영 환경에서는 Redis 사용 권장
4. **HTTPS**: 운영 환경에서는 HTTPS 필수

## 📚 추가 문서

- 상세 가이드: `AUTH_SYSTEM_GUIDE.md`
- 프로젝트 구조 및 API 명세 참조

## 🎉 완료!

모든 기능이 정상적으로 구현되었습니다. 애플리케이션을 실행하고 테스트해보세요!

