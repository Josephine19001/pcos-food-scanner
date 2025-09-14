import { ChatQuestion } from '@/types/onboarding';

export const chatQuestions: ChatQuestion[] = [
  {
    id: 'welcome',
    message:
      "👋 Hey gorgeous, I'm Luna — your cycle & wellness BFF. Let's make your days more synced ✨",
    type: 'select',
    options: [{ label: "Let's do it 💫", value: 'start' }],
  },

  // 1️⃣ Personal Info
  {
    id: 'personal',
    message: 'First things first — what should I call you? 💌',
    type: 'text',
    followUp: 'Love it! {answer} is such a cute name 💕',
    placeholder: 'e.g. Sarah Johnson',
    validation: { required: true },
  },
  {
    id: 'birthday',
    message: "When's your special day? 🎂 (Helps me understand hormones & metabolism!)",
    type: 'date',
    followUp: 'Perfect, got it 🎉',
    placeholder: 'MM/DD/YY',
    validation: { required: true },
  },

  // 2️⃣ Cycle Questions
  {
    id: 'cycle-start',
    message: '🩸 When did your last period start?',
    type: 'select',
    options: [
      { label: 'I know the date 📅', value: 'know-date' },
      { label: "I don't remember 🤷‍♀️", value: 'dont-know' },
    ],
    followUp: {
      'know-date': 'Perfect! Let me get that date from you 📅',
      'dont-know': "No worries! We'll track it going forward 💕",
    },
  },
  {
    id: 'cycle-start-date',
    message: 'What was the date? 📅',
    type: 'date',
    followUp: "Got it! We'll track from here 📆",
    placeholder: 'MM/DD/YY',
    validation: { required: true },
  },
  {
    id: 'cycle-regularity',
    message: '🔮 Is your cycle…',
    type: 'select',
    options: [
      { label: 'Super regular ⏰', value: 'regular' },
      { label: 'Sometimes 🤷‍♀️', value: 'irregular' },
      { label: 'No clue 😅', value: 'unknown' },
    ],
  },
  {
    id: 'cycle-length',
    message: '📏 How long is your cycle usually? (from first day of period to first day of next)',
    type: 'select',
    options: [
      { label: '21-24 days (short)', value: '22' },
      { label: '25-27 days', value: '26' },
      { label: '28-30 days (average)', value: '29' },
      { label: '31-33 days', value: '32' },
      { label: '34+ days (long)', value: '35' },
      { label: "I'm not sure 🤷‍♀️", value: 'unknown' },
    ],
    followUp: "Perfect! This helps me predict your cycles more accurately 🎯",
  },
  {
    id: 'cycle-symptoms',
    message: 'How do you usually feel before your period? 😌',
    type: 'multi-select',
    options: [
      { label: 'Tired 😴', value: 'tired' },
      { label: 'Irritable 😡', value: 'irritable' },
      { label: 'Bloating 🫄', value: 'bloating' },
      { label: 'Chocolate monster 🍫', value: 'chocolate' },
      { label: 'Pretty chill 😌', value: 'chill' },
    ],
  },
  {
    id: 'flow-intensity',
    message: '💧 How would you describe your typical period flow?',
    type: 'select',
    options: [
      { label: 'Light flow 💧', value: 'light' },
      { label: 'Moderate flow 💧💧', value: 'moderate' },
      { label: 'Heavy flow 💧💧💧', value: 'heavy' },
      { label: 'It varies 🌊', value: 'varies' },
    ],
    followUp: "Thanks! This helps me give you better period predictions and wellness tips 💕",
  },

  // 3️⃣ Nutrition
  {
    id: 'nutrition-style',
    message: '🍓 Tell me about your food vibe:',
    type: 'select',
    options: [
      { label: 'Eat everything 🙋‍♀️', value: 'all' },
      { label: 'Mostly plants 🥦', value: 'plants' },
      { label: 'Vegan queen 🌱', value: 'vegan' },
      { label: 'Surprise me 🎲', value: 'surprise' },
    ],
  },
  {
    id: 'nutrition-goal',
    message: "What's your nutrition goal right now? 🥗",
    type: 'select',
    options: [
      { label: 'Weight loss ⚖️', value: 'lose_weight' },
      { label: 'Muscle gain 💪', value: 'gain_muscle' },
      { label: 'Hormone balance 🌸', value: 'hormone_balance' },
      { label: 'Better energy ⚡', value: 'better_energy' },
      { label: 'Just eat better 🥗', value: 'maintain' },
    ],
  },
  {
    id: 'nutrition-activity',
    message: 'How active are you in daily life? 🚶‍♀️',
    type: 'select',
    options: [
      { label: 'Mostly sitting 🪑', value: 'sedentary' },
      { label: 'Lightly active 🚶', value: 'light' },
      { label: 'On my feet a lot 🏃‍♀️', value: 'moderate' },
      { label: 'Very active 🔥', value: 'active' },
    ],
  },

  // 4️⃣ Fitness Style & Location
  {
    id: 'fitness-goal',
    message: "What's your fitness goal? 🎯",
    type: 'select',
    options: [
      { label: 'Tone up ⚖️', value: 'tone_up' },
      { label: 'Strength 💪', value: 'build_muscle' },
      { label: 'Flexibility 🧘', value: 'flexibility' },
      { label: 'Cardio queen 🏃', value: 'improve_endurance' },
      { label: 'Just feel better ✨', value: 'general_wellness' },
    ],
  },
  {
    id: 'fitness-frequency',
    message: 'How often do you work out? 🏋️‍♀️',
    type: 'select',
    options: [
      { label: 'Never 😅', value: 'never' },
      { label: '1-2x a week 🐢', value: '1-2' },
      { label: '3-4x a week ⚡', value: '3-4' },
      { label: '5+ times 🔥', value: '5-6' },
    ],
  },
  {
    id: 'fitness-style',
    message: 'What kind of workouts do you enjoy? 🏋️‍♀️',
    type: 'multi-select',
    options: [
      { label: 'Strength 🏋️', value: 'strength' },
      { label: 'Yoga/Pilates 🧘', value: 'yoga' },
      { label: 'Cardio 🏃', value: 'cardio' },
      { label: 'Dance 💃', value: 'dance' },
      { label: 'Walking 🚶‍♀️', value: 'walking' },
    ],
  },
  {
    id: 'fitness-location',
    message: 'Where do you usually work out? 🏠',
    type: 'select',
    options: [
      { label: 'At home 🏠', value: 'home' },
      { label: 'At the gym 🏋️', value: 'gym' },
      { label: 'Outdoors 🌳', value: 'outdoors' },
      { label: "I don't (yet!) 😅", value: 'none' },
    ],
  },

  // 5️⃣ Body + Units
  {
    id: 'body-units',
    message: 'Which units do you like to use? ⚖️',
    type: 'select',
    options: [
      { label: 'Metric (kg, cm)', value: 'metric' },
      { label: 'Imperial (lbs, ft)', value: 'imperial' },
    ],
  },
  {
    id: 'body-height',
    message: "What's your height? 📏 This helps me calculate your perfect nutrition targets!",
    type: 'text',
    followUp: 'Perfect! Every body is beautiful at every height ✨',
    placeholder: 'e.g. 165 cm or 5\'5"',
    validation: { required: true },
  },
  {
    id: 'body-weight',
    message:
      "What's your current weight? 💪 Remember, this is just data to help me support your wellness journey!",
    type: 'text',
    followUp:
      "Thank you for trusting me with that! You're already taking amazing steps toward your goals 🌟",
    placeholder: 'e.g. 65 kg or 140 lbs',
    validation: { required: true },
  },
  {
    id: 'body-goal-weight',
    message:
      'Do you have a goal weight in mind? 🎯 (This is totally optional - some prefer focusing on how they feel!)',
    type: 'select',
    options: [
      { label: 'Yes, I have a goal weight 📈', value: 'has-goal' },
      { label: 'I want to focus on feeling strong 💪', value: 'no-goal' },
    ],
  },
  {
    id: 'body-goal-weight-input',
    message:
      "What's your goal weight? Remember, the best goals are ones that make you feel amazing! ✨",
    type: 'text',
    followUp: "That sounds like a wonderful goal! Let's work toward it together 💕",
    placeholder: 'e.g. 60 kg or 130 lbs',
  },

  // 6️⃣ Account Creation
  {
    id: 'complete',
    message:
      "🎉 Perfect, {name}! I've got everything I need to create your personalized Luna experience. With cycle-synced workouts, nutrition plans, and insights tailored just for you - your wellness journey starts now! ✨",
    type: 'text',
  },
];
