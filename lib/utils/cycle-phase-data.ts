export const getPhaseData = (day: number) => {
  // Menstrual Phase (Days 1-5)
  if (day === 1) {
    return {
      phase: 'Menstrual',
      type: 'Period Day 1',
      message:
        "Your period just started. Take it easy today - rest, stay hydrated, and use heat therapy for cramps. Iron-rich foods can help replenish what you're losing.",
      icon: 'droplets',
    };
  } else if (day === 2) {
    return {
      phase: 'Menstrual',
      type: 'Period Day 2',
      message:
        'Usually the heaviest flow day. Be gentle with yourself, stay warm, and consider light stretching or yoga. Magnesium can help with muscle tension.',
      icon: 'droplets',
    };
  } else if (day === 3) {
    return {
      phase: 'Menstrual',
      type: 'Period Day 3',
      message:
        'Flow is moderating. You might start feeling a bit more energetic. Gentle walks and warm baths can be soothing. Keep eating nourishing foods.',
      icon: 'droplets',
    };
  } else if (day === 4) {
    return {
      phase: 'Menstrual',
      type: 'Period Day 4',
      message:
        "Energy is slowly returning. Light exercise like walking or gentle yoga can help with mood and circulation. You're almost through the hardest part!",
      icon: 'droplets',
    };
  } else if (day === 5) {
    return {
      phase: 'Menstrual',
      type: 'Period Day 5',
      message:
        'Final period day for most people. You might feel relief and renewed energy. Perfect time to plan ahead for the productive follicular phase coming up.',
      icon: 'droplets',
    };
  }
  // Follicular Phase (Days 6-11)
  else if (day <= 8) {
    return {
      phase: 'Follicular',
      type: 'Early Follicular',
      message:
        'Post-period recovery time. Your energy is building back up. Great time to start planning new projects and gradually increase activity levels.',
      icon: 'leaf',
    };
  } else if (day <= 11) {
    return {
      phase: 'Follicular',
      type: 'Growing Phase',
      message:
        'Energy rising daily! Perfect time for challenging workouts, learning new skills, and tackling ambitious goals. Your brain is sharp and focused.',
      icon: 'leaf',
    };
  }
  // Ovulatory Phase (Days 12-15)
  else if (day === 12) {
    return {
      phase: 'Ovulatory',
      type: 'Pre-Ovulation',
      message:
        "Approaching your peak! Energy and confidence are high. Great for social activities, presentations, and important conversations. You're naturally more charismatic.",
      icon: 'flower',
    };
  } else if (day === 13 || day === 14) {
    return {
      phase: 'Ovulatory',
      type: 'Peak Fertility',
      message:
        "Your most fertile days with peak energy! Perfect for high-intensity workouts, public speaking, and making important decisions. You're at your most confident.",
      icon: 'flower',
    };
  } else if (day === 15) {
    return {
      phase: 'Ovulatory',
      type: 'Post-Ovulation',
      message:
        'Energy is still high but starting to shift. Good time to wrap up big projects before the more introspective luteal phase begins.',
      icon: 'flower',
    };
  }
  // Luteal Phase (Days 16-28)
  else if (day <= 21) {
    return {
      phase: 'Luteal',
      type: 'Early Luteal',
      message:
        'Energy is settling into a calmer rhythm. Perfect for detailed work, organization, and completing projects. Your body craves more protein and healthy fats.',
      icon: 'heart',
    };
  } else if (day <= 25) {
    return {
      phase: 'Luteal',
      type: 'Mid Luteal',
      message:
        'You might notice mood changes and food cravings. Listen to your body - it needs more rest and comfort foods. Great time for cozy, nurturing activities.',
      icon: 'heart',
    };
  } else {
    return {
      phase: 'Luteal',
      type: 'Late Luteal (PMS)',
      message:
        'PMS symptoms may be present. Be extra kind to yourself. Focus on gentle movement, stress management, and preparing for your upcoming period.',
      icon: 'heart',
    };
  }
};
