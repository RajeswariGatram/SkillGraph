from fastapi import APIRouter, Depends, HTTPException
from app.core.database import db_manager
from app.repositories.graph_repository import GraphRepository
from app.domain.models import GraphDataResponse

router = APIRouter(prefix="/graph", tags=["Graph Visualization"])

def get_repository() -> GraphRepository:
    return GraphRepository(db_manager)

@router.get("/visualization", response_model=GraphDataResponse)
async def get_graph_data(repo: GraphRepository = Depends(get_repository)):
    """
    Fetch the complete interactive node/relationship graph structure formatted for vis-network.
    """
    try:
        data = await repo.get_full_graph()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load graph visualization payload: {str(e)}")
