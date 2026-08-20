"""
SQLAlchemy ORM Models for ItihAI.
Defines database entities for heritage sites and supported languages.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, JSON
from app.database.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class HeritageSite(Base):
    """Represents a monument, temple, fortress, or cultural heritage landmark."""

    __tablename__ = "heritage_sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    location = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False, index=True)
    country = Column(String(100), nullable=False, default="India")
    region = Column(String(100), nullable=True, index=True)  # e.g., 'North India', 'East India', 'South India', 'West India', 'Central India'
    
    # Detailed heritage content (Text for long descriptions)
    description = Column(Text, nullable=False)
    historical_overview = Column(Text, nullable=True)
    cultural_significance = Column(Text, nullable=True)
    architecture = Column(Text, nullable=True)
    historical_period = Column(String(150), nullable=True, index=True)
    heritage_type = Column(String(100), nullable=True, index=True)
    image_url = Column(String(500), nullable=True)
    
    # Structured rich attributes
    interesting_facts = Column(JSON, nullable=True)      # List of strings
    local_traditions = Column(JSON, nullable=True)       # List of {title, description, tip}
    nearby_attractions = Column(JSON, nullable=True)     # List of {name, distance, description}
    visitor_information = Column(JSON, nullable=True)    # Dict with {bestTime, hours, entryFee, dressCode, photography}
    
    # Coordinates
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)


class Language(Base):
    """Represents supported international and Indian regional languages."""

    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, index=True, nullable=False)  # e.g., 'en', 'fr', 'hi'
    name = Column(String(100), nullable=False)  # e.g., 'English', 'French'
    native_name = Column(String(100), nullable=False)  # e.g., 'English', 'Français', 'हिन्दी'
    is_active = Column(Boolean, default=True, nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
