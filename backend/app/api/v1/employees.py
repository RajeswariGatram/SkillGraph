from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid
from app.core.database import db_manager
from app.repositories.graph_repository import GraphRepository
from app.domain.models import EmployeeModel, CreateEmployeeRequest

router = APIRouter(prefix="/employees", tags=["Employees & Talent"])

def get_repository() -> GraphRepository:
    return GraphRepository(db_manager)

@router.post("", response_model=EmployeeModel, status_code=status.HTTP_201_CREATED)
async def create_employee(
    payload: CreateEmployeeRequest,
    repo: GraphRepository = Depends(get_repository)
):
    """
    CYPHER WRITE API:
    Create a new Employee node in CognoDB and establish department & skill relationships.
    """
    try:
        emp_id = f"emp_{uuid.uuid4().hex[:8]}"
        result = await repo.create_employee(
            emp_id=emp_id,
            name=payload.name,
            title=payload.title,
            email=payload.email,
            dept_id=payload.department_id,
            skill_ids=payload.skill_ids
        )
        return EmployeeModel(
            id=result["id"],
            name=result["name"],
            title=result["title"],
            department=result.get("department") or "Engineering",
            email=result["email"],
            skills=[]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create employee in CognoDB: {str(e)}")

@router.get("", response_model=List[EmployeeModel])
async def list_employees(repo: GraphRepository = Depends(get_repository)):
    """Fetch list of all employees and their attached skills."""
    try:
        data = await repo.get_all_employees()
        return [
            EmployeeModel(
                id=item["id"],
                name=item["name"],
                title=item["title"],
                department=item.get("department") or "Engineering",
                email=item["email"],
                avatar_url=item.get("avatar_url"),
                skills=item.get("skills") or []
            )
            for item in data
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch employees: {str(e)}")
