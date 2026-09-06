from fastapi import APIRouter
from app.models.schemas import MKAResponse

router = APIRouter()

@router.get("/retrieve", response_model=MKAResponse)
async def retrieve_knowledge():
    """Mocked response for Medical Knowledge Agent"""
    return MKAResponse(
        hygiene_guidance="Use a heating pad for cramps.",
        nutrition_guidance="Drink plenty of water and avoid caffeine.",
        medication_reminders=["Take Ibuprofen if pain exceeds level 5."],
        consultation_guidance="Consult a doctor if pain persists for more than 2 days."
    )
