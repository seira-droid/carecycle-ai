from fastapi import APIRouter
from app.models.schemas import ACEAResponse

router = APIRouter()

@router.get("/communicate", response_model=ACEAResponse)
async def format_communication():
    """Mocked response for Adaptive Communication & Explanation Agent"""
    return ACEAResponse(
        accessible_explanations="Your cycle is expected to start soon. We noticed some cramps, which is normal.",
        personalized_communication="[Pictogram of heating pad] [Audio snippet suggesting hydration]"
    )
