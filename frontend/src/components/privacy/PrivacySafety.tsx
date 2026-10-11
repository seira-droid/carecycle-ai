import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Download,
  Trash2,
  PhoneCall,
  AlertTriangle,
  HeartHandshake,
  UserCheck,
  FileText,
  Key,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export const PrivacySafety: React.FC = () => {
  const { user, diaryEntries, cycleStatus } = useApp();
  const { settings } = useAccessibility();

  const [caregiverAccess, setCaregiverAccess] = useState(true);
  const [localOnlyStorage, setLocalOnlyStorage] = useState(true);
  const [anonymousResearchShare, setAnonymousResearchShare] = useState(false);
  const [authDemoModalOpen, setAuthDemoModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState(user.name.toLowerCase().replace(' ', '.') + '@example.com');
  const [authPassword, setAuthPassword] = useState('••••••••••••');

  const handleExportDataJSON = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      userProfile: user,
      currentCycle: cycleStatus,
      diaryHistory: diaryEntries,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carecycle_records_${user.name.replace(' ', '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleWipeData = () => {
    if (confirm('Are you sure you want to delete all stored diary logs and restore prototype defaults?')) {
      localStorage.removeItem('carecycle_diary_entries');
      localStorage.removeItem('carecycle_status');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              User Autonomy & Data Sovereignty
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            {settings.plainLanguage ? 'Your Privacy & Safety' : 'Privacy, Safety & Data Governance'}
          </h1>
          <p className="text-xs text-slate-500">
            User-controlled data visibility, secure authentication, and emergency clinical resources.
          </p>
        </div>

        <button
          onClick={() => setAuthDemoModalOpen(true)}
          className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Key className="w-4 h-4 text-purple-600" />
          <span>Security & Auth Details</span>
        </button>
      </div>

      {/* Grid: 2 Primary Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User-Controlled Data Visibility */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-purple-600" />
            <h2 className="text-base font-bold text-slate-800">
              User-Controlled Data Sharing & Privacy
            </h2>
          </div>

          <div className="space-y-4">
            {/* Setting 1: Local only */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-800">Local-Only Encrypted Sandbox</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Keep your menstrual and symptom records stored exclusively on your device.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={localOnlyStorage}
                onClick={() => setLocalOnlyStorage(!localOnlyStorage)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  localOnlyStorage ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            {/* Setting 2: Caregiver access */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-800">Caregiver Assistance Permission</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Allow designated caregiver to view high-pain threshold alerts and safety notes.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={caregiverAccess}
                onClick={() => setCaregiverAccess(!caregiverAccess)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  caregiverAccess ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>

            {/* Setting 3: Research share */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-800">De-Identified Academic Research</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Contribute anonymized symptom variance patterns to open disability healthcare studies.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={anonymousResearchShare}
                onClick={() => setAnonymousResearchShare(!anonymousResearchShare)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  anonymousResearchShare ? 'bg-purple-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-4 h-4 bg-white rounded-full shadow-md" />
              </button>
            </div>
          </div>

          {/* Record Management Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportDataJSON}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Download Health Records (JSON)</span>
            </button>
            <button
              onClick={handleWipeData}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset Local Records</span>
            </button>
          </div>
        </div>

        {/* Emergency & Professional Clinical Support */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-800">
              Emergency & Healthcare Safety Resources
            </h2>
          </div>

          {/* Red Flag Checklist */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <span>When to Seek Immediate Medical Evaluation (Red Flags):</span>
            </h3>
            <ul className="text-xs text-amber-900/90 space-y-1.5 list-disc list-inside">
              <li>Soaking through two or more menstrual pads per hour for over 2 consecutive hours.</li>
              <li>Sudden high fever combined with acute pelvic pain or nausea.</li>
              <li>Dizziness, fainting spells, or chest tightness.</li>
              <li>Sudden severe pain not relieved by recommended non-pharmacological care or medication.</li>
            </ul>
          </div>

          {/* Accessible Hotlines and Support Contacts */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <strong className="text-slate-800 block">Crisis & Sensory Support Text Line</strong>
                <span className="text-slate-500 text-[11px]">24/7 Free & Confidential Text Support</span>
              </div>
              <a
                href="tel:988"
                className="px-3 py-1.5 bg-white text-purple-700 border border-purple-200 rounded-xl font-bold hover:bg-purple-50 transition-colors"
              >
                Text 741741 or Call 988
              </a>
            </div>

            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <strong className="text-slate-800 block">Primary Ob-Gyn / Healthcare Provider</strong>
                <span className="text-slate-500 text-[11px]">Dr. Rachel Martinez, MD (Women’s Health)</span>
              </div>
              <button
                onClick={() => alert('Calling simulated clinic contact: (555) 019-2834')}
                className="px-3 py-1.5 bg-white text-teal-700 border border-teal-200 rounded-xl font-bold hover:bg-teal-50 transition-colors"
              >
                Contact Clinic
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
        <h3 className="font-bold text-slate-800 text-sm">
          Platform Safety Disclaimer & Academic Scope
        </h3>
        <p>
          CareCycle AI is an explainable AI engineering prototype engineered for academic research in disability-inclusive healthcare. It is not an FDA-cleared or CE-marked medical device. Model estimations, multi-agent suggestions, and symptom inferences are generated through deterministic heuristics and neural agent stubs. Users are encouraged to maintain active communication with qualified medical providers.
        </p>
      </div>

      {/* Auth Demo Modal */}
      {authDemoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Authentication & Session</h3>
              </div>
              <button
                onClick={() => setAuthDemoModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Simulated token-based session active. All user identities adhere to strict client-side encryption bounds.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">User Account Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full p-2.5 border rounded-xl border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Session Token Hash</label>
                <input
                  type="text"
                  readOnly
                  value="jwt_carecycle_sec_a8f93bc10492de"
                  className="w-full p-2.5 bg-slate-100 font-mono text-[11px] rounded-xl border border-slate-200"
                />
              </div>

              <div className="p-3 bg-purple-50 text-purple-900 rounded-xl text-[11px]">
                Active Profile: <strong>{user.name}</strong> ({user.neurodiversity[0]})
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAuthDemoModalOpen(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
