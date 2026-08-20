"""
PostgreSQL Database Setup & Session Management for ItihAI.
Uses SQLAlchemy 2.0 with Psycopg 3 driver.
"""

import logging
from typing import Generator, Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)

# Connection arguments (e.g. quick timeout when host is down)
connect_args = {}
if "postgres" in settings.DATABASE_URL:
    connect_args = {"connect_timeout": 3}

# Create PostgreSQL database engine with connection pooling and pre-ping
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    future=True,
)

# Session factory for DB operations
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True,
)

# Declarative Base for SQLAlchemy Models
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency yielding a database session.
    Automatically handles cleanup and closing.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_database_connection() -> Tuple[bool, str]:
    """
    Safely tests the database connection without exposing internal credentials.
    Returns (is_connected, message).
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            return True, "Database connection active"
    except Exception as exc:
        logger.warning("Database connection check failed: %s", exc)
        return False, "Database unavailable or connection failed"
