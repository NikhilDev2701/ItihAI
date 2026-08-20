"""
Main FastAPI Application Entrypoint for ItihAI.
"Understand the language, discover the culture"
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import api_router
from app.database.database import check_database_connection
from app.schemas.health import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events management for startup and shutdown."""
    print(f"[*] Starting {settings.APP_NAME} v{settings.APP_VERSION} in {settings.APP_ENV} mode...")
    db_ok, msg = check_database_connection()
    if db_ok:
        print("[+] PostgreSQL database connected successfully.")
    else:
        print(f"[-] PostgreSQL connection status: {msg}")
    yield
    print(f"[*] Shutting down {settings.APP_NAME}...")


def create_application() -> FastAPI:
    """Factory function to configure and initialize the FastAPI app."""
    application = FastAPI(
        title="ItihAI API",
        description="AI-Guided Multilingual Heritage Tour Platform API for Indian Culture & Heritage.",
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # Configure CORS for Vite frontend origin
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routes under /api
    application.include_router(api_router, prefix="/api")

    # Root endpoint
    @application.get("/", tags=["Root"])
    def root():
        return {
            "name": "ItihAI API",
            "tagline": "Understand the language, discover the culture",
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "health": "/api/health",
        }

    return application


app = create_application()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
