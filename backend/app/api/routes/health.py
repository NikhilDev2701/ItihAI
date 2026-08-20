"""
Health check endpoints for monitoring and database status verification.
"""

from fastapi import APIRouter
from app.core.config import settings
from app.database.database import check_database_connection
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Service and database health check")
def health_check() -> HealthResponse:
    """
    Health check endpoint to verify that the ItihAI API service and database connectivity are operational.
    """
    db_ok, db_msg = check_database_connection()
    return HealthResponse(
        status="ok" if db_ok else "degraded",
        service="ItihAI API",
        database="connected" if db_ok else "disconnected",
        environment=settings.APP_ENV,
        version=settings.APP_VERSION,
    )
