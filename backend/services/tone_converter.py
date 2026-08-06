import os
from dotenv import load_dotenv
from langchain_upstage import ChatUpstage
from langchain_core.prompts import ChatPromptTemplate
from backend.prompts.templates import get_system_prompt

# .env 파일 로드
load_dotenv()

def convert_tone(text: str, target_audience: str) -> str:
    """
    입력받은 원문 텍스트를 수신 대상에 맞춰 비즈니스 어조로 변환합니다.
    """
    api_key = os.getenv("UPSTAGE_API_KEY")
    if not api_key:
        raise ValueError("UPSTAGE_API_KEY가 .env 파일에 설정되어 있지 않습니다.")

    system_prompt = get_system_prompt(target_audience)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{text}")
    ])
    
    # Upstage Solar-Pro 모델 초기화
    llm = ChatUpstage(
        api_key=api_key,
        model="solar-pro"
    )
    
    chain = prompt | llm
    result = chain.invoke({"text": text})
    
    # 반환된 메시지 내용 추출
    converted_text = str(result.content).strip()
    return converted_text
