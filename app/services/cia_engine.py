"""Prediction engine for the Cycle Intelligence Agent (CIA).

The engine is intentionally decoupled from FastAPI so the prediction logic can
be tested and reused independently.

Prediction method
-----------------
Statistical cold start with a weak Bayesian prior:
    posterior_mean = (K0 * MU0 + n * sample_mean) / (K0 + n)
where ``MU0 = 28`` days is the population prior mean and ``K0 = 2`` is the
prior pseudo-weight. As more cycles are logged the prior influence shrinks and
the estimate converges on the user's own data. The predicted start date is the
most recent start date plus the rounded posterior mean.

The confident-and-ready-for-deep-learning design keeps prediction self-contained
in ``CIAEngine.predict``. A future LSTM/GRU model can replace the statistical
estimates behind the same public interface once enough labeled history exists;
no such model is loaded or emulated here.
"""

from datetime import date, timedelta
from statistics import mean, pstdev
from typing import List, Optional

from app.models.schemas import CIARequest, CIAResponse

PRIOR_MEAN_DAYS = 28.0
PRIOR_WEIGHT = 2.0
MIN_CYCLE_DAYS = 15
MAX_CYCLE_DAYS = 60
VARIABILITY_THRESHOLD = 0.20
LATEST_DEVIATION_DAYS = 5.0
LATEST_DEVIATION_RATIO = 0.15
COLD_START_CONFIDENCE = 0.30


class CIAEngine:
    """Computes cycle predictions from limited, possibly irregular history."""

    def predict(self, request: CIARequest) -> CIAResponse:
        """Return a CIAResponse for the given cycle input."""
        lengths = self._cycle_lengths(request)
        n = len(lengths)

        if n == 0:
            posterior_mean = PRIOR_MEAN_DAYS
            sd_days = 0.0
            latest_length = None
        elif n >= 1:
            sample_mean = mean(lengths)
            sd_days = pstdev(lengths)
            latest_length = lengths[-1]
            posterior_mean = (PRIOR_WEIGHT * PRIOR_MEAN_DAYS + n * sample_mean) / (
                PRIOR_WEIGHT + n
            )

        predicted_start = request.last_cycle_start + timedelta(
            days=round(posterior_mean)
        )

        return CIAResponse(
            predicted_cycle_start=predicted_start.isoformat(),
            confidence_score=self._confidence(n, sd_days, posterior_mean),
            irregularity_alerts=self._irregularity_alerts(n, lengths, latest_length),
        )

    def _cycle_lengths(self, request: CIARequest) -> List[int]:
        """Derive cycle lengths from history gaps and the declared latest length."""
        lengths: List[int] = []
        history = request.cycle_history
        for previous, current in zip(history, history[1:]):
            gap = (current.start_date - previous.start_date).days
            if gap > 0:
                lengths.append(gap)
        if request.cycle_length_days is not None:
            lengths.append(request.cycle_length_days)
        elif history:
            recent_gap = (request.last_cycle_start - history[-1].start_date).days
            if recent_gap > 0:
                lengths.append(recent_gap)
        return lengths

    def _irregularity_alerts(
        self,
        n: int,
        lengths: List[int],
        latest_length: Optional[int],
    ) -> List[str]:
        """Build human-readable alerts describing regularity and data sufficiency."""
        if n == 0:
            return [
                "Not enough cycle history to assess regularity; prediction uses a "
                "population prior (cold start)."
            ]
        if latest_length is None:
            return ["Insufficient cycle history to compute the latest cycle length."]

        alerts: List[str] = []
        if not MIN_CYCLE_DAYS <= latest_length <= MAX_CYCLE_DAYS:
            alerts.append(
                f"Latest cycle length ({latest_length} days) is outside the typical "
                f"{MIN_CYCLE_DAYS}-{MAX_CYCLE_DAYS} day range."
            )
        if n >= 2:
            sample_mean = mean(lengths)
            if abs(latest_length - sample_mean) > max(
                LATEST_DEVIATION_DAYS, LATEST_DEVIATION_RATIO * sample_mean
            ):
                alerts.append(
                    "Latest cycle deviates significantly from the user's average "
                    "cycle length."
                )
            cv = pstdev(lengths)
            if sample_mean > 0:
                cv = cv / sample_mean
            if cv > VARIABILITY_THRESHOLD:
                alerts.append(
                    "Cycle length variability is high; consider consulting a "
                    "healthcare professional."
                )
        else:
            alerts.append("Not enough cycle history to assess regularity reliably.")
        return alerts

    def _confidence(
        self,
        n: int,
        sd_days: float,
        posterior_mean: float,
    ) -> float:
        """Score prediction confidence in [0, 1] from data volume and variability."""
        if n == 0:
            return round(COLD_START_CONFIDENCE, 2)
        if n == 1:
            return round(0.25 + (n / 6.0) * 0.35, 2)
        baseline = 0.25 + min(n / 6.0, 1.0) * 0.35
        cv = sd_days / posterior_mean if posterior_mean > 0 else 0.0
        confidence = baseline + 0.30 * max(0.0, 1.0 - cv / 0.30)
        return round(max(0.15, min(0.95, confidence)), 2)