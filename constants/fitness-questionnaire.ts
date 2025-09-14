import { QuestionnaireStep } from '@/components/ui';

export const fitnessQuestionnaireSteps: QuestionnaireStep[] = [
  {
    key: 'goal',
    title: "What's your fitness goal?",
    subtitle: 'Choose your primary focus area.',
    options: [
      {
        value: 'lose_weight',
        label: 'Lose Weight',
        description: 'Focus on cardio and calorie burn',
        icon: '🔥',
      },
      {
        value: 'build_muscle',
        label: 'Build Muscle',
        description: 'Strength training and muscle growth',
        icon: '💪',
      },
      {
        value: 'improve_endurance',
        label: 'Improve Endurance',
        description: 'Cardiovascular fitness and stamina',
        icon: '🏃',
      },
      {
        value: 'general_fitness',
        label: 'General Fitness',
        description: 'Overall health and wellness',
        icon: '⚡',
      },
    ],
  },
  {
    key: 'frequency',
    title: 'How many workouts do you do per week?',
    subtitle: 'This will be used to calibrate your custom plan.',
    options: [
      { value: '1-2', label: '1-2 times', description: 'Just getting started' },
      { value: '3-4', label: '3-4 times', description: 'Regular routine' },
      { value: '5-6', label: '5-6 times', description: 'Very committed' },
      { value: '7+', label: '7+ times', description: 'Daily workouts' },
    ],
  },
  {
    key: 'experience',
    title: "What's your experience level?",
    subtitle: "We'll adjust intensity accordingly.",
    options: [
      { value: 'beginner', label: 'Beginner', description: 'New to working out' },
      { value: 'intermediate', label: 'Intermediate', description: 'Some gym experience' },
      { value: 'advanced', label: 'Advanced', description: 'Experienced athlete' },
    ],
  },
];

// Helper functions to format display values
export const formatFitnessGoal = (goal: string) => {
  const goalMap: Record<string, string> = {
    lose_weight: 'Lose Weight',
    build_muscle: 'Build Muscle', 
    improve_endurance: 'Improve Endurance',
    general_fitness: 'General Fitness',
    // NEW VALUES from onboarding chat
    tone_up: 'Tone Up',
    flexibility: 'Flexibility',
    general_wellness: 'General Wellness',
  };
  return goalMap[goal] || goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatWorkoutFrequency = (freq: string) => {
  const freqMap: Record<string, string> = {
    never: 'Never',
    '1-2': '1-2 times per week',
    '3-4': '3-4 times per week', 
    '5-6': '5-6 times per week',
    '7+': '7+ times per week',
  };
  return freqMap[freq] || `${freq} times per week`;
};

export const formatFitnessExperience = (exp: string) => {
  const expMap: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return expMap[exp] || exp;
};
