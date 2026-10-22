import React, { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { ClinicalPredictor } from './components/predictor/ClinicalPredictor';
import { CycleTracker } from './components/cycle/CycleTracker';
import { HealthDiary } from './components/diary/HealthDiary';
import { ExplainableAI } from './components/insights/ExplainableAI';
import { AgentMonitoring } from './components/agents/AgentMonitoring';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { PrivacySafety } from './components/privacy/PrivacySafety';
import { QuickLogModal } from './components/diary/QuickLogModal';
import { AccessibilityPanel } from './components/accessibility/AccessibilityPanel';

const DashboardContent: React.FC = () => {
  const { activeTab } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fd] text-slate-800">
      {/* Research & Medical Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Main Body with Sidebar + Active View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          isOpenMobile={mobileSidebarOpen}
          setIsOpenMobile={setMobileSidebarOpen}
        />

        <main className="flex-1 p-4 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && <MainDashboard />}
          {activeTab === 'predictor' && <ClinicalPredictor />}
          {activeTab === 'cycle' && <CycleTracker />}
          {activeTab === 'diary' && <HealthDiary />}
          {activeTab === 'insights' && <ExplainableAI />}
          {activeTab === 'agents' && <AgentMonitoring />}
          {activeTab === 'reports' && <ReportsAnalytics />}
          {activeTab === 'privacy' && <PrivacySafety />}
        </main>
      </div>

      {/* Modals & Drawers */}
      <QuickLogModal />
      <AccessibilityPanel />
    </div>
  );
};

export default function App() {
  return (
    <AccessibilityProvider>
      <AppProvider>
        <DashboardContent />
      </AppProvider>
    </AccessibilityProvider>
  );
}
