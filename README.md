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
