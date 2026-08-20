"""
Languages API Routes.
Provides endpoints for querying supported international and Indian languages from the database.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.database.database import get_db
from app.database.models import Language
from app.schemas.language import LanguageResponse

router = APIRouter()


@router.get("", response_model=List[LanguageResponse], summary="List all supported languages")
@router.get("/", response_model=List[LanguageResponse], summary="List all supported languages", include_in_schema=False)
def list_languages(
    active_only: bool = True,
    db: Session = Depends(get_db),
) -> List[LanguageResponse]:
    """
    Retrieve all supported languages from PostgreSQL database.
    By default, returns active languages.
    """
    try:
        query = db.query(Language)
        if active_only:
            query = query.filter(Language.is_active.is_(True))
        languages = query.order_by(Language.is_default.desc(), Language.id.asc()).all()
        return languages
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable while fetching languages.",
        ) from None
