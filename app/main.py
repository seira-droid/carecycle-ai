from fastapi import FastAPI
from app.orchestrator.agent_orchestrator import router as orchestrator_router
from app.agents.cycle_intelligence_agent import router as cia_router
from app.agents.symptom_understanding_agent import router as sua_router
from app.agents.medical_knowledge_agent import router as mka_router
from app.agents.caregiver_risk_agent import router as crdsa_router
from app.agents.communication_agent import router as acea_router

app = FastAPI(title="CareCycle AI", version="1.0.0")

# Include the main orchestrator route
app.include_router(orchestrator_router, prefix="/api/v1", tags=["Orchestrator"])

# Include individual agent routes for testing/mocking
app.include_router(cia_router, prefix="/agents/cia", tags=["Cycle Intelligence Agent"])
app.include_router(sua_router, prefix="/agents/sua", tags=["Symptom Understanding Agent"])
app.include_router(mka_router, prefix="/agents/mka", tags=["Medical Knowledge Agent"])
app.include_router(crdsa_router, prefix="/agents/crdsa", tags=["Caregiver Risk Agent"])
app.include_router(acea_router, prefix="/agents/acea", tags=["Communication Agent"])

@app.get("/health", tags=["System"])
async def health_check():
    """Simple health check endpoint"""
    return {"status": "ok"}
