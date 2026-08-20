"""
Pydantic schemas for Heritage Site entities, paginated responses, and dynamic filters.
"""

from typing import Optional, List, Any, Dict
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class HeritageSiteBase(BaseModel):
    name: str
    slug: str
    location: str
    state: str
    country: str = "India"
    region: Optional[str] = None
    description: str
    historical_overview: Optional[str] = None
    cultural_significance: Optional[str] = None
    architecture: Optional[str] = None
    historical_period: Optional[str] = None
    heritage_type: Optional[str] = None
    image_url: Optional[str] = None
    
    # Structured fields
    interesting_facts: Optional[List[str]] = None
    local_traditions: Optional[List[Dict[str, Any]]] = None
    nearby_attractions: Optional[List[Dict[str, Any]]] = None
    visitor_information: Optional[Dict[str, Any]] = None
    
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class HeritageSiteCreate(HeritageSiteBase):
    pass


class HeritageSiteResponse(HeritageSiteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class HeritageListResponse(BaseModel):
    """Paginated list of heritage sites."""
    items: List[HeritageSiteResponse]
    page: int = Field(1, ge=1, description="Current page number")
    limit: int = Field(10, ge=1, le=50, description="Items per page")
    total: int = Field(..., ge=0, description="Total matching records")
    total_pages: int = Field(..., ge=0, description="Total available pages")


class HeritageFilterResponse(BaseModel):
    """Dynamic distinct filter criteria retrieved from database."""
    states: List[str] = []
    regions: List[str] = []
    heritage_types: List[str] = []
    historical_periods: List[str] = []
