# 🎯 HealnGo 로그인 시스템 최종 구조

## ✅ 완료된 작업

### 1. 경로 단순화
- ❌ `/auth/user/**` 경로 제거
- ✅ `/login`, `/signup` 사용
- ✅ API는 `/api/user/**` 사용

### 2. OAuth 임시 비활성화
- ⏸️ 카카오 로그인 (기존 서비스 필요)
- ⏸️ 구글 로그인 (기존 서비스 필요)
- ✅ 이메일 로그인 작동

## 📁 컨트롤러 구조

### 일반 사용자

#### LoginController (기존)
```java
@Controller
public class LoginController {
    @GetMapping("/login")
    public String loginPage(Model model) {
        // 카카오/구글 URL 생성 (현재 비활성화됨)
        return "login";
    }
}
```

#### SocialUsersAuthController (새로 생성)
```java
@Controller
public class SocialUsersAuthController {
    
    @GetMapping("/signup")
    public String signupPage() {
        return "user-signup";
    }
    
    @PostMapping("/api/user/send-code")     // 인증 코드 전송
    @PostMapping("/api/user/verify-code")   // 인증 코드 확인
    @PostMapping("/api/user/register")      // 회원가입
    @PostMapping("/api/user/login")         // 로그인
    @PostMapping("/api/user/logout")        // 로그아웃
}
```

### 업체 사용자

#### CompanyAuthController
```java
@Controller
@RequestMapping("/crm")
public class CompanyAuthController {
    
    @GetMapping("/crm_login")           // 로그인 페이지
    @GetMapping("/company_signup")      // 회원가입 페이지
    
    @PostMapping("/send-code")          // 인증 코드 전송
    @PostMapping("/verify-code")        // 인증 코드 확인
    @PostMapping("/register")           // 회원가입
    @PostMapping("/login")              // 로그인
    @PostMapping("/logout")             // 로그아웃
}
```

## 🗺️ URL 매핑

### 일반 사용자

| 타입 | URL | 설명 | 컨트롤러 |
|------|-----|------|---------|
| 페이지 | `GET /login` | 로그인 페이지 | LoginController |
| 페이지 | `GET /signup` | 회원가입 페이지 | SocialUsersAuthController |
| API | `POST /api/user/send-code` | 인증 코드 전송 | SocialUsersAuthController |
| API | `POST /api/user/verify-code` | 인증 코드 확인 | SocialUsersAuthController |
| API | `POST /api/user/register` | 회원가입 | SocialUsersAuthController |
| API | `POST /api/user/login` | 로그인 | SocialUsersAuthController |
| API | `POST /api/user/logout` | 로그아웃 | SocialUsersAuthController |

### 업체 사용자

| 타입 | URL | 설명 | 컨트롤러 |
|------|-----|------|---------|
| 페이지 | `GET /crm/crm_login` | 로그인 페이지 | CompanyAuthController |
| 페이지 | `GET /crm/company_signup` | 회원가입 페이지 | CompanyAuthController |
| API | `POST /crm/send-code` | 인증 코드 전송 | CompanyAuthController |
| API | `POST /crm/verify-code` | 인증 코드 확인 | CompanyAuthController |
| API | `POST /crm/register` | 회원가입 | CompanyAuthController |
| API | `POST /crm/login` | 로그인 | CompanyAuthController |
| API | `POST /crm/logout` | 로그아웃 | CompanyAuthController |

## 🔐 SecurityConfig

### CRM Chain (Order 1)
```java
.securityMatcher("/crm/**")
.authorizeHttpRequests(auth -> auth
    .anyRequest().permitAll()  // 개발 중: 모든 경로 허용
)
```

### User Chain (Order 2)
```java
.securityMatcher("/**")
.authorizeHttpRequests(auth -> auth
    .requestMatchers(
        "/", "/main", "/login", "/signup",
        "/list", "/detail/**", "/location",
        "/tourism/**", "/oauth/**", "/api/**",
        "/community", "/forget-password"
    ).permitAll()
    .requestMatchers(
        "/static/**", "/resources/**",
        "/css/**", "/js/**", "/images/**"
    ).permitAll()
    .anyRequest().authenticated()
)
.formLogin(form -> form
    .loginPage("/login")
    .loginProcessingUrl("/api/user/login")
)
```

