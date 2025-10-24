# 관리자 사용자 관리 시스템 가이드

## 개요
관리자가 일반 사용자(social_users)를 조회, 수정, 정지/비활성화할 수 있는 시스템입니다.

## 주요 기능

### 1. 사용자 목록 조회 ✅
- **페이지**: `/admin/users`
- **기능**:
  - 페이징 처리 (기본 10명씩)
  - 이름/이메일로 검색
  - 상태별 필터 (전체/활성/정지/비활성)
  - 가입일/이름/이메일 순으로 정렬
  - 오름차순/내림차순 선택
  - 필터 초기화 버튼

### 2. 사용자 상세 보기 👁️
- **API**: `GET /admin/api/users/{userId}`
- **표시 정보**:
  - 기본 정보 (이름, 이메일, 전화번호, 상태)
  - 활동 정보 (가입일, 최근 로그인, 예약 수, 결제 금액)
  - 관리자 메모

### 3. 사용자 정보 수정 ✏️
- **API**: `PUT /admin/api/users/{userId}`
- **수정 가능 항목**:
  - 이름
  - 전화번호
  - 상태 (활성/비활성/정지)
  - 관리자 메모

### 4. 사용자 상태 토글 🔄
- **API**: `POST /admin/api/users/{userId}/toggle-status`
- **동작**:
  - **활성** → **정지** → **비활성화** (순환)
  - 버튼 한번 클릭: 활성 → 정지
  - 버튼 두번 클릭: 정지 → 비활성화
  - 버튼 세번 클릭: 비활성화 → 활성

### 5. 일괄 정지 처리 📋
- **API**: `POST /admin/api/users/bulk-suspend`
- **버튼**: "선택 정지"
- **기능**:
  - 체크박스로 여러 사용자 선택
  - 한번에 여러 사용자를 정지 상태로 변경

## 사용자 상태 종류

### 🟢 활성 (ACTIVE)
- 정상적으로 서비스 이용 가능
- 로그인 가능
- 배지 색상: 초록색

### 🟡 정지 (SUSPENDED)
- 일시적으로 서비스 이용 제한
- 로그인 불가 (구현 필요)
- 배지 색상: 노란색

### 🔴 비활성화 (INACTIVE)
- 계정이 비활성화됨
- 로그인 불가
- 목록에서 제외됨 (isDeleted = true)
- 배지 색상: 빨간색

## 데이터베이스 구조

### social_users 테이블
```sql
user_id INT PRIMARY KEY
email VARCHAR(190) UNIQUE NOT NULL
password_hash VARCHAR(255)
name VARCHAR(100)
phone VARCHAR(30)
avatar_blob LONGBLOB
avatar_mime VARCHAR(50)
avatar_updated_at DATETIME
last_login_at DATETIME
is_deleted TINYINT(1) DEFAULT 0
status VARCHAR(20) DEFAULT 'ACTIVE'  -- 신규 추가 필드
created_at DATETIME
updated_at DATETIME
```

## REST API 엔드포인트

### 1. 사용자 상세 조회
```
GET /admin/api/users/{userId}

Response:
{
  "id": 1,
  "name": "김철수",
  "email": "kim@example.com",
  "phone": "010-1234-5678",
  "joinDate": "2024-01-15",
  "lastLogin": "2024-10-09 14:30",
  "status": "활성",
  "totalReservations": 15,
  "totalSpent": 750000,
  "notes": ""
}
```

### 2. 사용자 정보 수정
```
PUT /admin/api/users/{userId}

Request Body:
{
  "name": "김철수",
  "phone": "010-1234-5678",
  "status": "active",
  "notes": "관리자 메모"
}

Response:
{
  "success": true,
  "message": "사용자 정보가 수정되었습니다."
}
```

### 3. 사용자 상태 토글
```
POST /admin/api/users/{userId}/toggle-status

Response:
{
  "success": true,
  "message": "사용자 상태가 정지(으)로 변경되었습니다.",
  "newStatus": "정지"
}
```

### 4. 일괄 정지
```
POST /admin/api/users/bulk-suspend

Request Body:
{
  "userIds": [1, 2, 3, 4, 5]
}

Response:
{
  "success": true,
  "message": "5명의 사용자가 정지되었습니다."
}
```

## 사용 시나리오

