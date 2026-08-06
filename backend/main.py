import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.routers import convert

app = FastAPI(
    title="업무 말투 변환기 API",
    description="입력 문장을 상황 및 수신 대상에 알맞은 비즈니스 어조로 자동 변환하는 API 서비스",
    version="1.0.0"
)

# CORS 설정 (프론트엔드 통신 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 배포 시 실제 도메인으로 제약 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 헬스 체크 엔드포인트
@app.get("/health", summary="서버 상태 점검")
async def health_check():
    return {"status": "ok"}

# API 라우터 포함
app.include_router(convert.router, prefix="/api")

# 프론트엔드 정적 파일 서비스 (frontend 디렉토리가 존재하는 경우)
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

