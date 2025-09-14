export interface OnboardingData {
  // Personal Info
  name: string;
  dateOfBirth: string;

  // Cycle Info
  lastPeriodStart?: string;
  cycleRegularity?: 'regular' | 'irregular' | 'unknown';
  cycleSymptoms?: string[];

  // Nutrition
  nutritionStyle?: 'all' | 'plants' | 'vegan' | 'surprise';
  nutritionGoal: string;
  activityLevel: string;
  nutritionExperience?: string;

  // Fitness Goals
  fitnessGoal: string;
  fitnessFrequency: string;
  fitnessExperience?: string;
  fitnessStyles?: string[];
  fitnessLocation?: 'home' | 'gym' | 'outdoors' | 'none';

  // Body Metrics
  height: number;
  weight: number;
  weightGoal?: number;
  units: 'metric' | 'imperial';

  // Preferences
  plan: 'yearly' | 'monthly';
}

export interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
}

export type CalendarType = 'birthday';

export interface OnboardingStepContentProps {
  data: OnboardingData;
  updateData: (key: keyof OnboardingData, value: any) => void;
  openCalendar: (type: CalendarType) => void;
}
