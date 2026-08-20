"""
Pydantic schemas for Language entities.
"""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class LanguageBase(BaseModel):
    code: str
    name: str
    native_name: str
    is_active: bool = True
    is_default: bool = False


class LanguageCreate(LanguageBase):
    pass


class LanguageResponse(LanguageBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
