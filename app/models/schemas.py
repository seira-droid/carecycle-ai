from pydantic import BaseModel
from typing import List, Optional

# --- Cycle Intelligence Agent (CIA) ---
class CIAResponse(BaseModel):
    predicted_cycle_start: str
    confidence_score: float
    irregularity_alerts: List[str]

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
