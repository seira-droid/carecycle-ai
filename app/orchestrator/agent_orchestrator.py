from fastapi import APIRouter
from app.models.schemas import OrchestratorResponse

# Import agent stub functions
from app.agents.cycle_intelligence_agent import predict_cycle
from app.agents.symptom_understanding_agent import analyze_symptoms
from app.agents.medical_knowledge_agent import retrieve_knowledge
from app.agents.caregiver_risk_agent import assess_risk
from app.agents.communication_agent import format_communication

router = APIRouter()

@router.get("/orchestrate", response_model=OrchestratorResponse)
async def orchestrate_agents():
    """
    Calls all agent stubs in sequence and returns a combined result.
    In later phases, this will handle state, conflicts, and complex workflows.
    """
    # 1. Cycle Intelligence
    cia_response = await predict_cycle()
    
    # 2. Symptom Understanding
    sua_response = await analyze_symptoms()
    
    # 3. Medical Knowledge
    mka_response = await retrieve_knowledge()
    
    # 4. Caregiver Risk & Decision Support
    crdsa_response = await assess_risk()
    
    # 5. Adaptive Communication & Explanation
    acea_response = await format_communication()
    
    # Assemble final recommendation mock
    final_recommendation = (
        "Based on the analysis, please monitor symptoms and ensure hydration. "
        "Review the personalized communication for more details."
    )
    
    return OrchestratorResponse(
        cycle_intelligence=cia_response,
        symptoms=sua_response,
        medical_knowledge=mka_response,
        caregiver_risk=crdsa_response,
        communication=acea_response,
        final_recommendation=final_recommendation
    )
