"""
Pydantic schemas for Cultural Q&A, Translation & Audio Guide interactions.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class CulturalQueryRequest(BaseModel):
    """User inquiry about Indian heritage, culture, or historical site."""
    query: str = Field(..., min_length=2, max_length=1000, description="The tourist's question")
    site_slug: Optional[str] = Field(None, description="Specific monument/site context")
    language: str = Field("en", description="Target response language (e.g. en, hi, bn, fr, es)")


class CulturalQueryResponse(BaseModel):
    """AI cultural guide response with citations and audio readiness."""
    query: str
    response_text: str
    language: str
    context_sources: List[str] = []
    audio_available: bool = False


class TranslationRequest(BaseModel):
    """Request for translating local phrases or historical explanations."""
    text: str = Field(..., min_length=1, max_length=2000)
    source_language: str = Field("en", description="Original language")
    target_language: str = Field("hi", description="Target language")


class TranslationResponse(BaseModel):
    """Translated text result."""
    original_text: str
    translated_text: str
    source_language: str
    target_language: str


class TTSRequest(BaseModel):
    """Request for generating speech audio for an explanation."""
    text: str = Field(..., min_length=1, max_length=2000)
    language: str = Field("en", description="Voice language code")
    voice_gender: Optional[str] = "neutral"


class TTSResponse(BaseModel):
    """Generated audio stream URL or base64."""
    audio_url: Optional[str] = None
    duration_seconds: Optional[float] = None
    language: str
