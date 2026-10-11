import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  BarChart2,
  BookOpen,
  Info,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SpeechButton } from '../common/SpeechButton';
import { sampleExplainableInsight } from '../../data/sampleData';

export const ExplainableAI: React.FC = () => {
  const { cycleStatus } = useApp();
  const { settings } = useAccessibility();

  const [explanationMode, setExplanationMode] = useState<'plain' | 'clinical'>('plain');
  const insight = sampleExplainableInsight;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Lightbulb className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Transparent & Interpretable AI
            </span>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
              SHAP-Aligned Feature Attribution
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            {settings.plainLanguage ? 'Why the AI Made This Estimate' : 'Explainable AI (XAI) Cycle Insights'}
          </h1>
          <p className="text-xs text-slate-500">
            Deconstructing cycle predictions with factor weighting, plain explanations, and safety warnings.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setExplanationMode('plain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              explanationMode === 'plain'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Plain Language
          </button>
          <button
            onClick={() => setExplanationMode('clinical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              explanationMode === 'clinical'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clinical / Technical
          </button>
        </div>
      </div>

      {/* Primary Prediction Banner & Plain Language Explanation */}
      <div className="bg-gradient-to-br from-white to-purple-50/40 rounded-3xl p-6 lg:p-8 border border-purple-200/80 shadow-sm relative space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-100">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Estimated Cycle Phase & Day
            </span>
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-3">
              <span className="capitalize">{insight.predictedPhase} Phase</span>
              <span className="text-base font-normal text-slate-500">
                (Cycle Day {cycleStatus.currentDay})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-center">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">
                Model Confidence
              </span>
              <span className="text-xl font-extrabold text-emerald-800 font-['Outfit']">
                {Math.round(insight.confidenceScore * 100)}%
              </span>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-2 text-center">
              <span className="text-[10px] text-purple-700 font-bold uppercase block">
                Uncertainty Margin
              </span>
              <span className="text-xl font-extrabold text-purple-800 font-['Outfit']">
                ±{insight.uncertaintyMarginDays} Days
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Explanation Box */}
        <div className="p-5 rounded-2xl bg-white border border-purple-100/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>
                {explanationMode === 'plain'
                  ? 'Why did CareCycle AI estimate this?'
                  : 'Algorithmic Rationale & Physiological Proxy Mapping'}
              </span>
            </span>
            <SpeechButton
              text={
                explanationMode === 'plain'
                  ? insight.plainExplanation
                  : insight.clinicalExplanation
              }
              label="Listen to Explanation"
            />
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {explanationMode === 'plain'
              ? insight.plainExplanation
              : insight.clinicalExplanation}
          </p>
        </div>
      </div>

      {/* Feature Importance / Factor Contribution Breakdown (SHAP-Style) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {settings.plainLanguage ? 'What Clues Helped the AI Decide?' : 'Factor Attribution Breakdown (Feature Weighting)'}
            </h2>
            <p className="text-xs text-slate-500">
              Individual contributions of your logged symptoms, biometric patterns, and historical cycles.
            </p>
          </div>
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Total Weights: 100%
          </span>
        </div>

        {/* Horizontal Factor Bars */}
        <div className="space-y-4 pt-2">
          {insight.contributingFactors.map((item, idx) => {
            const barColors = [
              'bg-purple-600',
              'bg-teal-500',
              'bg-indigo-500',
              'bg-amber-500',
              'bg-rose-500',
            ];
            const colorClass = barColors[idx % barColors.length];

            return (
              <div
                key={item.factor}
                className="p-4 rounded-2xl border border-slate-100 hover:border-purple-200 transition-colors bg-slate-50/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{item.factor}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-purple-700 font-mono">
                    +{item.weight}% Impact
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`${colorClass} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${item.weight * 2.5}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {settings.plainLanguage ? item.plainDescription : item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Data Limitations & Safety Guardrails */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Limitations */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Info className="w-4 h-4 text-purple-600" />
            <span>Dataset Limitations & Uncertainties</span>
          </div>
          <p className="text-xs text-slate-500">
            Transparently documenting prototype boundaries and assumptions:
          </p>

          <ul className="space-y-2 text-xs text-slate-600">
            {insight.dataLimitations.map((lim, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safety Guardrails */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Safety Boundaries & Red-Flag Safeguards</span>
          </div>
          <p className="text-xs text-slate-500">
            CareCycle AI is calibrated to avoid unsafe algorithmic certainty:
          </p>

          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
              <span>
                <strong>Pain Thresholds:</strong> Pain levels ≥ 7 trigger non-pharmacological care suggestions and prompt evaluation of clinical checkups.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
              <span>
                <strong>No Fertility Guarantees:</strong> Estimates are informational windows and must never be used as sole contraception.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
              <span>
                <strong>Plain Communication:</strong> Replaces alarming medical terminology with clear, grounding affirmations.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
