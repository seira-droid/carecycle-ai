from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field, model_validator

# --- Cycle Intelligence Agent (CIA) ---
class CIAResponse(BaseModel):
    predicted_cycle_start: str
    confidence_score: float
    irregularity_alerts: List[str]

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
    symptom_severity: str
    health_indicators: List[str]

# --- Medical Knowledge Agent (MKA) ---
class MKAResponse(BaseModel):
    hygiene_guidance: str
    nutrition_guidance: str
    medication_reminders: List[str]
    consultation_guidance: Optional[str] = None

# --- Caregiver Risk & Decision Support Agent (CRDSA) ---
class CRDSAResponse(BaseModel):
    risk_score: float
    caregiver_alerts: List[str]
    recommended_actions: List[str]

# --- Adaptive Communication & Explanation Agent (ACEA) ---
class ACEAResponse(BaseModel):
    accessible_explanations: str
    personalized_communication: str

# --- Orchestrator ---
class OrchestratorResponse(BaseModel):
    cycle_intelligence: CIAResponse
    symptoms: SUAResponse
    medical_knowledge: MKAResponse
    caregiver_risk: CRDSAResponse
    communication: ACEAResponse
    final_recommendation: str
