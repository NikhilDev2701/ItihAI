"""
FastAPI Dependency Injection helpers.
Provides database sessions, service singletons, and validation hooks.
"""

from app.database.database import get_db
from app.services.ai_service import ai_service, AIService
from app.services.rag_service import rag_service, RAGService
from app.services.translation_service import translation_service, TranslationService
from app.services.tts_service import tts_service, TTSService


def get_ai_service() -> AIService:
    return ai_service


def get_rag_service() -> RAGService:
    return rag_service


def get_translation_service() -> TranslationService:
    return translation_service


def get_tts_service() -> TTSService:
    return tts_service
