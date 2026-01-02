import type { FoodReaction, ReactionType, MealType } from '@/lib/types/journal';

export type WeekDay = {
  date: Date;
  dayName: string;
  dayNum: number;
  isToday: boolean;
  isSelected: boolean;
};

export type DailyStats = {
  total: number;
  good: number;
  bad: number;
  okay: number;
  avgEnergy: number;
  hasData: boolean;
};

// Map language codes to locale codes
function getLocaleCode(language: string): string {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    pt: 'pt-BR',
    it: 'it-IT',
    ar: 'ar-SA',
    hi: 'hi-IN',
    tr: 'tr-TR',
  };
  return localeMap[language] || 'en-US';
}

// Get week days for calendar strip
export function getWeekDays(selectedDate: Date, language: string = 'en'): WeekDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const locale = getLocaleCode(language);

  const result: WeekDay[] = [];
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start from Sunday

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    date.setHours(0, 0, 0, 0);

    result.push({
      date,
      dayName: date.toLocaleDateString(locale, { weekday: 'short' }),
      dayNum: date.getDate(),
      isToday: date.getTime() === today.getTime(),
      isSelected: date.toDateString() === selectedDate.toDateString(),
    });
  }

  return result;
}

// Filter reactions by date
export function filterReactionsByDate(reactions: FoodReaction[], date: Date): FoodReaction[] {
  const dateStr = date.toDateString();
  return reactions.filter((r) => {
    const reactionDate = new Date(r.consumed_at);
    return reactionDate.toDateString() === dateStr;
  });
}

// Calculate daily stats
export function calculateDailyStats(reactions: FoodReaction[]): DailyStats {
  const total = reactions.length;
  const good = reactions.filter((r) => r.reaction === 'good').length;
  const bad = reactions.filter((r) => r.reaction === 'bad').length;
  const avgEnergy =
    reactions.filter((r) => r.energy_level).reduce((sum, r) => sum + (r.energy_level || 0), 0) /
    (reactions.filter((r) => r.energy_level).length || 1);

  return {
    total,
    good,
    bad,
    okay: total - good - bad,
    avgEnergy: Math.round(avgEnergy * 10) / 10,
    hasData: total > 0,
  };
}

// Format time from date string
export function formatTime(dateStr: string, language: string = 'en'): string {
  const date = new Date(dateStr);
  const locale = getLocaleCode(language);
  return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
}

// Format date for display (e.g., "Monday, Jan 15")
export function formatDateDisplay(date: Date, language: string = 'en'): string {
  const locale = getLocaleCode(language);
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

// Get reaction color based on reaction type
export function getReactionColor(reaction: ReactionType): string {
  switch (reaction) {
    case 'good':
      return '#059669';
    case 'bad':
      return '#DC2626';
    default:
      return '#D97706';
  }
}

export type MealTypeInfo = {
  label: string;
  color: string;
};

// Meal type colors (labels should come from translations)
export const MEAL_TYPE_COLORS: Record<MealType, string> = {
  breakfast: '#F59E0B',
  lunch: '#0284C7',
  dinner: '#7C3AED',
  snack: '#EC4899',
};

// Get meal type info (without icon - icons should be rendered in component)
// Pass translated label from component
export function getMealTypeInfo(
  mealType: MealType | null | undefined,
  translatedLabel?: string
): MealTypeInfo | null {
  if (!mealType) return null;

  const color = MEAL_TYPE_COLORS[mealType];
  if (!color) return null;

  return {
    label: translatedLabel || mealType,
    color
  };
}