### 시나리오 1: 문제 사용자 정지
```
1. 사용자 검색 → "김철수" 검색
2. 상세보기 클릭 → 사용자 정보 확인
3. 상태 변경 버튼 클릭 → "활성" → "정지"로 변경
```

### 시나리오 2: 여러 사용자 일괄 정지
```
1. 문제 사용자들 체크박스 선택
2. "선택 정지" 버튼 클릭
3. 확인 → 일괄 정지 처리
4. 페이지 자동 새로고침
```

### 시나리오 3: 정지된 사용자 비활성화
```
1. 정지된 사용자 선택
2. 상태 변경 버튼 다시 클릭 → "정지" → "비활성화"
3. 목록에서 사라짐 (isDeleted = true)
```

### 시나리오 4: 비활성화된 사용자 복구
```
1. DB에서 직접 isDeleted = false로 변경
2. 또는 상태 변경 버튼 클릭 → "비활성화" → "활성"
```

### 시나리오 5: 필터 및 정렬 사용
```
1. 상태 필터에서 "정지" 선택
2. 정렬을 "이름순" 선택
3. 정렬 방향을 "오름차순" 선택
4. "필터 적용" 버튼 클릭
5. 정지된 사용자만 이름 오름차순으로 표시됨
```

### 시나리오 6: 복합 검색
```
1. 검색창에 "김" 입력
2. 상태 필터에서 "활성" 선택
3. "필터 적용" 클릭
4. 이름에 "김"이 포함된 활성 사용자만 표시
```

## 필터 기능 상세

### 상태 필터 옵션
- **전체 상태**: 삭제되지 않은 모든 사용자
- **활성 (ACTIVE)**: 정상 사용자만
- **정지 (SUSPENDED)**: 정지된 사용자만
- **비활성 (INACTIVE)**: 비활성화된 사용자만

### 정렬 옵션
- **가입일순**: 최신 가입자 우선 (기본값)
- **이름순**: 가나다순
- **이메일순**: 알파벳순

### 정렬 방향
- **내림차순 (DESC)**: 큰 값 → 작은 값 (기본값)
- **오름차순 (ASC)**: 작은 값 → 큰 값

### 필터 초기화
- "초기화" 버튼 클릭
- 모든 필터와 검색어 제거
- 기본 목록으로 돌아감

## 데이터베이스 마이그레이션

`social_users_status_migration.sql` 파일 실행:
```sql
ALTER TABLE social_users 
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' AFTER is_deleted;

UPDATE social_users 
SET status = CASE 
    WHEN is_deleted = 1 THEN 'INACTIVE'
    ELSE 'ACTIVE'
END
WHERE status IS NULL;

CREATE INDEX idx_social_users_status ON social_users(status);
```

## 코드 위치

### 백엔드
- **컨트롤러**: `src/main/java/com/example/ApiRound/crm/minggzz/AdminController.java`
- **엔티티**: `src/main/java/com/example/ApiRound/crm/hyeonah/entity/SocialUsers.java`
- **Repository**: `src/main/java/com/example/ApiRound/crm/hyeonah/Repository/SocialUsersRepository.java`

### 프론트엔드
- **HTML**: `src/main/resources/templates/admin/users.html`
- **JavaScript**: `src/main/resources/static/crm/js/admin_users.js`
- **CSS**: `src/main/resources/static/crm/css/admin_users.css`

## 상태 배지 색상

- **활성**: 초록색 배경 (`#d4edda`)
- **정지**: 노란색 배경 (`#fff3cd`)
- **비활성화**: 빨간색 배경 (`#f8d7da`)

## 주의사항

- 상태 변경은 토글 방식으로 작동합니다 (활성 → 정지 → 비활성화 순환)
- 비활성화된 사용자는 목록에 표시되지 않습니다 (isDeleted = true)
- 일괄 정지는 선택된 모든 사용자를 "정지" 상태로 변경합니다

## 향후 개선사항

1. ✅ 로그인 시 정지 상태 체크 (정지된 사용자 로그인 차단)
2. ✅ 예약 내역 조회 기능
3. ✅ 결제 내역 조회 기능
4. ✅ 관리자 메모 저장 기능
5. ✅ 엑셀 다운로드 기능
6. ✅ 일괄 활성화 기능
