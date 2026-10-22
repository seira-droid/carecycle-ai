import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  Database,
  BarChart2,
  TrendingUp,
  ShieldAlert,
  HeartPulse,
  Clock,
  HelpCircle,
  Eye,
  Sliders,
  FileSpreadsheet,
  Layers,
  Activity,
  ArrowRight,
  UserCheck,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useAccessibility } from '../../context/AccessibilityContext';
import { apiService } from '../../services/api';
import {
  PatientSimulationProfile,
  LivePredictionResponse,
  ModelPerformanceMetrics,
  DatasetRecord,
} from '../../types';
import { SpeechButton } from '../common/SpeechButton';

// Default presets
const PRESET_PATIENTS: Record<string, PatientSimulationProfile> = {
  elena: {
    user_id: 'U100',
    name: 'Elena Vance (Autism + Sensory Overload)',
    age: 18,
    bmi: 21.8,
    primary_disability: 'Autism Spectrum Disorder',
    cooccurring_disability: 'None',
    communication_ability: 'Verbal - reliable',
    aac_use: 'No',
    preferred_communication_format: 'Structured visual schedule + simple text',
    caregiver_dependency_level: 'Independent',
    stress_level_1_10: 4,
    exercise_freq_per_week: 3,
    sleep_hours: 7.8,
    diet_quality: 'Balanced',
    reported_symptoms: 'Mild Cramps, Low Spoons',
    pain_level_0_4_BioVid_scale: 1,
    pspi_score_0_15_UNBC_scale: 3,
    self_report_reliable: 1,
    caregiver_observed_pain_0_4: 1,
    last_period_start: '2026-10-12',
  },
  maya: {
    user_id: 'U104',
    name: 'Maya Lin (Intellectual Disability + AAC, High Pain Masking)',
    age: 16,
    bmi: 24.2,
    primary_disability: 'Intellectual Disability',
    cooccurring_disability: 'Speech or Language Impairment',
    communication_ability: 'Non-verbal (uses AAC)',
    aac_use: 'Yes',
    preferred_communication_format: 'Pictogram/AAC symbols',
    caregiver_dependency_level: 'Full support',
    stress_level_1_10: 8,
    exercise_freq_per_week: 0,
    sleep_hours: 5.2,
    diet_quality: 'High-sugar',
    reported_symptoms: 'Severe Cramps, Bloating, Back pain',
    pain_level_0_4_BioVid_scale: 3,
    pspi_score_0_15_UNBC_scale: 11,
    self_report_reliable: 0,
    caregiver_observed_pain_0_4: 4,
    last_period_start: '2026-10-02',
  },
  aaliyah: {
    user_id: 'U108',
    name: 'Aaliyah Chen (ADHD + High Autonomic Stress)',
    age: 21,
    bmi: 19.5,
    primary_disability: 'Other Health Impairment (ADHD)',
    cooccurring_disability: 'Specific Learning Disability',
    communication_ability: 'Verbal - limited',
    aac_use: 'No',
    preferred_communication_format: 'Calm-tone text + quick bullet reminders',
    caregiver_dependency_level: 'Partial support',
    stress_level_1_10: 7,
    exercise_freq_per_week: 1,
    sleep_hours: 6.0,
    diet_quality: 'Irregular',
    reported_symptoms: 'Headache, Mood swings, Fatigue',
    pain_level_0_4_BioVid_scale: 2,
    pspi_score_0_15_UNBC_scale: 5,
    self_report_reliable: 1,
    caregiver_observed_pain_0_4: 2,
    last_period_start: '2026-10-08',
  },
};

const DISABILITY_OPTIONS = [
  'Autism Spectrum Disorder',
  'Intellectual Disability',
  'Specific Learning Disability',
  'Emotional Disturbance',
  'Speech or Language Impairment',
  'Other Health Impairment (ADHD)',
  'Traumatic Brain Injury',
];

const COMMUNICATION_OPTIONS = [
  'Verbal - reliable',
  'Verbal - limited',
  'Non-verbal (uses AAC)',
  'Non-verbal (no AAC yet)',
];

