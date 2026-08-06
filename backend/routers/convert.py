from fastapi import APIRouter, HTTPException, status
from backend.models.schemas import ConvertRequest, ConvertResponse
from backend.services.tone_converter import convert_tone

router = APIRouter()

@router.post("/convert", response_model=ConvertResponse, summary="업무 말투 변환 API")
async def convert_text(request: ConvertRequest):
    """
    원문 텍스트와 수신 대상을 전달받아 상황에 맞는 비즈니스 말투로 변환합니다.
    """
    if not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="변환할 text 필드는 필수입니다."
        )

    try:
        converted_text = convert_tone(request.text, request.target_audience)
        return ConvertResponse(
            converted_text=converted_text,
            target_audience=request.target_audience,
            original_text=request.text
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"LLM API 호출 중 오류가 발생했습니다: {str(e)}"
        )
