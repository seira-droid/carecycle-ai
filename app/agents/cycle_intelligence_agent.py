from fastapi import APIRouter
from app.models.schemas import CIAResponse, PatientProfileInput
from app.services.ml_service import ml_service

router = APIRouter()

@router.get("/predict", response_model=CIAResponse)
async def predict_cycle():
    """Predicts cycle length and onset date using the trained CIA GradientBoostingRegressor model."""
    default_patient = PatientProfileInput()
    return ml_service.predict_cycle(default_patient)

@router.post("/predict", response_model=CIAResponse)
async def predict_cycle_custom(patient: PatientProfileInput):
    """Predicts cycle metrics for a custom patient profile."""
    return ml_service.predict_cycle(patient)
