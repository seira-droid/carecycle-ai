import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { apiService } from '../services/api';
import { mockProfiles } from '../data/sampleData';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    pronouns?: string;
    age?: number;
    neurodiversity?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; demoToken?: string }>;
  resetPassword: (email: string, resetToken: string, newPassword: string) => Promise<{ success: boolean; message: string; error?: string }>;
  logout: () => Promise<void>;
  switchDemoUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'carecycle_auth_token';
const USER_KEY = 'carecycle_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session on app mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const remoteUser = await apiService.getCurrentUser(storedToken);
          if (remoteUser) {
            const mappedUser: UserProfile = {
              id: remoteUser.id,
              name: remoteUser.name,
              pronouns: remoteUser.pronouns || 'she/they',
              age: remoteUser.age || 18,
              neurodiversity: remoteUser.neurodiversity || ['Neurodivergent'],
              sensorySensitivities: remoteUser.sensory_sensitivities || ['Tactile sensitivity', 'Low noise tolerance'],
              averageCycleLength: remoteUser.average_cycle_length || 28,
              averagePeriodLength: remoteUser.average_period_length || 5,
              lastPeriodStart: remoteUser.last_period_start || '2026-10-01',
              caregiverAssistance: remoteUser.caregiver_assistance ?? true,
              caregiverName: remoteUser.caregiver_name || 'Marcus Vance (Caregiver)',
              preferredLanguageMode: remoteUser.preferred_language_mode || 'standard',
            };
            setUser(mappedUser);
            localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
          }
        } catch {
          // If offline or invalid token, retain cached user or clear
          const cached = localStorage.getItem(USER_KEY);
          if (cached) {
            try {
              setUser(JSON.parse(cached));
            } catch {
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
              setToken(null);
              setUser(null);
            }
          } else {
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiService.login(email, password);
      const mappedUser: UserProfile = {
        id: res.user.id,
        name: res.user.name,
        pronouns: res.user.pronouns || 'she/they',
        age: res.user.age || 18,
        neurodiversity: res.user.neurodiversity || ['Neurodivergent Baseline'],
        sensorySensitivities: res.user.sensory_sensitivities || ['Tactile sensitivity'],
        averageCycleLength: res.user.average_cycle_length || 28,
        averagePeriodLength: res.user.average_period_length || 5,
        lastPeriodStart: res.user.last_period_start || '2026-10-01',
        caregiverAssistance: res.user.caregiver_assistance ?? true,
        caregiverName: res.user.caregiver_name || 'Assigned Caregiver',
        preferredLanguageMode: res.user.preferred_language_mode || 'standard',
      };

      setToken(res.access_token);
      setUser(mappedUser);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
      return { success: true };
    } catch (err: any) {
      // Offline fallback for demo accounts if backend is temporarily disconnected
      if (
        (email.toLowerCase() === 'elena.vance@carecycle.health' || email.toLowerCase() === 'demo@carecycle.health') &&
        password === 'CareCycle2026!'
      ) {
        const fallbackUser = mockProfiles[0];
        const demoToken = 'cc_offline_demo_token';
        setToken(demoToken);
        setUser(fallbackUser);
        localStorage.setItem(TOKEN_KEY, demoToken);
        localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
        return { success: true };
      }
      return { success: false, error: err.message || 'Login failed. Please verify your credentials.' };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    pronouns?: string;
    age?: number;
    neurodiversity?: string[];
  }) => {
    try {
      const res = await apiService.register(data);
      const mappedUser: UserProfile = {
        id: res.user.id,
        name: res.user.name,
        pronouns: res.user.pronouns || data.pronouns || 'she/they',
        age: res.user.age || data.age || 18,
        neurodiversity: res.user.neurodiversity || data.neurodiversity || ['Neurodivergent Baseline'],
        sensorySensitivities: res.user.sensory_sensitivities || ['Sensory sensitivity'],
        averageCycleLength: 28,
        averagePeriodLength: 5,
        lastPeriodStart: new Date().toISOString().split('T')[0],
        caregiverAssistance: false,
        preferredLanguageMode: 'standard',
      };

      setToken(res.access_token);
      setUser(mappedUser);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await apiService.requestPasswordReset(email);
      return { success: true, message: res.message, demoToken: res.demo_reset_token };
    } catch (err: any) {
      return { success: false, message: err.message || 'Unable to process recovery request.' };
    }
  };

  const resetPassword = async (email: string, resetToken: string, newPassword: string) => {
    try {
      const res = await apiService.confirmPasswordReset(email, resetToken, newPassword);
      return { success: true, message: res.message };
    } catch (err: any) {
      return { success: false, message: '', error: err.message || 'Password reset failed.' };
    }
  };

  const logout = async () => {
    await apiService.logout(token);
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const switchDemoUser = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
