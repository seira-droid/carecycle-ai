import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  Activity,
  Heart,
  ShieldCheck,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  cycleHistoryMonths,
  symptomFrequencyData,
  monthlyPainTrendData,
} from '../../data/sampleData';

export const ReportsAnalytics: React.FC = () => {
  const { user, cycleStatus } = useApp();
  const { settings } = useAccessibility();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Longitudinal Patterns & Clinical Summary
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
              Demonstration & Historical Dataset
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            {settings.plainLanguage ? 'Health Trends & Reports' : 'Reports, Analytics & Clinical Exports'}
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive analysis of cycle length stability, symptom frequencies, and mood dynamics.
          </p>
        </div>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Export Clinical Summary (PDF)</span>
        </button>
      </div>

      {/* Grid: 2 Primary Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Cycle-Length Trends Over Time */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {settings.plainLanguage ? 'How Long Your Cycles Last' : 'Cycle Length Variation (Last 6 Months)'}
              </h2>
              <p className="text-xs text-slate-500">
                Evaluating regularity compared to 28-day standard norm.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              Regular (Avg 28.2d)
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cycleHistoryMonths} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[20, 35]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="length" name="Cycle Length (Days)" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="periodDays" name="Bleeding Days" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
            <span>Variance bounds: Low variance (±1.4 days)</span>
            <span className="text-emerald-600 font-semibold">✓ Meets ACOG Normal Range</span>
          </div>
        </div>

        {/* Chart 2: Symptom Frequency Analysis */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {settings.plainLanguage ? 'Most Common Discomforts' : 'Symptom Frequency & Occurrence Count'}
              </h2>
              <p className="text-xs text-slate-500">
                Incidence of physical cramping vs sensory overwhelm events.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Top: Cramping & Sensory
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={symptomFrequencyData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  dataKey="symptom"
                  type="category"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Frequency (Occurrences)" fill="#14b8a6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
            <span>Sensory overwhelm peaks primarily during Late Luteal phase.</span>
            <span className="text-purple-600 font-semibold">Sensory support active</span>
          </div>
        </div>
      </div>

      {/* Chart 3: Pain vs Energy & Mood Dynamics across Cycle Days */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {settings.plainLanguage ? 'Pain Level vs Energy Throughout the Month' : 'Pain-Level vs Vitality & Stamina Correlation'}
            </h2>
            <p className="text-xs text-slate-500">
              Longitudinal tracking across Days 1 through 28.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-semibold text-rose-500">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Pain Level (0–10)
            </span>
            <span className="flex items-center gap-1 font-semibold text-teal-600">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Energy Rating (1–5)
            </span>
            <span className="flex items-center gap-1 font-semibold text-purple-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Mood Score (1–5)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyPainTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 8]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="pain"
                name="Pain (0-10)"
                stroke="#f43f5e"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                name="Energy (1-5)"
                stroke="#0d9488"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="moodRating"
                name="Mood (1-5)"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Clinical Summary Modal / PDF Preview */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            {/* Modal Controls Bar */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  CareCycle AI Clinical Summary Document
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReport}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-8 space-y-6 text-slate-800 text-left bg-white font-sans max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
              {/* Report Header */}
              <div className="flex items-start justify-between border-b pb-6 border-slate-200">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    CareCycle AI – Patient Menstrual Health Report
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Multi-Agent Disability-Inclusive Healthcare Summary • Generated: October 11, 2026
                  </p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-purple-700 block">Confidential Healthcare Summary</span>
                  <span className="text-slate-400 text-[11px]">Academic Research Prototype</span>
                </div>
              </div>

              {/* Patient & Disability Accommodations Profile */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Patient Name</span>
                  <strong className="text-sm text-slate-900">{user.name} ({user.pronouns})</strong>
                  <span className="text-slate-500 block mt-1">Age: {user.age} • Patient ID: {user.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Disability & Sensory Profile
                  </span>
                  <strong className="text-purple-900 block">{user.neurodiversity.join(', ')}</strong>
                  <span className="text-slate-500 text-[11px]">
                    Sensitivities: {user.sensorySensitivities.join(', ')}
                  </span>
                </div>
              </div>

              {/* Cycle Metrics Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Menstrual Cycle Baseline & Stability
                </h3>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Average Cycle</span>
                    <strong className="text-slate-900">{user.averageCycleLength} Days</strong>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Bleeding Duration</span>
                    <strong className="text-slate-900">{user.averagePeriodLength} Days</strong>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Current Status</span>
                    <strong className="text-teal-700">Day 11 (Follicular)</strong>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Next Projected Start</span>
                    <strong className="text-purple-700">{cycleStatus.estimatedNextPeriod}</strong>
                  </div>
                </div>
              </div>

              {/* Pain & Symptom Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Pain Trajectory & Dysmenorrhea Findings
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Patient experiences primary cramping concentrated on Cycle Days 1 through 3, peaking at 6/10 severity. Symptoms taper rapidly by Day 5. Mid-cycle pelvic sensations (1/10) observed on Day 11 align with normal pre-ovulatory follicular expansion. No excessive bleeding (&gt; 8 hours continuous heavy saturation) reported.
                </p>
              </div>

              {/* Neurodivergent Caregiver & Accommodations Statement */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Neurodivergent Sensory & Executive Accommodations
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Heightened sensory vulnerability observed during late luteal phase. Recommended clinical and home accommodations include tactile-soft menstrual garments, non-auditory visual task reminders, structured hydration targets, and sensory decompression space during menstruation.
                </p>
              </div>

              {/* Physician Review & Sign-Off Block */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
                <div>
                  <p className="italic">
                    * Generated via CareCycle AI Multi-Agent Explainability Engine. Intended to assist healthcare consultation.
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-48 border-b border-slate-400 mb-1" />
                  <span>Clinician / Reviewer Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
