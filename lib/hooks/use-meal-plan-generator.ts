import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner-native';

interface MealPlanParams {
  cuisines: string[];
  customBudget?: string;
  foodGroups: string[];
  selectedFavoriteFoods: string[];
  favoriteFoodNames: string[];
  duration: '3_days' | '7_days' | '14_days';
  existingIngredients: string[];
  userContext?: {
    cyclePhase?: string;
    cycleDay?: number;
    symptoms?: string[];
    nutritionGoals?: any;
  };
}

interface GeneratedMealPlan {
  id: string;
  name: string;
  meals_data: any;
  grocery_list: any;
  estimated_cost?: number;
  nutrition_summary?: any;
}

export function useGenerateMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: MealPlanParams): Promise<GeneratedMealPlan> => {
      console.log('Starting meal plan generation with params:', params);
      
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        console.error('No session found');
        throw new Error('Not authenticated');
      }

      console.log('User authenticated:', session.user.id);
      console.log('Calling edge function with URL:', `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/meal-plan-generator`);

      // Call the meal planner edge function
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/meal-plan-generator`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText };
        }
        throw new Error(error.error || 'Failed to generate meal plan');
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] });
      queryClient.invalidateQueries({ queryKey: ['grocery-lists'] });
      
      toast.success('Meal plan generated successfully!');
    },
    onError: (error: Error) => {
      console.error('Error generating meal plan:', error);
      toast.error('Failed to generate meal plan', {
        description: error.message,
      });
    },
  });
}

