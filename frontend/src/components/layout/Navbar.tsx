import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  Plus,
  Volume2,
  VolumeX,
  User,
  CheckCircle2,
  Radio,
  BookOpen,
  Sparkles,
  ZapOff,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAccessibility } from '../../context/AccessibilityContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    user,
    setUser,
    availableProfiles,
    backendHealth,
    notifications,
    markNotificationRead,
    setIsQuickLogOpen,
    setIsA11yPanelOpen,
    setActiveTab,
  } = useApp();

  const { settings, updateSettings, speak, stopSpeaking, isSpeaking } = useAccessibility();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleReadPageOverview = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(
        `Welcome ${user.name}. You are on day 11 of your cycle, in the follicular phase. Your estimated next period is October 29th. System is operating normally.`
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 font-['Outfit']">
                  CareCycle <span className="text-purple-600">AI</span>
                </span>
                <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Disability-Aware Multi-Agent Healthcare
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Backend Status badge */}
        <div className="hidden md:flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
              backendHealth.connected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
            title={backendHealth.connected ? 'FastAPI Backend Online' : 'Research Prototype Mode (Simulated AI Agent Pipeline)'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendHealth.connected ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'
              }`}
            />
            <span className="font-medium text-[11px]">
              {backendHealth.connected ? 'FastAPI Backend Live' : 'AI Agent Engine: Ready'}
            </span>
          </div>
        </div>

        {/* Right: Quick Accessibility Buttons + Actions */}
        <div className="flex items-center gap-2">
          {/* Plain Language Mode Quick Toggle */}
          <button
            onClick={() => updateSettings({ plainLanguage: !settings.plainLanguage })}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              settings.plainLanguage
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle plain language mode"
            aria-pressed={settings.plainLanguage}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Plain Words</span>
          </button>

          {/* Low-Stimulation Quick Toggle */}
          <button
            onClick={() => updateSettings({ lowStimulation: !settings.lowStimulation })}
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              settings.lowStimulation
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle low-stimulation mode"
            aria-pressed={settings.lowStimulation}
          >
            <ZapOff className="w-3.5 h-3.5" />
            <span>Low-Stim</span>
          </button>

          {/* Audio Narration Toggle */}
          <button
            onClick={handleReadPageOverview}
            className={`p-2 rounded-lg border transition-colors ${
              isSpeaking
                ? 'bg-purple-600 text-white border-purple-600 animate-pulse'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title={isSpeaking ? 'Stop speech' : 'Read aloud dashboard overview'}
            aria-label={isSpeaking ? 'Stop speech' : 'Read aloud dashboard overview'}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Accessibility Settings Drawer Button */}
          <button
            onClick={() => setIsA11yPanelOpen(true)}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
            title="Open Accessibility & Sensory panel"
            aria-label="Open Accessibility & Sensory panel"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-semibold text-xs text-slate-800">
                    Reminders & Sensory Check-ins
                  </span>
                  <span className="text-[11px] text-purple-600 font-medium">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationRead(item.id)}
                      className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                        item.read ? 'bg-slate-50/70 text-slate-500' : 'bg-purple-50/60 text-purple-900 font-medium'
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

          {/* Quick Log Button */}
          <button
            onClick={() => setIsQuickLogOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm shadow-purple-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Log Today</span>
          </button>

          {/* User Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-slate-200 hover:border-purple-300 bg-white transition-colors"
              aria-label="User profile selector"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs font-semibold text-slate-800 block leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-purple-600 block leading-tight">
                  {user.neurodiversity[0]}
                </span>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
                <div className="pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">Switch Demo Persona</span>
                  <p className="text-[11px] text-slate-400">
                    Test different disability & neurodivergent profiles
                  </p>
                </div>
                <div className="space-y-1.5">
                  {availableProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setUser(p);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        user.id === p.id
                          ? 'bg-purple-100/70 text-purple-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {p.neurodiversity.join(' • ')}
                        </div>
                      </div>
                      {user.id === p.id && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
