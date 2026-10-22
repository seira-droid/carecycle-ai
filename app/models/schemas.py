from datetime import date
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, model_validator

# --- Input Schema for Live Model Inference ---
class PatientProfileInput(BaseModel):
    user_id: Optional[str] = "U_LIVE"
    name: Optional[str] = "Participant"
    age: float = Field(default=18.0, ge=10, le=45)
    bmi: float = Field(default=22.4, ge=12, le=50)
    primary_disability: str = "Autism Spectrum Disorder"
    cooccurring_disability: Optional[str] = "None"
    communication_ability: str = "Verbal - reliable"
    aac_use: str = "No"
    preferred_communication_format: Optional[str] = "Structured visual schedule + simple text"
    caregiver_dependency_level: str = "Independent"
    stress_level_1_10: int = Field(default=5, ge=1, le=10)
    exercise_freq_per_week: int = Field(default=2, ge=0, le=14)
    sleep_hours: float = Field(default=7.5, ge=2, le=14)
    diet_quality: str = "Balanced"
    reported_symptoms: Optional[str] = "Cramps, Fatigue"
    pain_level_0_4_BioVid_scale: int = Field(default=1, ge=0, le=4)
    pspi_score_0_15_UNBC_scale: int = Field(default=3, ge=0, le=15)
    self_report_reliable: int = Field(default=1, ge=0, le=1)
    caregiver_observed_pain_0_4: Optional[float] = 0.0
    last_period_start: Optional[str] = None


# --- Cycle Intelligence Agent (CIA) ---
class CIAResponse(BaseModel):
    predicted_cycle_start: str
    predicted_cycle_length: float = 28.0
    predicted_period_duration: float = 5.0
    confidence_score: float
    irregularity_alerts: List[str] = []
    top_contributing_factors: List[Dict[str, Any]] = []

class CycleHistoryEntry(BaseModel):
    """A single recorded menstrual cycle start date in the user's history."""
    start_date: date

class CIARequest(BaseModel):
    """Input contract for the Cycle Intelligence Agent.

    At a minimum the most recent cycle start date is required. With no cycle
    length or history the agent falls back to a population-style cold start.
    """
    last_cycle_start: date = Field(description="Start date of the most recent menstrual period (ISO YYYY-MM-DD).")
    cycle_length_days: Optional[int] = Field(
        default=None,
        ge=15,
        le=60,
        description="Length in days of the most recent cycle, if known.",
    )
    cycle_history: List[CycleHistoryEntry] = Field(
        default_factory=list,
        description="Ascending list of prior cycle start dates (before last_cycle_start).",
    )

    @model_validator(mode="after")
    def _validate_history(self) -> "CIARequest":
        starts = [entry.start_date for entry in self.cycle_history]
        if len(set(starts)) != len(starts):
            raise ValueError("cycle_history start dates must be unique")
        if starts != sorted(starts):
            raise ValueError("cycle_history start dates must be in ascending order")
        for entry in self.cycle_history:
            if entry.start_date >= self.last_cycle_start:
                raise ValueError("cycle_history start dates must precede last_cycle_start")
        return self

# --- Symptom Understanding Agent (SUA) ---
class SUAResponse(BaseModel):
    pain_level: int
    pspi_score: int = 3
    symptom_severity: str
    silent_distress_flag: bool = False
    pain_masking_explanation: Optional[str] = None
    health_indicators: List[str] = []

# --- Medical Knowledge Agent (MKA) ---
class MKAResponse(BaseModel):
    hygiene_guidance: str
    nutrition_guidance: str
    medication_reminders: List[str] = []
    sensory_comfort_techniques: List[str] = []
    consultation_guidance: Optional[str] = None

# --- Caregiver Risk & Decision Support Agent (CRDSA) ---
class CRDSAResponse(BaseModel):
    risk_score: float
    alert_triggered: bool = False
    alert_probability: float = 0.0
    risk_level: str = "Low"
    caregiver_alerts: List[str] = []
    recommended_actions: List[str] = []
    top_risk_drivers: List[Dict[str, Any]] = []

# --- Adaptive Communication & Explanation Agent (ACEA) ---
class ACEAResponse(BaseModel):
    accessible_explanations: str
    personalized_communication: str
    preferred_format: str = "Plain Text + Icons"
    audio_narration_script: str = ""

# --- Orchestrator Aggregation ---
class OrchestratorResponse(BaseModel):
    cycle_intelligence: CIAResponse
    symptoms: SUAResponse
    medical_knowledge: MKAResponse
    caregiver_risk: CRDSAResponse
    communication: ACEAResponse
    final_recommendation: str
    plain_summary: str = ""
    clinical_summary: str = ""
    shap_factors: List[Dict[str, Any]] = []
    disclaimer: str = (
        "CareCycle AI is an academic explainable research platform. "
        "Predictions are clinical decision-support estimates and not medical diagnoses."
    )
