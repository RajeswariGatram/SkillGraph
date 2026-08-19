from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Node Models ---

class SkillModel(BaseModel):
    id: str
    name: str
    category: str  # e.g., "Backend", "Frontend", "Database", "AI/ML", "DevOps"

class CreateSkillRequest(BaseModel):
    name: str
    category: str = "General"

class EmployeeModel(BaseModel):
    id: str
    name: str
    title: str
    department: str
    email: str
    avatar_url: Optional[str] = None
    skills: List[str] = []

class CreateEmployeeRequest(BaseModel):
    name: str
    title: str
    email: str
    department_id: str
    skill_ids: List[str] = []

class ProjectModel(BaseModel):
    id: str
    name: str
    status: str  # e.g., "Active", "Completed", "Planning"
    tech_stack: List[str] = []

class DepartmentModel(BaseModel):
    id: str
    name: str
    location: str

# --- Graph Visualization Payload Models ---

class GraphNode(BaseModel):
    id: str
    label: str  # "Employee", "Skill", "Project", "Department"
    name: str
    group: str
    properties: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str  # "HAS_SKILL", "WORKED_ON", "BELONGS_TO", "COLLABORATED_WITH"
    label: Optional[str] = None
    properties: Dict[str, Any] = {}

class GraphDataResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# --- Analytics & Multi-hop Query Responses ---

class TeamCandidate(BaseModel):
    employee: EmployeeModel
    covered_skills: List[str]
    collaboration_partners: List[str] = []

class TeamRecommendationRequest(BaseModel):
    required_skills: List[str] = Field(..., min_items=1)
    max_team_size: Optional[int] = 4

class TeamRecommendationResponse(BaseModel):
    target_skills: List[str]
    recommended_team: List[TeamCandidate]
    total_coverage: float  # Percentage of skills covered
    shared_projects: List[str]
    graph: GraphDataResponse

class KnowledgeSiloItem(BaseModel):
    department: str
    critical_skill: str
    sole_expert: EmployeeModel

class KnowledgeSiloResponse(BaseModel):
    silos: List[KnowledgeSiloItem]
    count: int

class HealthResponse(BaseModel):
    status: str
    connected: bool
    uri: Optional[str] = None
    error: Optional[str] = None
