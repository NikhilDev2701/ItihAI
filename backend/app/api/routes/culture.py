"""
Culture, Translation, Q&A, and Voice API Routes.
"""

from typing import Dict
from fastapi import APIRouter, Depends
from app.schemas.culture import (
    CulturalQueryRequest,
    CulturalQueryResponse,
    TranslationRequest,
    TranslationResponse,
    TTSRequest,
    TTSResponse,
)
from app.api.dependencies import (
    get_ai_service,
    get_rag_service,
    get_translation_service,
    get_tts_service,
    AIService,
    RAGService,
    TranslationService,
    TTSService,
)

router = APIRouter()


@router.post("/ask", response_model=CulturalQueryResponse)
async def ask_cultural_guide(
    request: CulturalQueryRequest,
    ai: AIService = Depends(get_ai_service),
    rag: RAGService = Depends(get_rag_service),
) -> CulturalQueryResponse:
    """
    Submit a query to the AI Cultural Guide.
    Retrieves verified heritage context and produces a culturally nuanced explanation.
    """
    context = await rag.retrieve_relevant_context(request.query, request.site_slug)
    explanation = await ai.generate_explanation(
        query=request.query,
        context_documents=[c["excerpt"] for c in context],
        target_language=request.language,
    )
    return CulturalQueryResponse(
        query=request.query,
        response_text=explanation,
        language=request.language,
        context_sources=[c["source"] for c in context],
        audio_available=True,
    )


@router.post("/translate", response_model=TranslationResponse)
async def translate_phrase(
    request: TranslationRequest,
    translation: TranslationService = Depends(get_translation_service),
) -> TranslationResponse:
    """
    Translate essential travel phrases or cultural explanations into target language.
    """
    translated = await translation.translate_text(
        text=request.text,
        source_language=request.source_language,
        target_language=request.target_language,
    )
    return TranslationResponse(
        original_text=request.text,
        translated_text=translated,
        source_language=request.source_language,
        target_language=request.target_language,
    )


@router.get("/languages", response_model=Dict[str, str])
def get_supported_languages(
    translation: TranslationService = Depends(get_translation_service),
) -> Dict[str, str]:
    """
    Get list of supported tour languages.
    """
    return translation.get_supported_languages()


@router.post("/tts", response_model=TTSResponse)
async def synthesize_speech(
    request: TTSRequest,
    tts: TTSService = Depends(get_tts_service),
) -> TTSResponse:
    """
    Convert textual cultural explanation into spoken audio guide narration.
    """
    result = await tts.generate_speech(
        text=request.text,
        language=request.language,
    )
    return TTSResponse(
        audio_url=result.get("audio_url"),
        duration_seconds=result.get("duration_seconds"),
        language=request.language,
    )
