import {
  AgentTelemetry,
  CycleStatus,
  DiaryEntry,
  ExplainableInsight,
} from '../types';
import {
  currentCycleStatus,
  mockAgentTelemetry,
  sampleDiaryHistory,
  sampleExplainableInsight,
} from '../data/sampleData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface BackendHealth {
  connected: boolean;
  url: string;
  version?: string;
}

export const apiService = {
  // Check backend availability
  async checkHealth(): Promise<BackendHealth> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        return { connected: true, url: BASE_URL, version: '1.0.0' };
      }
      return { connected: false, url: BASE_URL };
    } catch {
      return { connected: false, url: BASE_URL };
    }
  },

  // Fetch or simulate live Orchestrator call
  async getOrchestratorData(): Promise<{
    telemetry: AgentTelemetry[];
    finalRecommendation: string;
    isLive: boolean;
  }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${BASE_URL}/api/v1/orchestrate`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        // Map backend response into telemetry
        const liveTelemetry: AgentTelemetry[] = [
          {
            id: 'CIA',
            name: 'CIA',
            fullTitle: 'Context & Inclusion / Cycle Intelligence Agent',
            role: 'Predicts cycle start and evaluates personal neurodivergent constraints.',
            status: 'success',
            inputSummary: 'Cycle length baseline & latest user period logs.',
            outputSummary: `Predicted start: ${data.cycle_intelligence.predicted_cycle_start}. Alerts: ${data.cycle_intelligence.irregularity_alerts.join(', ') || 'None'}`,
            latencyMs: 78,
            confidenceScore: data.cycle_intelligence.confidence_score,
            details: data.cycle_intelligence,
          },
          {
            id: 'SUA',
            name: 'SUA',
            fullTitle: 'Symptom Understanding Agent',
            role: 'Interprets multidimensional pain and physical indicators.',
            status: 'success',
            inputSummary: 'Daily symptom ratings, pain scale, and sensory indicators.',
            outputSummary: `Pain level: ${data.symptoms.pain_level}/10, Severity: ${data.symptoms.symptom_severity}.`,
            latencyMs: 110,
            confidenceScore: 0.92,
            details: data.symptoms,
          },
          {
            id: 'MKA',
            name: 'MKA',
            fullTitle: 'Menstrual Knowledge Agent',
            role: 'Evidence-based healthcare and sensory comfort guidelines.',
            status: 'success',
            inputSummary: 'Current cycle phase, symptom profile, and hygiene inquiries.',
            outputSummary: `${data.medical_knowledge.hygiene_guidance} ${data.medical_knowledge.nutrition_guidance}`,
            latencyMs: 135,
            confidenceScore: 0.96,
            details: data.medical_knowledge,
          },
          {
            id: 'CRDSA',
            name: 'CRDSA',
            fullTitle: 'Cycle-Related Data & Symptom Analysis Agent (Risk Assessment)',
            role: 'Anomalies, pain thresholds, and caregiver notification triggers.',
            status: 'success',
            inputSummary: 'Longitudinal symptom drift and safety boundaries.',
            outputSummary: `Risk Score: ${data.caregiver_risk.risk_score}. Alerts: ${data.caregiver_risk.caregiver_alerts.join(', ') || 'All normal'}`,
            latencyMs: 89,
            confidenceScore: 0.97,
            details: data.caregiver_risk,
          },
          {
            id: 'ACEA',
            name: 'ACEA',
            fullTitle: 'Accessibility & Care Explanation Agent',
            role: 'Translates outputs into plain-language, sensory-safe explanations.',
            status: 'success',
            inputSummary: 'Aggregated findings from all prior agent nodes.',
            outputSummary: data.communication.accessible_explanations,
            latencyMs: 98,
            confidenceScore: 0.95,
            details: data.communication,
          },
          {
            id: 'AO',
            name: 'AO',
            fullTitle: 'Agent Orchestrator',
            role: 'Coordinates execution flow, verifies agent consensus, and compiles response.',
            status: 'success',
            inputSummary: 'Sequential multi-agent execution pipeline.',
            outputSummary: data.final_recommendation,
            latencyMs: 310,
            confidenceScore: 0.95,
            details: { pipelineStatus: 'Completed', liveConnected: true },
          },
        ];

        return {
          telemetry: liveTelemetry,
          finalRecommendation: data.final_recommendation,
          isLive: true,
        };
      }
    } catch {
      // Fallback cleanly to rich simulated prototype telemetry
    }

    return {
      telemetry: mockAgentTelemetry,
      finalRecommendation:
        'Based on multi-agent analysis, your follicular phase is progressing normally. Keep hydration steady and wear sensory-soft fabrics as pre-ovulation begins.',
      isLive: false,
    };
  },

  // Simulate pipeline execution step-by-step for demonstration
  async runStepSimulation(
    onStep: (agentId: string, status: 'processing' | 'success') => void
  ): Promise<void> {
    const sequence = ['CIA', 'SUA', 'MKA', 'CRDSA', 'ACEA', 'AO'];
    for (const id of sequence) {
      onStep(id, 'processing');
      await new Promise((r) => setTimeout(r, 400));
      onStep(id, 'success');
    }
  },

  // Cycle status
  getCycleStatus(): CycleStatus {
    const saved = localStorage.getItem('carecycle_status');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // use default
      }
    }
    return currentCycleStatus;
  },

  saveCycleStatus(status: CycleStatus): void {
    localStorage.setItem('carecycle_status', JSON.stringify(status));
  },

  // Diary entries
  getDiaryEntries(): DiaryEntry[] {
    const saved = localStorage.getItem('carecycle_diary_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // use sample
      }
    }
    return sampleDiaryHistory;
  },

  saveDiaryEntry(entry: DiaryEntry): DiaryEntry[] {
    const current = this.getDiaryEntries();
    const updated = [entry, ...current.filter((e) => e.id !== entry.id && e.date !== entry.date)];
    localStorage.setItem('carecycle_diary_entries', JSON.stringify(updated));
    return updated;
  },

  deleteDiaryEntry(id: string): DiaryEntry[] {
    const current = this.getDiaryEntries();
    const updated = current.filter((e) => e.id !== id);
    localStorage.setItem('carecycle_diary_entries', JSON.stringify(updated));
    return updated;
  },

  // Explainable AI Insights
  getExplainableInsight(): ExplainableInsight {
    return sampleExplainableInsight;
  },
};
