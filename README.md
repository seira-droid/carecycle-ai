# CareCycle AI

CareCycle AI is a multi-agent, explainable AI platform for disability-aware menstrual healthcare. It predicts cycles, interprets symptoms, retrieves evidence-based medical guidance, assesses caregiver intervention needs, and communicates results in accessible formats.

## Phase 1: Repo & Backend Scaffold

This repository contains the foundational scaffolding for the CareCycle AI backend.

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/seira-droid/carecycle-ai.git
   cd carecycle-ai
   ```

2. **Set up a Python virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server locally**
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`. You can test the health route via `http://localhost:8000/health`.

### Running Tests
To run the automated tests:
```bash
pytest
```

## Cycle Intelligence Agent (CIA)

### CIA input
`POST /agents/cia/predict` (JSON body) or `GET /agents/cia/predict` (no body, cold start):

- `last_cycle_start` _(required)_ — ISO date (`YYYY-MM-DD`) of the most recent cycle start.
- `cycle_length_days` _(optional)_ — length in days of the most recent cycle (validated to 15–60).
- `cycle_history` _(optional)_ — ascending list of prior start dates, each as `{"start_date": "YYYY-MM-DD"}` and strictly before `last_cycle_start`.

### CIA output
A `CIAResponse`:
- `predicted_cycle_start` — ISO date of the expected next cycle start.
- `confidence_score` — value in `[0, 1]`.
- `irregularity_alerts` — list of human-readable alerts; empty when the cycle is regular.

### Prediction method
Statistical estimate with a weak Bayesian prior (`app/services/cia_engine.py`):
`posterior_mean = (2 * 28 + n * sample_mean) / (2 + n)`. The predicted start is
`last_cycle_start + round(posterior_mean)`. With few cycles the 28-day population
prior dominates; with more data the estimate converges on the user's own average.

### Cold-start behavior
With no history or declared cycle length, the agent uses the 28-day prior, returns
a low confidence score (0.30), and notes that regularity cannot yet be assessed.

### Irregularity detection
Alerts are raised when the latest cycle deviates substantially from the user's
average, when cycle length variability is high, or when a cycle length falls
outside the typical 15–60 day range.

### Limitations
- Statistical/bayesian estimate only; no LSTM/GRU model is loaded. The engine
  interface (`CIAEngine.predict`) is designed so a trained deep-learning model can
  replace the statistical estimate later without changing the API contract.
- Confidence reflects data quantity and variability, not medical certainty.
- Not a medical diagnosis tool.
