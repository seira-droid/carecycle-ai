import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BookHeart,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Sparkles,
  HeartHandshake,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const { activeTab, setActiveTab, user, setIsA11yPanelOpen } = useApp();
  const { logout } = useAuth();
  const { settings } = useAccessibility();

  const navItems = [
    {
      id: 'dashboard',
      label: settings.plainLanguage ? 'Home' : 'Dashboard',
      icon: LayoutDashboard,
      description: 'Daily overview & status',
    },
    {
      id: 'cycle',
      label: settings.plainLanguage ? 'My Cycle' : 'Cycle Calendar',
      icon: CalendarDays,
      description: '4 phases & period dates',
    },
    {
      id: 'diary',
      label: settings.plainLanguage ? 'Symptom Journal' : 'Symptom Journal',
      icon: BookHeart,
      description: 'Log pain, mood, energy',
    },
    {
      id: 'insights',
      label: settings.plainLanguage ? 'Health Guidance' : 'Health Assistant',
      icon: HelpCircle,
      description: 'Non-drug comfort & tips',
    },
    {
      id: 'reports',
      label: settings.plainLanguage ? 'Past Cycles' : 'Cycle History',
      icon: BarChart3,
      description: 'Trends & printable summary',
    },
    {
      id: 'predictor',
      label: settings.plainLanguage ? 'AI Model Lab' : 'Clinical Model Lab',
      icon: Sparkles,
      description: 'Trained ML & 250 cohort',
      badge: '96% Acc',
    },
    {
      id: 'privacy',
      label: settings.plainLanguage ? 'Caregiver & Safety' : 'Caregiver Support',
      icon: HeartHandshake,
      description: 'Sharing controls & privacy',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed lg:sticky top-[61px] left-0 z-40 h-[calc(100vh-61px)] bg-white border-r border-purple-100/80 transition-all duration-300 flex flex-col justify-between shrink-0 shadow-[1px_0_4px_rgba(139,92,246,0.02)] ${
          collapsed ? 'w-20' : 'w-64'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Navigation Item List */}
        <div className="p-3.5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all group relative ${
                  isActive
                    ? 'bg-purple-50 text-purple-950 font-bold shadow-sm border border-purple-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                      : 'bg-slate-100/80 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <span className="text-xs block leading-snug">{item.label}</span>
                      <span className="text-[10px] text-slate-400 block font-normal leading-tight">
                        {item.description}
                      </span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: Quick Accessibility & Collapse Toggle */}
        <div className="p-3.5 border-t border-purple-100/80 space-y-2 bg-slate-50/50">
          {/* Accessibility Settings Quick Link */}
          <button
            onClick={() => setIsA11yPanelOpen(true)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Accessibility Preferences"
          >
            <Sliders className="w-4 h-4 text-purple-600 shrink-0" />
            {!collapsed && (
              <span className="text-xs font-semibold">Accessibility Mode</span>
            )}
          </button>

          {/* Desktop Collapse / Expand Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
