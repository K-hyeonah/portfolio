# 🔑 CRM 비밀번호 찾기 페이지

## ✅ 생성된 파일

### 1. HTML 페이지
```
templates/crm/forgot-crm-password.html
```

### 2. CSS 파일
```
static/crm/css/forgot-crm-password.css
```

### 3. JavaScript 파일
```
static/crm/js/forgot-crm-password.js
```

## 🎯 페이지 구조

### 3단계 프로세스

#### Step 1: 이메일 인증
1. 이메일 입력
2. "인증 코드 전송" 버튼 클릭
3. 6자리 코드를 이메일로 받음
4. 인증 코드 입력 및 확인
5. 타이머: 5분 (300초)

#### Step 2: 비밀번호 재설정
1. 새 비밀번호 입력 (8자 이상)
2. 비밀번호 확인 입력
3. "비밀번호 재설정" 버튼 클릭

#### Step 3: 완료
1. 성공 메시지 표시
2. "로그인 페이지로 이동" 버튼

## 🔗 URL 및 API

### 페이지 URL
```
GET /crm/forgot-password
```

### API 엔드포인트

| Method | URL | 설명 |
|--------|-----|------|
| POST | `/crm/send-code` | 인증 코드 이메일 전송 |
| POST | `/crm/verify-code` | 인증 코드 확인 |
| POST | `/crm/reset-password` | 비밀번호 재설정 |

## 🎨 디자인 특징

### 레이아웃
- **왼쪽 사이드바 (40%)**: 파란색 그라디언트
  - 로고
  - 타이틀과 설명
  - 3단계 안내

- **오른쪽 메인 컨텐츠 (60%)**: 하얀 배경
  - Progress bar (진행 상태 표시)
  - 단계별 폼
  - Alert 메시지

### 스타일
- company_signup과 동일한 디자인 시스템
- 색상: `#3F8CFF` → `#1e40af` 그라디언트
- Font Awesome 아이콘 사용
- 반응형 디자인 (모바일/태블릿)

## 📝 Controller 코드

### CompanyAuthController.java
```java
@GetMapping("/forgot-password")
public String forgotPasswordPage() {
    return "crm/forgot-crm-password";
}

@PostMapping("/reset-password")
@ResponseBody
public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String newPassword = request.get("newPassword");
    
    companyService.updatePassword(email, newPassword);
    
    response.put("success", true);
    response.put("message", "비밀번호가 성공적으로 재설정되었습니다.");
    return ResponseEntity.ok(response);
}
```

### CompanyUserService.java
```java
void updatePassword(String email, String newPassword);
```

### CompanyUserServiceImpl.java
```java
@Override
public void updatePassword(String email, String newPassword) {
    Optional<CompanyUser> companyOpt = repository.findByEmail(email);
    
    if (companyOpt.isEmpty()) {
        throw new IllegalArgumentException("업체를 찾을 수 없습니다.");
    }
    
    CompanyUser company = companyOpt.get();
    String encodedPassword = passwordEncoder.encode(newPassword);
    company.setPasswordHash(encodedPassword);
    repository.save(company);
}
```

## 🔐 JavaScript 주요 기능

### 인증 코드 전송
```javascript
async function sendVerificationCode() {
    const email = document.getElementById('email').value;
    
    const response = await fetch('/crm/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    
    // 타이머 시작 (5분)
    startTimer();
}
```

### 타이머 기능
```javascript
let timeLeft = 300; // 5분 = 300초

function startTimer() {
    verificationTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();  // "5:00" → "4:59" → ...
        
        if (timeLeft <= 0) {
            stopTimer();
            showAlert('인증 시간이 만료되었습니다.', 'error');
        }
    }, 1000);
}
```

### 비밀번호 검증
```javascript
if (newPassword.length < 8) {
    showAlert('비밀번호는 8자 이상이어야 합니다.', 'error');
    return;
}

if (newPassword !== confirmPassword) {
    showAlert('비밀번호가 일치하지 않습니다.', 'error');
    return;
}
```

## 🔗 링크 연결

### crm_login.html에서
```html
<!-- 비밀번호 찾기 링크 -->
<a th:href="@{/crm/forgot-password}">
    <i class="fas fa-lock"></i>
    비밀번호 찾기
</a>
```

### forgot-crm-password.html에서
```html
<!-- 로그인으로 돌아가기 -->
<a href="/crm/crm_login">
    <i class="fas fa-arrow-left"></i>
    로그인으로 돌아가기
</a>
```

## 🧪 테스트 방법

### 1. 애플리케이션 실행
```bash
mvn spring-boot:run
```

### 2. 페이지 접속
```
http://localhost:8080/crm/forgot-password
```

### 3. 플로우 테스트
1. 이메일 입력 → 인증 코드 전송 → 이메일 확인
2. 6자리 코드 입력 → 확인
3. 새 비밀번호 입력 → 확인 → 재설정
4. 완료 → 로그인 페이지 이동

## 📊 API 요청 예시

### 인증 코드 전송
```bash
curl -X POST http://localhost:8080/crm/send-code \
  -H "Content-Type: application/json" \
  -d '{"email": "company@example.com"}'
```

### 인증 코드 확인
```bash
curl -X POST http://localhost:8080/crm/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email": "company@example.com", "code": "ABC123"}'
```

### 비밀번호 재설정
```bash
curl -X POST http://localhost:8080/crm/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "company@example.com", "newPassword": "newpassword123"}'
```

## 🎉 완료!

CRM 비밀번호 찾기 페이지가 company_signup과 동일한 스타일로 완성되었습니다!

