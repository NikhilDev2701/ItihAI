"""
Security, Authentication & Sanitization Helpers.
"""

import re
from typing import Optional


def sanitize_input(text: str) -> str:
    """Basic input sanitization to strip dangerous control characters."""
    if not text:
        return ""
    # Strip null bytes and non-printable control characters
    return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text.strip())


def validate_language_code(lang_code: str) -> bool:
    """Validate ISO language code against supported formats."""
    return bool(re.match(r"^[a-z]{2}(-[A-Z]{2})?$", lang_code))
