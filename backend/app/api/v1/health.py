from fastapi import APIRouter, status, HTTPException
from app.core.database import db_manager
from app.domain.models import HealthResponse

router = APIRouter(prefix="/health", tags=["Health & DB Connectivity"])

@router.get("", response_model=HealthResponse)
async def check_health():
    """
    Check API and CognoDB graph database connectivity.
    Demonstrates graceful error handling when database is unreachable.
    """
    health_data = await db_manager.check_health()
    if not health_data.get("connected"):
        # Return 503 Service Unavailable with friendly detail rather than crashing
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "message": "CognoDB database is unreachable. Please verify environment credentials and network connection.",
                "database": health_data
            }
        )
    return health_data
