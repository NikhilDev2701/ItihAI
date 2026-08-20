"""API router aggregation."""

from fastapi import APIRouter
from app.api.routes.health import router as health_router
from app.api.routes.heritage import router as heritage_router
from app.api.routes.languages import router as languages_router
from app.api.routes.culture import router as culture_router
from app.api.routes.ai import router as ai_router

api_router = APIRouter()

# Register routes
api_router.include_router(health_router, tags=["Health"])
api_router.include_router(ai_router, prefix="/ai", tags=["AI Guide"])
api_router.include_router(heritage_router, prefix="/heritage", tags=["Heritage Sites"])
api_router.include_router(languages_router, prefix="/languages", tags=["Languages"])
api_router.include_router(culture_router, prefix="/culture", tags=["Culture & Translation"])