## 🌐 HTML 페이지

### login.html
```html
<!-- 로그인 폼 -->
<form id="login-form">
  <input type="email" id="email">
  <input type="password" id="password">
  <button type="submit">로그인</button>
</form>

<!-- JavaScript -->
<script>
  fetch('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
</script>

<!-- 링크들 -->
<a href="/signup">회원가입</a>
<a href="/crm/crm_login">업체 로그인</a>
<a href="/forget-password">비밀번호 찾기</a>
```

### crm/crm_login.html
```html
<!-- 로그인 폼 -->
<form id="loginForm">
  <input type="email" id="email">
  <input type="password" id="password">
  <button type="submit">로그인</button>
</form>

<!-- JavaScript -->
<script src="/crm/js/crm_login.js">
  fetch('/crm/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
</script>

<!-- 링크들 -->
<a href="/crm/company_signup">업체 회원가입</a>
<a href="/login">일반 사용자 로그인</a>
```

## 📊 세션 정보

### 일반 사용자 로그인 후
```java
session.setAttribute("userId", user.getUserId());
session.setAttribute("userEmail", user.getEmail());
session.setAttribute("userName", user.getName());
session.setAttribute("userType", "social");
```

### 업체 로그인 후
```java
session.setAttribute("companyId", company.getCompanyId());
session.setAttribute("companyEmail", company.getEmail());
session.setAttribute("companyName", company.getCompanyName());
session.setAttribute("userType", "company");
```

## 🚀 테스트

### 1. 애플리케이션 실행
```bash
mvn spring-boot:run
```

### 2. 페이지 접속
```
일반 사용자 로그인:  http://localhost:8080/login
업체 로그인:         http://localhost:8080/crm/crm_login
메인 페이지:         http://localhost:8080/main
```

### 3. 링크 테스트
- ✅ `/login` → 회원가입 버튼 → `/signup` 이동
- ✅ `/login` → 업체 로그인 → `/crm/crm_login` 이동
- ✅ `/crm/crm_login` → 회원가입 → `/crm/company_signup` 이동
- ✅ `/crm/crm_login` → 일반 로그인 → `/login` 이동

## 📦 파일 구조

```
src/main/java/com/example/ApiRound/
├── Controller/
│   └── LoginController.java                    ← GET /login
├── crm/hyeonah/
│   ├── Controller/
│   │   ├── SocialUsersAuthController.java      ← GET /signup, POST /api/user/**
│   │   └── CompanyAuthController.java          ← /crm/**
│   ├── Service/
│   │   ├── SocialUsersService
│   │   ├── CompanyUserService
│   │   └── EmailVerificationService
│   ├── Repository/
│   ├── entity/
│   └── dto/
└── config/
    └── SecurityConfig.java                     ← 멀티 시큐리티 설정

src/main/resources/
├── templates/
│   ├── login.html                              ← 일반 로그인
│   ├── user-signup.html                        ← 일반 회원가입
│   └── crm/
│       ├── crm_login.html                      ← CRM 로그인
│       └── company_signup.html                 ← CRM 회원가입
└── static/
    ├── resources/css/login.css                 ← 일반 로그인 CSS
    └── crm/
        ├── css/crm_login.css                   ← CRM 로그인 CSS
        └── js/crm_login.js                     ← CRM 로그인 JS
```

## 🎉 완료!

- ✅ `/auth/user/**` 경로 제거
- ✅ `/login`, `/signup` 단순화
- ✅ API는 `/api/user/**` 사용
- ✅ CRM은 `/crm/**` 사용
- ✅ 모든 링크 정상 작동
- ✅ SecurityConfig 정리 완료

이제 깔끔하고 이해하기 쉬운 구조가 되었습니다! 😊

