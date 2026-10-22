from datetime import date

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_cia_predict_get_returns_valid_contract():
    response = client.get("/agents/cia/predict")
    assert response.status_code == 200
    data = response.json()

    assert "predicted_cycle_start" in data
    assert "confidence_score" in data
    assert "irregularity_alerts" in data
    date.fromisoformat(data["predicted_cycle_start"])
    assert 0.0 <= data["confidence_score"] <= 1.0
    assert isinstance(data["irregularity_alerts"], list)


def test_cia_predict_post_valid_input():
    payload = {"last_cycle_start": "2026-01-01", "cycle_length_days": 28}
    response = client.post("/agents/cia/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["predicted_cycle_start"] == "2026-01-29"
    assert 0.0 <= data["confidence_score"] <= 1.0


def test_cia_predict_post_with_history():
    payload = {
        "last_cycle_start": "2026-01-01",
        "cycle_history": [
            {"start_date": "2025-10-09"},
            {"start_date": "2025-11-06"},
            {"start_date": "2025-12-04"},
        ],
    }
    response = client.post("/agents/cia/predict", json=payload)
    assert response.status_code == 200
    assert response.json()["predicted_cycle_start"] == "2026-01-29"


def test_cia_predict_invalid_date_format():
    payload = {"last_cycle_start": "not-a-date"}
    response = client.post("/agents/cia/predict", json=payload)
    assert response.status_code == 422


def test_cia_predict_invalid_cycle_length():
    payload = {"last_cycle_start": "2026-01-01", "cycle_length_days": 5}
    response = client.post("/agents/cia/predict", json=payload)
    assert response.status_code == 422


def test_cia_predict_history_after_last_cycle_start():
    payload = {
        "last_cycle_start": "2026-01-01",
        "cycle_history": [{"start_date": "2026-01-02"}],
    }
    response = client.post("/agents/cia/predict", json=payload)
    assert response.status_code == 422