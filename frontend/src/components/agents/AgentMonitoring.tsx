import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  RotateCw,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
  Code,
  Volume2,
  Zap,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SpeechButton } from '../common/SpeechButton';
import { apiService } from '../../services/api';
import { AgentTelemetry } from '../../types';
import { mockAgentTelemetry } from '../../data/sampleData';

export const AgentMonitoring: React.FC = () => {
  const { backendHealth } = useApp();
  const { settings } = useAccessibility();

  const [agents, setAgents] = useState<AgentTelemetry[]>(mockAgentTelemetry);
  const [activeAgentId, setActiveAgentId] = useState<string>('AO');
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState<string[]>([]);
  const [finalRecommendation, setFinalRecommendation] = useState(
    'Based on the synchronized multi-agent analysis, your mid-follicular phase is proceeding normally. No anomaly detected. Hydration and sensory-soft clothing recommended as pre-ovulation nears.'
  );

  const fetchAgentData = async () => {
    const res = await apiService.getOrchestratorData();
    setAgents(res.telemetry);
    setFinalRecommendation(res.finalRecommendation);
  };

  useEffect(() => {
    fetchAgentData();
  }, []);

  const handleRunPipelineSimulation = async () => {
    setIsRunningPipeline(true);
    setPipelineProgress([]);

    // Step by step progression
    const order = ['CIA', 'SUA', 'MKA', 'CRDSA', 'ACEA', 'AO'];
    for (const id of order) {
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'processing' } : a))
      );
      await new Promise((r) => setTimeout(r, 380));
      setPipelineProgress((prev) => [...prev, id]);
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'success' } : a))
      );
    }

    setIsRunningPipeline(false);
  };

  const selectedAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  const agentColor = (id: string) => {
    switch (id) {
      case 'CIA':
        return 'from-teal-500 to-emerald-600 border-teal-300 text-teal-700 bg-teal-50';
      case 'SUA':
        return 'from-blue-500 to-indigo-600 border-blue-300 text-blue-700 bg-blue-50';
      case 'MKA':
        return 'from-purple-500 to-violet-600 border-purple-300 text-purple-700 bg-purple-50';
      case 'CRDSA':
        return 'from-amber-500 to-rose-600 border-amber-300 text-amber-700 bg-amber-50';
      case 'ACEA':
        return 'from-emerald-500 to-teal-600 border-emerald-300 text-emerald-700 bg-emerald-50';
      case 'AO':
        return 'from-purple-600 to-indigo-700 border-purple-300 text-purple-700 bg-purple-50';
      default:
        return 'from-slate-500 to-slate-700 border-slate-300 text-slate-700 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Pipeline Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Cpu className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Distributed AI Architecture
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                backendHealth.connected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              {backendHealth.connected ? 'FastAPI Endpoints Live' : 'Interactive Prototype Simulation'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            {settings.plainLanguage ? 'The AI Agent Team' : 'Multi-Agent AI Monitoring & Telemetry'}
          </h1>
          <p className="text-xs text-slate-500">
            Coordinated multi-agent workflow: CIA, SUA, MKA, CRDSA, ACEA orchestrated by AO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAgentData}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
            title="Refresh agent states"
            aria-label="Refresh agent states"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRunPipelineSimulation}
            disabled={isRunningPipeline}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            {isRunningPipeline ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Simulate Agent Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Agent Pipeline Architecture Diagram */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Multi-Agent Orchestration Flowchart
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Message-Passing Topology</span>
        </div>

        {/* Pipeline Nodes Flow */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
          {agents.map((ag) => {
            const isSelected = activeAgentId === ag.id;
            const isExecuting = isRunningPipeline && ag.status === 'processing';
            const isDone = pipelineProgress.includes(ag.id) || ag.status === 'success';

            return (
              <div
                key={ag.id}
                onClick={() => setActiveAgentId(ag.id)}
                className={`p-3 rounded-2xl border cursor-pointer text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-purple-600 border-purple-400 shadow-md bg-purple-50/30'
                    : 'border-slate-200 hover:border-purple-300 bg-white'
                } ${isExecuting ? 'animate-pulse ring-2 ring-indigo-400 bg-indigo-50/50' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-slate-900 tracking-wider">
                      {ag.id}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isExecuting
                          ? 'bg-amber-400 animate-ping'
                          : isDone
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                      }`}
                    />
                  </div>
                  <h3 className="text-[11px] font-bold text-slate-700 leading-tight">
                    {ag.name === 'AO' ? 'Orchestrator' : ag.id}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    {ag.role}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{ag.latencyMs}ms</span>
                  <span className="font-semibold text-emerald-600">
                    {Math.round((ag.confidenceScore || 0.9) * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orchestrator Consolidated Consensus Output Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-teal-50/40 to-indigo-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                AO Synthesized Consensus
              </span>
              <span className="text-[10px] bg-purple-200/80 text-purple-900 font-semibold px-2 py-0.5 rounded-full">
                All 5 Agents Aligned (Zero Conflicts)
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              "{finalRecommendation}"
            </p>
          </div>
          <SpeechButton text={finalRecommendation} label="Listen to Advice" className="shrink-0" />
        </div>
      </div>

      {/* Selected Agent Deep Dive & Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Details (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg">
                  {selectedAgent.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedAgent.fullTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">{selectedAgent.role}</p>
            </div>
            <div className="text-right">
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Status: {selectedAgent.status.toUpperCase()}
              </span>
              <span className="block text-[11px] text-slate-400 mt-1">
                Latency: {selectedAgent.latencyMs} ms
              </span>
            </div>
          </div>

          {/* Inputs & Outputs Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                <span>Agent Input Information</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedAgent.inputSummary}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Agent Output / Inference</span>
              </div>
              <p className="text-xs text-purple-950 leading-relaxed font-medium">
                {selectedAgent.outputSummary}
              </p>
            </div>
          </div>

          {/* Agent Parameters & Internal State Details */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-500" />
                <span>Internal Decision State & Attributes</span>
              </span>
              <span className="text-[11px] text-slate-400">JSON Attributes</span>
            </div>
            <pre className="p-4 bg-slate-900 text-purple-200 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
              {JSON.stringify(selectedAgent.details, null, 2)}
            </pre>
          </div>
        </div>

        {/* Agent Role Matrix & Inclusion Significance (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Why this Agent Matters for Disability Inclusion
            </h3>

            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              {selectedAgent.id === 'CIA' && (
                <p>
                  <strong>Context & Inclusion Agent (CIA)</strong> ensures cycle tracking is not a "one-size-fits-all" model. It factors in neurodivergent routines, medication impacts, and sensory comfort requirements before making timing forecasts.
                </p>
              )}
              {selectedAgent.id === 'SUA' && (
                <p>
                  <strong>Symptom Understanding Agent (SUA)</strong> acknowledges non-verbal, emoji-based, or simplified symptom inputs so users with intellectual or cognitive disabilities can express discomfort without reading medical jargon.
                </p>
              )}
              {selectedAgent.id === 'MKA' && (
                <p>
                  <strong>Menstrual Knowledge Agent (MKA)</strong> retrieves clinical and sensory self-care techniques (e.g., heat vs weighted stimulation, non-pharmacological relief) tailored to individual accommodation profiles.
                </p>
              )}
              {selectedAgent.id === 'CRDSA' && (
                <p>
                  <strong>Cycle-Related Data & Symptom Analysis Agent (CRDSA)</strong> acts as a safety guardrail. It evaluates pain thresholds and abnormal patterns to recommend gentle caregiver alerts or medical check-ins without causing panic.
                </p>
              )}
              {selectedAgent.id === 'ACEA' && (
                <p>
                  <strong>Accessibility & Care Explanation Agent (ACEA)</strong> is the communication bridge. It converts multi-agent clinical consensus into straightforward, calm, and actionable advice that avoids sensory or cognitive overload.
                </p>
              )}
              {selectedAgent.id === 'AO' && (
                <p>
                  <strong>Agent Orchestrator (AO)</strong> coordinates the message pipeline, verifies agreement between agents, resolves conflicting predictions, and ensures all outputs pass strict disability accessibility standards.
                </p>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-purple-900">
            <span className="font-semibold block mb-0.5">Prototype Status:</span>
            Modular architecture ready for seamless microservice integration or local standalone execution.
          </div>
        </div>
      </div>
    </div>
  );
};
