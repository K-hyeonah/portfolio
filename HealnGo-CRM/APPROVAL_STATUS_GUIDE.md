# 업체 승인 상태 관리 가이드

## 개요
업체 회원가입 후 관리자 승인을 받아야만 로그인할 수 있도록 하는 시스템입니다.

## 승인 상태 종류

### 1. PENDING (승인 대기중)
- 기본 상태: 회원가입 시 자동으로 설정됨
- 의미: 관리자 승인을 기다리는 중
- 로그인 시: "승인 대기중입니다" 모달 표시

### 2. APPROVED (승인 완료)
- 의미: 관리자가 승인한 상태
- 로그인 시: 정상 로그인 허용

### 3. REJECTED (승인 거부)
- 의미: 관리자가 승인을 거부한 상태
- 로그인 시: "승인이 거부되었습니다" 모달 표시 (거부 사유 포함)

### 4. INACTIVE (비활성화)
- 의미: 계정이 비활성화된 상태
- 로그인 시: "비활성화된 계정입니다" 모달 표시

## 데이터베이스 구조

### company_user 테이블
```sql
approval_status VARCHAR(20) DEFAULT 'PENDING'  -- 승인 상태
approved_by BIGINT                             -- 승인한 관리자 ID
approved_at DATETIME                           -- 승인 일시
rejection_reason VARCHAR(500)                  -- 거부 사유
is_active TINYINT(1) DEFAULT 1                -- 활성화 여부
```

## 로그인 프로세스

### 1. 사용자가 로그인 시도
```
이메일/비밀번호 입력
  ↓
POST /crm/login
  ↓
CompanyAuthController.login()
```

### 2. 승인 상태 체크 순서
```
1. PENDING 체크 → 승인 대기 모달 표시
2. REJECTED 체크 → 승인 거부 모달 표시
3. INACTIVE 체크 → 비활성화 모달 표시
4. APPROVED 체크 → 로그인 허용
5. 그 외 → 로그인 불가
```

### 3. 응답 형식
```json
// 승인 대기중인 경우
{
  "success": false,
  "status": "PENDING",
  "message": "승인 대기중입니다.",
  "detail": "관리자의 승인을 기다리고 있습니다. 승인 완료 후 로그인이 가능합니다."
}

// 승인 거부된 경우
{
  "success": false,
  "status": "REJECTED",
  "message": "승인이 거부되었습니다.",
  "detail": "사업자등록증이 유효하지 않습니다."  // rejection_reason
}

// 로그인 성공
{
  "success": true,
  "message": "로그인 성공",
  "redirectUrl": "/company/dashboard"
}
```

## 프론트엔드 구현

### 1. JavaScript (crm_login.js)
- `showApprovalModal(title, message, status)`: 모달 표시 함수
- `closeApprovalModal()`: 모달 닫기 함수
- 상태별 아이콘 및 색상 자동 변경

### 2. HTML (crm_login.html)
```html
<div id="approvalModal" class="approval-modal">
  <div class="modal-content">
    <div id="modalIcon" class="modal-icon"></div>
    <h2 id="modalTitle"></h2>
    <p id="modalMessage"></p>
    <button onclick="closeApprovalModal()">확인</button>
  </div>
</div>
```

### 3. CSS (crm_login.css)
- 배경 블러 효과
- 페이드인/슬라이드업 애니메이션
- 상태별 색상 구분
  - PENDING: 노란색 (⏰ 시계 아이콘)
  - REJECTED: 빨간색 (❌ X 아이콘)
  - INACTIVE: 회색 (🚫 금지 아이콘)

## 관리자 승인 방법

### 업체 승인하기
```sql
UPDATE company_user 
SET 
  approval_status = 'APPROVED',
  approved_by = {관리자_ID},
  approved_at = NOW()
WHERE company_id = {업체_ID};
```

### 업체 승인 거부하기
```sql
UPDATE company_user 
SET 
  approval_status = 'REJECTED',
  rejection_reason = '거부 사유',
  approved_by = {관리자_ID},
  approved_at = NOW()
WHERE company_id = {업체_ID};
```

### 업체 비활성화하기
```sql
UPDATE company_user 
SET is_active = 0
WHERE company_id = {업체_ID};
```

## 코드 위치

### 백엔드
- 컨트롤러: `src/main/java/com/example/ApiRound/crm/hyeonah/Controller/CompanyAuthController.java`
- 엔티티: `src/main/java/com/example/ApiRound/crm/hyeonah/entity/CompanyUser.java`

### 프론트엔드
- HTML: `src/main/resources/templates/crm/crm_login.html`
- JavaScript: `src/main/resources/static/crm/js/crm_login.js`
- CSS: `src/main/resources/static/crm/css/crm_login.css`

## 테스트 시나리오

### 1. 신규 업체 회원가입 후 로그인
```
1. 회원가입 완료 (approval_status = 'PENDING')
2. 로그인 시도
3. "승인 대기중입니다" 모달 확인
4. 확인 버튼 클릭 → 모달 닫힘
```

### 2. 관리자 승인 후 로그인
```
1. 관리자가 업체 승인 (approval_status = 'APPROVED')
2. 로그인 시도
3. 정상 로그인 → 대시보드 이동
```

### 3. 승인 거부된 업체 로그인
```
1. 관리자가 승인 거부 (approval_status = 'REJECTED')
2. 로그인 시도
3. "승인이 거부되었습니다" 모달 + 거부 사유 표시
```

## 향후 개선사항

1. ✅ 이메일 알림
   - 승인 완료 시 이메일 발송
   - 승인 거부 시 이메일 발송 (거부 사유 포함)

2. ✅ 관리자 페이지
   - 승인 대기 업체 목록
   - 원클릭 승인/거부 기능
   - 업체 정보 상세 보기

3. ✅ 재심사 요청
   - 거부된 업체가 재심사 요청 가능
   - 서류 재제출 기능

4. ✅ 자동 승인
   - 특정 조건 충족 시 자동 승인
   - 신뢰도 기반 자동 승인

