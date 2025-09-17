import { QuestionnaireStep } from '@/components/ui';

export const onboardingQuestionnaireSteps: QuestionnaireStep[] = [
  // Personal Information
  {
    key: 'personal',
    title: 'First things first — what should I call you? 💌',
    subtitle: 'Your wellness journey starts with your name',
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'e.g. Sarah Johnson',
  },
  {
    key: 'birthday',
    title: "When's your special day? 🎂",
    subtitle: 'Helps me understand hormones & metabolism!',
    options: [], // This will be handled as date input
    inputType: 'date',
    placeholder: 'MM/DD/YY',
  },

  // Cycle Questions
  {
    key: 'cycle-start',
    title: '🩸 When did your last period start?',
    subtitle: 'This helps me predict your cycles accurately',
    options: [
      { value: 'know-date', label: 'I know the date 📅', description: 'I can provide the exact date', icon: '📅' },
      { value: 'dont-know', label: "I don't remember 🤷‍♀️", description: "We'll track it going forward", icon: '🤷‍♀️' },
    ],
  },
  {
    key: 'cycle-start-date',
    title: 'What was the date? 📅',
    subtitle: "Got it! We'll track from here",
    options: [], // This will be handled as date input
    inputType: 'date',
    placeholder: 'MM/DD/YY',
    showIf: { 'cycle-start': 'know-date' },
  },
  {
    key: 'cycle-regularity',
    title: '🔮 Is your cycle…',
    subtitle: 'This helps me give better predictions',
    options: [
      { value: 'regular', label: 'Super regular ⏰', description: 'Pretty predictable timing', icon: '⏰' },
      { value: 'irregular', label: 'Sometimes 🤷‍♀️', description: 'A bit unpredictable', icon: '🤷‍♀️' },
      { value: 'unknown', label: 'No clue 😅', description: "I'll help you figure it out", icon: '😅' },
    ],
  },
  {
    key: 'cycle-length',
    title: '📏 How long is your cycle usually?',
    subtitle: 'From first day of period to first day of next',
    options: [
      { value: '22', label: '21-24 days (short)', description: 'Shorter cycle', icon: '📏' },
      { value: '26', label: '25-27 days', description: 'Below average', icon: '📏' },
      { value: '29', label: '28-30 days (average)', description: 'Most common length', icon: '📏' },
      { value: '32', label: '31-33 days', description: 'Above average', icon: '📏' },
      { value: '35', label: '34+ days (long)', description: 'Longer cycle', icon: '📏' },
      { value: 'unknown', label: "I'm not sure 🤷‍♀️", description: "We'll figure it out together", icon: '🤷‍♀️' },
    ],
  },
  {
    key: 'cycle-symptoms',
    title: 'How do you usually feel before your period? 😌',
    subtitle: 'Select all that apply to you',
    options: [
      { value: 'tired', label: 'Tired 😴', description: 'Low energy levels', icon: '😴' },
      { value: 'irritable', label: 'Irritable 😡', description: 'Mood swings', icon: '😡' },
      { value: 'bloating', label: 'Bloating 🫄', description: 'Feeling puffy', icon: '🫄' },
      { value: 'chocolate', label: 'Chocolate monster 🍫', description: 'Craving sweets', icon: '🍫' },
      { value: 'chill', label: 'Pretty chill 😌', description: 'Not much changes', icon: '😌' },
    ],
    multiSelect: true,
  },
  {
    key: 'flow-intensity',
    title: '💧 How would you describe your typical period flow?',
    subtitle: 'This helps me give you better period predictions',
    options: [
      { value: 'light', label: 'Light flow 💧', description: 'Minimal flow', icon: '💧' },
      { value: 'moderate', label: 'Moderate flow 💧💧', description: 'Average flow', icon: '💧' },
      { value: 'heavy', label: 'Heavy flow 💧💧💧', description: 'Heavier flow', icon: '💧' },
      { value: 'varies', label: 'It varies 🌊', description: 'Changes month to month', icon: '🌊' },
    ],
  },

  // Nutrition Questions
  {
    key: 'nutrition-style',
    title: '🍓 Tell me about your food vibe:',
    subtitle: 'What describes your eating style?',
    options: [
      { value: 'all', label: 'Eat everything 🙋‍♀️', description: 'No restrictions', icon: '🙋‍♀️' },
      { value: 'plants', label: 'Mostly plants 🥦', description: 'Plant-focused diet', icon: '🥦' },
      { value: 'vegan', label: 'Vegan queen 🌱', description: 'Plant-based lifestyle', icon: '🌱' },
      { value: 'surprise', label: 'Surprise me 🎲', description: 'Open to anything', icon: '🎲' },
    ],
  },
  {
    key: 'nutrition-goal',
    title: "What's your nutrition goal right now? 🥗",
    subtitle: 'Choose your main focus',
    options: [
      { value: 'lose_weight', label: 'Weight loss ⚖️', description: 'Healthy weight loss', icon: '⚖️' },
      { value: 'gain_muscle', label: 'Muscle gain 💪', description: 'Build lean muscle', icon: '💪' },
      { value: 'hormone_balance', label: 'Hormone balance 🌸', description: 'Support hormonal health', icon: '🌸' },
      { value: 'better_energy', label: 'Better energy ⚡', description: 'Boost energy levels', icon: '⚡' },
      { value: 'maintain', label: 'Just eat better 🥗', description: 'Overall nutrition', icon: '🥗' },
    ],
  },
  {
    key: 'nutrition-activity',
    title: 'How active are you in daily life? 🚶‍♀️',
    subtitle: 'This affects your daily calorie needs',
    options: [
      { value: 'sedentary', label: 'Mostly sitting 🪑', description: 'Desk job, little exercise', icon: '🪑' },
      { value: 'light', label: 'Lightly active 🚶', description: 'Light exercise 1-3 days/week', icon: '🚶' },
      { value: 'moderate', label: 'On my feet a lot 🏃‍♀️', description: 'Regular exercise 3-5 days/week', icon: '🏃‍♀️' },
      { value: 'active', label: 'Very active 🔥', description: 'Intense exercise 6-7 days/week', icon: '🔥' },
    ],
  },

  // Fitness Questions
  {
    key: 'fitness-goal',
    title: "What's your fitness goal? 🎯",
    subtitle: 'Choose your primary focus area',
    options: [
      { value: 'tone_up', label: 'Tone up ⚖️', description: 'Focus on body composition', icon: '⚖️' },
      { value: 'build_muscle', label: 'Strength 💪', description: 'Build muscle and get stronger', icon: '💪' },
      { value: 'flexibility', label: 'Flexibility 🧘', description: 'Improve mobility and stretch', icon: '🧘' },
      { value: 'improve_endurance', label: 'Cardio queen 🏃', description: 'Boost cardiovascular fitness', icon: '🏃' },
      { value: 'general_wellness', label: 'Just feel better ✨', description: 'Overall health and wellness', icon: '✨' },
    ],
  },
  {
    key: 'fitness-frequency',
    title: 'How often do you work out? 🏋️‍♀️',
    subtitle: 'This helps us plan your weekly routine',
    options: [
      { value: 'never', label: 'Never 😅', description: 'Just getting started', icon: '😅' },
      { value: '1-2', label: '1-2x a week 🐢', description: 'Light and easy', icon: '🐢' },
      { value: '3-4', label: '3-4x a week ⚡', description: 'Regular routine', icon: '⚡' },
      { value: '5-6', label: '5+ times 🔥', description: 'Very committed', icon: '🔥' },
    ],
  },
  {
    key: 'fitness-style',
    title: 'What kind of workouts do you enjoy? 🏋️‍♀️',
    subtitle: 'Select all that apply to you',
    options: [
      { value: 'strength', label: 'Strength 🏋️', description: 'Weight training', icon: '🏋️' },
      { value: 'yoga', label: 'Yoga/Pilates 🧘', description: 'Mind-body connection', icon: '🧘' },
      { value: 'cardio', label: 'Cardio 🏃', description: 'Running, cycling', icon: '🏃' },
      { value: 'dance', label: 'Dance 💃', description: 'Fun movement', icon: '💃' },
      { value: 'walking', label: 'Walking 🚶‍♀️', description: 'Low-impact exercise', icon: '🚶‍♀️' },
    ],
    multiSelect: true,
  },
  {
    key: 'fitness-location',
    title: 'Where do you usually work out? 🏠',
    subtitle: 'Choose your preferred workout space',
    options: [
      { value: 'home', label: 'At home 🏠', description: 'Home workouts', icon: '🏠' },
      { value: 'gym', label: 'At the gym 🏋️', description: 'Gym facilities', icon: '🏋️' },
      { value: 'outdoors', label: 'Outdoors 🌳', description: 'Nature workouts', icon: '🌳' },
      { value: 'none', label: "I don't (yet!) 😅", description: 'Getting started', icon: '😅' },
    ],
  },

  // Body & Units
  {
    key: 'body-units',
    title: 'Which units do you like to use? ⚖️',
    subtitle: 'Choose your measurement system',
    options: [
      { value: 'metric', label: 'Metric (kg, cm)', description: 'Kilograms and centimeters', icon: '📏' },
      { value: 'imperial', label: 'Imperial (lbs, ft)', description: 'Pounds and feet', icon: '📏' },
    ],
  },
  {
    key: 'body-height',
    title: "What's your height? 📏",
    subtitle: 'This helps me calculate your perfect nutrition targets!',
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'e.g. 165 cm or 5\'5"',
  },
  {
    key: 'body-weight',
    title: "What's your current weight? 💪",
    subtitle: 'Remember, this is just data to help me support your wellness journey!',
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'e.g. 65 kg or 140 lbs',
  },
  {
    key: 'body-goal-weight',
    title: 'Do you have a goal weight in mind? 🎯',
    subtitle: 'This is totally optional - some prefer focusing on how they feel!',
    options: [
      { value: 'has-goal', label: 'Yes, I have a goal weight 📈', description: 'I want to reach a specific weight', icon: '📈' },
      { value: 'no-goal', label: 'I want to focus on feeling strong 💪', description: 'Focus on strength and wellness', icon: '💪' },
    ],
  },
  {
    key: 'body-goal-weight-input',
    title: "What's your goal weight?",
    subtitle: 'Remember, the best goals are ones that make you feel amazing! ✨',
    options: [], // This will be handled as text input
    inputType: 'text',
    placeholder: 'e.g. 60 kg or 130 lbs',
    showIf: { 'body-goal-weight': 'has-goal' },
  },
];

