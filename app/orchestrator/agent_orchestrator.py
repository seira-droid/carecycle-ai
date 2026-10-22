from fastapi import APIRouter, Body
from typing import Optional
from app.models.schemas import OrchestratorResponse, PatientProfileInput
from app.services.ml_service import ml_service

router = APIRouter()

@router.get("/orchestrate", response_model=OrchestratorResponse)
async def orchestrate_default():
    """
    Executes the multi-agent orchestration pipeline using the standard default neurodivergent profile.
    Leverages trained ML models for CIA, SUA, CRDSA, MKA, and ACEA.
    """
    default_patient = PatientProfileInput(
        user_id="U100",
        name="Elena Vance",
        age=18.0,
        bmi=21.8,
        primary_disability="Autism Spectrum Disorder",
        communication_ability="Verbal - reliable",
        caregiver_dependency_level="Independent",
        stress_level_1_10=4,
        exercise_freq_per_week=3,
        sleep_hours=7.8,
        diet_quality="Balanced",
        reported_symptoms="Mild Cramps, Low Spoons",
        pain_level_0_4_BioVid_scale=1,
        pspi_score_0_15_UNBC_scale=3,
        self_report_reliable=1
    )
    return ml_service.orchestrate_all(default_patient)

@router.post("/orchestrate", response_model=OrchestratorResponse)
async def orchestrate_custom(patient: PatientProfileInput):
    """
    Executes the multi-agent orchestration pipeline using custom patient parameters.
    Returns real-time predictions, SHAP attribution, risk scores, and sensory recommendations.
    """
    return ml_service.orchestrate_all(patient)

@router.get("/models/metrics")
async def get_model_metrics():
    """Returns training metrics, accuracy, F1, ROC-AUC, and feature importances."""
    return ml_service.get_metrics()

@router.get("/dataset/summary")
async def get_dataset_summary():
    """Returns summary statistics and distributions from CareCycle_AI_Disability_Menstrual_Dataset.xlsx."""
    return ml_service.get_dataset_summary()

@router.get("/dataset/records")
async def get_dataset_records(limit: int = 50, disability: Optional[str] = None):
    """Returns patient rows from the dataset with optional disability filtering."""
    return ml_service.get_dataset_records(limit=limit, disability=disability)
