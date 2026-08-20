"""
Application Settings & Environment Configuration for ItihAI.
Uses Pydantic Settings for type safety and environment variable validation.
"""

from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """ItihAI Core Settings."""

    # Application Configuration
    APP_NAME: str = "ItihAI"
    APP_VERSION: str = "0.3.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_PREFIX: str = "/api"

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        return []

    # Database Configuration (PostgreSQL with psycopg 3)
    # Never hardcode credentials in code. Load from DATABASE_URL environment variable.
    DATABASE_URL: str = "postgresql+psycopg://postgres:password@localhost:5432/itihai"

    # Google Gemini AI Guide Configuration (Phase 5)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.6-flash"
    GEMINI_TEMPERATURE: float = 0.4
    GEMINI_MAX_TOKENS: int = 1024

    # External AI & Heritage Service Placeholders (For Phase 6-8)
    LLM_PROVIDER: str = "gemini"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gemini-3.6-flash"

    TRANSLATION_PROVIDER: str = "google_translate"
    TRANSLATION_API_KEY: str = ""

    TTS_PROVIDER: str = "elevenlabs"
    TTS_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
