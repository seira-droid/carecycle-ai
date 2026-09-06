from fastapi import APIRouter
from app.models.schemas import CRDSAResponse

router = APIRouter()

@router.get("/assess", response_model=CRDSAResponse)
async def assess_risk():
    """Mocked response for Caregiver Risk & Decision Support Agent"""
    return CRDSAResponse(
        risk_score=0.4,
        caregiver_alerts=["Moderate pain reported. Monitor for next 12 hours."],
        recommended_actions=["Offer heating pad", "Ensure hydration"]
    )
