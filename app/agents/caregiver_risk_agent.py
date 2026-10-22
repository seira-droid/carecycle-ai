from fastapi import APIRouter
from app.models.schemas import CRDSAResponse, PatientProfileInput
from app.services.ml_service import ml_service

router = APIRouter()

@router.get("/assess", response_model=CRDSAResponse)
async def assess_risk():
    """Assesses caregiver risk using the trained CRDSA RandomForestClassifier & Regressor."""
    default_patient = PatientProfileInput()
    return ml_service.assess_risk(default_patient)

@router.post("/assess", response_model=CRDSAResponse)
async def assess_risk_custom(patient: PatientProfileInput):
    """Assesses caregiver risk for custom patient telemetry."""
    return ml_service.assess_risk(patient)
