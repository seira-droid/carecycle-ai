import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  activeSpeechText: string | null;
}

const defaultSettings: AccessibilitySettings = {
  lowStimulation: false,
  highContrast: false,
  fontSize: 'normal',
  dyslexicFont: false,
  plainLanguage: false,
  audioNarration: false,
  reducedMotion: false,
  sensorySoundAlerts: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('carecycle_a11y_settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        // default
      }
    }
    return defaultSettings;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('carecycle_a11y_settings', JSON.stringify(settings));

    // Apply class names to document body
    const body = document.body;

    if (settings.lowStimulation) {
      body.classList.add('low-stimulation');
    } else {
      body.classList.remove('low-stimulation');
    }

    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    body.classList.remove('text-size-lg', 'text-size-xl');
    if (settings.fontSize === 'large') {
      body.classList.add('text-size-lg');
    } else if (settings.fontSize === 'extra-large') {
      body.classList.add('text-size-xl');
    }

    if (settings.dyslexicFont) {
      body.classList.add('dyslexia-font');
    } else {
      body.classList.remove('dyslexia-font');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    stopSpeaking();
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // gentle, steady pace
    utterance.pitch = 1.0;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpeechText(cleanText);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechText(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechText(null);
    };
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setActiveSpeechText(null);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        speak,
        stopSpeaking,
        isSpeaking,
        activeSpeechText,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
