import { useCallback, useEffect, useRef } from 'react';
import { useDeleteMealEntry } from '@/lib/hooks/use-meal-tracking';
import { toast } from 'sonner-native';

export function useMealCleanup() {
  const deleteMealEntry = useDeleteMealEntry();
  const cleanupIntervalRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const deletingMealsRef = useRef<Set<string>>(new Set()); // Track meals being deleted

  const cleanupStuckAnalyzingMeals = useCallback(
    async (dailySummary: any) => {
      if (!dailySummary || !dailySummary.meals_by_type) {
        console.log('🧹 No daily summary or meals data available');
        return;
      }

      console.log('🧹 Checking for stuck analyzing meals...');
      const allMeals = Object.values(dailySummary.meals_by_type).flat();
      
      // First, check if there are ANY analyzing meals at all
      const analyzingMeals = allMeals.filter((meal: any) => 
        meal.analysis_status === 'analyzing' || 
        (meal.food_items && meal.food_items.some((item: any) =>
          item.food.name === 'AI analyzing your food...' ||
          item.food.name === 'Analyzing food...' ||
          item.food.brand === 'AI Scanning' ||
          item.food.category === 'scanning'
        ))
      );

      if (analyzingMeals.length === 0) {
        console.log('✅ No analyzing meals found');
        return;
      }

      console.log(`🔍 Found ${analyzingMeals.length} analyzing meals, checking if any are stuck...`);

      const stuckAnalyzingMeals = analyzingMeals.filter((meal: any) => {
        // Skip meals that have completed analysis (double-check)
        if (meal.analysis_status === 'completed') {
          console.log(`✅ Meal ${meal.id} is completed, skipping`);
          return false;
        }

        // Consider a meal "stuck" only if it's been analyzing for more than 5 minutes
        const createdAt = new Date(meal.created_at);
        const now = new Date();
        const minutesElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60);

        console.log(`⏱️ Meal ${meal.id}: ${minutesElapsed.toFixed(1)} minutes elapsed, status: ${meal.analysis_status}`);
        
        return minutesElapsed > 5;
      });

      if (stuckAnalyzingMeals.length > 0) {
        console.log(
          `🚨 Found ${stuckAnalyzingMeals.length} stuck analyzing meals:`,
          stuckAnalyzingMeals.map((m: any) => m.id)
        );

        for (const meal of stuckAnalyzingMeals) {
          // Skip if already being deleted
          if (deletingMealsRef.current.has(meal.id)) {
            console.log(`⏭️ Skipping meal ${meal.id} - already being deleted`);
            continue;
          }

          try {
            console.log(`🗑️ Deleting stuck analyzing meal: ${meal.id}`);
            deletingMealsRef.current.add(meal.id); // Mark as being deleted
            await deleteMealEntry.mutateAsync(meal.id);
            console.log(`✅ Deleted stuck meal: ${meal.id}`);
          } catch (error) {
            console.error(`❌ Failed to delete stuck meal ${meal.id}:`, error);
          } finally {
            deletingMealsRef.current.delete(meal.id); // Remove from tracking
          }
        }

        toast.success(
          `Cleaned up ${stuckAnalyzingMeals.length} stuck analyzing meal${stuckAnalyzingMeals.length > 1 ? 's' : ''}`
        );
      } else {
        console.log('✅ No stuck analyzing meals found');
      }
    },
    [deleteMealEntry]
  );

  // Manual cleanup only - no automatic intervals
  // Removed automatic cleanup to prevent issues with completed meals
  
  const stopAutoCleanup = useCallback(() => {
    if (cleanupIntervalRef.current) {
      clearInterval(cleanupIntervalRef.current);
      cleanupIntervalRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAutoCleanup();
    };
  }, [stopAutoCleanup]);

  return {
    cleanupStuckAnalyzingMeals, // Manual cleanup only
    stopAutoCleanup, // For cleanup of any existing intervals
  };
}
