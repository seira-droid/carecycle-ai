from datetime import date
from typing import Optional

from fastapi import APIRouter

from app.models.schemas import CIAResponse, CIARequest
from app.services.cia_engine import CIAEngine

router = APIRouter()
engine = CIAEngine()


def _cold_start_request() -> CIARequest:
    return CIARequest(last_cycle_start=date.today())


def _run_prediction(request: CIARequest) -> CIAResponse:
    return engine.predict(request)


@router.get("/predict", response_model=CIAResponse)
async def predict_cycle(request: Optional[CIARequest] = None):
    """Predict the next cycle start.

    Accepts an optional CIARequest body. With no input it falls back to a cold
    start using today's date so the orchestrator keeps working unchanged.
    """
    return _run_prediction(request or _cold_start_request())


@router.post("/predict", response_model=CIAResponse)
async def predict_cycle_with_input(request: CIARequest):
    """Predict the next cycle start from a supplied CIARequest body."""
    return _run_prediction(request)
