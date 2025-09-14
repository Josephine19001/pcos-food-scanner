import { QuestionnaireStep } from '@/components/ui';

export const nutritionQuestionnaireSteps: QuestionnaireStep[] = [
  {
    key: 'goal',
    title: "What's your nutrition goal?",
    subtitle: 'This will help us customize your plan.',
    options: [
      {
        value: 'lose_weight',
        label: 'Lose Weight',
        description: 'Healthy weight loss for women',
      },
      {
        value: 'gain_muscle',
        label: 'Build Muscle',
        description: 'Lean muscle development',
      },
      {
        value: 'maintain',
        label: 'Maintain Weight',
        description: 'Stay at current healthy weight',
      },
      {
        value: 'improve_health',
        label: 'Improve Health',
        description: 'Focus on overall wellness',
      },
    ],
  },
  {
    key: 'activity',
    title: 'How active are you?',
    subtitle: 'This affects your daily calorie needs.',
    options: [
      { value: 'sedentary', label: 'Sedentary', description: 'Desk job, minimal exercise' },
      { value: 'light', label: 'Light Activity', description: 'Light workouts 1-3 days/week' },
      {
        value: 'moderate',
        label: 'Moderate Activity',
        description: 'Regular workouts 3-5 days/week',
      },
      { value: 'active', label: 'Very Active', description: 'Intense workouts 6-7 days/week' },
    ],
  },
  {
    key: 'experience',
    title: "What's your nutrition experience?",
    subtitle: "We'll adjust recommendations accordingly.",
    options: [
      { value: 'beginner', label: 'Beginner', description: 'New to nutrition tracking' },
      {
        value: 'intermediate',
        label: 'Intermediate',
        description: 'Some experience with healthy eating',
      },
      {
        value: 'advanced',
        label: 'Advanced',
        description: 'Experienced with nutrition planning',
      },
    ],
  },
];

// Helper functions to format display values
export const formatGoal = (goal: string) => {
  const goalMap: Record<string, string> = {
    lose_weight: 'Lose Weight',
    gain_muscle: 'Gain Muscle', 
    maintain: 'Maintain Weight',
    improve_health: 'Improve Health',
    // NEW VALUES from onboarding chat
    hormone_balance: 'Hormone Balance',
    better_energy: 'Better Energy',
  };
  return goalMap[goal] || goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatActivityLevel = (level: string) => {
  const levelMap: Record<string, string> = {
    sedentary: 'Sedentary',
    light: 'Light Activity',
    moderate: 'Moderate Activity',
    active: 'Very Active',
  };
  return levelMap[level] || level.replace('_', ' ');
};

export const formatNutritionStyle = (style: string) => {
  const styleMap: Record<string, string> = {
    all: 'Eat Everything',
    plants: 'Mostly Plants',
    vegan: 'Vegan',
    surprise: 'Surprise Me',
  };
  return styleMap[style] || style.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};
