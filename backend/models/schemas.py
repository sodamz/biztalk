from pydantic import BaseModel, Field
from typing import Literal

# 수신 대상 타입 지정 (boss: 상사/임원, colleague: 타팀 동료, client: 고객/외부, team: 팀 내 동료)
TargetAudience = Literal["boss", "colleague", "client", "team"]

class ConvertRequest(BaseModel):
    text: str = Field(..., min_length=1, description="변환할 원문 텍스트")
    target_audience: TargetAudience = Field(..., description="수신 대상 (boss, colleague, client, team)")

class ConvertResponse(BaseModel):
    converted_text: str = Field(..., description="변환된 업무용 텍스트")
    target_audience: str = Field(..., description="수신 대상")
    original_text: str = Field(..., description="입력된 원문 텍스트")
