export interface OnboardingData {
  // Personal Info
  name: string;
  dateOfBirth: string;

  // Cycle Info
  knowsLastPeriod?: boolean;
  lastPeriodStart?: string;
  cycleRegularity?: 'regular' | 'irregular' | 'unknown';
  cycleLength?: number;
  cycleSymptoms?: string[];
  flowIntensity?: 'light' | 'moderate' | 'heavy' | 'varies';

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
  hasGoalWeight?: boolean;
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

// Chat-based onboarding types
export interface ChatOption {
  label: string;
  value: string;
}

export interface ChatQuestion {
  id: string;
  message: string;
  type: 'text' | 'select' | 'multi-select' | 'date' | 'number';
  options?: ChatOption[];
  followUp?: string | { [key: string]: string };
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ChatResponse {
  questionId: string;
  answer: string | string[] | number;
  timestamp: number;
}

export interface ChatOnboardingState {
  currentQuestionIndex: number;
  responses: ChatResponse[];
  isComplete: boolean;
  data: Partial<OnboardingData>;
}
