import React, { useState } from 'react';
import {
  BookHeart,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  Smile,
  Frown,
  Droplets,
  Moon,
  Battery,
  Heart,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SpeechButton } from '../common/SpeechButton';
import { DiaryEntry, CyclePhase } from '../../types';

export const HealthDiary: React.FC = () => {
  const { diaryEntries, deleteDiaryEntry, setIsQuickLogOpen } = useApp();
  const { settings } = useAccessibility();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [minPainFilter, setMinPainFilter] = useState<number>(0);

  // Filter entries
  const filteredEntries = diaryEntries.filter((entry) => {
    if (selectedPhaseFilter !== 'all' && entry.phase !== selectedPhaseFilter) {
      return false;
    }
    if (entry.painLevel < minPainFilter) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const inSymptoms = entry.symptoms.some((s) => s.toLowerCase().includes(q));
      const inNotes = entry.notes.toLowerCase().includes(q);
      const inCare = entry.selfCarePracticed.some((c) => c.toLowerCase().includes(q));
      if (!inSymptoms && !inNotes && !inCare) return false;
    }
    return true;
  });

  const avgPain =
    diaryEntries.length > 0
      ? (diaryEntries.reduce((acc, e) => acc + e.painLevel, 0) / diaryEntries.length).toFixed(1)
      : '0';

  const avgSleep =
    diaryEntries.length > 0
      ? (diaryEntries.reduce((acc, e) => acc + e.sleepHours, 0) / diaryEntries.length).toFixed(1)
      : '0';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <BookHeart className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Personal Health Diary
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            {settings.plainLanguage ? 'Your Daily Health Entries' : 'Accessible Health & Symptom Diary'}
          </h1>
          <p className="text-xs text-slate-500">
            Chronological records of pain, mood, flow, sleep, and sensory accommodations.
          </p>
        </div>

        <button
          onClick={() => setIsQuickLogOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Today's Entry</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Recorded Days
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-['Outfit'] mt-1 block">
            {diaryEntries.length} Entries
          </span>
          <span className="text-[11px] text-purple-600 font-medium mt-1 block">
            Covers Current Cycle
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Average Pain Level
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-['Outfit'] mt-1 block">
            {avgPain} / 10
          </span>
          <span className="text-[11px] text-teal-600 font-medium mt-1 block">
            Mild / Manageable Baseline
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Average Sleep Rest
          </span>
          <span className="text-2xl font-extrabold text-slate-900 font-['Outfit'] mt-1 block">
            {avgSleep} Hours
          </span>
          <span className="text-[11px] text-indigo-600 font-medium mt-1 block">
            Consistent Rest Window
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, notes, or accommodations..."
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Phase Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Phase:
          </span>
          {(['all', 'menstrual', 'follicular', 'ovulation', 'luteal'] as const).map((ph) => (
            <button
              key={ph}
              onClick={() => setSelectedPhaseFilter(ph)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize shrink-0 transition-all ${
                selectedPhaseFilter === ph
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ph}
            </button>
          ))}
        </div>
      </div>

      {/* Diary Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <p className="text-sm text-slate-500">No diary entries matched your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedPhaseFilter('all');
                setMinPainFilter(0);
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow text-left space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                    {entry.date}
                  </span>
                  <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                    Cycle Day {entry.cycleDay}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {entry.phase} Phase
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <SpeechButton
                    text={`Entry for ${entry.date}, cycle day ${entry.cycleDay}. Pain level ${entry.painLevel} out of 10. Flow ${entry.flow}. Mood ${entry.mood}. Notes: ${entry.notes || 'None'}.`}
                    label="Read Entry"
                  />
                  <button
                    onClick={() => {
                      if (confirm('Delete this diary entry?')) {
                        deleteDiaryEntry(entry.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Badges Grid: Pain, Flow, Mood, Energy, Sleep */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pain Scale</span>
                  <span
                    className={`text-sm font-extrabold ${
                      entry.painLevel > 5 ? 'text-rose-600' : 'text-teal-600'
                    }`}
                  >
                    {entry.painLevel} / 10
                  </span>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Period Flow</span>
                  <span className="text-sm font-extrabold text-slate-800 capitalize">
                    {entry.flow}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mind State</span>
                  <span className="text-sm font-extrabold text-purple-700 capitalize">
                    {entry.mood.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Energy Level</span>
                  <span className="text-sm font-extrabold text-emerald-600">
                    {entry.energyLevel} / 5
                  </span>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sleep Duration</span>
                  <span className="text-sm font-extrabold text-indigo-600">
                    {entry.sleepHours} hrs
                  </span>
                </div>
              </div>

              {/* Symptoms & Self Care */}
              <div className="space-y-2">
                {entry.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs font-semibold text-slate-500 mr-1">Symptoms:</span>
                    {entry.symptoms.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-rose-50 text-rose-800 border border-rose-200/60 px-2.5 py-0.5 rounded-lg"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {entry.selfCarePracticed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs font-semibold text-slate-500 mr-1">Self-Care:</span>
                    {entry.selfCarePracticed.map((c) => (
                      <span
                        key={c}
                        className="text-xs bg-teal-50 text-teal-800 border border-teal-200/60 px-2.5 py-0.5 rounded-lg"
                      >
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              {entry.notes && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-700 italic">
                  "{entry.notes}"
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
