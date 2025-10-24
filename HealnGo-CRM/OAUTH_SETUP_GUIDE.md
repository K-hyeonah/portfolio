# 🔐 HealnGo OAuth 로그인 설정 가이드

## ✅ 완료된 작업

### 1. 카카오 로그인
- ✅ `KakaoOAuthController` 활성화
- ✅ 새로운 `SocialUsers` 엔티티와 연결
- ✅ 자동 회원가입/로그인 구현

### 2. 구글 로그인
- ✅ `GoogleOAuthController` 활성화
- ✅ 새로운 `SocialUsers` 엔티티와 연결
- ✅ 자동 회원가입/로그인 구현

## 🗂️ 구조

### OAuth Controller
```
src/main/java/com/example/ApiRound/Controller/
├── KakaoOAuthController.java    ← /oauth/kakao/callback
└── GoogleOAuthController.java   ← /oauth/google/callback
```

### 사용하는 엔티티
```
src/main/java/com/example/ApiRound/crm/hyeonah/
├── entity/SocialUsers.java
└── Repository/SocialUsersRepository.java
```

## 🌐 OAuth 플로우

### 카카오 로그인

```
1. 사용자가 /login 페이지 접속
   ↓
2. LoginController가 kakaoLoginUrl 생성
   https://kauth.kakao.com/oauth/authorize?client_id=...
   ↓
3. 사용자가 "카카오로 로그인" 버튼 클릭
   ↓
4. 카카오 로그인 페이지로 이동
   ↓
5. 카카오 로그인 완료 후 콜백
   /oauth/kakao/callback?code=xxxxx
   ↓
6. KakaoOAuthController가 처리
   - Access Token 획득
   - 사용자 정보 조회 (email, nickname)
   - DB에서 이메일로 검색
   - 있으면: lastLoginAt 업데이트
   - 없으면: 신규 SocialUsers 생성
   ↓
7. 세션에 사용자 정보 저장
   - userId, userEmail, userName
   - userType: "social"
   - loginMethod: "kakao"
   ↓
8. /main으로 리다이렉트
```

### 구글 로그인

```
1. 사용자가 /login 페이지 접속
   ↓
2. LoginController가 googleLoginUrl 생성
   https://accounts.google.com/o/oauth2/v2/auth?client_id=...
   ↓
3. 사용자가 "구글로 로그인" 버튼 클릭
   ↓
4. 구글 로그인 페이지로 이동
   ↓
5. 구글 로그인 완료 후 콜백
   /oauth/google/callback?code=xxxxx
   ↓
6. GoogleOAuthController가 처리
   - Access Token 획득
   - 사용자 정보 조회 (email, name)
   - DB에서 이메일로 검색
   - 있으면: lastLoginAt 업데이트
   - 없으면: 신규 SocialUsers 생성
   ↓
7. 세션에 사용자 정보 저장
   - userId, userEmail, userName
   - userType: "social"
   - loginMethod: "google"
   ↓
8. /main으로 리다이렉트
```

## ⚙️ 설정 파일 (application.properties)

### 카카오 설정
```properties
kakao.client-id=c7ceeb58d858498a39068ce0c31eade5
kakao.redirect-uri=http://localhost:8080/oauth/kakao/callback
kakao.client-secret=${KAKAO_CLIENT_SECRET:}
```

### 구글 설정
```properties
google.client-id=268930941505-94e6k5ft8770u8dfooaoqqca5en01m3i.apps.googleusercontent.com
google.client-secret=${GOOGLE_CLIENT_SECRET:}
google.redirect-uri=http://localhost:8080/oauth/google/callback
```

## 🔑 환경 변수 설정

### Windows (PowerShell)
```powershell
$env:GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
$env:KAKAO_CLIENT_SECRET="your_kakao_client_secret_here"
```

### Windows (CMD)
```cmd
set GOOGLE_CLIENT_SECRET=your_google_client_secret_here
set KAKAO_CLIENT_SECRET=your_kakao_client_secret_here
```

### Linux/Mac
```bash
export GOOGLE_CLIENT_SECRET=your_google_client_secret_here
export KAKAO_CLIENT_SECRET=your_kakao_client_secret_here
```

## 📊 데이터베이스

### SocialUsers 테이블
```sql
CREATE TABLE social_users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) UNIQUE NOT NULL,
    password_hash VARCHAR(255),           -- OAuth는 NULL 가능
    name VARCHAR(100),
    phone VARCHAR(30),
    avatar_blob LONGBLOB,
    avatar_mime VARCHAR(50),
    avatar_updated_at DATETIME,
    last_login_at DATETIME,              -- OAuth 로그인 시 업데이트
    is_deleted TINYINT(1) DEFAULT 0,
    created_at DATETIME,
    updated_at DATETIME
);
```

