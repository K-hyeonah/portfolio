# 정확도 향상 패치 (actions.py 교체)

## 적용 방법
1) 압축에서 `rasa_patch_precise/actions.py` 파일을 꺼내서
2) 기존 프로젝트의 `rasa-bot/actions/actions.py` 를 **덮어쓰기** 합니다.
3) Rasa **액션 서버만 재시작** 하면 됩니다. (학습은 다시 안 해도 됩니다)

### 재시작 순서 (CMD)
```
cd rasa-bot
call .venv\Scripts\activate.bat
taskkill /fi "WINDOWTITLE eq Rasa Actions (5055)" /f
rasa run actions --port 5055
```

### 사용 예시
- `서울 요양원` → 서울 주소/기관 먼저 우선
- `가장 저렴한 요양원` → 요금/월비용 추정치가 있는 항목부터 **낮은 순**
- `병상 많은 곳` → 병상/정원 **내림차순**
