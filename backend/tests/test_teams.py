import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    """Test backend health check endpoint."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data

@patch("app.repositories.graph_repository.GraphRepository.assemble_optimal_team")
def test_assemble_teams_endpoint(mock_assemble):
    """Test team assembly API endpoint returns expected structure."""
    mock_assemble.return_value = [
        {
            "members": [
                {"id": "emp_alex", "name": "Alex Rivera", "title": "Staff Backend Engineer", "skills": ["FastAPI"]},
                {"id": "emp_sarah", "name": "Sarah Chen", "title": "UI/UX Architect", "skills": ["React.js"]}
            ]
        }
    ]

    response = client.post(
        "/api/v1/teams/assemble?team_size=2",
        json=["FastAPI", "React.js"]
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["team_size"] == 2
    assert data["total_matches"] == 1
    assert len(data["recommended_partnerships"]) == 1
