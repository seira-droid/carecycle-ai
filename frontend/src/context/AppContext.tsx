import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  CycleStatus,
  DiaryEntry,
  NotificationItem,
} from '../types';
import {
  mockProfiles,
  sampleNotifications,
} from '../data/sampleData';
import { apiService, BackendHealth } from '../services/api';

type TabView = 'dashboard' | 'cycle' | 'diary' | 'insights' | 'agents' | 'reports' | 'privacy';

interface AppContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  availableProfiles: UserProfile[];
  cycleStatus: CycleStatus;
  updateCycleStatus: (status: Partial<CycleStatus>) => void;
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: DiaryEntry) => void;
  deleteDiaryEntry: (id: string) => void;
  todayEntry: DiaryEntry | undefined;
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
  backendHealth: BackendHealth;
  checkBackend: () => Promise<void>;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  isQuickLogOpen: boolean;
  setIsQuickLogOpen: (open: boolean) => void;
  isA11yPanelOpen: boolean;
  setIsA11yPanelOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(mockProfiles[0]);
  const [availableProfiles] = useState<UserProfile[]>(mockProfiles);
  const [cycleStatus, setCycleStatusState] = useState<CycleStatus>(() => apiService.getCycleStatus());
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => apiService.getDiaryEntries());
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [backendHealth, setBackendHealth] = useState<BackendHealth>({ connected: false, url: 'http://localhost:8000' });
  const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isA11yPanelOpen, setIsA11yPanelOpen] = useState(false);

  const checkBackend = async () => {
    const health = await apiService.checkHealth();
    setBackendHealth(health);
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  const updateCycleStatus = (partial: Partial<CycleStatus>) => {
    setCycleStatusState((prev) => {
      const updated = { ...prev, ...partial };
      apiService.saveCycleStatus(updated);
      return updated;
    });
  };

  const addDiaryEntry = (entry: DiaryEntry) => {
    const updated = apiService.saveDiaryEntry(entry);
    setDiaryEntries(updated);
  };

  const deleteDiaryEntry = (id: string) => {
    const updated = apiService.deleteDiaryEntry(id);
    setDiaryEntries(updated);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Find today's entry (e.g. 2026-10-11 or current date)
  const todayEntry = diaryEntries.find((d) => d.cycleDay === cycleStatus.currentDay);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        availableProfiles,
        cycleStatus,
        updateCycleStatus,
        diaryEntries,
        addDiaryEntry,
        deleteDiaryEntry,
        todayEntry,
        activeTab,
        setActiveTab,
        backendHealth,
        checkBackend,
        notifications,
        markNotificationRead,
        isQuickLogOpen,
        setIsQuickLogOpen,
        isA11yPanelOpen,
        setIsA11yPanelOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
