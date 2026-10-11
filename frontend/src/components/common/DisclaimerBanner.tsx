import React, { useState } from 'react';
import { AlertTriangle, Info, X, ShieldCheck } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { settings } = useAccessibility();

  if (dismissed) return null;

  return (
    <aside
      aria-label="Medical Disclaimer and Research Notice"
      className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 transition-all dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1">
          <span className="p-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <p className="leading-snug">
            <strong className="font-semibold">Research Prototype Notice:</strong>{' '}
            {settings.plainLanguage ? (
              <span>
                CareCycle AI helps you learn about your cycle, but it is not a doctor. Simulated models and sample data are used for demonstration.
              </span>
            ) : (
              <span>
                CareCycle AI is an academic engineering research demonstration. Insights are algorithmic estimates and simulated outputs, not certified medical diagnoses. Always consult licensed healthcare providers for clinical advice.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="w-3 h-3" />
            Simulated / Research Demo
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-700 hover:text-amber-950 hover:bg-amber-100 rounded transition-colors"
            aria-label="Dismiss disclaimer banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
