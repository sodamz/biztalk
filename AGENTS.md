# AGENTS.md — Antigravity 개발 지침 및 프로젝트 개요

이 문서는 **업무 말투 변환기 (`biztalk_antigravity`)** 프로젝트를 진행할 때, AI 에이전트(Google Antigravity)가 준수해야 하는 개발 원칙, 지침, 그리고 프로젝트 개요를 정해둔 가이드라인입니다.

---

## 1. 프로젝트 개요 (Project Overview)

- **프로젝트명**: 업무 말투 변환기 (`biztalk_antigravity`)
- **목적**: 작성하고자 하는 메시지와 수신 대상을 입력받아 상황에 적합한 업무용 어조(비즈니스 언어)로 자동 변환하는 원데이(One Day) 웹 서비스
- **대상 사용자**: 신입 사원, 실무 담당자 등 비즈니스 커뮤니케이션에 도움이 필요한 이용자
- **기술 스택**:
  - **백엔드**: Python 3.11+ / FastAPI / Uvicorn / LangChain (`langchain-upstage`) / Pydantic
  - **의존성 & 가상환경 관리**: `uv` (`uv venv`, `uv pip`, `uv run`)
  - **AI 모델**: Upstage `Solar-Pro3`
  - **프론트엔드**: HTML5 / CSS3 / JavaScript (ES6+, Vanilla JS)
  - **환경 관리**: `python-dotenv` (`.env`)
  - **버전 관리 및 배포**: Git, GitHub, Vercel

---

## 2. 프로젝트 디렉토리 구조 (Directory Structure)

```text
biztalk_antigravity/
├── .agents/                    # 에이전트 설정 및 MCP 모듈
├── backend/                    # FastAPI 백엔드
│   ├── main.py                 # FastAPI 앱 및 CORS, Static 라우팅 설정
│   ├── routers/
│   │   └── convert.py          # /api/convert 라우터
│   ├── services/
│   │   └── tone_converter.py   # LangChain + Upstage Solar-Pro3 연동 로직
│   ├── prompts/
│   │   └── templates.py        # 수신 대상별 시스템 프롬프트 템플릿
│   ├── models/
│   │   └── schemas.py          # Pydantic 요청/응답 스키마
│   ├── .env                    # API 키 (Git 관리 대상 제외)
│   ├── .env.example            # 환경 변수 템플릿
│   └── requirements.txt        # 백엔드 의존성 목록
├── frontend/                   # 프론트엔드 소스
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── .env                        # 루트 환경 변수 (UPSTAGE_API_KEY)
├── .gitignore
├── PRD_업무말투변환기.md        # 제품 요구사항 명세서
├── 개요서_업무말투변환기.md      # 프로그램 전체 개요서
└── AGENTS.md                   # 에이전트 지침 문서 (본 파일)
```

---

## 3. 바이브 코딩 3원칙 (Vibe Coding Principles)

Antigravity는 본 프로젝트를 수행할 때 아래 **3가지 핵심 개발 원칙**을 엄격히 준수합니다.

### 1) 원칙 1. 완료 기준을 먼저 정의하라
- 작업 시작 전 PRD의 **완료 체크리스트** 및 요구사항을 명확히 확인하고 범위 내 작업만 진행합니다.
- 승인되지 않은 추측성 기능(로그인, 회원가입, DB 연동, 과도한 옵션 등)을 임의로 추가하지 않습니다.

### 2) 원칙 2. 조사 먼저, 구현 나중
- 새로운 라이브러리 연동(Upstage Solar-Pro3, LangChain 등) 시 공식 문서와 연동 방식을 먼저 파악합니다.
- 패키지 설치 시 `uv` 기반 명령어(`uv pip install`, `uv add`)를 적극 사용합니다.

### 3) 원칙 3. 버그는 분석 먼저, 수정 나중
- 에러 발생 시 원인 분석(Root Cause)을 진행하고 설명한 후, 사용자와 함께 단계적으로 해결책을 적용합니다.
- 증상만 가리는 임시 방편(예: try-except 소환, 테스트 삭제, 더미 데이터 반환 등)을 사용하지 않습니다.

---

## 4. Antigravity 개발 지침 & 규칙 (Agent Rules)

### 4-1. 의존성 및 패키지 관리 (`uv` 도구 활용)
- 환경 관리 및 패키지 설치는 **`uv`**를 우선적으로 사용합니다.
  - 가상환경 생성: `uv venv`
  - 의존성 설치: `uv pip install -r backend/requirements.txt` 또는 `uv pip install 패키지명`
  - 서버 실행 및 명령어 수행: `uv run uvicorn main:app --reload`

### 4-2. 🚫 절대 금지 행동 (Never Do)
- **.env 및 민감 정보 접근/수정/출력 금지**: `.env` 파일의 API 키나 비밀번호를 절대 텍스트로 노출하거나 무단 수정하지 않습니다.
- **파괴적 Git 명령 금지**: `git push --force`, `git reset --hard`, `git clean -fd` 등 비가역적 Git 명령어를 금지합니다.
- **자동 커밋/푸시 금지**: 사용자의 명시적 승인 없이 `git commit` 및 `git push`를 실행하지 않습니다.
- **범위 외 파일 변경 금지**: 프로젝트 루트 외부의 파일에 접근하거나 프로젝트와 무관한 시스템 설정을 변경하지 않습니다.

### 4-3. API 및 기능 명세 준수
- **POST `/api/convert`**:
  - 요청: `{ "text": "...", "target_audience": "boss" | "colleague" | "client" | "team" }`
  - 응답: `{ "converted_text": "...", "target_audience": "...", "original_text": "..." }`
- **GET `/health`**: 백엔드 상태 점검용 엔드포인트 유지
