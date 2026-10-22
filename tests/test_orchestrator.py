from datetime import date

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Test that the health endpoint returns 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_orchestrator():
    """Test that the orchestrator calls all agent ML models and returns combined data."""
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
    
    # Check that the cycle intelligence result is a valid prediction contract
    date.fromisoformat(data["cycle_intelligence"]["predicted_cycle_start"])
    assert 0.0 <= data["cycle_intelligence"]["confidence_score"] <= 1.0
    assert data["cycle_intelligence"]["predicted_cycle_length"] > 20
    assert "symptom_severity" in data["symptoms"]
    assert "risk_score" in data["caregiver_risk"]
    assert "accessible_explanations" in data["communication"]

def test_orchestrator_custom_post():
    """Test orchestrator with custom patient profile."""
    payload = {
        "user_id": "U250",
        "name": "Alex Rivera",
        "age": 19.0,
        "bmi": 23.5,
        "primary_disability": "Autism Spectrum Disorder",
        "communication_ability": "Non-verbal (uses AAC)",
        "caregiver_dependency_level": "Full support",
        "stress_level_1_10": 8,
        "exercise_freq_per_week": 1,
        "sleep_hours": 5.5,
        "diet_quality": "Irregular",
        "reported_symptoms": "Severe cramps, Back pain",
        "pain_level_0_4_BioVid_scale": 3,
        "pspi_score_0_15_UNBC_scale": 11,
        "self_report_reliable": 0
    }
    response = client.post("/api/v1/orchestrate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["caregiver_risk"]["alert_triggered"] is True
    assert data["symptoms"]["silent_distress_flag"] is True
    assert len(data["shap_factors"]) > 0

def test_models_metrics():
    """Test model metrics endpoint."""
    response = client.get("/api/v1/models/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert "crdsa_alert_classifier" in data["models"]
    assert data["models"]["crdsa_alert_classifier"]["accuracy"] >= 0.90

def test_dataset_summary():
    """Test dataset summary endpoint."""
    response = client.get("/api/v1/dataset/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
    assert data["total_users"] >= 200
