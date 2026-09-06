from fastapi import APIRouter
from app.models.schemas import CIAResponse

router = APIRouter()

@router.get("/predict", response_model=CIAResponse)
async def predict_cycle():
    """Mocked response for Cycle Intelligence Agent"""
    return CIAResponse(
        predicted_cycle_start="2023-11-01",
        confidence_score=0.85,
        irregularity_alerts=["Cycle is 2 days late compared to average."]
    )
