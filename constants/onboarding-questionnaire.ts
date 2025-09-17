import { QuestionnaireStep } from '@/components/ui';

export const onboardingQuestionnaireSteps: QuestionnaireStep[] = [
  // Personal Information
  {
    key: 'personal',
    title: 'What should we call you?',
    subtitle: 'We want to personalize your wellness journey',
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'e.g. Sarah Johnson',
  },
  {
    key: 'birthday',
    title: "What's your birthday?",
    subtitle: 'This helps us understand your hormones better',
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'MM/DD/YYYY',
  },

  // Cycle Questions
  {
    key: 'cycle-start',
    title: 'When did your last period start?',
    subtitle: 'This helps us predict your upcoming cycles',
    options: [
      {
        value: 'know-date',
        label: 'I know the date',
        description: 'I can provide the exact date',
        icon: '📅',
      },
      {
        value: 'dont-know',
        label: "I don't remember",
        description: "We'll track it going forward",
        icon: '🤷‍♀️',
      },
    ],
  },
  {
    key: 'cycle-start-date',
    title: 'What was the date?',
    subtitle: "Perfect! We'll use this to track your cycle patterns",
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'MM/DD/YYYY',
    showIf: { 'cycle-start': 'know-date' },
  },
  {
    key: 'cycle-regularity',
    title: 'How would you describe your cycle?',
    subtitle: 'This helps us understand your unique patterns',
    options: [
      {
        value: 'regular',
        label: 'Super regular',
        description: 'Pretty predictable timing',
        icon: '⏰',
      },
      { value: 'irregular', label: 'Sometimes', description: 'A bit unpredictable', icon: '🤷‍♀️' },
      {
        value: 'unknown',
        label: 'No clue',
        description: "I'll help you figure it out",
        icon: '😅',
      },
    ],
  },
  {
    key: 'cycle-length',
    title: 'How long is your cycle usually?',
    subtitle: 'Count from first day of one period to first day of next',
    options: [
      { value: '22', label: '21-24 days (short)', description: 'Shorter cycle', icon: '' },
      { value: '26', label: '25-27 days', description: 'Below average', icon: '' },
      { value: '29', label: '28-30 days (average)', description: 'Most common length', icon: '' },
      { value: '32', label: '31-33 days', description: 'Above average', icon: '' },
      { value: '35', label: '34+ days (long)', description: 'Longer cycle', icon: '' },
      {
        value: 'unknown',
        label: "I'm not sure",
        description: "We'll figure it out together",
        icon: '🤷‍♀️',
      },
    ],
  },
  {
    key: 'cycle-symptoms',
    title: 'How do you feel before your period?',
    subtitle: 'Select all that apply - this helps us understand your PMS patterns',
    options: [
      { value: 'tired', label: 'Tired', description: 'Low energy levels', icon: '😴' },
      { value: 'irritable', label: 'Irritable', description: 'Mood swings', icon: '😡' },
      { value: 'bloating', label: 'Bloating', description: 'Feeling puffy', icon: '🫄' },
      {
        value: 'chocolate',
        label: 'Chocolate monster',
        description: 'Craving sweets',
        icon: '🍫',
      },
      { value: 'chill', label: 'Pretty chill', description: 'Not much changes', icon: '😌' },
    ],
    multiSelect: true,
  },
  {
    key: 'flow-intensity',
    title: 'How would you describe your typical period flow?',
    subtitle: 'This helps us give you better period predictions',
    options: [
      { value: 'light', label: 'Light flow', description: 'Minimal flow', icon: '🩸' },
      { value: 'moderate', label: 'Moderate flow', description: 'Average flow', icon: '🩸🩸' },
      { value: 'heavy', label: 'Heavy flow', description: 'Heavier flow', icon: '🩸🩸🩸' },
      { value: 'varies', label: 'It varies', description: 'Changes month to month', icon: '🌊' },
    ],
  },

  // Nutrition Questions
  {
    key: 'nutrition-style',
    title: "What's your eating style like?",
    subtitle: 'This helps us create meal plans that fit your lifestyle',
    options: [
      { value: 'all', label: 'Eat everything', description: 'No restrictions', icon: '🙋‍♀️' },
      { value: 'plants', label: 'Mostly plants', description: 'Plant-focused diet', icon: '🥦' },
      { value: 'vegan', label: 'Vegan queen', description: 'Plant-based lifestyle', icon: '🌱' },
      { value: 'surprise', label: 'Surprise us', description: 'Open to anything', icon: '🎲' },
    ],
  },
  {
    key: 'nutrition-goal',
    title: "What's your nutrition goal?",
    subtitle: 'This helps us tailor your meal plans to what matters most',
    options: [
      {
        value: 'lose_weight',
        label: 'Weight loss',
        description: 'Healthy weight loss',
        icon: '⚖️',
      },
      {
        value: 'gain_muscle',
        label: 'Muscle gain',
        description: 'Build lean muscle',
        icon: '💪',
      },
      {
        value: 'hormone_balance',
        label: 'Hormone balance',
        description: 'Support hormonal health',
        icon: '🌸',
      },
      {
        value: 'better_energy',
        label: 'Better energy',
        description: 'Boost energy levels',
        icon: '⚡',
      },
      {
        value: 'maintain',
        label: 'Just eat better',
        description: 'Overall nutrition',
        icon: '🥗',
      },
    ],
  },
  {
    key: 'nutrition-activity',
    title: 'How active are you daily?',
    subtitle: 'This helps us calculate your calorie needs',
    options: [
      {
        value: 'sedentary',
        label: 'Mostly sitting',
        description: 'Desk job, little exercise',
        icon: '🪑',
      },
      {
        value: 'light',
        label: 'Lightly active',
        description: 'Light exercise 1-3 days/week',
        icon: '🚶',
      },
      {
        value: 'moderate',
        label: 'On my feet a lot',
        description: 'Regular exercise 3-5 days/week',
        icon: '🏃‍♀️',
      },
      {
        value: 'active',
        label: 'Very active',
        description: 'Intense exercise 6-7 days/week',
        icon: '🔥',
      },
    ],
  },

  // Fitness Questions
  {
    key: 'fitness-goal',
    title: "What's your fitness goal?",
    subtitle: 'This helps us create workout plans that fit your goals',
    options: [
      {
        value: 'tone_up',
        label: 'Tone up',
        description: 'Focus on body composition',
        icon: '⚖️',
      },
      {
        value: 'build_muscle',
        label: 'Strength',
        description: 'Build muscle and get stronger',
        icon: '💪',
      },
      {
        value: 'flexibility',
        label: 'Flexibility',
        description: 'Improve mobility and stretch',
        icon: '🧘',
      },
      {
        value: 'improve_endurance',
        label: 'Cardio queen',
        description: 'Boost cardiovascular fitness',
        icon: '🏃',
      },
      {
        value: 'general_wellness',
        label: 'Just feel better',
        description: 'Overall health and wellness',
        icon: '✨',
      },
    ],
  },
  {
    key: 'fitness-frequency',
    title: 'How often do you currently work out?',
    subtitle: 'This helps me create a realistic workout plan that fits your current routine',
    options: [
      { value: 'never', label: 'Never', description: 'Just getting started', icon: '😅' },
      { value: '1-2', label: '1-2x a week', description: 'Light and easy', icon: '🐢' },
      { value: '3-4', label: '3-4x a week', description: 'Regular routine', icon: '⚡' },
      { value: '5-6', label: '5+ times', description: 'Very committed', icon: '🔥' },
    ],
  },
  {
    key: 'fitness-style',
    title: 'What kind of workouts do you enjoy?',
    subtitle: 'Select all that you like - this helps us create workouts you will enjoy',
    options: [
      { value: 'strength', label: 'Strength', description: 'Weight training', icon: '🏋️' },
      { value: 'yoga', label: 'Yoga/Pilates', description: 'Mind-body connection', icon: '🧘' },
      { value: 'cardio', label: 'Cardio', description: 'Running, cycling', icon: '🏃' },
      { value: 'dance', label: 'Dance', description: 'Fun movement', icon: '💃' },
      { value: 'walking', label: 'Walking', description: 'Low-impact exercise', icon: '🚶‍♀️' },
    ],
    multiSelect: true,
  },
  {
    key: 'fitness-location',
    title: 'Where do you prefer to work out?',
    subtitle: 'This helps us design workouts for your space and equipment',
    options: [
      { value: 'home', label: 'At home', description: 'Home workouts', icon: '🏠' },
      { value: 'gym', label: 'At the gym', description: 'Gym facilities', icon: '🏋️' },
      { value: 'outdoors', label: 'Outdoors', description: 'Nature workouts', icon: '🌳' },
      { value: 'none', label: "I don't (yet!)", description: 'Getting started', icon: '😅' },
    ],
  },

  // Body & Units
  {
    key: 'body-units',
    title: 'Which measurement system do you prefer?',
    subtitle: 'This helps us show your progress in units that make sense to you',
    options: [
      {
        value: 'metric',
        label: 'Metric (kg, cm)',
        description: 'Kilograms and centimeters',
        icon: '',
      },
      {
        value: 'imperial',
        label: 'Imperial (lbs, ft)',
        description: 'Pounds and feet',
        icon: '',
      },
    ],
  },
  {
    key: 'body-height',
    title: "What's your height?",
    subtitle: 'This helps us calculate your nutrition targets and calorie needs',
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'e.g. 165 cm or 5\'5"',
  },
  {
    key: 'body-weight',
    title: "What's your current weight?",
    subtitle: 'This is just data to help us support your wellness journey - no judgment!',
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'e.g. 65 kg or 140 lbs',
  },
  {
    key: 'body-goal-weight',
    title: 'Do you have a goal weight in mind?',
    subtitle: 'This is totally optional - some prefer focusing on how they feel!',
    options: [
      {
        value: 'has-goal',
        label: 'Yes, I have a goal weight',
        description: 'I want to reach a specific weight',
        icon: '📈',
      },
      {
        value: 'no-goal',
        label: 'I want to focus on feeling strong',
        description: 'Focus on strength and wellness',
        icon: '💪',
      },
    ],
  },
  {
    key: 'body-goal-weight-input',
    title: "What's your goal weight?",
    subtitle: 'The best goals are ones that make you feel amazing!',
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'e.g. 60 kg or 130 lbs',
    showIf: { 'body-goal-weight': 'has-goal' },
  },
];
