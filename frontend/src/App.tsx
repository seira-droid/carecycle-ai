import React, { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { LoginPage } from './components/auth/LoginPage';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { ClinicalPredictor } from './components/predictor/ClinicalPredictor';
import { CycleTracker } from './components/cycle/CycleTracker';
import { HealthDiary } from './components/diary/HealthDiary';
import { ExplainableAI } from './components/insights/ExplainableAI';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { PrivacySafety } from './components/privacy/PrivacySafety';
import { QuickLogModal } from './components/diary/QuickLogModal';
import { AccessibilityPanel } from './components/accessibility/AccessibilityPanel';
import { Heart, RefreshCw } from 'lucide-react';

const ProtectedShell: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { activeTab } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF8FD] text-slate-700">
        <div className="w-14 h-14 rounded-3xl bg-purple-100 flex items-center justify-center mb-4 text-purple-700 shadow-sm animate-pulse">
          <Heart className="w-7 h-7 fill-purple-600" />
        </div>
        <p className="text-sm font-bold text-slate-800 font-['Outfit']">CareCycle AI</p>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Securing confidential session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FD] text-slate-800">
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
          {activeTab === 'cycle' && <CycleTracker />}
          {activeTab === 'diary' && <HealthDiary />}
          {activeTab === 'insights' && <ExplainableAI />}
          {activeTab === 'reports' && <ReportsAnalytics />}
          {activeTab === 'predictor' && <ClinicalPredictor />}
          {activeTab === 'privacy' && <PrivacySafety />}
        </main>
      </div>

      {/* Modals & Accessibility Drawer */}
      <QuickLogModal />
      <AccessibilityPanel />
    </div>
  );
};

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <AppProvider>
          <ProtectedShell />
        </AppProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}
