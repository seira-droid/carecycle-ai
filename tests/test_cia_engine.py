from datetime import date, timedelta

import pytest
from pydantic import ValidationError

from app.models.schemas import CIARequest, CycleHistoryEntry
from app.services.cia_engine import (
    COLD_START_CONFIDENCE,
    MAX_CYCLE_DAYS,
    MIN_CYCLE_DAYS,
    PRIOR_MEAN_DAYS,
    PRIOR_WEIGHT,
    CIAEngine,
)

engine = CIAEngine()
TODAY = date(2026, 1, 1)


def _request(last_cycle_start=TODAY, cycle_length_days=None, history=None):
    return CIARequest(
        last_cycle_start=last_cycle_start,
        cycle_length_days=cycle_length_days,
        cycle_history=[CycleHistoryEntry(start_date=d) for d in history] if history else [],
    )


def test_cold_start_without_history():
    response = engine.predict(_request())

    expected = TODAY + timedelta(days=round(PRIOR_MEAN_DAYS))
    assert response.predicted_cycle_start == expected.isoformat()
    assert response.confidence_score == COLD_START_CONFIDENCE
    assert len(response.irregularity_alerts) >= 1
    assert "cold start" in response.irregularity_alerts[0]


def test_single_cycle_length():
    response = engine.predict(_request(cycle_length_days=30))

    posterior_mean = (PRIOR_WEIGHT * PRIOR_MEAN_DAYS + 1 * 30) / (PRIOR_WEIGHT + 1)
    expected = TODAY + timedelta(days=round(posterior_mean))
    assert response.predicted_cycle_start == expected.isoformat()
    assert 0.0 < response.confidence_score < 1.0


def test_regular_cycle_history():
    history = [TODAY - timedelta(days=84), TODAY - timedelta(days=56), TODAY - timedelta(days=28)]
    response = engine.predict(_request(history=history))

    assert response.predicted_cycle_start == (TODAY + timedelta(days=28)).isoformat()
    assert response.irregularity_alerts == []


def test_different_cycle_lengths():
    history = [TODAY - timedelta(days=90), TODAY - timedelta(days=60), TODAY - timedelta(days=30)]
    response = engine.predict(_request(history=history))

    expected_delta = round(
        (PRIOR_WEIGHT * PRIOR_MEAN_DAYS + 3 * 30) / (PRIOR_WEIGHT + 3)
    )
    assert response.predicted_cycle_start == (TODAY + timedelta(days=expected_delta)).isoformat()


def test_multiple_history_increases_confidence():
    one = engine.predict(_request(cycle_length_days=28))
    regular = engine.predict(
        _request(history=[TODAY - timedelta(days=84), TODAY - timedelta(days=56), TODAY - timedelta(days=28)])
    )

    assert regular.confidence_score > one.confidence_score
    assert one.confidence_score > COLD_START_CONFIDENCE


def test_irregular_cycle_detected_by_deviation():
    history = [TODAY - timedelta(days=96), TODAY - timedelta(days=68), TODAY - timedelta(days=40)]
    response = engine.predict(_request(history=history))

    assert any("deviates" in alert for alert in response.irregularity_alerts)


def test_irregular_cycle_detected_by_out_of_range_length():
    response = engine.predict(_request(history=[TODAY - timedelta(days=70)]))

    assert any("outside the typical" in alert for alert in response.irregularity_alerts)


def test_insufficient_history_reliability_note():
    response = engine.predict(_request(cycle_length_days=28))

    assert any("assess regularity reliably" in alert for alert in response.irregularity_alerts)


def test_invalid_cycle_length_below_range():
    with pytest.raises(ValidationError):
        _request(cycle_length_days=MIN_CYCLE_DAYS - 1)


def test_invalid_cycle_length_above_range():
    with pytest.raises(ValidationError):
        _request(cycle_length_days=MAX_CYCLE_DAYS + 1)


def test_invalid_history_after_last_cycle_start():
    history = [TODAY + timedelta(days=1)]
    with pytest.raises(ValidationError):
        _request(history=history)


def test_invalid_history_not_ascending():
    history = [TODAY - timedelta(days=28), TODAY - timedelta(days=56)]
    with pytest.raises(ValidationError):
        _request(history=history)


def test_invalid_history_duplicate_dates():
    history = [TODAY - timedelta(days=28), TODAY - timedelta(days=28)]
    with pytest.raises(ValidationError):
        _request(history=history)


def test_confidence_drops_with_variability():
    regular = engine.predict(
        _request(history=[TODAY - timedelta(days=84), TODAY - timedelta(days=56), TODAY - timedelta(days=28)])
    )
    irregular = engine.predict(
        _request(history=[TODAY - timedelta(days=96), TODAY - timedelta(days=68), TODAY - timedelta(days=40)])
    )

    assert irregular.confidence_score < regular.confidence_score