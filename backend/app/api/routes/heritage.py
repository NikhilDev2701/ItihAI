"""
Heritage Sites API Routes for ItihAI.
Provides discovery, search, multi-faceted filtering, pagination, and detail endpoints
backed by PostgreSQL.
"""

import math
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from sqlalchemy.exc import SQLAlchemyError

from app.database.database import get_db
from app.database.models import HeritageSite
from app.schemas.heritage import (
    HeritageSiteResponse,
    HeritageListResponse,
    HeritageFilterResponse,
)

router = APIRouter()


@router.get("/filters", response_model=HeritageFilterResponse, summary="Get dynamic filter options")
def get_heritage_filters(db: Session = Depends(get_db)) -> HeritageFilterResponse:
    """
    Retrieve dynamically populated distinct filter categories (states, regions,
    heritage types, historical periods) from active database records.
    """
    try:
        # Fetch distinct non-null, non-empty values
        states = [
            r[0] for r in db.query(HeritageSite.state).distinct().order_by(HeritageSite.state.asc()).all()
            if r[0]
        ]
        regions = [
            r[0] for r in db.query(HeritageSite.region).distinct().order_by(HeritageSite.region.asc()).all()
            if r[0]
        ]
        heritage_types = [
            r[0] for r in db.query(HeritageSite.heritage_type).distinct().order_by(HeritageSite.heritage_type.asc()).all()
            if r[0]
        ]
        historical_periods = [
            r[0] for r in db.query(HeritageSite.historical_period).distinct().order_by(HeritageSite.historical_period.asc()).all()
            if r[0]
        ]

        return HeritageFilterResponse(
            states=states,
            regions=regions,
            heritage_types=heritage_types,
            historical_periods=historical_periods,
        )
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable while fetching filters.",
        ) from None


@router.get("", response_model=HeritageListResponse, summary="List and search heritage sites with pagination")
@router.get("/", response_model=HeritageListResponse, summary="List and search heritage sites with pagination", include_in_schema=False)
def list_heritage_sites(
    search: Optional[str] = Query(None, description="Case-insensitive search query across name, location, state, region, description, and type"),
    state: Optional[str] = Query(None, description="Filter by Indian State (e.g. 'Uttar Pradesh', 'West Bengal')"),
    region: Optional[str] = Query(None, description="Filter by Region (e.g. 'North India', 'East India', 'South India')"),
    heritage_type: Optional[str] = Query(None, description="Filter by Heritage Type (e.g. 'UNESCO World Heritage', 'Temples & Spiritual', 'Forts & Palaces')"),
    historical_period: Optional[str] = Query(None, description="Filter by Historical Period (e.g. 'Ancient', 'Medieval & Mughal', 'Colonial')"),
    page: int = Query(1, ge=1, description="Page number (minimum 1)"),
    limit: int = Query(10, ge=1, le=50, description="Items per page (between 1 and 50)"),
    db: Session = Depends(get_db),
) -> HeritageListResponse:
    """
    Retrieve paginated Indian heritage sites from PostgreSQL.
    Supports comprehensive search and multi-criteria combinable filters.
    """
    try:
        query = db.query(HeritageSite)

        # 1. Full-text search across relevant fields
        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    HeritageSite.name.ilike(term),
                    HeritageSite.location.ilike(term),
                    HeritageSite.state.ilike(term),
                    HeritageSite.region.ilike(term),
                    HeritageSite.description.ilike(term),
                    HeritageSite.historical_overview.ilike(term),
                    HeritageSite.heritage_type.ilike(term),
                    HeritageSite.historical_period.ilike(term),
                )
            )

        # 2. State filter
        if state and state != "All":
            query = query.filter(HeritageSite.state == state)

        # 3. Region filter
        if region and region != "All":
            query = query.filter(HeritageSite.region == region)

        # 4. Heritage category/type filter
        if heritage_type and heritage_type != "All":
            query = query.filter(HeritageSite.heritage_type == heritage_type)

        # 5. Historical period filter
        if historical_period and historical_period != "All":
            query = query.filter(HeritageSite.historical_period.ilike(f"%{historical_period}%"))

        # Calculate total matching count
        total = query.count()
        total_pages = math.ceil(total / limit) if total > 0 else 0

        # Fetch paginated items ordered by ID
        items = query.order_by(HeritageSite.id.asc()).offset((page - 1) * limit).limit(limit).all()

        return HeritageListResponse(
            items=items,
            page=page,
            limit=limit,
            total=total,
            total_pages=total_pages,
        )
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable while fetching heritage sites.",
        ) from None


@router.get("/slug/{slug}", response_model=HeritageSiteResponse, summary="Get heritage site by URL slug")
def get_heritage_site_by_slug(
    slug: str,
    db: Session = Depends(get_db),
) -> HeritageSiteResponse:
    """
    Retrieve full heritage details by human-readable URL slug (e.g. 'taj-mahal', 'qutub-minar').
    """
    try:
        site = db.query(HeritageSite).filter(HeritageSite.slug == slug).first()
        if not site:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Heritage site with slug '{slug}' not found.",
            )
        return site
    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable.",
        ) from None


@router.get("/{id_or_slug}", response_model=HeritageSiteResponse, summary="Get heritage site by ID or slug")
def get_heritage_site(
    id_or_slug: str,
    db: Session = Depends(get_db),
) -> HeritageSiteResponse:
    """
    Retrieve full historical, architectural, and visiting details for a heritage site by integer ID or string slug.
    """
    try:
        if id_or_slug.isdigit():
            site = db.query(HeritageSite).filter(HeritageSite.id == int(id_or_slug)).first()
        else:
            site = db.query(HeritageSite).filter(HeritageSite.slug == id_or_slug).first()

        if not site:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Heritage site '{id_or_slug}' not found.",
            )

        return site
    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable.",
        ) from None
