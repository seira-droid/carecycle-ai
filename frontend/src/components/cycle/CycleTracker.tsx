import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Heart,
  Sparkles,
  Info,
  CheckCircle,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SpeechButton } from '../common/SpeechButton';
import { cycleHistoryMonths } from '../../data/sampleData';

export const CycleTracker: React.FC = () => {
  const { cycleStatus, updateCycleStatus, diaryEntries, setIsQuickLogOpen } = useApp();
  const { settings } = useAccessibility();

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(11);
  const [currentMonthName] = useState('October 2026');

  // Days in October 2026 (31 days)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Helper to determine phase for day in October 2026
  const getDayPhaseInfo = (day: number) => {
    if (day >= 1 && day <= 5) {
      return {
        phase: 'menstrual',
        label: 'Menstrual',
        bg: 'bg-rose-100 text-rose-800 border-rose-300',
        dot: 'bg-rose-500',
        isPeriod: true,
      };
    }
    if (day >= 6 && day <= 13) {
      return {
        phase: 'follicular',
        label: 'Follicular',
        bg: 'bg-teal-100 text-teal-800 border-teal-300',
        dot: 'bg-teal-500',
        isPeriod: false,
      };
    }
    if (day >= 14 && day <= 16) {
      return {
        phase: 'ovulation',
        label: 'Ovulation',
        bg: 'bg-purple-100 text-purple-800 border-purple-300',
        dot: 'bg-purple-600',
        isFertile: true,
      };
    }
    if (day >= 17 && day <= 28) {
      return {
        phase: 'luteal',
        label: 'Luteal',
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
        dot: 'bg-amber-500',
        isPeriod: false,
      };
    }
    return {
      phase: 'menstrual',
      label: 'Est. Next Period',
      bg: 'bg-rose-50 text-rose-700 border-dashed border-rose-300',
      dot: 'bg-rose-400',
      isEstimated: true,
    };
  };

  const selectedDayLog = diaryEntries.find((d) => d.cycleDay === selectedDayNumber);
  const selectedDayInfo = getDayPhaseInfo(selectedDayNumber);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            {settings.plainLanguage ? 'Your Menstrual Cycle Calendar' : 'Menstrual Cycle Tracking & Phases'}
          </h1>
          <p className="text-xs text-slate-500">
            Interactive phase map, period tracking, and neurodivergent hormonal context.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              updateCycleStatus({
                currentDay: 1,
                phase: 'menstrual',
                periodStartDate: '2026-10-11',
                estimatedNextPeriod: '2026-11-08',
              });
              alert('Logged: Period started today (Cycle Day 1).');
            }}
            className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Droplets className="w-3.5 h-3.5 text-rose-600" />
            <span>Record Period Start</span>
          </button>
          <button
            onClick={() => setIsQuickLogOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Symptoms</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Calendar & Selected Day Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-800">{currentMonthName}</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                Today: Oct 11 (Day 11)
              </span>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid (October 2026 starts on Thursday -> 4 empty padding cells) */}
          <div className="grid grid-cols-7 gap-2">
            {/* 4 empty offset boxes for Thu Oct 1 */}
            <div className="p-2 opacity-0 pointer-events-none" />
            <div className="p-2 opacity-0 pointer-events-none" />
            <div className="p-2 opacity-0 pointer-events-none" />
            <div className="p-2 opacity-0 pointer-events-none" />

            {daysInMonth.map((day) => {
              const info = getDayPhaseInfo(day);
              const isToday = day === 11;
              const isSelected = selectedDayNumber === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDayNumber(day)}
                  className={`min-h-[72px] p-2 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'ring-2 ring-purple-600 border-purple-400 shadow-md bg-purple-50/40'
                      : isToday
                      ? 'border-purple-300 bg-purple-50/20'
                      : 'border-slate-100 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center'
                          : 'text-slate-800'
                      }`}
                    >
                      {day}
                    </span>
                    {info.isPeriod && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" title="Period flow" />
                    )}
                    {info.isFertile && (
                      <span className="text-[10px]" title="Fertile window">
                        ✨
                      </span>
                    )}
                  </div>

                  {/* Phase Label Pill */}
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md truncate block mt-1 ${info.bg}`}
                  >
                    {info.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Phase Color Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-600">Menstrual (Days 1–5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-slate-600">Follicular (Days 6–13)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600" />
              <span className="text-slate-600">Ovulation (Days 14–16)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-600">Luteal (Days 17–28)</span>
            </div>
          </div>
        </div>

        {/* Selected Day Inspector */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Inspecting Date</span>
                <h3 className="text-lg font-bold text-slate-900">
                  October {selectedDayNumber}, 2026
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${selectedDayInfo.bg}`}
              >
                {selectedDayInfo.label}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-1">Hormonal Profile</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedDayNumber <= 5
                    ? 'Estrogen and progesterone at lowest levels. Uterine shedding.'
                    : selectedDayNumber <= 13
                    ? 'Rising estradiol stimulates energy, cognitive stamina, and positive mood.'
                    : selectedDayNumber <= 16
                    ? 'LH surge triggers release of mature egg. Peak libido & physical energy.'
                    : 'Progesterone dominance. Metabolism increases; sensory thresholds may decrease.'}
                </p>
              </div>

              {/* Recorded Observation for selected day */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  User Observation Record:
                </span>
                {selectedDayLog ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 rounded-xl bg-purple-50 text-purple-900">
                      <span>Pain Level:</span>
                      <strong className="font-bold">{selectedDayLog.painLevel} / 10</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-teal-50 text-teal-900">
                      <span>Energy Level:</span>
                      <strong className="font-bold">{selectedDayLog.energyLevel} / 5</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-100 text-slate-800">
                      <span>Reported Mood:</span>
                      <strong className="font-bold capitalize">{selectedDayLog.mood}</strong>
                    </div>
                    {selectedDayLog.symptoms.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] text-slate-500">Symptoms noted:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedDayLog.symptoms.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No log recorded for this day.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all text-center block"
            >
              + Log or Edit Observations for Day {selectedDayNumber}
            </button>
          </div>
        </div>
      </div>

      {/* Four Cycle Phases Comprehensive Educational Guidance */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {settings.plainLanguage ? 'The 4 Menstrual Phases Explained' : 'Four Cycle Phases: Neurodivergent & Physiological Matrix'}
            </h2>
            <p className="text-xs text-slate-500">
              Understanding how neurodiversity, sensory processing, and hormones intersect across your cycle.
            </p>
          </div>
          <SpeechButton
            text="Cycle Phases: Menstrual phase is days 1 to 5, rest and comfort. Follicular phase is days 6 to 13, rising energy and focus. Ovulation is days 14 to 16, peak stamina. Luteal phase is days 17 to 28, sensory sensitivity and calm self-care."
            label="Listen"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Phase 1 */}
          <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-rose-700 uppercase">1. Menstrual Phase</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                Days 1–5
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-800">Uterine Shedding & Low Spoons</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings.plainLanguage
                ? 'Your period is happening. You may have low energy and need more quiet time.'
                : 'Progesterone and estrogen plunge. Cramping driven by prostaglandins. Executive dysfunction and sensory fatigue are commonly highest.'}
            </p>
            <div className="pt-2 text-[11px] text-rose-800 font-semibold border-t border-rose-200/60">
              Accommodations: Heating pad, loose waistbands, dark quiet rest room.
            </div>
          </div>

          {/* Phase 2 */}
          <div className="p-5 rounded-2xl border-2 border-teal-500 bg-teal-50/80 space-y-2 text-left relative shadow-sm">
            <span className="absolute -top-2.5 right-3 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
              Current
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-teal-800 uppercase">2. Follicular Phase</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                Days 6–13
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-800">Estrogen Surge & Focus Window</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings.plainLanguage
                ? 'Your body is building fresh energy. You can get things done and enjoy socializing.'
                : 'FSH stimulates follicle growth. Rising estrogen boosts dopamine synthesis, executive focus, and tactile tolerance in ADHD/Autistic individuals.'}
            </p>
            <div className="pt-2 text-[11px] text-teal-800 font-semibold border-t border-teal-200/60">
              Accommodations: Schedule challenging tasks, creative hyperfocus, outdoor walks.
            </div>
          </div>

          {/* Phase 3 */}
          <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-purple-700 uppercase">3. Ovulation Phase</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                Days 14–16
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-800">Peak Vitality & Egg Release</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings.plainLanguage
                ? 'Egg release happens. High energy, good mood, and highest confidence.'
                : 'Luteinizing Hormone (LH) peak prompts follicle rupture. Mild mittelschmerz (lower abdomen twinge) can be monitored.'}
            </p>
            <div className="pt-2 text-[11px] text-purple-800 font-semibold border-t border-purple-200/60">
              Accommodations: Stay hydrated; monitor mild twinges without anxiety.
            </div>
          </div>

          {/* Phase 4 */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-700 uppercase">4. Luteal Phase</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                Days 17–28
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-800">Progesterone & Sensory Thresholds</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings.plainLanguage
                ? 'Body slows down. Bright lights or loud noises may feel harder to handle.'
                : 'Corpus luteum secretes progesterone. Dopamine decline can intensify ADHD symptoms or autistic burnout sensitivity in late luteal stage.'}
            </p>
            <div className="pt-2 text-[11px] text-amber-800 font-semibold border-t border-amber-200/60">
              Accommodations: Noise-cancelling headphones, low sensory evenings, magnesium.
            </div>
          </div>
        </div>
      </div>

      {/* Historical Cycle Log Records */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Past Cycle History & Variation Records</h2>
            <p className="text-xs text-slate-500">6-Month historical stability baseline</p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Average: 28.2 Days
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Cycle Month</th>
                <th className="py-2.5 px-3">Cycle Length</th>
                <th className="py-2.5 px-3">Period Duration</th>
                <th className="py-2.5 px-3">Pain Peak</th>
                <th className="py-2.5 px-3">Regularity Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cycleHistoryMonths.map((c) => (
                <tr key={c.month} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">{c.month}</td>
                  <td className="py-3 px-3 text-slate-600">{c.length} days</td>
                  <td className="py-3 px-3 text-slate-600">{c.periodDays} days</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        c.painPeak > 6
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {c.painPeak} / 10
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {c.regularity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
