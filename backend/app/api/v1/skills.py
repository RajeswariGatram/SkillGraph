from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Dict, Any
import uuid
from app.core.database import db_manager
from app.repositories.graph_repository import GraphRepository
from app.domain.models import SkillModel, CreateSkillRequest

router = APIRouter(prefix="/skills", tags=["Skills & Network Traversal"])

def get_repository() -> GraphRepository:
    return GraphRepository(db_manager)

@router.post("", response_model=SkillModel, status_code=status.HTTP_201_CREATED)
async def create_skill(
    payload: CreateSkillRequest,
    repo: GraphRepository = Depends(get_repository)
):
    """
    CYPHER WRITE API:
    Create a new Skill node in CognoDB.
    """
    try:
        sk_id = f"sk_{uuid.uuid4().hex[:8]}"
        result = await repo.create_skill(
            sk_id=sk_id,
            name=payload.name,
            category=payload.category
        )
        return SkillModel(
            id=result["id"],
            name=result["name"],
            category=result["category"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create skill in CognoDB: {str(e)}")

@router.get("", response_model=List[SkillModel])
async def list_skills(repo: GraphRepository = Depends(get_repository)):
    """Fetch list of available skills in the organization."""
    try:
        data = await repo.get_all_skills()
        return [
            SkillModel(
                id=item["id"],
                name=item["name"],
                category=item.get("category") or "General"
            )
            for item in data
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch skills: {str(e)}")

@router.get("/multi-hop-network")
async def get_multi_hop_skill_network(
    skill: str = Query(..., description="Target skill to trace multi-hop network for (e.g. 'FastAPI', 'Cypher')"),
    repo: GraphRepository = Depends(get_repository)
):
    """
    MULTI-HOP TRAVERSAL API:
    Trace expert engineers for a target skill AND connected collaborators within 2 hops.
    Demonstrates graph traversal capabilities.
    """
    try:
        results = await repo.find_multi_hop_skill_network(skill)
        return {
            "target_skill": skill,
            "total_matches": len(results),
            "traversals": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-hop Cypher traversal failed: {str(e)}")
