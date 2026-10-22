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
  pspiScore?: number; // 0 to 15 UNBC scale
  bioVidScale?: number; // 0 to 4 BioVid scale
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

// --- Machine Learning & Clinical Prediction Types ---

export interface PatientSimulationProfile {
  user_id?: string;
  name?: string;
  age: number;
  bmi: number;
  primary_disability: string;
  cooccurring_disability: string;
  communication_ability: string;
  aac_use: string;
  preferred_communication_format: string;
  caregiver_dependency_level: string;
  stress_level_1_10: number;
  exercise_freq_per_week: number;
  sleep_hours: number;
  diet_quality: string;
  reported_symptoms: string;
  pain_level_0_4_BioVid_scale: number;
  pspi_score_0_15_UNBC_scale: number;
  self_report_reliable: number;
  caregiver_observed_pain_0_4?: number;
  last_period_start?: string;
}

export interface ModelMetricDetails {
  name: string;
  agent?: string;
  algorithm: string;
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1_score?: number;
  roc_auc?: number;
  mae_days?: number;
  rmse_days?: number;
  mae?: number;
  r2_score?: number;
  confusion_matrix?: number[][];
  top_features?: Array<{ feature: string; importance: number }>;
  classes?: string[];
}

export interface DatasetInsights {
  total_users: number;
  disability_distribution: Record<string, number>;
  severity_distribution: Record<string, number>;
  alert_distribution: Record<string, number>;
  communication_distribution: Record<string, number>;
  avg_pain_by_disability: Record<string, number>;
  avg_cycle_by_disability: Record<string, number>;
  alert_rate_by_disability_pct: Record<string, number>;
  silent_distress_detected_count: number;
  mean_cycle_length: number;
  mean_stress_level: number;
  mean_sleep_hours: number;
}

export interface ModelPerformanceMetrics {
  timestamp: string;
  total_records: number;
  models: {
    cia_cycle_model: ModelMetricDetails;
    crdsa_alert_classifier: ModelMetricDetails;
    crdsa_risk_regressor: ModelMetricDetails;
    sua_severity_classifier: ModelMetricDetails;
  };
  dataset_insights: DatasetInsights;
}

export interface DatasetRecord {
  user_id: string;
  age: number;
  bmi: number;
  primary_disability: string;
  cooccurring_disability: string;
  disability_type: string;
  communication_ability: string;
  aac_use: string;
  preferred_communication_format: string;
  caregiver_dependency_level: string;
  stress_level_1_10: number;
  exercise_freq_per_week: number;
  sleep_hours: number;
  diet_quality: string;
  cycle_start_date: string;
  cycle_length_days: number;
  period_duration_days: number;
  predicted_next_cycle_start: string;
  reported_symptoms: string;
  pain_level_0_4_BioVid_scale: number;
  pspi_score_0_15_UNBC_scale: number;
  symptom_severity_category: string;
  self_report_reliable: number;
  caregiver_observed_pain_0_4: number;
  risk_score_0_15: number;
  caregiver_alert_triggered: string;
}

export interface LivePredictionResponse {
  cycle_intelligence: {
    predicted_cycle_start: string;
    predicted_cycle_length: number;
    predicted_period_duration: number;
    confidence_score: number;
    irregularity_alerts: string[];
    top_contributing_factors: Array<{ factor: string; weight: number; direction: string; detail: string }>;
  };
  symptoms: {
    pain_level: number;
    pspi_score: number;
    symptom_severity: string;
    silent_distress_flag: boolean;
    pain_masking_explanation?: string;
    health_indicators: string[];
  };
  medical_knowledge: {
    hygiene_guidance: string;
    nutrition_guidance: string;
    medication_reminders: string[];
    sensory_comfort_techniques: string[];
    consultation_guidance?: string;
  };
  caregiver_risk: {
    risk_score: number;
    alert_triggered: boolean;
    alert_probability: number;
    risk_level: string;
    caregiver_alerts: string[];
    recommended_actions: string[];
    top_risk_drivers: Array<{ driver: string; impact: number; level: string }>;
  };
  communication: {
    accessible_explanations: string;
    personalized_communication: string;
    preferred_format: string;
    audio_narration_script: string;
  };
  final_recommendation: string;
  plain_summary: string;
  clinical_summary: string;
  shap_factors: Array<{ factor: string; weight: number; description: string }>;
  disclaimer: string;
}
