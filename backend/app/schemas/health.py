"""
Health check schema for ItihAI API.
"""

from typing import Optional
from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str
    service: str
    database: Optional[str] = None
    environment: Optional[str] = None
    version: Optional[str] = None
