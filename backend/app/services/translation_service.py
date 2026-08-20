"""
Multilingual Translation Service Interface & Placeholder.
Supports English, Hindi, Bengali initially, and extensible for European & Asian languages.
"""

from typing import List, Dict


class TranslationService:
    """
    Service interface for text & phrase translations.
    External Translation API integration will be implemented in Phase 7.
    """

    SUPPORTED_LANGUAGES: Dict[str, str] = {
        "en": "English",
        "hi": "Hindi (हिंदी)",
        "bn": "Bengali (বাংলা)",
        "fr": "French (Français)",
        "de": "German (Deutsch)",
        "es": "Spanish (Español)",
        "ja": "Japanese (日本語)",
        "it": "Italian (Italiano)",
    }

    async def translate_text(
        self,
        text: str,
        source_language: str = "en",
        target_language: str = "hi",
    ) -> str:
        """
        Translates text from source to target language.
        (Placeholder for Phase 1).
        """
        target_name = self.SUPPORTED_LANGUAGES.get(target_language, target_language)
        return f"[{target_name} Translation Placeholder for: '{text}']"

    def get_supported_languages(self) -> Dict[str, str]:
        """Returns list of supported language codes and names."""
        return self.SUPPORTED_LANGUAGES


translation_service = TranslationService()
