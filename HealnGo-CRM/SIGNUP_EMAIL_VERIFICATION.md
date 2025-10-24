# 📧 회원가입 이메일 인증 시스템

## ✅ 완료된 변경 사항

### 1. 일반 사용자 회원가입 (user-signup.html)
- ❌ 전화번호 인증 제거
- ✅ 이메일 인증으로 변경
- ✅ 2단계 프로세스
  - Step 1: 이메일 인증 (코드 전송, 비밀번호 입력)
  - Step 2: 개인 정보 (이름, 전화번호 선택)

### 2. 업체 회원가입 (company_signup.html)
- ❌ 전화번호 인증 제거
- ✅ 이메일 인증으로 변경
- ✅ 3단계 프로세스
  - Step 1: 이메일 인증 (코드 전송, 비밀번호 입력, 전화번호 선택)
  - Step 2: 회사 정보 (회사명, 사업자번호, 병원 종류, 직급)
  - Step 3: 팀원 초대 (선택)

## 📁 생성/수정된 파일

### 일반 사용자
```
✅ templates/user-signup.html              (새로 생성)
✅ static/resources/js/user_signup.js      (새로 생성)
✅ static/resources/css/user_signup.css    (새로 생성)
```

### 업체 사용자
```
✅ templates/crm/company_signup.html       (수정)
✅ static/crm/js/company_signup.js         (수정)
```

## 🔄 변경 내용 비교

### Before (전화번호 인증)
```html
<div class="form-group">
    <label>핸드폰 번호</label>
    <input type="tel" id="phoneNumber" placeholder="010-1234-5678">
    <button onclick="sendSMS()">인증하기</button>
</div>
<div class="form-group">
    <label>인증번호</label>
    <input type="text" id="smsCode" placeholder="SMS 인증번호">
</div>
```

### After (이메일 인증)
```html
<div class="form-group">
    <label>Email Address</label>
    <input type="email" id="email" placeholder="your@email.com">
    <button onclick="sendEmailCode()">인증하기</button>
</div>
<div class="form-group">
    <label>인증번호</label>
    <input type="text" id="emailCode" placeholder="6자리 인증번호" maxlength="6">
</div>
```

## 🎯 회원가입 플로우

### 일반 사용자 (user-signup.html)

#### Step 1: 이메일 인증
1. 이메일 입력
2. "인증하기" 버튼 클릭 → `POST /api/user/send-code`
3. 6자리 코드 이메일로 수신
4. 인증번호 입력
5. 비밀번호 입력 (8자 이상)
6. "Next Step" 클릭 → `POST /api/user/verify-code`

#### Step 2: 개인 정보
1. 이름 입력
2. 전화번호 입력 (선택)
3. "회원가입" 클릭 → `POST /api/user/register`

#### 완료
- 성공 페이지 표시
- "시작하기" 버튼 → `/login` 이동

### 업체 사용자 (company_signup.html)

#### Step 1: 이메일 인증
1. 이메일 입력
2. "인증하기" 버튼 클릭 → `POST /crm/send-code`
3. 6자리 코드 이메일로 수신
4. 인증번호 입력
5. 전화번호 입력 (선택)
6. 비밀번호 입력 (8자 이상)
7. "Next Step" 클릭 → `POST /crm/verify-code`

#### Step 2: 회사 정보
1. 병원명 입력
2. 사업자번호 입력
3. 병원 종류 선택
4. 직급 선택
5. "Next Step" 클릭

#### Step 3: 팀원 초대
1. 팀원 이메일 입력 (선택)
2. "회원가입" 클릭 → `POST /crm/register`

#### 완료
- 성공 페이지 표시
- "Let's Start" 버튼 → `/crm/company` 이동

## 📊 API 엔드포인트

### 일반 사용자
```
POST /api/user/send-code       # 이메일 인증 코드 전송
POST /api/user/verify-code     # 인증 코드 확인
POST /api/user/register        # 회원가입
```

### 업체 사용자
```
POST /crm/send-code            # 이메일 인증 코드 전송
POST /crm/verify-code          # 인증 코드 확인
POST /crm/register             # 회원가입
```

## 🔐 이메일 인증 시스템

### EmailVerificationService
- **코드 생성**: 6자리 영숫자 (A-Z, 0-9)
- **유효 시간**: 5분 (300초)
- **저장소**: ConcurrentHashMap (메모리)
- **운영 환경**: Redis 사용 권장

### JavaScript 타이머
```javascript
let timeLeft = 300; // 5분

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        // "05:00" → "04:59" → ... → "00:00"
        
        if (timeLeft < 0) {
            alert('인증 시간이 만료되었습니다.');
        }
    }, 1000);
}
```

## 🎨 디자인 특징

### 공통
- company_signup.css 스타일 재사용
- 왼쪽 사이드바: 파란색 그라디언트
- 오른쪽 컨텐츠: 하얀 배경
- Progress steps 표시
- Font Awesome 아이콘

### 차이점
- **일반 사용자**: 2단계 (간단)
- **업체 사용자**: 3단계 (상세 정보 필요)

## 🚀 테스트

### 1. 애플리케이션 실행
```bash
mvn spring-boot:run
```

### 2. 페이지 접속
```
일반 회원가입: http://localhost:8080/signup
업체 회원가입: http://localhost:8080/crm/company_signup
```

### 3. 이메일 인증 테스트
1. 이메일 입력
2. "인증하기" 클릭
3. 콘솔 확인 (실제 이메일 전송됨)
4. 받은 코드 입력
5. "Next Step" 클릭

## 📝 회원가입 데이터

### 일반 사용자 (SocialUsers)
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"  // 선택
}
```

### 업체 사용자 (CompanyUser)
```json
{
  "email": "company@example.com",
  "password": "password123",
  "companyName": "힐앤고 병원",
  "bizNo": "123-45-67890",
  "phone": "02-1234-5678",  // 선택
  "address": ""             // Step 2에서 추가 가능
}
```

## 🎉 완성!

### 변경된 인증 방식
| 페이지 | Before | After |
|--------|--------|-------|
| user-signup | ❌ 전화번호 SMS | ✅ 이메일 코드 |
| company_signup | ❌ 전화번호 SMS | ✅ 이메일 코드 |

### 모든 기능
- ✅ 이메일 인증 코드 전송 (6자리, 5분 유효)
- ✅ 실시간 타이머 표시
- ✅ 재전송 기능
- ✅ 비밀번호 강도 검증 (8자 이상)
- ✅ 중복 이메일 확인
- ✅ 회원가입 완료 후 자동 로그인 가능

모든 준비가 완료되었습니다! 애플리케이션을 재시작하고 테스트해보세요! 😊

