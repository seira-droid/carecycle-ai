from fastapi import APIRouter
from app.models.schemas import SUAResponse

router = APIRouter()

@router.get("/analyze", response_model=SUAResponse)
async def analyze_symptoms():
    """Mocked response for Symptom Understanding Agent"""
    return SUAResponse(
        pain_level=4,
        symptom_severity="Moderate",
        health_indicators=["Cramps", "Fatigue"]
    )
