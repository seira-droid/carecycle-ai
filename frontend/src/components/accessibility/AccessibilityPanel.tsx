import React from 'react';
import {
  Sparkles,
  Sun,
  Type,
  Eye,
  Volume2,
  Check,
  RotateCcw,
  BookOpen,
  ZapOff,
  Sliders,
  X,
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useApp } from '../../context/AppContext';

export const AccessibilityPanel: React.FC = () => {
  const { settings, updateSettings, resetSettings, speak } = useAccessibility();
  const { isA11yPanelOpen, setIsA11yPanelOpen } = useApp();

  if (!isA11yPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between border-l border-slate-200"
        role="dialog"
        aria-label="Disability-Aware Accessibility Settings"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Accessibility & Sensory</h2>
                <p className="text-xs text-slate-500">Neurodivergent & Disability Preferences</p>
              </div>
            </div>
            <button
              onClick={() => setIsA11yPanelOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close Accessibility Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Explanation */}
          <div className="mt-4 p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-900 flex items-start justify-between gap-2">
            <p>
              Customize your experience for autism, ADHD, sensory processing sensitivity, or visual comfort.
            </p>
            <button
              onClick={() =>
                speak(
                  'Accessibility settings. You can adjust low-stimulation mode, high contrast, text size, dyslexia-friendly font, and plain language.'
                )
              }
              className="p-1 bg-white text-purple-700 rounded-md shadow-sm hover:bg-purple-100 shrink-0"
              title="Read panel aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {/* Low-stimulation Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-purple-200 transition-colors bg-slate-50/50">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-lg mt-0.5">
                  <ZapOff className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Low-Stimulation Mode</h3>
                  <p className="text-xs text-slate-500">
                    Mutes vibrant colors, disables animations, and reduces sensory overwhelm.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.lowStimulation}
                onClick={() => updateSettings({ lowStimulation: !settings.lowStimulation })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.lowStimulation ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            {/* Plain Language Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-purple-200 transition-colors bg-slate-50/50">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-teal-100 text-teal-800 rounded-lg mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Plain Language Mode</h3>
                  <p className="text-xs text-slate-500">
                    Replaces medical jargon with direct, easy-to-understand explanations.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.plainLanguage}
                onClick={() => updateSettings({ plainLanguage: !settings.plainLanguage })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.plainLanguage ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-purple-200 transition-colors bg-slate-50/50">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-slate-900 text-yellow-300 rounded-lg mt-0.5">
                  <Sun className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">High Contrast Mode</h3>
                  <p className="text-xs text-slate-500">
                    High visual contrast for visual clarity and low-vision assistance.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.highContrast ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            {/* Text Size */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-slate-800">Text Size</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                      settings.fontSize === size
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {size === 'normal' && 'Normal (100%)'}
                    {size === 'large' && 'Large (125%)'}
                    {size === 'extra-large' && 'XL (150%)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexia-Friendly Typography */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-purple-200 transition-colors bg-slate-50/50">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-indigo-100 text-indigo-800 rounded-lg mt-0.5">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Dyslexic-Friendly Font</h3>
                  <p className="text-xs text-slate-500">
                    Distinct character shapes and expanded letter spacing.
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.dyslexicFont}
                onClick={() => updateSettings({ dyslexicFont: !settings.dyslexicFont })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.dyslexicFont ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={resetSettings}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors py-2 px-3 rounded-lg hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={() => setIsA11yPanelOpen(false)}
            className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
