import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Droplets,
  Activity,
  Heart,
  Moon,
  ChevronRight,
  ShieldCheck,
  Bell,
  Clock,
  Volume2,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Plus,
  BookHeart,
  HelpCircle,
  Sliders,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SpeechButton } from '../common/SpeechButton';
import { sampleWellnessRecommendations } from '../../data/sampleData';

export const MainDashboard: React.FC = () => {
  const {
    user,
    cycleStatus,
    updateCycleStatus,
    todayEntry,
    addDiaryEntry,
    diaryEntries,
    setActiveTab,
    setIsQuickLogOpen,
    setIsA11yPanelOpen,
  } = useApp();

  const { settings } = useAccessibility();

  // Inline Quick Symptom Logger state
  const [quickPain, setQuickPain] = useState<number>(todayEntry ? todayEntry.painLevel : 1);
  const [quickEnergy, setQuickEnergy] = useState<number>(todayEntry ? todayEntry.energyLevel : 4);
  const [quickMood, setQuickMood] = useState<string>(todayEntry ? todayEntry.mood : 'calm');
  const [quickFlow, setQuickFlow] = useState<string>(todayEntry ? todayEntry.flow : 'none');
  const [quickSymptoms, setQuickSymptoms] = useState<string[]>(todayEntry ? todayEntry.symptoms : ['Mild cramping']);
  const [quickNote, setQuickNote] = useState<string>(todayEntry ? todayEntry.notes : '');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Caregiver sharing toggle state
  const [caregiverEnabled, setCaregiverEnabled] = useState<boolean>(user.caregiverAssistance);

  // 7-day trend data
  const recentTrendData = [
    { day: 'Day 5', pain: 3, energy: 2 },
    { day: 'Day 6', pain: 2, energy: 3 },
    { day: 'Day 7', pain: 2, energy: 3 },
    { day: 'Day 8', pain: 1, energy: 4 },
    { day: 'Day 9', pain: 0, energy: 4 },
    { day: 'Day 10', pain: 0, energy: 4 },
    {
      day: 'Today',
      pain: todayEntry ? todayEntry.painLevel : quickPain,
      energy: todayEntry ? todayEntry.energyLevel : quickEnergy,
    },
  ];

  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    addDiaryEntry({
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      cycleDay: cycleStatus.currentDay,
      phase: cycleStatus.phase,
      flow: quickFlow as any,
      painLevel: quickPain,
      painLocations: quickPain > 0 ? ['Lower abdomen'] : [],
      mood: quickMood as any,
      energyLevel: quickEnergy,
      sleepHours: 7.5,
      sleepQuality: 'good',
      symptoms: quickSymptoms,
      sensoryTriggers: [],
      medications: [],
      selfCarePracticed: ['Hydration tracker', 'Comfort-waist clothing'],
      notes: quickNote,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleSymptomTag = (sym: string) => {
    setQuickSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const commonSymptomPills = [
    'Mild cramping',
    'Bloating',
    'Clear focus',
    'Fatigue',
    'Headache',
    'Sensory sensitivity',
    'Good energy',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto">
      {/* 1. Welcoming Healthcare Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 rounded-3xl p-6 lg:p-8 text-white shadow-lg shadow-purple-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-l-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
                {user.pronouns} • {user.age} yrs
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/20 text-teal-100 border border-teal-300/30">
                {user.neurodiversity[0]}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-300/20 text-purple-100 border border-purple-200/30">
                Sensory Profile Active
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight font-['Outfit']">
              {settings.plainLanguage ? `Hello, ${user.name}` : `Welcome back, ${user.name}`}
            </h1>

            <p className="text-purple-100/90 text-sm max-w-xl leading-relaxed">
              {settings.plainLanguage ? (
                <span>
                  Today is Cycle Day <strong>{cycleStatus.currentDay}</strong>. You are in the{' '}
                  <strong className="capitalize">{cycleStatus.phase}</strong> phase. Energy is steady.
                </span>
              ) : (
                <span>
                  You are on Cycle Day <strong>{cycleStatus.currentDay}</strong> of your {cycleStatus.totalDays}-day cycle. Follicular estrogen rise supports cognitive focus and physical stamina.
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <SpeechButton
              text={`Welcome ${user.name}. You are on day ${cycleStatus.currentDay} of your cycle, in the ${cycleStatus.phase} phase. Your estimated next period is ${cycleStatus.estimatedNextPeriod}.`}
              label="Listen"
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-semibold px-3.5 py-2 rounded-2xl"
            />
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="bg-white text-purple-800 hover:bg-purple-50 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-transform active:scale-95"
            >
              + Log Period / Sensation
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECTION A: PROMINENT CYCLE OVERVIEW CARD */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-100/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">
              Current Cycle Trajectory
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Outfit']">
              Day {cycleStatus.currentDay} of {cycleStatus.totalDays} •{' '}
              <span className="capitalize text-purple-700">{cycleStatus.phase} Phase</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('cycle')}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>View Full Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Phases Visual Timeline Bar */}
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/80">
              <span className="font-bold text-rose-800 block text-[11px]">1. Menstrual</span>
              <span className="text-[10px] text-rose-500">Days 1–5</span>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-50 border-2 border-teal-500 shadow-sm relative">
              <span className="absolute -top-2 right-2 bg-teal-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                Active
              </span>
              <span className="font-bold text-teal-800 block text-[11px]">2. Follicular</span>
              <span className="text-[10px] text-teal-600">Days 6–13</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200/80">
              <span className="font-bold text-purple-800 block text-[11px]">3. Ovulation</span>
              <span className="text-[10px] text-purple-500">Days 14–16</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80">
              <span className="font-bold text-amber-800 block text-[11px]">4. Luteal</span>
              <span className="text-[10px] text-amber-500">Days 17–28</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-rose-400 h-full w-[18%]" title="Menstrual Days" />
            <div className="bg-teal-500 h-full w-[28%]" title="Follicular Days" />
            <div className="bg-purple-500 h-full w-[11%]" title="Ovulation Days" />
            <div className="bg-amber-400 h-full w-[43%]" title="Luteal Days" />
          </div>
        </div>

        {/* Forecast Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#FAF8FD] border border-purple-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Estimated Next Period
            </span>
            <p className="text-lg font-bold text-slate-800 font-['Outfit']">
              {cycleStatus.estimatedNextPeriod}
            </p>
            <p className="text-xs text-purple-600 font-medium mt-0.5">
              In approximately {cycleStatus.daysUntilNextPeriod} days
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8FD] border border-purple-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Last Recorded Period
            </span>
            <p className="text-lg font-bold text-slate-800 font-['Outfit']">
              {cycleStatus.periodStartDate}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Duration: ~{user.averagePeriodLength} days bleeding
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8FD] border border-purple-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Typical Cycle Length
            </span>
            <p className="text-lg font-bold text-slate-800 font-['Outfit']">
              {cycleStatus.totalDays} Days
            </p>
            <p className="text-xs text-teal-600 font-medium mt-0.5">
              ✓ Regular clinical range (21–35 days)
            </p>
          </div>
        </div>

        {/* Clear Medical Disclaimer Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <span>
            <strong>Note on Cycle Predictions:</strong> Next period dates and phase milestones are personalized estimations calculated from your logged history. Menstrual timing naturally varies with stress, sleep, and physical health.
          </span>
        </div>
      </div>

      {/* 3. SECTION B: QUICK ACTIONS GRID */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 px-1 font-['Outfit']">
          Quick Actions & Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setIsQuickLogOpen(true)}
            className="p-4 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Log Period</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Record flow onset/end</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('diary')}
            className="p-4 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookHeart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Track Symptoms</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Pain, energy & mood</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="p-4 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Cycle History</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">6-month trends</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className="p-4 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Health Assistant</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Comfort & questions</span>
            </div>
          </button>

          <button
            onClick={() => setIsA11yPanelOpen(true)}
            className="p-4 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Accessibility</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Low-stim & words</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className="p-4 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Caregiver Support</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Privacy & alerts</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. SECTION C & D: SYMPTOM TRACKING & HEALTH GUIDANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION C: Easy Symptom & Sensation Logger Form */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <BookHeart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  How Are You Feeling Today?
                </h3>
                <p className="text-xs text-slate-400">Day {cycleStatus.currentDay} • Quick Daily Log</p>
              </div>
            </div>

            {saveSuccess && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleQuickSave} className="space-y-4 pt-1">
            {/* Visual Pain Scale 0 - 10 */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                <span>Pain Level (Wong-Baker Scale)</span>
                <span className="text-purple-700 font-extrabold">{quickPain} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={quickPain}
                onChange={(e) => setQuickPain(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 No Pain</span>
                <span>5 Moderate</span>
                <span>10 Severe</span>
              </div>
            </div>

            {/* Energy Level 1 - 5 */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                <span>Energy & Spoon Reserve</span>
                <span className="text-teal-700 font-extrabold">{quickEnergy} / 5 Spoons</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setQuickEnergy(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      quickEnergy === lvl
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl} {lvl === 1 ? 'Low' : lvl === 5 ? 'High' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Common Sensations Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Observed Sensations & Symptoms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {commonSymptomPills.map((sym) => {
                  const active = quickSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptomTag(sym)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        active
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Personal Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Optional Notes for Yourself
              </label>
              <input
                type="text"
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="e.g. Took warm bath; felt peaceful in the morning..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Today's Sensation Record
            </button>
          </form>
        </div>

        {/* SECTION D: Evidence-Based Comfort & Health Information */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                    Daily Comfort & Evidence-Based Guidance
                  </h3>
                  <p className="text-xs text-slate-400">Non-Pharmacological Follicular Phase Support</p>
                </div>
              </div>
              <SpeechButton
                text="Daily comfort tips: Your estrogen is rising, giving you steady energy. Try wearing loose comfortable fabrics to avoid sensory discomfort. Keep water nearby and enjoy gentle stretching."
                label="Read"
              />
            </div>

            <div className="space-y-3 pt-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF8FD] border border-purple-100">
                <span className="text-xs font-bold text-purple-900 block mb-1">
                  1. Thermal & Abdominal Care
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Low-intensity warm wraps (40°C) applied to the lower pelvic area ease smooth muscle spasms and relieve lingering pelvic tension without sensory startle.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100">
                <span className="text-xs font-bold text-teal-900 block mb-1">
                  2. Sensory-Friendly Clothing
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tagless, high-waisted bamboo or soft cotton garments prevent waist pressure, tactile chafing, and sensory overload.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="text-xs font-bold text-amber-900 block mb-1">
                  3. Rest & Magnesium Nutrition
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Magnesium-rich foods (pumpkin seeds, spinach) and warm chamomile tea assist neuromuscular relaxation.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sources: ACOG Clinical Guidelines & Autism Sensory Practice</span>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-purple-600 hover:text-purple-800 font-bold"
            >
              Ask Assistant →
            </button>
          </div>
        </div>
      </div>

      {/* 5. SECTION E: RECENT CYCLE HISTORY & TREND TRAJECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Past Cycles Summary */}
        <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
              Recent Cycle History
            </h3>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800"
            >
              View Full →
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">October 2026 (Active)</span>
                <span className="text-[11px] text-slate-500">Started Oct 01 • Day 11</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
                28d Target
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">September 2026</span>
                <span className="text-[11px] text-slate-500">Sep 03 – Sep 30</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                27 Days
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">August 2026</span>
                <span className="text-[11px] text-slate-500">Aug 05 – Sep 02</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                29 Days
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day Symptom & Energy Trajectory Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-['Outfit']">
                  Weekly Energy & Comfort Trajectory
                </h3>
                <p className="text-xs text-slate-400">Pain declined as follicular energy increased</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-semibold text-teal-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Energy
                </span>
                <span className="flex items-center gap-1 font-semibold text-rose-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Pain
                </span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recentTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="chartPain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 6]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(139,92,246,0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fill="url(#chartEnergy)"
                    name="Energy Level"
                  />
                  <Area
                    type="monotone"
                    dataKey="pain"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#chartPain)"
                    name="Pain Level"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Trajectory: Stable Recovery</span>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-purple-600 hover:text-purple-800 font-bold"
            >
              Export Clinical PDF →
            </button>
          </div>
        </div>
      </div>

      {/* 6. SECTION F: CAREGIVER SUPPORT & PRIVACY CONTROL BANNER */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-teal-50 rounded-3xl p-6 border border-purple-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                User-Controlled Caregiver Support
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  caregiverEnabled
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {caregiverEnabled ? 'Sharing Active' : 'Private Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {caregiverEnabled
                ? `Authorized caregiver (${user.caregiverName || 'Marcus Vance'}) can receive automated alerts only if severe somatic distress or emergency safety thresholds are reached.`
                : 'Caregiver sharing is currently disabled. All cycle records, symptoms, and alerts are stored strictly on your local device.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setCaregiverEnabled(!caregiverEnabled)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              caregiverEnabled
                ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                : 'bg-purple-700 text-white border-purple-700 hover:bg-purple-800'
            }`}
          >
            {caregiverEnabled ? 'Pause Sharing' : 'Enable Support'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className="px-4 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md shadow-purple-700/20"
          >
            Manage Permissions
          </button>
        </div>
      </div>
    </div>
  );
};
