# 요양병원 정보 비교 서비스

## 프로젝트 개요
국민건강보험공단의 **장기요양기관 시설별 현황** 데이터를 기반으로 요양병원 정보를 탐색·비교하고, Rasa 기반 챗봇으로 자연어 검색을 지원하는 웹 서비스입니다. 사용자는 원하는 조건(지역, 항목 등)을 걸어 병원을 비교하고, 챗봇에게 질의해 즉시 결과를 받을 수 있습니다.

- 프론트엔드: HTML, CSS, JavaScript, Figma  
- 백엔드: Spring Boot, Spring Security, Oracle SQL, JDBC  
- AI 챗봇: Python 3.10, Flask, Rasa(https://github.com/RasaHQ/rasa)
- 데이터 출처: [국민건강보험공단 장기요양기관 시설별 현황](https://www.data.go.kr/data/15124763/fileData.do)

---

## 팀 구성
| 이름 | 역할 |
|------|------|
| 이상혁 | 팀장 · 백엔드 |
| 강유경 | 기획 · 백엔드 |
| 강효조 | 백엔드 · 데이터 전처리 |
| 정민서 | 프론트엔드 · AI 챗봇 |
| 김현아 | 프론트엔드 · 디자인 |

---

## 기술 스택 및 개발 환경
- 협업: Notion, GitHub  
- 프론트엔드: VS Code, HTML/CSS/JS, Figma  
- 백엔드: IntelliJ, Spring Boot, Spring Security, Oracle SQL, JDBC  
- AI: Python 3.10, Flask, Rasa  
- 데이터: 국민건강보험공단 공개 CSV(정기 갱신)

---

## 주요 기능
- **자연어 검색**: “강원도에서 가장 저렴한 요양병원 추천”, “병상 수 많은 곳” 등 질의에 대한 챗봇 응답
- **조건 필터링**: 지역/기관유형/핵심 항목 기반 리스트 정렬·필터
- **비교 보기**: 선택한 병원(최대 3곳)의 핵심 지표를 항목별로 나란히 비교
- **보안**: Spring Security 기반 **세션 인증**(쿠키) 적용
- **데이터 갱신**: 최신 CSV 반영(목표 주기: 월 1회)

---

## 성과 지표(목표) 및 측정 방법
| 구분 | 목표 | 측정 방법 |
|---|---|---|
| 정보 접근성 | 탐색 시간 50% 단축 | 동일 시나리오 기준 작업 시간 전후 비교 |
| 챗봇 정확도 | 85% 이상 | 사전 정의 FAQ·시나리오 세트 정답 매칭율 |
| 비교 기능 활용 | 비교 페이지 이용률 60% 이상 | 세션 대비 비교 페이지 진입 비율 |
| 데이터 최신성 | 월 1회 갱신 | 배포 로그와 데이터 버전 태깅 |
| 확장성 | 신규 기능 3건 이상 | 릴리즈 노트 누적 항목 수 |

> 위 수치는 달성 **목표**이며, 리포트에 측정 기준과 결과를 함께 기록합니다.

---

## 데이터
- 형식: 국민건강보험공단 제공 CSV  
- 활용: 병원 기본 정보 및 주요 지표 파싱 → DB 적재 → API 제공  
- 갱신: 월간 반영(운영 절차 문서화 및 태깅)

---

## 폴더 구조
```text
.
├── backend
│   ├── src
│   │   ├── main
│   │   │   ├── java/com/example/carecompare/...
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── schema.sql
│   ├── pom.xml               # 또는 build.gradle
│   └── Dockerfile
├── frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/         # API 호출 모듈
│   ├── package.json
│   └── Dockerfile
├── chatbot
│   ├── actions/
│   ├── data/
│   │   ├── nlu.yml
│   │   └── stories.yml
│   ├── domain.yml
│   ├── config.yml
│   ├── credentials.yml       # REST 채널 활성화
│   └── Dockerfile
├── data
│   ├── raw/                  # 공단 원본 CSV
│   └── processed/            # 전처리 산출물(예: hospitals.parquet)
├── scripts
│   ├── import_csv_to_oracle.sql
│   └── seed.sql
├── docs
│   └── ERD.png
├── docker-compose.yml
└── README.md
```

---

## API 명세 (요약)

### Base URL
- 로컬: `http://localhost:8080/api`
- 운영: `https://<도메인>/api`

### 인증
- **세션 기반 인증(쿠키)** 사용  
  - 로그인 성공 시 서버가 세션을 생성하고 쿠키로 식별합니다.  
  - CORS 사용 시 `credentials: true` 및 `SameSite`/`Secure` 설정이 필요합니다.
  - API 호출 시 별도의 `Authorization` 헤더가 **필요하지 않습니다**.

### 엔드포인트

#### 1) 병원 목록 조회
```
GET /hospitals
```

**Query Params**
- `q` (string, optional): 자유검색(기관명/주소/키워드)
- `sido` (string, optional): 시/도
- `sigungu` (string, optional): 시/군/구
- `type` (string, optional): 기관유형
- `page` (int, default=0), `size` (int, default=20)
- `sort` (string, default="name,asc")  예) `beds,desc`

**Response (200)**
```json
{
  "content": [
    {
      "id": 12345,
      "name": "가온요양병원",
      "address": "서울특별시 강남구 ...",
      "phone": "02-123-4567",
      "type": "요양병원",
      "beds": 120
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 4213,
  "totalPages": 211
}
```

#### 2) 병원 상세
```
GET /hospitals/{id}
```
**Response (200)**
```json
{
  "id": 12345,
  "name": "가온요양병원",
  "address": "서울특별시 강남구 ...",
  "phone": "02-123-4567",
  "type": "요양병원",
  "beds": 120,
  "metrics": {
    "nurses": 35,
    "caregivers": 40,
    "rooms": 80
  }
}
```

#### 3) 병원 비교 (최대 3개)
```
POST /hospitals/compare
```
**Request**
```json
{ "ids": [12345, 67890, 24680] }
```
**Response (200)**
```json
{
  "compare": [
    { "id": 12345, "name": "가온요양병원", "beds": 120, "nurses": 35, "caregivers": 40 },
    { "id": 67890, "name": "CNK 요양병원", "beds": 150, "nurses": 38, "caregivers": 42 }
  ]
}
```

#### 4) 검색 자동완성
```
GET /search/suggestions?q={keyword}
```
**Response (200)**
```json
["경기도 고양", "부산 부산진구", "강원도 홍천군"]
```

#### 5) 챗봇 프록시
```
POST /chat/query
```
**설명**: 백엔드가 Rasa REST 웹훅(`/webhooks/rest/webhook`)으로 프록시

**Request**
```json
{ "message": "강남 근처 요양병원 추천해줘", "sessionId": "user-123" }
```
**Response (200)**
```json
{
  "answers": [
    "다음이 관련 결과예요: ...",
    "- 기관명: ... / 주소: ... / 전화번호: ..."
  ]
}
```

#### 6) 데이터 버전/갱신 (관리자)
```
GET  /admin/data/version
POST /admin/data/refresh
```
- 역할 기반 접근 제어(RBAC) 필요

> 상세 스키마/에러코드는 `docs/API.md`로 분리하여 관리 권장.

---

## 환경 변수 (.env 예시)

### 백엔드
```ini
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080

ORACLE_URL=jdbc:oracle:thin:@//db-host:1521/XEPDB1
ORACLE_USERNAME=care_user
ORACLE_PASSWORD=care_pass

RASA_BASE_URL=http://localhost:5005
```

### 챗봇(Rasa/Flask)
```ini
RASA_PORT=5005
RASA_MODEL=models
FLASK_PORT=8000
```

### 프론트엔드
```ini
VITE_API_BASE=http://localhost:8080/api
```

---

## 실행 방법

1) 레포지토리 클론
```bash
git clone <레포지토리 URL>
```

