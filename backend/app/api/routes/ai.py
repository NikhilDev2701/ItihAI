"""
FastAPI Route for ItihAI AI Guide Service (Phase 5).
Handles conversational cultural narration and landmark grounding via PostgreSQL.
"""

import json
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import HeritageSite
from app.schemas.ai import AIChatRequest, AIChatResponse
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

router = APIRouter()


def build_heritage_context(site: HeritageSite) -> str:
    """Formats structured PostgreSQL heritage attributes into a clean context prompt for Gemini."""
    lines = [
        f"Landmark: {site.name}",
        f"Location: {site.location}, {site.state}, {site.country} ({site.region or 'India'})",
        f"Historical Period: {site.historical_period}",
        f"Heritage Classification: {site.heritage_type}",
    ]

    if site.description:
        lines.append(f"Brief Summary: {site.description}")
    if site.historical_overview:
        lines.append(f"Historical Overview: {site.historical_overview}")
    if site.cultural_significance:
        lines.append(f"Cultural Significance: {site.cultural_significance}")
    if site.architecture:
        lines.append(f"Architectural Details: {site.architecture}")

    # Format interesting facts
    if site.interesting_facts:
        facts = site.interesting_facts if isinstance(site.interesting_facts, list) else json.loads(site.interesting_facts)
        if facts:
            lines.append("Interesting Historical Facts:")
            for fact in facts[:4]:
                lines.append(f" - {fact}")

    # Format local traditions and etiquette
    if site.local_traditions:
        traditions = site.local_traditions if isinstance(site.local_traditions, list) else json.loads(site.local_traditions)
        if traditions:
            lines.append("Local Customs & Etiquette:")
            for t in traditions[:3]:
                if isinstance(t, dict):
                    title = t.get("title", "")
                    desc = t.get("description", "")
                    tip = t.get("tip", "")
                    lines.append(f" - {title}: {desc} (Tourist Tip: {tip})")
                else:
                    lines.append(f" - {t}")

    # Format visitor practical information
    if site.visitor_information:
        vinfo = site.visitor_information if isinstance(site.visitor_information, dict) else json.loads(site.visitor_information)
        if vinfo:
            lines.append("Visitor Guidelines:")
            if "hours" in vinfo:
                lines.append(f" - Visiting Hours: {vinfo['hours']}")
            if "dressCode" in vinfo:
                lines.append(f" - Dress Code: {vinfo['dressCode']}")
            if "photography" in vinfo:
                lines.append(f" - Photography Rules: {vinfo['photography']}")
            if "bestTime" in vinfo:
                lines.append(f" - Recommended Season: {vinfo['bestTime']}")

    return "\n".join(lines)


@router.post(
    "/chat",
    response_model=AIChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Chat with ItihAI Cultural Guide",
    description="Ask questions about Indian heritage, monuments, history, architecture, and cultural traditions.",
)
async def chat_with_ai(
    request: AIChatRequest,
    db: Session = Depends(get_db),
):
    """
    Handles user chat interaction with ItihAI cultural guide.
    Optionally retrieves structured PostgreSQL context for the specified heritage landmark.
    """
    logger.info("AI chat request received (language: %s, site_id: %s)", request.language, request.heritage_site_id)

    heritage_context: Optional[str] = None
    site_name: Optional[str] = None

    if request.heritage_site_id is not None:
        site = db.query(HeritageSite).filter(HeritageSite.id == request.heritage_site_id).first()
        if not site:
            logger.warning("Requested heritage site ID %d not found in database.", request.heritage_site_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Heritage landmark with ID {request.heritage_site_id} was not found.",
            )
        site_name = site.name
        heritage_context = build_heritage_context(site)

    # Generate response via Gemini AI service
    response_text = await ai_service.generate_response(
        message=request.message,
        language=request.language,
        context=heritage_context,
    )

    return AIChatResponse(
        response=response_text,
        language=request.language,
        heritage_site_name=site_name,
    )
