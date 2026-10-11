import React, { useState } from 'react';
import {
  X,
  Smile,
  Frown,
  Meh,
  Heart,
  Moon,
  Battery,
  Droplets,
  Sparkles,
  Check,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { DiaryEntry, FlowLevel, MoodType } from '../../types';

export const QuickLogModal: React.FC = () => {
  const { isQuickLogOpen, setIsQuickLogOpen, addDiaryEntry, cycleStatus } = useApp();
  const { settings } = useAccessibility();

  const [date, setDate] = useState('2026-10-11');
  const [flow, setFlow] = useState<FlowLevel>('none');
  const [painLevel, setPainLevel] = useState<number>(1);
  const [mood, setMood] = useState<MoodType>('focused');
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Clear skin',
    'Good focus',
  ]);
  const [selectedSelfCare, setSelectedSelfCare] = useState<string[]>([
    'Hydration tracker goal met',
  ]);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isQuickLogOpen) return null;

  const painFace = (val: number) => {
    if (val === 0) return { icon: Smile, text: 'No Pain', color: 'text-emerald-500' };
    if (val <= 3) return { icon: Smile, text: 'Mild / Noticeable', color: 'text-teal-600' };
    if (val <= 6) return { icon: Meh, text: 'Moderate / Distracting', color: 'text-amber-500' };
    if (val <= 8) return { icon: Frown, text: 'Severe / Hard to Focus', color: 'text-orange-600' };
    return { icon: Frown, text: 'Very Severe / Need Rest', color: 'text-rose-600' };
  };

  const symptomList = [
    'Mild cramping',
    'Pelvic twinge',
    'Sensory overload',
    'Brain fog',
    'Fatigue',
    'Headache',
    'Bloating',
    'Breast tenderness',
    'Clear skin',
    'Good focus',
    'Anxiety spike',
  ];

  const selfCareList = [
    'Heating pad',
    'Weighted blanket',
    'Noise-cancelling headphones',
    'Dim lights / sensory break',
    'Hydration tracker goal met',
    'Magnesium / Herbal tea',
    'Comfort-waist clothing',
  ];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const toggleSelfCare = (item: string) => {
    setSelectedSelfCare((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DiaryEntry = {
      id: `log-${Date.now()}`,
      date,
      cycleDay: cycleStatus.currentDay,
      phase: cycleStatus.phase,
      flow,
      painLevel,
      painLocations: painLevel > 0 ? ['Lower abdomen'] : [],
      mood,
      energyLevel,
      sleepHours,
      sleepQuality: sleepHours >= 7 ? 'good' : 'fair',
      symptoms: selectedSymptoms,
      sensoryTriggers: [],
      medications: [],
      selfCarePracticed: selectedSelfCare,
      notes,
    };

    addDiaryEntry(newEntry);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsQuickLogOpen(false);
    }, 800);
  };

  const PainIcon = painFace(painLevel).icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        role="dialog"
        aria-label="Log Daily Symptoms & Observations"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/10 via-teal-500/10 to-transparent p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-purple-600 text-white rounded-2xl shadow-sm shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {settings.plainLanguage ? 'Record How You Feel' : 'Daily Health & Symptom Log'}
              </h2>
              <p className="text-xs text-slate-500">
                Cycle Day {cycleStatus.currentDay} • {cycleStatus.phase.toUpperCase()} Phase
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickLogOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Date Picker */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-purple-600" />
            <label htmlFor="log-date" className="text-xs font-semibold text-slate-700">Date:</label>
            <input
              id="log-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          {/* Menstrual Flow Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {settings.plainLanguage ? 'Period Bleeding' : 'Menstrual Flow Intensity'}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(
                [
                  { id: 'none', label: 'None', drops: 0 },
                  { id: 'spotting', label: 'Spotting', drops: 1 },
                  { id: 'light', label: 'Light', drops: 2 },
                  { id: 'medium', label: 'Medium', drops: 3 },
                  { id: 'heavy', label: 'Heavy', drops: 4 },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFlow(f.id)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    flow === f.id
                      ? 'bg-rose-50 border-rose-300 text-rose-800 ring-2 ring-rose-400'
                      : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Droplets
                    className={`w-5 h-5 mx-auto mb-1 ${
                      flow === f.id ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-xs font-medium block">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pain Scale (0-10) with visual faces */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                {settings.plainLanguage ? 'Pain or Cramps (0 to 10)' : 'Pain Severity Level (Visual Scale)'}
              </label>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <PainIcon className={`w-4 h-4 ${painFace(painLevel).color}`} />
                <span className={painFace(painLevel).color}>{painLevel} / 10 – {painFace(painLevel).text}</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 (None)</span>
              <span>3 (Mild)</span>
              <span>5 (Moderate)</span>
              <span>8 (Severe)</span>
              <span>10 (Extreme)</span>
            </div>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {settings.plainLanguage ? 'How is your mind feeling?' : 'Emotional & Sensory State'}
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'calm', label: 'Calm & Steady', emoji: '😌' },
                  { id: 'happy', label: 'Joyful / Social', emoji: '😊' },
                  { id: 'focused', label: 'Hyper-focused', emoji: '🎯' },
                  { id: 'overstimulated', label: 'Overstimulated', emoji: '⚡' },
                  { id: 'low_spoons', label: 'Low Spoons', emoji: '🥄' },
                  { id: 'fatigued', label: 'Exhausted', emoji: '🥱' },
                  { id: 'anxious', label: 'Anxious / Restless', emoji: '🌪️' },
                  { id: 'irritable', label: 'Irritable / Sensitive', emoji: '💥' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    mood === m.id
                      ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy & Sleep */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Battery className="w-4 h-4 text-emerald-600" />
                  Energy Level: {energyLevel} / 5
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyLevel(lvl)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      energyLevel === lvl
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  Sleep Duration: {sleepHours} hrs
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
              />
            </div>
          </div>

          {/* Physical & Sensory Symptoms Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Physical & Sensory Sensations
            </label>
            <div className="flex flex-wrap gap-1.5">
              {symptomList.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 font-medium'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Self-Care & Accommodations Practiced */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Sensory Accommodations & Self-Care Practiced
            </label>
            <div className="flex flex-wrap gap-1.5">
              {selfCareList.map((item) => {
                const isSelected = selectedSelfCare.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleSelfCare(item)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 font-medium'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Journal Notes */}
          <div>
            <label htmlFor="log-notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Personal Diary Notes (Optional)
            </label>
            <textarea
              id="log-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record sensory triggers, food, or thoughts..."
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsQuickLogOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Today's Entry</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
