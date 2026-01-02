// Reaction types
export type ReactionType = 'good' | 'okay' | 'bad';

// Meal type categories
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// Time after eating options
export type TimeAfterEating = 'immediate' | '30min' | '1hour' | '2hours' | 'next_day';

// Food-related symptom keys for journal entries
export type FoodSymptomKey =
  | 'bloating'
  | 'nausea'
  | 'stomachPain'
  | 'heartburn'
  | 'gas'
  | 'diarrhea'
  | 'constipation'
  | 'headache'
  | 'fatigue'
  | 'brainFog'
  | 'skinBreakout'
  | 'cravings';

// Legacy symptom keys (for onboarding)
export type SymptomKey =
  | 'irregularPeriods'
  | 'weightGain'
  | 'fatigue'
  | 'acne'
  | 'hairLoss'
  | 'hairGrowth'
  | 'moodSwings'
  | 'cravings'
  | 'bloating'
  | 'brainFog';

export interface FoodReaction {
  id: string;
  user_id: string;
  // Food info
  scan_id?: string | null;
  food_name: string;
  food_image_url?: string | null;
  meal_type?: MealType | null;
  // Reaction data
  reaction: ReactionType;
  symptoms: FoodSymptomKey[];
  severity?: number | null; // 1-5
  time_after_eating?: TimeAfterEating | null;
  energy_level?: number | null; // 1-5
  notes?: string | null;
  // Timestamps
  consumed_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFoodReactionInput {
  scan_id?: string;
  food_name: string;
  food_image_url?: string;
  meal_type?: MealType;
  reaction: ReactionType;
  symptoms?: FoodSymptomKey[];
  severity?: number;
  time_after_eating?: TimeAfterEating;
  energy_level?: number;
  notes?: string;
  consumed_at?: string;
}

export interface UpdateFoodReactionInput {
  meal_type?: MealType | null;
  reaction?: ReactionType;
  symptoms?: FoodSymptomKey[];
  severity?: number | null;
  time_after_eating?: TimeAfterEating | null;
  energy_level?: number | null;
  notes?: string | null;
}

// For displaying food options from scans
export interface FoodOption {
  id: string;
  name: string;
  image_url?: string;
  status: 'safe' | 'caution' | 'avoid';
  scanned_at: string;
}
