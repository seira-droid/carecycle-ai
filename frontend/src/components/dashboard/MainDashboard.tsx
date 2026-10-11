import React from 'react';
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
  Zap,
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
    todayEntry,
    diaryEntries,
    setActiveTab,
    setIsQuickLogOpen,
  } = useApp();

  const { settings } = useAccessibility();

  // Progress percentage
  const cyclePercent = Math.round((cycleStatus.currentDay / cycleStatus.totalDays) * 100);

  // Past 7 days data for mini trend chart
  const recentTrendData = [
    { day: 'D5', pain: 3, energy: 2, label: 'Day 5' },
    { day: 'D6', pain: 2, energy: 3, label: 'Day 6' },
    { day: 'D7', pain: 2, energy: 3, label: 'Day 7' },
    { day: 'D8', pain: 1, energy: 3, label: 'Day 8' },
    { day: 'D9', pain: 0, energy: 3, label: 'Day 9' },
    { day: 'D10', pain: 0, energy: 4, label: 'Day 10' },
    { day: 'Today', pain: todayEntry ? todayEntry.painLevel : 1, energy: todayEntry ? todayEntry.energyLevel : 4, label: 'Day 11' },
  ];

  const phaseColors: Record<string, { bg: string; text: string; border: string }> = {
    menstrual: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    follicular: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    ovulation: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    luteal: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  };

  const currentPhaseStyle = phaseColors[cycleStatus.phase] || phaseColors.follicular;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Welcome & Disability Profile Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-700 rounded-3xl p-6 lg:p-8 text-white shadow-xl shadow-purple-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-[2px] rounded-l-full hidden md:block pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-md text-white">
                {user.pronouns} • {user.age} yrs
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-400/30 text-teal-100 border border-teal-300/30">
                {user.neurodiversity.join(' • ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/30 text-amber-100 border border-amber-300/30">
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
                  <strong className="capitalize">{cycleStatus.phase}</strong> phase. Energy is rising!
                </span>
              ) : (
                <span>
                  You are on Cycle Day <strong>{cycleStatus.currentDay}</strong> of your typical 28-day cycle. Follicular estrogen rise indicates higher cognitive resilience and sensory stamina.
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <SpeechButton
              text={`Welcome ${user.name}. You are on day ${cycleStatus.currentDay} of your cycle, in the ${cycleStatus.phase} phase. Your estimated next period is ${cycleStatus.estimatedNextPeriod}.`}
              label="Listen"
              className="bg-white/20 hover:bg-white/30 text-white"
            />
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="bg-white text-purple-700 hover:bg-purple-50 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              + Log Today's Symptoms
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Cycle Overview & Countdown Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Phase Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cycle Phase</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold border capitalize ${currentPhaseStyle.bg} ${currentPhaseStyle.text} ${currentPhaseStyle.border}`}>
              {cycleStatus.phase}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
            Day {cycleStatus.currentDay} <span className="text-sm font-normal text-slate-500">/ {cycleStatus.totalDays}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            {settings.plainLanguage ? 'Follicular (body gaining energy)' : 'Estrogen building; pre-ovulatory'}
          </p>
        </div>

        {/* Next Period Countdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Next Period</span>
            <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              In {cycleStatus.daysUntilNextPeriod} days
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
            {cycleStatus.estimatedNextPeriod}
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            Last started: {cycleStatus.periodStartDate}
          </p>
        </div>

        {/* Regularity & Confidence */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Confidence</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              92% High
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
            Regular Pattern
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Variance bounds ±1.5 days
          </p>
        </div>

        {/* Sensory Load / Accommodations Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sensory Balance</span>
            <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Stable
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
            Low Overwhelm
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Sensory triggers: Minimal today
          </p>
        </div>
      </div>

      {/* 3. Cycle Phase Progression Visualizer */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {settings.plainLanguage ? 'Where You Are in Your Cycle' : 'Menstrual Cycle Timeline & Phase Progression'}
            </h2>
            <p className="text-xs text-slate-500">
              28-Day Standard Cycle Map with Neurodivergent Phase Guidance
            </p>
          </div>
          <button
            onClick={() => setActiveTab('cycle')}
            className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            <span>Open Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Phases Segment Bar */}
        <div className="relative pt-2 pb-4">
          <div className="grid grid-cols-4 gap-2 mb-2">
            {/* Menstrual Phase (Days 1-5) */}
            <div className="p-3 rounded-2xl border bg-rose-50/70 border-rose-200/80 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-rose-700 uppercase">1. Menstrual</span>
                <span className="text-[10px] text-rose-500">Days 1–5</span>
              </div>
              <p className="text-[11px] text-slate-600">Period bleeding, low spoons, rest.</p>
            </div>

            {/* Follicular Phase (Days 6-13) - ACTIVE */}
            <div className="p-3 rounded-2xl border-2 border-teal-500 bg-teal-50 text-left shadow-sm relative">
              <span className="absolute -top-2.5 right-2 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Current Phase
              </span>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-teal-800 uppercase">2. Follicular</span>
                <span className="text-[10px] text-teal-600">Days 6–13</span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium">Energy rising, sharp focus, clear skin.</p>
            </div>

            {/* Ovulation Phase (Days 14-16) */}
            <div className="p-3 rounded-2xl border bg-purple-50/70 border-purple-200/80 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-purple-700 uppercase">3. Ovulation</span>
                <span className="text-[10px] text-purple-500">Days 14–16</span>
              </div>
              <p className="text-[11px] text-slate-600">Peak energy, egg release, fertile window.</p>
            </div>

            {/* Luteal Phase (Days 17-28) */}
            <div className="p-3 rounded-2xl border bg-amber-50/70 border-amber-200/80 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-amber-700 uppercase">4. Luteal</span>
                <span className="text-[10px] text-amber-500">Days 17–28</span>
              </div>
              <p className="text-[11px] text-slate-600">Progesterone rise, sensory sensitivity.</p>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
            <div className="bg-rose-400 h-full" style={{ width: '18%' }} title="Menstrual (Days 1-5)" />
            <div className="bg-teal-500 h-full relative" style={{ width: '28%' }} title="Follicular (Days 6-13)">
              {/* Marker for Day 11 */}
              <div
                className="absolute top-0 bottom-0 w-2 bg-purple-900 ring-2 ring-white rounded-full"
                style={{ left: '70%' }}
                title="Today: Day 11"
              />
            </div>
            <div className="bg-purple-500 h-full" style={{ width: '11%' }} title="Ovulation (Days 14-16)" />
            <div className="bg-amber-400 h-full" style={{ width: '43%' }} title="Luteal (Days 17-28)" />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-2">
            <span>Cycle Start (Oct 1)</span>
            <span className="font-semibold text-purple-700">★ Today: Day 11 (Oct 11)</span>
            <span>Estimated Next Cycle (Oct 29)</span>
          </div>
        </div>
      </div>

      {/* 4. Two Column Layout: Today's Symptom Summary + Weekly Trend Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Log Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Activity className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-slate-800">
                  {settings.plainLanguage ? "Today's Health Notes" : 'Today’s Recorded Observation'}
                </h2>
              </div>
              <button
                onClick={() => setIsQuickLogOpen(true)}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg"
              >
                {todayEntry ? 'Edit Entry' : '+ Log Now'}
              </button>
            </div>

            {todayEntry ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pain Level</span>
                    <span className="text-base font-extrabold text-teal-600">{todayEntry.painLevel} / 10</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Flow</span>
                    <span className="text-base font-extrabold text-slate-800 capitalize">{todayEntry.flow}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Energy</span>
                    <span className="text-base font-extrabold text-emerald-600">{todayEntry.energyLevel} / 5</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sleep</span>
                    <span className="text-base font-extrabold text-indigo-600">{todayEntry.sleepHours} hrs</span>
                  </div>
                </div>

                {/* Logged tags */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-600">Observed Sensations:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {todayEntry.symptoms.map((s) => (
                      <span key={s} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-100">
                        {s}
                      </span>
                    ))}
                    {todayEntry.selfCarePracticed.map((c) => (
                      <span key={c} className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-lg border border-teal-100">
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>

                {todayEntry.notes && (
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs text-slate-600 italic">
                    "{todayEntry.notes}"
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <Smile className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-xs text-slate-500 mb-3">No observations recorded yet for today.</p>
                <button
                  onClick={() => setIsQuickLogOpen(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold"
                >
                  Log Today's Symptoms
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Last recorded: Oct 11, 2026</span>
            <button
              onClick={() => setActiveTab('diary')}
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              View Full History →
            </button>
          </div>
        </div>

        {/* 7-Day Symptom & Energy Trends Graph */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-teal-100 text-teal-700 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-slate-800">
                  {settings.plainLanguage ? 'Energy vs Pain (Last 7 Days)' : 'Weekly Symptom & Stamina Trajectory'}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-teal-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> Energy (1-5)
                </span>
                <span className="flex items-center gap-1 text-rose-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> Pain (0-10)
                </span>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 6]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorEnergy)"
                    name="Energy Level"
                  />
                  <Area
                    type="monotone"
                    dataKey="pain"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPain)"
                    name="Pain Level"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pattern: Pain declined as menstrual bleeding finished; energy increasing.</span>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              Analytics →
            </button>
          </div>
        </div>
      </div>

      {/* 5. Disability-Aware Wellness & Sensory Recommendations */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Heart className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {settings.plainLanguage ? 'Helpful Tips for You Today' : 'Personalized Disability-Aware Wellness Guidance'}
              </h2>
              <p className="text-xs text-slate-500">
                Curated for {user.neurodiversity[0]} & Follicular Phase Comfort
              </p>
            </div>
          </div>
          <SpeechButton
            text="Personalized tips: Estrogen is rising, giving you good focus. Wear comfortable loose clothes to avoid waistband pressure. Drink water and enjoy gentle movement."
            label="Listen to Tips"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleWellnessRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-purple-50/30 hover:border-purple-200 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full">
                    {rec.category}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {rec.priority === 'recommended' ? '★ Suggested' : 'Daily Comfort'}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 mb-1">{rec.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {settings.plainLanguage ? rec.simpleDescription : rec.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/40 flex items-center justify-between">
                <SpeechButton text={settings.plainLanguage ? rec.simpleDescription : rec.description} label="Read" />
                <span className="text-[11px] text-teal-600 font-medium">Sensory Safe</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