### OAuth 로그인 시 저장되는 데이터
- `email`: 카카오/구글에서 받은 이메일
- `name`: 카카오 nickname / 구글 name
- `password_hash`: NULL (OAuth 로그인이므로 비밀번호 없음)
- `last_login_at`: 현재 시간
- `is_deleted`: false

## 🎯 세션 정보

### OAuth 로그인 후 세션
```java
session.setAttribute("userId", user.getUserId());
session.setAttribute("userEmail", user.getEmail());
session.setAttribute("userName", user.getName());
session.setAttribute("userType", "social");
session.setAttribute("loginMethod", "kakao");  // or "google"
```

## 🔧 코드 주요 부분

### KakaoOAuthController
```java
@Controller
@RequestMapping("/oauth/kakao")
public class KakaoOAuthController {
    
    @Autowired
    private SocialUsersRepository socialUsersRepository;  // ← 새 엔티티 사용
    
    @GetMapping("/callback")
    public RedirectView kakaoCallback(@RequestParam String code, HttpSession session) {
        // 1. Access Token 획득
        String accessToken = getAccessToken(code);
        
        // 2. 사용자 정보 조회
        Map<String, Object> userInfo = getUserInfo(accessToken);
        String email = (String) userInfo.get("email");
        String nickname = (String) userInfo.get("nickname");
        
        // 3. DB 조회 또는 생성
        Optional<SocialUsers> userOpt = socialUsersRepository.findByEmail(email);
        SocialUsers user;
        
        if (userOpt.isPresent()) {
            user = userOpt.get();
            user.setLastLoginAt(LocalDateTime.now());
            socialUsersRepository.save(user);
        } else {
            user = SocialUsers.builder()
                    .email(email)
                    .name(nickname)
                    .isDeleted(false)
                    .lastLoginAt(LocalDateTime.now())
                    .build();
            user = socialUsersRepository.save(user);
        }
        
        // 4. 세션 저장
        session.setAttribute("userId", user.getUserId());
        // ...
        
        return new RedirectView("/main");
    }
}
```

### GoogleOAuthController
```java
@Controller
@RequestMapping("/oauth/google")
public class GoogleOAuthController {
    
    @Autowired
    private SocialUsersRepository socialUsersRepository;  // ← 새 엔티티 사용
    
    @GetMapping("/callback")
    public RedirectView googleCallback(@RequestParam String code, HttpSession session) {
        // 카카오와 동일한 프로세스
        // 1. Access Token 획득
        // 2. 사용자 정보 조회
        // 3. DB 조회 또는 생성
        // 4. 세션 저장
        // 5. /main으로 리다이렉트
    }
}
```

## 🧪 테스트 방법

### 1. 애플리케이션 실행
```bash
mvn spring-boot:run
```

### 2. 로그인 페이지 접속
```
http://localhost:8080/login
```

### 3. OAuth 버튼 클릭
- ✅ 카카오로 로그인 → 카카오 로그인 페이지로 이동
- ✅ 구글로 로그인 → 구글 로그인 페이지로 이동

### 4. 로그인 후 확인
- ✅ `/main` 페이지로 리다이렉트
- ✅ 세션에 사용자 정보 저장됨
- ✅ DB에 사용자 정보 저장됨 (신규 사용자인 경우)

## 📝 주의사항

### OAuth 설정
1. **카카오 개발자 콘솔**
   - Redirect URI: `http://localhost:8080/oauth/kakao/callback`
   - 동의 항목: 이메일, 닉네임

2. **구글 개발자 콘솔**
   - Redirect URI: `http://localhost:8080/oauth/google/callback`
   - Scope: openid, email, profile

### 환경 변수
- Client Secret은 환경 변수로 관리 (보안)
- Git에 커밋하지 않도록 주의

### 이메일 없는 경우
카카오에서 이메일을 제공하지 않는 경우가 있을 수 있으니, 에러 처리 필요:
```java
if (email == null || email.isEmpty()) {
    return new RedirectView("/login?error=no_email");
}
```

## 🎉 완료!

카카오와 구글 로그인이 새로운 `SocialUsers` 엔티티와 완전히 연결되었습니다!

### 로그인 방법
1. ✅ 이메일/비밀번호 로그인
2. ✅ 카카오 OAuth 로그인
3. ✅ 구글 OAuth 로그인

모든 방법이 동일한 `social_users` 테이블을 사용합니다! 😊

