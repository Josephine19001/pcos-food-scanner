import { createContext, useContext, useState, ReactNode } from 'react';
import type { OnboardingProfile } from '@/lib/hooks/use-accounts';

export interface OnboardingData {
  // Their personal "why" - what they want to achieve
  primaryGoal: string | null;
  // PCOS symptoms they're dealing with
  symptoms: string[];
  // How PCOS affects their daily life
  dailyStruggles: string[];
  // Their relationship with food
  foodRelationship: string | null;
  // Foods that make them feel good
  feelGoodFoods: string[];
  // Foods they want to enjoy without guilt
  guiltFoods: string[];
  // How active they are (no judgment)
  activityLevel: string | null;
  // How they found us
  referralSource: string | null;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  toggleArrayItem: (field: keyof OnboardingData, value: string) => void;
  resetData: () => void;
  loadFromProfile: (profile: OnboardingProfile) => void;
}

const defaultData: OnboardingData = {
  primaryGoal: null,
  symptoms: [],
  dailyStruggles: [],
  foodRelationship: null,
  feelGoodFoods: [],
  guiltFoods: [],
  activityLevel: null,
  referralSource: null,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (field: keyof OnboardingData, value: string) => {
    setData((prev) => {
      const currentArray = prev[field];
      if (!Array.isArray(currentArray)) return prev;

      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return { ...prev, [field]: newArray };
    });
  };

  const resetData = () => {
    setData(defaultData);
  };

  const loadFromProfile = (profile: OnboardingProfile) => {
    setData({
      primaryGoal: profile.primary_goal,
      symptoms: profile.symptoms ?? [],
      dailyStruggles: profile.daily_struggles ?? [],
      foodRelationship: profile.food_relationship,
      feelGoodFoods: profile.feel_good_foods ?? [],
      guiltFoods: profile.guilt_foods ?? [],
      activityLevel: profile.activity_level,
      referralSource: profile.referral_source,
    });
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, toggleArrayItem, resetData, loadFromProfile }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
