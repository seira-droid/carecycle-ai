from fastapi import APIRouter
from app.models.schemas import SUAResponse, PatientProfileInput
from app.services.ml_service import ml_service

router = APIRouter()

@router.get("/analyze", response_model=SUAResponse)
async def analyze_symptoms():
    """Analyzes symptoms and predicts severity using the trained SUA model."""
    default_patient = PatientProfileInput()
    return ml_service.analyze_symptoms(default_patient)

@router.post("/analyze", response_model=SUAResponse)
async def analyze_symptoms_custom(patient: PatientProfileInput):
    """Analyzes symptoms, pain masking, and UNBC PSPI scores for custom input."""
    return ml_service.analyze_symptoms(patient)
