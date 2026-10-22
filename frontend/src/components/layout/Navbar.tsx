import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  Plus,
  Volume2,
  VolumeX,
  User,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ZapOff,
  Menu,
  LogOut,
  Heart,
  ChevronDown,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user } = useApp();
  const { logout, switchDemoUser } = useAuth();
  const {
    availableProfiles,
    notifications,
    markNotificationRead,
    setIsQuickLogOpen,
    setIsA11yPanelOpen,
    setActiveTab,
  } = useApp();

  const { settings, updateSettings, speak, stopSpeaking, isSpeaking } = useAccessibility();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleReadPageOverview = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(
        `Hello ${user.name}. You are on day 11 of your cycle, in the follicular phase. Your estimated next period is October 29th.`
      );
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100/80 px-4 lg:px-8 py-3 transition-colors shadow-[0_1px_3px_rgba(139,92,246,0.03)]">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-purple-50 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-purple-500/15 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-['Outfit'] block leading-none">
                  CareCycle <span className="text-purple-600">AI</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide mt-0.5 hidden sm:block">
                  Personal Menstrual Health
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions, Accessibility Toggles & User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Plain Words Quick Toggle */}
            <button
              onClick={() => updateSettings({ plainLanguage: !settings.plainLanguage })}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                settings.plainLanguage
                  ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle plain language mode"
              aria-pressed={settings.plainLanguage}
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>{settings.plainLanguage ? 'Plain Words On' : 'Plain Words'}</span>
            </button>

            {/* Low-Stimulation Quick Toggle */}
            <button
              onClick={() => updateSettings({ lowStimulation: !settings.lowStimulation })}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                settings.lowStimulation
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle low-stimulation mode"
              aria-pressed={settings.lowStimulation}
            >
              <ZapOff className="w-3.5 h-3.5 text-amber-600" />
              <span>{settings.lowStimulation ? 'Low-Stim On' : 'Low-Stim'}</span>
            </button>

            {/* Speech Narration Button */}
            <button
              onClick={handleReadPageOverview}
              className={`p-2 rounded-xl border transition-colors ${
                isSpeaking
                  ? 'bg-purple-600 text-white border-purple-600 animate-pulse'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-purple-50 hover:text-purple-700'
              }`}
              title={isSpeaking ? 'Stop speech' : 'Listen to overview'}
              aria-label={isSpeaking ? 'Stop speech' : 'Listen to overview'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Accessibility Settings Panel Button */}
            <button
              onClick={() => setIsA11yPanelOpen(true)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
              title="Accessibility & Sensory Preferences"
              aria-label="Accessibility & Sensory Preferences"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 relative transition-colors"
                aria-label="Care notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-purple-100 p-3.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-800">
                      Reminders & Gentle Check-ins
                    </span>
                    <span className="text-[11px] text-purple-600 font-semibold">
                      {unreadCount} new
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationRead(item.id)}
                        className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                          item.read
                            ? 'bg-slate-50/70 text-slate-500'
                            : 'bg-purple-50/60 text-purple-950 font-medium border border-purple-100/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{item.title}</span>
                          <span className="text-[10px] text-slate-400">{item.timeAgo}</span>
                        </div>
                        <p className="text-xs mt-1 text-slate-600 leading-snug">
                          {settings.plainLanguage ? item.simpleMessage : item.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action: Log Period / Symptoms */}
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Log Today</span>
            </button>

            {/* Profile Dropdown & Logout */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-slate-200 hover:border-purple-300 bg-white transition-all shadow-sm"
                aria-label="User profile options"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block pr-1">
                  <span className="text-xs font-bold text-slate-800 block leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    {user.pronouns}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-purple-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 space-y-3">
                  <div className="pb-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user.name}</p>
                    <p className="text-[11px] text-purple-600 font-medium">{user.neurodiversity[0]}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Cycle Length: {user.averageCycleLength} days
                    </p>
                  </div>

                  {/* Switch Demo Persona (Optional for testing) */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Switch Active Persona
                    </span>
                    <div className="space-y-1">
                      {availableProfiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            switchDemoUser(p);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full p-2 rounded-xl text-left text-xs transition-colors flex items-center justify-between ${
                            user.id === p.id
                              ? 'bg-purple-50 text-purple-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span>{p.name}</span>
                          <span className="text-[10px] text-slate-400">{p.pronouns}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Sign Out of CareCycle?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your cycle data and health logs remain safely encrypted on your device.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-md shadow-rose-600/20"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
