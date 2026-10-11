import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BookHeart,
  Lightbulb,
  Cpu,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  HeartHandshake,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
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
  const { activeTab, setActiveTab, user } = useApp();
  const { settings } = useAccessibility();

  const navItems = [
    {
      id: 'dashboard',
      label: settings.plainLanguage ? 'Home' : 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & daily status',
    },
    {
      id: 'cycle',
      label: settings.plainLanguage ? 'Cycle Calendar' : 'Cycle Tracker',
      icon: CalendarDays,
      description: '4 phases & calendar',
    },
    {
      id: 'diary',
      label: settings.plainLanguage ? 'My Health Log' : 'Symptom Diary',
      icon: BookHeart,
      description: 'Daily symptoms & mood',
    },
    {
      id: 'insights',
      label: settings.plainLanguage ? 'AI Reasons' : 'AI Insights',
      icon: Lightbulb,
      description: 'Explainable phase logic',
    },
    {
      id: 'agents',
      label: settings.plainLanguage ? 'Agent Team' : 'AI Agents',
      icon: Cpu,
      description: 'Multi-agent monitoring',
      badge: '5+AO',
    },
    {
      id: 'reports',
      label: settings.plainLanguage ? 'Trends & Charts' : 'Reports & Analytics',
      icon: BarChart3,
      description: 'Patterns & PDF export',
    },
    {
      id: 'privacy',
      label: settings.plainLanguage ? 'Safety & Privacy' : 'Privacy & Safety',
      icon: ShieldCheck,
      description: 'Data controls & support',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-[57px] left-0 z-40 h-[calc(100vh-57px)] bg-white border-r border-slate-200/80 transition-all duration-300 flex flex-col justify-between shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Navigation list */}
        <div className="p-3 space-y-1 overflow-y-auto">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-700 font-semibold border border-purple-200/60 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`p-2 rounded-lg shrink-0 transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-normal truncate block">
                      {item.description}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom card & collapse toggle */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {!collapsed && (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-teal-50/50 border border-purple-100/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-900 mb-1">
                <HeartHandshake className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Disability Accommodations</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Sensory support active for {user.neurodiversity[0]}. Zero overwhelming animations.
              </p>
            </div>
          )}

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
