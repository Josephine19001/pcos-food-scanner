import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { queryKeys } from './query-keys';
import { toast } from 'sonner-native';

export interface UpdateMealNutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Hook to update meal nutrition values directly
 * This is useful for quick edits without modifying food_items
 */
export function useUpdateMealNutrition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mealId,
      nutrition,
    }: {
      mealId: string;
      nutrition: UpdateMealNutritionData;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      console.log('useUpdateMealNutrition: Updating meal_entries table for meal ID:', mealId, 'with nutrition:', nutrition);

      const { data: result, error } = await supabase
        .from('meal_entries')
        .update({
          total_calories: nutrition.calories,
          total_protein: nutrition.protein,
          total_carbs: nutrition.carbs,
          total_fat: nutrition.fat,
          updated_at: new Date().toISOString(),
        })
        .eq('id', mealId)
        .eq('user_id', user.user.id)
        .select()
        .single();

      console.log('useUpdateMealNutrition: Database update result:', result, 'error:', error);

      if (error) throw error;
      return result;
    },
    onSuccess: (result) => {
      console.log('🟢 useUpdateMealNutrition: Update successful, result:', result);
      
      // Log all active queries before invalidation
      const allQueries = queryClient.getQueryCache().getAll();
      console.log('🔍 All active queries before invalidation:', allQueries.map(q => ({
        queryKey: q.queryKey,
        state: q.state.status,
        data: q.state.data ? 'has data' : 'no data'
      })));
      
      // Immediately invalidate the core queries to ensure instant UI update
      try {
        console.log('🔄 Starting query invalidation...');
        
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.logs.mealEntries],
        });
        console.log('✅ Invalidated mealEntries');
        
        // Also force refetch to bypass any caching issues
        queryClient.refetchQueries({
          queryKey: [...queryKeys.logs.mealEntries],
        });
        console.log('🔄 Refetching mealEntries');
        
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.logs.dailyNutrition],
        });
        console.log('✅ Invalidated dailyNutrition');
        
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.logs.nutritionProgress],
        });
        console.log('✅ Invalidated nutritionProgress');
        
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.settings.nutritionGoals],
        });
        console.log('✅ Invalidated nutritionGoals');
        
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.logs.nutritionStreak],
        });
        console.log('✅ Invalidated nutritionStreak');
        
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.logs.loggedDates],
        });
        console.log('✅ Invalidated loggedDates');
        
        // Log queries after invalidation
        const queriesAfter = queryClient.getQueryCache().getAll();
        console.log('🔍 All queries after invalidation:', queriesAfter.map(q => ({
          queryKey: q.queryKey,
          state: q.state.status,
          isInvalidated: q.state.isInvalidated
        })));
        
        console.log('🟢 useUpdateMealNutrition: Completed immediate query invalidation');
      } catch (error) {
        console.error('🔴 useUpdateMealNutrition: Error during query invalidation:', error);
      }
    },
    onError: (error) => {
      console.error('Failed to update meal nutrition:', error);
      toast.error('Failed to update meal');
    },
  });
}
