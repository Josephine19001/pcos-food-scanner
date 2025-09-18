/**
 * Utility functions for meal plan calculations
 */

export interface MealData {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface SnackData extends MealData {
  name?: string;
}

export interface DayMeals {
  breakfast?: MealData;
  lunch?: MealData;
  dinner?: MealData;
  snacks?: SnackData[];
}

export interface DayData {
  day?: string;
  date?: string;
  meals?: DayMeals;
  daily_totals?: MealData;
}

/**
 * Calculate total calories for a single day
 */
export function calculateDayCalories(dayData: DayData): number {
  if (!dayData?.meals) return 0;

  // First check if daily_totals already exists and has calories
  if (dayData.daily_totals?.calories) {
    return dayData.daily_totals.calories;
  }

  // Otherwise calculate from individual meals
  const { meals } = dayData;
  let totalCalories = 0;

  // Add calories from main meals
  totalCalories += meals.breakfast?.calories || 0;
  totalCalories += meals.lunch?.calories || 0;
  totalCalories += meals.dinner?.calories || 0;

  // Add calories from snacks
  if (meals.snacks && Array.isArray(meals.snacks)) {
    totalCalories += meals.snacks.reduce((acc, snack) => acc + (snack.calories || 0), 0);
  }

  return Math.round(totalCalories);
}

/**
 * Calculate total nutrition for a single day
 */
export function calculateDayNutrition(dayData: DayData): MealData {
  if (!dayData?.meals) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  // First check if daily_totals already exists
  if (dayData.daily_totals) {
    return {
      calories: dayData.daily_totals.calories || 0,
      protein: dayData.daily_totals.protein || 0,
      carbs: dayData.daily_totals.carbs || 0,
      fat: dayData.daily_totals.fat || 0,
    };
  }

  // Otherwise calculate from individual meals
  const { meals } = dayData;
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Add nutrition from main meals
  const mainMeals = [meals.breakfast, meals.lunch, meals.dinner].filter(Boolean);
  mainMeals.forEach(meal => {
    if (meal) {
      totals.calories += meal.calories || 0;
      totals.protein += meal.protein || 0;
      totals.carbs += meal.carbs || 0;
      totals.fat += meal.fat || 0;
    }
  });

  // Add nutrition from snacks
  if (meals.snacks && Array.isArray(meals.snacks)) {
    meals.snacks.forEach(snack => {
      totals.calories += snack.calories || 0;
      totals.protein += snack.protein || 0;
      totals.carbs += snack.carbs || 0;
      totals.fat += snack.fat || 0;
    });
  }

  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
  };
}

/**
 * Calculate average daily nutrition for entire meal plan
 */
export function calculateMealPlanAverages(mealPlanData: { days?: DayData[] }): MealData {
  if (!mealPlanData?.days || !Array.isArray(mealPlanData.days) || mealPlanData.days.length === 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  const totalNutrition = mealPlanData.days.reduce(
    (acc, day) => {
      const dayNutrition = calculateDayNutrition(day);
      acc.calories += dayNutrition.calories;
      acc.protein += dayNutrition.protein;
      acc.carbs += dayNutrition.carbs;
      acc.fat += dayNutrition.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const dayCount = mealPlanData.days.length;
  return {
    calories: Math.round(totalNutrition.calories / dayCount),
    protein: Math.round(totalNutrition.protein / dayCount),
    carbs: Math.round(totalNutrition.carbs / dayCount),
    fat: Math.round(totalNutrition.fat / dayCount),
  };
}

/**
 * Format calorie count for display
 */
export function formatCalories(calories: number): string {
  if (calories === 0) return '0';
  if (calories < 1000) return calories.toString();
  return `${(calories / 1000).toFixed(1)}k`;
}

/**
 * Get meal plan summary stats
 */
export function getMealPlanStats(mealPlanData: { days?: DayData[] }) {
  if (!mealPlanData?.days || !Array.isArray(mealPlanData.days)) {
    return {
      totalDays: 0,
      avgCalories: 0,
      totalCalories: 0,
      avgNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    };
  }

  const days = mealPlanData.days;
  const avgNutrition = calculateMealPlanAverages(mealPlanData);
  const totalCalories = days.reduce((acc, day) => acc + calculateDayCalories(day), 0);

  return {
    totalDays: days.length,
    avgCalories: avgNutrition.calories,
    totalCalories,
    avgNutrition
  };
}