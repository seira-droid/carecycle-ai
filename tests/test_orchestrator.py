from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Test that the health endpoint returns 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_orchestrator():
    """Test that the orchestrator calls all agent stubs and returns combined mock data."""
    response = client.get("/api/v1/orchestrate")
    assert response.status_code == 200
    data = response.json()
    
    # Check that all agent responses are present
    assert "cycle_intelligence" in data
    assert "symptoms" in data
    assert "medical_knowledge" in data
    assert "caregiver_risk" in data
    assert "communication" in data
    assert "final_recommendation" in data
    
    # Check specific mock values from one of the agents
    assert data["cycle_intelligence"]["predicted_cycle_start"] == "2023-11-01"
    assert data["symptoms"]["pain_level"] == 4