const ALL_SYMPTOMS = ['Cramps', 'Bloating', 'Back pain', 'Mood swings', 'Headache', 'Fatigue', 'Acne'];

export const ClinicalPredictor: React.FC = () => {
  const { settings } = useAccessibility();
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'dataset' | 'metrics'>('simulator');

  // Simulator Form State
  const [selectedPreset, setSelectedPreset] = useState<string>('elena');
  const [profile, setProfile] = useState<PatientSimulationProfile>(PRESET_PATIENTS.elena);
  const [prediction, setPrediction] = useState<LivePredictionResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionTimeMs, setPredictionTimeMs] = useState<number>(0);

  // Dataset & Metrics State
  const [metrics, setMetrics] = useState<ModelPerformanceMetrics | null>(null);
  const [datasetRecords, setDatasetRecords] = useState<DatasetRecord[]>([]);
  const [filterDisability, setFilterDisability] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial Data Load
  useEffect(() => {
    loadMetricsAndDataset();
    handleRunPrediction(PRESET_PATIENTS.elena);
  }, []);

  const loadMetricsAndDataset = async () => {
    const m = await apiService.getModelMetrics();
    if (m) setMetrics(m);

    const records = await apiService.getDatasetRecords(100);
    setDatasetRecords(records);
  };

  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey in PRESET_PATIENTS) {
      const p = PRESET_PATIENTS[presetKey];
      setProfile(p);
      handleRunPrediction(p);
    }
  };

  const handleSymptomToggle = (symptom: string) => {
    const current = profile.reported_symptoms
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.toLowerCase() !== 'none');

    let updated: string[];
    if (current.includes(symptom)) {
      updated = current.filter((s) => s !== symptom);
    } else {
      updated = [...current, symptom];
    }
    setProfile({
      ...profile,
      reported_symptoms: updated.length > 0 ? updated.join(', ') : 'None',
    });
  };

  const handleRunPrediction = async (inputProfile: PatientSimulationProfile = profile) => {
    setIsPredicting(true);
    const start = performance.now();
    try {
      const res = await apiService.predictCustomPatient(inputProfile);
      setPrediction(res);
      setPredictionTimeMs(Math.round(performance.now() - start));
    } catch (e) {
      console.error('Prediction failed', e);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleLoadRecordIntoSimulator = (record: DatasetRecord) => {
    const loaded: PatientSimulationProfile = {
      user_id: record.user_id,
      name: `Participant ${record.user_id} (${record.primary_disability})`,
      age: record.age,
      bmi: record.bmi,
      primary_disability: record.primary_disability,
      cooccurring_disability: record.cooccurring_disability,
      communication_ability: record.communication_ability,
      aac_use: record.aac_use,
      preferred_communication_format: record.preferred_communication_format,
      caregiver_dependency_level: record.caregiver_dependency_level,
      stress_level_1_10: record.stress_level_1_10,
      exercise_freq_per_week: record.exercise_freq_per_week,
      sleep_hours: record.sleep_hours,
      diet_quality: record.diet_quality,
      reported_symptoms: record.reported_symptoms,
      pain_level_0_4_BioVid_scale: record.pain_level_0_4_BioVid_scale,
      pspi_score_0_15_UNBC_scale: record.pspi_score_0_15_UNBC_scale,
      self_report_reliable: record.self_report_reliable,
      caregiver_observed_pain_0_4: record.caregiver_observed_pain_0_4,
      last_period_start: record.cycle_start_date,
    };
    setSelectedPreset('custom');
    setProfile(loaded);
    setActiveSubTab('simulator');
    handleRunPrediction(loaded);
  };

  const filteredRecords = datasetRecords.filter((r) => {
    const matchesDisability =
      filterDisability === 'All' ||
      r.primary_disability.toLowerCase().includes(filterDisability.toLowerCase());
    const matchesSearch =
      searchQuery === '' ||
      r.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.primary_disability.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reported_symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDisability && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-violet-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-violet-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/30 text-violet-200 border border-violet-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                Trained ML Models Active (96.0% Acc)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-200 border border-teal-400/30 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-teal-300" />
                250-Patient Clinical Cohort
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                Disability-Aware XAI
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight font-['Outfit']">
              Clinical Predictor & AI Model Hub
            </h1>

            <p className="text-violet-200/90 text-sm max-w-2xl leading-relaxed">
              Test personalized cycle forecasting, automated caregiver alert detection, pain-masking
              identification, and sensory care recommendations trained on the multi-dimensional disability dataset.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 shrink-0 shadow-inner">
            <button
              onClick={() => setActiveSubTab('simulator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'simulator'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              Live Clinical Predictor
            </button>
            <button
              onClick={() => setActiveSubTab('dataset')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'dataset'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Dataset Explorer
            </button>
            <button
              onClick={() => setActiveSubTab('metrics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'metrics'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Model Performance
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE CLINICAL PREDICTOR */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Patient Profile Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Persona Preset Picker */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-['Outfit']">
                  <UserCheck className="w-4 h-4 text-violet-600" />
                  Select Clinical Persona Preset
                </h3>
                <span className="text-xs text-slate-400">1-click test</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('elena')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    selectedPreset === 'elena'
                      ? 'border-violet-600 bg-violet-50/70 shadow-sm ring-1 ring-violet-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">Elena Vance (Autism • Verbal)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Low stress, mild pain, reliable self-report, sensory overload precautions
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Low Risk
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('maya')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    selectedPreset === 'maya'
                      ? 'border-violet-600 bg-violet-50/70 shadow-sm ring-1 ring-violet-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">Maya Lin (Intellectual Disability • AAC)</p>
                    <p className="text-[11px] text-rose-600 font-medium mt-0.5">
                      High PSPI facial pain (11/15), non-verbal masking risk, full caregiver support
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                    Alert Active
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('aaliyah')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between ${
                    selectedPreset === 'aaliyah'
                      ? 'border-violet-600 bg-violet-50/70 shadow-sm ring-1 ring-violet-500'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">Aaliyah Chen (ADHD • High Stress)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Short sleep (6h), stress 7/10, irregular diet, headache & fatigue
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                    Moderate
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Input Form */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-['Outfit']">
                  <Sliders className="w-4 h-4 text-violet-600" />
                  Patient Parameters & Sensory Profile
                </h3>
                <button
                  onClick={() => handlePresetSelect('elena')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Disability & Communication */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Primary Disability Category (IDEA Taxonomy)
                  </label>
                  <select
                    value={profile.primary_disability}
                    onChange={(e) => {
                      setSelectedPreset('custom');
                      setProfile({ ...profile, primary_disability: e.target.value });
                    }}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none"
                  >
                    {DISABILITY_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Communication Mode</label>
                    <select
                      value={profile.communication_ability}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setProfile({ ...profile, communication_ability: e.target.value });
                      }}
                      className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none"
                    >
                      {COMMUNICATION_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Caregiver Support</label>
                    <select
                      value={profile.caregiver_dependency_level}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setProfile({ ...profile, caregiver_dependency_level: e.target.value });
                      }}
                      className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none"
                    >
                      <option value="Independent">Independent</option>
                      <option value="Partial support">Partial Support</option>
                      <option value="Full support">Full Support</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Biometrics & Scales */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                {/* Age & Stress */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Age</span>
                      <span className="text-violet-600 font-bold">{profile.age} yrs</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="25"
                      value={profile.age}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setProfile({ ...profile, age: Number(e.target.value) });
                      }}
                      className="w-full accent-violet-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Stress Scale</span>
                      <span className="text-violet-600 font-bold">{profile.stress_level_1_10}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={profile.stress_level_1_10}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setProfile({ ...profile, stress_level_1_10: Number(e.target.value) });
                      }}
                      className="w-full accent-violet-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Sleep & UNBC PSPI Pain Scale */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Nightly Sleep</span>
                      <span className="text-violet-600 font-bold">{profile.sleep_hours} hrs</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      step="0.5"
                      value={profile.sleep_hours}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setProfile({ ...profile, sleep_hours: Number(e.target.value) });
                      }}
                      className="w-full accent-violet-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>UNBC PSPI Pain</span>
                      <span className="text-rose-600 font-bold">{profile.pspi_score_0_15_UNBC_scale}/15</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={profile.pspi_score_0_15_UNBC_scale}
                      onChange={(e) => {
                        setSelectedPreset('custom');
                        setProfile({ ...profile, pspi_score_0_15_UNBC_scale: Number(e.target.value) });
                      }}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Self Report Reliability Toggle */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Self-Report Reliability</p>
                    <p className="text-[11px] text-slate-500">
                      {profile.self_report_reliable === 1
                        ? 'User reliably communicates pain location & intensity'
                        : 'Pain masking, alexithymia, or non-verbal barrier present'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPreset('custom');
                      setProfile({
                        ...profile,
                        self_report_reliable: profile.self_report_reliable === 1 ? 0 : 1,
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      profile.self_report_reliable === 1
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {profile.self_report_reliable === 1 ? 'Reliable' : 'Impaired / Masked'}
                  </button>
                </div>

                {/* Symptoms Pill Multi-Select */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Reported Symptoms</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SYMPTOMS.map((sym) => {
                      const active = profile.reported_symptoms.toLowerCase().includes(sym.toLowerCase());
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => {
                            setSelectedPreset('custom');
                            handleSymptomToggle(sym);
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                            active
                              ? 'bg-violet-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {sym}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleRunPrediction(profile)}
                disabled={isPredicting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isPredicting ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-violet-200" />
                    Running 5-Agent ML Pipeline...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    Run Multi-Agent Clinical Prediction
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Prediction Results & Explainability (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {prediction ? (
              <>
                {/* 1. Hero KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Predicted Next Period */}
                  <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[11px] font-semibold tracking-wider uppercase">Cycle Forecast</span>
                      <TrendingUp className="w-4 h-4 text-violet-600" />
                    </div>
                    <p className="text-xl font-extrabold text-slate-800 font-['Outfit']">
                      {prediction.cycle_intelligence.predicted_cycle_length} Days
                    </p>
                    <p className="text-xs text-violet-700 font-medium mt-1">
                      Next: {prediction.cycle_intelligence.predicted_cycle_start}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Confidence: {Math.round(prediction.cycle_intelligence.confidence_score * 100)}%
                    </div>
                  </div>

                  {/* Caregiver Risk Score */}
                  <div
                    className={`rounded-3xl p-4 border shadow-sm relative overflow-hidden ${
                      prediction.caregiver_risk.alert_triggered
                        ? 'bg-rose-50/80 border-rose-200'
                        : 'bg-emerald-50/80 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-600">
                        Caregiver Risk
                      </span>
                      {prediction.caregiver_risk.alert_triggered ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p
                      className={`text-xl font-extrabold font-['Outfit'] ${
                        prediction.caregiver_risk.alert_triggered ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {prediction.caregiver_risk.risk_score} / 15
                    </p>
                    <p
                      className={`text-xs font-bold mt-1 ${
                        prediction.caregiver_risk.alert_triggered ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {prediction.caregiver_risk.alert_triggered
                        ? 'CARE ALARM TRIGGERED'
                        : 'Normal Variation'}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-600">
                      Prob: {Math.round(prediction.caregiver_risk.alert_probability * 100)}%
                    </div>
                  </div>

                  {/* Pain & Severity */}
                  <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-[11px] font-semibold tracking-wider uppercase">Pain & Severity</span>
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-xl font-extrabold text-slate-800 font-['Outfit']">
                      Level {prediction.symptoms.pain_level} / 10
                    </p>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Severity: <span className="font-bold text-slate-800">{prediction.symptoms.symptom_severity}</span>
                    </p>
                    <div className="mt-2 text-[11px] text-slate-500">
                      UNBC Facial Score: {prediction.symptoms.pspi_score}/15
                    </div>
                  </div>
                </div>

                {/* 2. Silent Pain Masking Banner (Crucial Accessibility Feature) */}
                {prediction.symptoms.silent_distress_flag && (
                  <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-2 border-rose-400/80 rounded-3xl p-5 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                      SILENT DISTRESS / PAIN MASKING DETECTED
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {prediction.symptoms.pain_masking_explanation ||
                        'Prkachin and Solomon Pain Intensity (UNBC scale) indicates somatic facial strain that contradicts suppressed verbal self-report. User may be silently enduring acute dysmenorrhea.'}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white">
                        Caregiver Direct Check-in Advised
                      </span>
                      <span className="text-xs text-slate-500">BioVid autonomic response elevated</span>
                    </div>
                  </div>
                )}

                {/* 3. Personalized Communication & Audio Narration Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 font-['Outfit']">
                          Adaptive Care Advice & Audio Narration
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Format: {prediction.communication.preferred_format}
                        </p>
                      </div>
                    </div>
                    <SpeechButton
                      text={prediction.communication.audio_narration_script || prediction.communication.accessible_explanations}
                      label="Listen"
                      className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold border border-violet-200"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 text-xs leading-relaxed space-y-2">
                    <p className="font-semibold text-slate-800 text-sm">
                      "{prediction.communication.accessible_explanations}"
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {prediction.communication.personalized_communication}
                    </p>
                  </div>

                  {/* Caregiver Action Protocol */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Priority Caregiver Actions
                    </h5>
                    <div className="space-y-1.5">
                      {prediction.caregiver_risk.recommended_actions.map((act, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100"
                        >
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Explainable AI Feature Attribution Breakdown (SHAP-aligned) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 font-['Outfit'] flex items-center gap-2">
                        <Brain className="w-4 h-4 text-violet-600" />
                        Explainable AI (XAI) Contributing Factors
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        SHAP-aligned model attribution weights explaining why this prediction was made
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Pipeline: {predictionTimeMs}ms</span>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prediction.shap_factors}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis dataKey="factor" type="category" tick={{ fontSize: 11, width: 120 }} />
                        <Tooltip
                          formatter={(val: any) => [`Impact Weight: ${val}`, 'Factor Weight']}
                          contentStyle={{ borderRadius: 12, fontSize: 12 }}
                        />
                        <Bar dataKey="weight" radius={[0, 8, 8, 0]}>
                          {prediction.shap_factors.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.weight > 20 ? '#e11d48' : entry.weight > 10 ? '#8b5cf6' : '#14b8a6'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5. Sensory Comfort Techniques & Medical Guidelines */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 font-['Outfit'] flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-teal-600" />
                    Evidence-Based Sensory Accommodations (MKA Agent)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-teal-900">Tactile & Hygiene Support</p>
                      <p>{prediction.medical_knowledge.hygiene_guidance}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100 text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-violet-900">Metabolic & Nutrition</p>
                      <p>{prediction.medical_knowledge.nutrition_guidance}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {prediction.medical_knowledge.sensory_comfort_techniques.map((c, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-slate-600 flex items-center gap-2 bg-slate-50 p-2 rounded-xl"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>

                  {prediction.medical_knowledge.consultation_guidance && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{prediction.medical_knowledge.consultation_guidance}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Brain className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700">Ready to Run Prediction</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select a clinical persona or configure the sliders on the left, then click 'Run Multi-Agent Clinical Prediction'.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DATASET EXPLORER */}
      {activeSubTab === 'dataset' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-slate-700">Filter by Disability:</span>
              {['All', 'Autism', 'Intellectual', 'ADHD', 'Emotional'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterDisability(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    filterDisability === cat
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search user ID, symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs rounded-xl border border-slate-200 px-3.5 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500 outline-none w-64"
              />
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Showing {filteredRecords.length} records
              </span>
            </div>
          </div>

          {/* Dataset Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4">Demographics</th>
                    <th className="py-3 px-4">Primary Disability</th>
                    <th className="py-3 px-4">Communication & AAC</th>
                    <th className="py-3 px-4">Pain Scales (UNBC / BioVid)</th>
                    <th className="py-3 px-4">Caregiver Alert</th>
                    <th className="py-3 px-4">Reported Symptoms</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRecords.slice(0, 30).map((record) => (
                    <tr key={record.user_id} className="hover:bg-violet-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-violet-700">
                        {record.user_id}
                      </td>
                      <td className="py-3 px-4">
                        {record.age}y • BMI {record.bmi}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {record.primary_disability}
                        {record.cooccurring_disability && record.cooccurring_disability !== 'None' && (
                          <span className="block text-[10px] text-slate-400">
                            + {record.cooccurring_disability}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{record.communication_ability}</span>
                        {record.aac_use === 'Yes' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-800">
                            AAC
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-rose-600">
                          {record.pspi_score_0_15_UNBC_scale}/15
                        </span>{' '}
                        <span className="text-slate-400 text-[11px]">
                          (BioVid {record.pain_level_0_4_BioVid_scale}/4)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {record.caregiver_alert_triggered === 'Yes' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Alert Triggered
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                        {record.reported_symptoms}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleLoadRecordIntoSimulator(record)}
                          className="px-2.5 py-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-[11px] transition-all shadow-sm"
                        >
                          Simulate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MODEL PERFORMANCE & BENCHMARKS */}
      {activeSubTab === 'metrics' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold">Caregiver Risk Classifier</span>
              <p className="text-2xl font-extrabold text-violet-700 font-['Outfit'] mt-1">96.0%</p>
              <p className="text-xs text-slate-600 mt-1">Test Accuracy (Stratified 80/20)</p>
              <div className="mt-2 text-[11px] text-emerald-600 font-semibold">ROC-AUC: 0.997 • F1: 0.950</div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold">Symptom Severity Model</span>
              <p className="text-2xl font-extrabold text-teal-600 font-['Outfit'] mt-1">98.0%</p>
              <p className="text-xs text-slate-600 mt-1">Random Forest Multi-Class</p>
              <div className="mt-2 text-[11px] text-teal-700 font-semibold">Mild, Mod, Sev, Very Sev</div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold">Cycle Intelligence Regressor</span>
              <p className="text-2xl font-extrabold text-indigo-600 font-['Outfit'] mt-1">4.36d</p>
              <p className="text-xs text-slate-600 mt-1">Mean Absolute Error (Days)</p>
              <div className="mt-2 text-[11px] text-indigo-700 font-semibold">GradientBoosting n=80</div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold">Clinical Dataset Size</span>
              <p className="text-2xl font-extrabold text-slate-800 font-['Outfit'] mt-1">250</p>
              <p className="text-xs text-slate-600 mt-1">Participants across 7 IDEA categories</p>
              <div className="mt-2 text-[11px] text-slate-500 font-semibold">UNBC & BioVid Calibrated</div>
            </div>
          </div>

          {/* Model Details & Confusion Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Feature Importances */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 font-['Outfit']">
                CRDSA Risk Classifier: Top Feature Importances (MDI)
              </h4>
              <p className="text-xs text-slate-500">
                Key drivers contributing to automated caregiver notifications
              </p>
              {metrics?.models?.crdsa_alert_classifier?.top_features ? (
                <div className="space-y-2">
                  {metrics.models.crdsa_alert_classifier.top_features.slice(0, 6).map((feat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-700 font-semibold">
                        <span>{feat.feature}</span>
                        <span>{Math.round(feat.importance * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-600 rounded-full"
                          style={{ width: `${Math.min(100, feat.importance * 100 * 2.5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400">Metrics loading...</div>
              )}
            </div>

            {/* Confusion Matrix & Clinical Validation */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-800 font-['Outfit']">
                Caregiver Alert Model Confusion Matrix (N=50 Test Records)
              </h4>
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-400 block font-semibold">True Negatives</span>
                  <span className="text-2xl font-bold text-emerald-600">30</span>
                  <span className="text-[10px] text-slate-500 block">Correct Normal</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-400 block font-semibold">False Positives</span>
                  <span className="text-2xl font-bold text-slate-400">1</span>
                  <span className="text-[10px] text-slate-500 block">False Alarm</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-400 block font-semibold">False Negatives</span>
                  <span className="text-2xl font-bold text-slate-400">1</span>
                  <span className="text-[10px] text-slate-500 block">Missed Alert</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-400 block font-semibold">True Positives</span>
                  <span className="text-2xl font-bold text-rose-600">18</span>
                  <span className="text-[10px] text-slate-500 block">Correct Alert</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                High sensitivity (94.7%) ensures non-verbal users undergoing acute sensory or dysmenorrheic pain
                are not overlooked by automated decision systems.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
