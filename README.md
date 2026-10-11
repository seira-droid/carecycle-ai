# CareCycle AI

**Project Title:** CareCycle AI – Multi-Agent Explainable AI Platform for Disability-Aware Menstrual Healthcare

CareCycle AI is an accessible, explainable AI platform designed to support disability-inclusive menstrual healthcare. The platform provides personalized cycle tracking, multi-agent AI monitoring, explainable predictions, neurodivergent sensory accommodations, and intelligent healthcare assistance.

---

## Key Features

1. **Main Dashboard:**
   - Real-time cycle countdown, active phase indicators, and daily observation summaries.
   - Weekly symptom & stamina trajectory charts (Recharts).
   - Personalized neurodivergent wellness recommendations with Web Speech API audio narration.
   - Gentle reminders and sensory check-in notifications.

2. **Menstrual Cycle Tracking:**
   - Interactive monthly calendar with color-coded cycle days.
   - Comprehensive matrix covering the 4 cycle phases: **Menstrual**, **Follicular**, **Ovulation**, and **Luteal**, with neurodivergent sensory and hormonal guidance.
   - Quick logging for period onset, end dates, and flow intensity.
   - Historical 6-month cycle variation records.

3. **Disability-Aware Accessibility:**
   - **Low-Stimulation Mode:** Muted color schemes, suppressed animations, and reduced sensory overwhelm.
   - **Plain Language Mode:** Translates medical terminology into clear, accessible everyday words.
   - **High-Contrast Mode:** High-visibility contrast for low-vision support.
   - **Dyslexic-Friendly Typography:** Expanded letter-spacing and distinctive glyph shapes.
   - **Text Scaling:** 100%, 125%, and 150% sizing.
   - **Text-to-Speech (Audio Narration):** Read aloud any section, advice card, or explanation.

4. **Multi-Agent AI Architecture:**
   - **CIA (Context & Inclusion / Cycle Intelligence Agent):** Personal cycle baseline and disability accommodations.
   - **SUA (Symptom Understanding Agent):** Interprets physical pain and sensory overload self-reports.
   - **MKA (Menstrual Knowledge Agent):** Evidence-based clinical guidelines and non-pharmacological comfort techniques.
   - **CRDSA (Cycle-Related Data & Symptom Analysis Agent / Risk):** Monitors longitudinal anomalies and safety thresholds.
   - **ACEA (Accessibility & Care Explanation Agent):** Formulates plain-language, sensory-safe communications.
   - **AO (Agent Orchestrator):** Coordinates execution flow, evaluates consensus, and synthesizes final care advice.
   - Interactive pipeline execution simulation and raw JSON telemetry inspection.

5. **Explainable AI (XAI) Insights:**
   - SHAP-aligned feature attribution breakdown showing contributing factor weights.
   - Plain-language vs. Clinical explanation toggle.
   - Model confidence metrics and uncertainty intervals.
   - Dataset limitations and safety guardrails.

6. **Health Diary:**
   - Visual Wong-Baker style pain rating scale (0–10).
   - Menstrual flow intensity picker (None, Spotting, Light, Medium, Heavy).
   - Sensory triggers, self-care accommodations, and energy battery rating (1–5).
   - Searchable and filterable history log with delete/edit support.

7. **Reports & Analytics:**
   - Cycle-length variations over 6 months vs. ACOG standard norms.
   - Symptom frequency occurrence analysis.
   - Pain vs. Energy & Mood longitudinal trajectories.
   - **Exportable Clinical Summary (PDF / Print-ready)** with physician sign-off block.

8. **Privacy & Safety:**
   - Simulated secure authentication and persona switcher (Elena Vance vs. Aaliyah Chen).
   - User-controlled data sovereignty (Local-only encrypted storage, caregiver sharing permissions).
   - Emergency Red-Flag symptom checklist and crisis hotline access.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** FastAPI, Python 3.12, Uvicorn, Pydantic, Starlette TestClient, Pytest
- **Integration:** Dual-mode service layer (Direct FastAPI connection with automatic offline prototype fallback)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/seira-droid/carecycle-ai.git
cd carecycle-ai
```

### 2. Backend Setup (FastAPI)
```bash
# Set up Python virtual environment
python -m venv venv
venv\Scripts\activate   # On Linux/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
uvicorn app.main:app --reload --port 8000
```
- Health Check: `http://localhost:8000/health`
- Orchestrator Endpoint: `http://localhost:8000/api/v1/orchestrate`
- Run Backend Tests: `pytest`

### 3. Frontend Setup (React + Tailwind CSS)
In a separate terminal:
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Academic & Research Disclaimer

CareCycle AI is an academic engineering research demonstration. Insights and multi-agent outputs represent algorithmic estimations and research prototype simulations, not certified medical diagnoses. Always consult licensed healthcare professionals for clinical guidance.
