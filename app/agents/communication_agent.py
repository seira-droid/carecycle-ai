from fastapi import APIRouter
from app.models.schemas import ACEAResponse, PatientProfileInput
from app.services.ml_service import ml_service

router = APIRouter()

@router.get("/format", response_model=ACEAResponse)
async def format_communication():
    """Formats communication in plain language and disability-adapted formats."""
    default_patient = PatientProfileInput()
    cia = ml_service.predict_cycle(default_patient)
    sua = ml_service.analyze_symptoms(default_patient)
    crdsa = ml_service.assess_risk(default_patient, sua.symptom_severity)
    return ml_service.format_communication(default_patient, cia, crdsa, sua)

@router.post("/format", response_model=ACEAResponse)
async def format_communication_custom(patient: PatientProfileInput):
    """Formats communication tailored to specific preferred communication styles."""
    cia = ml_service.predict_cycle(patient)
    sua = ml_service.analyze_symptoms(patient)
    crdsa = ml_service.assess_risk(patient, sua.symptom_severity)
    return ml_service.format_communication(patient, cia, crdsa, sua)
