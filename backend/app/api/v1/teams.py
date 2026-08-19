from fastapi import APIRouter, Depends, HTTPException, Body, Query
from typing import List, Dict, Any
from app.core.database import db_manager
from app.repositories.graph_repository import GraphRepository

router = APIRouter(prefix="/teams", tags=["Team Assembler & Knowledge Silos"])

def get_repository() -> GraphRepository:
    return GraphRepository(db_manager)

@router.post("/assemble")
async def assemble_optimal_team(
    required_skills: List[str] = Body(..., example=["FastAPI", "React.js", "Cypher & CognoDB"]),
    team_size: int = Query(2, ge=1, le=10, description="Target team size (1 to 10 members)"),
    repo: GraphRepository = Depends(get_repository)
):
    """
    Assemble optimal project teams by matching required skills across employees.
    """
    if not required_skills:
        raise HTTPException(status_code=400, detail="At least 1 required skill must be specified.")
    
    try:
        recommendations = await repo.assemble_optimal_team(required_skills, team_size=team_size)
        return {
            "requested_skills": required_skills,
            "team_size": team_size,
            "total_matches": len(recommendations),
            "recommended_partnerships": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Team assembly Cypher query failed: {str(e)}")

@router.get("/knowledge-silos")
async def get_knowledge_silos(repo: GraphRepository = Depends(get_repository)):
    """
    GRAPH ANALYTICS API:
    Identify departments with critical skills where only 1 employee is the sole expert (Single Point of Failure).
    """
    try:
        silos = await repo.find_knowledge_silos()
        return {
            "total_silos": len(silos),
            "silos": silos
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Knowledge silos Cypher analytics failed: {str(e)}")