2) 백엔드(Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

3) 프론트엔드(정적 서버)
```bash
cd frontend
# Live Server 또는 http-server 등으로 실행
```

4) AI 챗봇(Rasa)
```bash
cd chatbot
rasa train
rasa run actions --port 5055
rasa run --enable-api --cors "*" --port 5005 --model models
```

> 로컬 포트 충돌 시 `.env` 또는 각 서비스 설정에서 포트 변경

---

## 배포 가이드

### 옵션 A) Docker Compose
`docker-compose.yml` 예시:
```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    env_file:
      - ./backend/.env
    ports:
      - "8080:8080"
    depends_on:
      - rasa
    networks: [care-net]

  frontend:
    build: ./frontend
    env_file:
      - ./frontend/.env
    ports:
      - "80:80"
    networks: [care-net]

  rasa:
    build: ./chatbot
    env_file:
      - ./chatbot/.env
    ports:
      - "5005:5005"
    networks: [care-net]

networks:
  care-net:
    driver: bridge
```

> Oracle DB는 사내/클라우드 인스턴스 또는 별도 컨테이너로 운용합니다. JDBC 연결 정보만 주입하면 됩니다.

### 옵션 B) 수동 배포(리눅스)
1. **백엔드**
   - 빌드: `./mvnw -DskipTests package`
   - 실행: `java -jar target/*.jar --spring.profiles.active=prod`
   - 시스템 서비스 등록(systemd) 권장

2. **프론트엔드**
   - 빌드: `npm ci && npm run build`
   - 산출물(`/dist`)을 Nginx 루트에 배치

3. **Nginx 리버스 프록시 예시**
```nginx
server {
  listen 80;
  server_name example.com;

  root /var/www/carecompare;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8080/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /chat/ {
    proxy_pass http://127.0.0.1:5005/;
  }

  location / {
    try_files $uri /index.html;
  }
}
```

4. **환경 구성 체크리스트**
   - [ ] `.env`/`application.yml` 비밀키 분리, Git 미추적
   - [ ] DB 계정 최소 권한 원칙 적용
   - [ ] 헬스체크 엔드포인트(`/actuator/health`) 노출 범위 제한
   - [ ] 로그 로테이션 설정
   - [ ] 세션 타임아웃/쿠키 보안(SameSite, Secure, HttpOnly) 설정

---

## 트러블슈팅
- **CORS 오류**: 백엔드 `CorsConfiguration`에서 프론트 도메인 허용(+ `allowCredentials=true`)
- **한글 깨짐**: 응답 헤더 `Content-Type: application/json; charset=UTF-8` 확인
- **Rasa 연결 실패**: `RASA_BASE_URL`과 방화벽/포트 오픈 상태 확인
- **CSV 스키마 변경**: 파서/매핑 레이어를 스키마 버전별로 분기

---

## 데모 및 저장소
- GitHub: [링크]  https://github.com/mingg01zz/Team-SAGE.git
- 시연 영상: [링크]  https://youtu.be/BcjNaAuBFFU

---

## 라이선스
- 공공데이터 이용약관 및 각 라이브러리 라이선스를 따릅니다.
