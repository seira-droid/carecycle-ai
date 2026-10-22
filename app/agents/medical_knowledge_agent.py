from fastapi import APIRouter
from app.models.schemas import MKAResponse, PatientProfileInput
from app.services.ml_service import ml_service

router = APIRouter()

@router.get("/guidance", response_model=MKAResponse)
async def retrieve_knowledge():
    """Retrieves evidence-based non-pharmacological comfort techniques and clinical guidelines."""
    default_patient = PatientProfileInput()
    return ml_service.retrieve_medical_knowledge(default_patient, "Moderate")

@router.post("/guidance", response_model=MKAResponse)
async def retrieve_knowledge_custom(patient: PatientProfileInput):
    """Retrieves guidelines tailored to patient's disability and symptom severity."""
    return ml_service.retrieve_medical_knowledge(patient, "Moderate")
