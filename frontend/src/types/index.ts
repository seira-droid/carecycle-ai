export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface UserProfile {
  id: string;
  name: string;
  pronouns: string;
  age: number;
  neurodiversity: string[];
  sensorySensitivities: string[];
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodStart: string;
  caregiverAssistance: boolean;
  caregiverName?: string;
  preferredLanguageMode: 'simple' | 'standard';
}

export interface CycleStatus {
  currentDay: number;
  totalDays: number;
  phase: CyclePhase;
  phaseDay: number;
  phaseDuration: number;
  periodStartDate: string;
  estimatedNextPeriod: string;
  daysUntilNextPeriod: number;
  isIrregular: boolean;
  irregularityAlert?: string;
}

export type FlowLevel = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type MoodType = 'calm' | 'happy' | 'anxious' | 'fatigued' | 'overstimulated' | 'low_spoons' | 'focused' | 'irritable';

export interface DiaryEntry {
  id: string;
  date: string;
  cycleDay: number;
  phase: CyclePhase;
  flow: FlowLevel;
  painLevel: number; // 0 to 10
  painLocations: string[];
  mood: MoodType;
  energyLevel: number; // 1 to 5
  sleepHours: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'restful';
  symptoms: string[];
  sensoryTriggers: string[];
  medications: string[];
  selfCarePracticed: string[];
  notes: string;
}

export interface AgentTelemetry {
  id: 'CIA' | 'SUA' | 'MKA' | 'CRDSA' | 'ACEA' | 'AO';
  name: string;
  fullTitle: string;
  role: string;
  status: 'idle' | 'processing' | 'active' | 'success' | 'alert';
  inputSummary: string;
  outputSummary: string;
  latencyMs: number;
  confidenceScore?: number;
  details: Record<string, any>;
}

export interface ContributingFactor {
  factor: string;
  weight: number; // percentage (positive or negative impact)
  description: string;
  plainDescription: string;
  category: 'historical' | 'symptom' | 'biometric' | 'sensory';
}

export interface ExplainableInsight {
  predictedPhase: CyclePhase;
  nextPeriodPrediction: string;
  confidenceScore: number; // 0.0 to 1.0
  uncertaintyMarginDays: number;
  plainExplanation: string;
  clinicalExplanation: string;
  contributingFactors: ContributingFactor[];
  dataLimitations: string[];
  medicalDisclaimer: string;
}

export interface AccessibilitySettings {
  lowStimulation: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  dyslexicFont: boolean;
  plainLanguage: boolean;
  audioNarration: boolean;
  reducedMotion: boolean;
  sensorySoundAlerts: boolean;
}

export interface WellnessRecommendation {
  id: string;
  category: 'comfort' | 'sensory' | 'nutrition' | 'hygiene' | 'movement';
  title: string;
  description: string;
  simpleDescription: string;
  icon: string;
  priority: 'routine' | 'recommended' | 'gentle_care';
}

export interface NotificationItem {
  id: string;
  type: 'cycle' | 'symptom' | 'sensory' | 'wellness';
  title: string;
  message: string;
  simpleMessage: string;
  timeAgo: string;
  read: boolean;
}
