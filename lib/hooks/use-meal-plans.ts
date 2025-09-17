import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { queryKeys } from './query-keys';
import { toast } from 'sonner-native';

export interface MealPlan {
  id: string;
  user_id: string;
  name: string;
  plan_type: 'weekly' | 'daily' | 'custom';
  start_date: string;
  end_date: string;
  cuisine_preferences: string[];
  existing_ingredients: string[];
  include_favorites: boolean;
  meals_data: any;
  estimated_cost?: number;
  nutrition_summary?: any;
  generation_context: any;
  created_at: string;
  updated_at: string;
}

export interface GroceryList {
  id: string;
  user_id: string;
  meal_plan_id: string;
  name: string;
  items: any;
  total_estimated_cost?: number;
  is_completed: boolean;
  completed_items: any[];
  created_at: string;
}

export interface GenerateMealPlanParams {
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

// Generate meal plan using edge function (background process)
export function useGenerateMealPlan() {
  const queryClient = useQueryClient();

  return useMutation<any, Error, GenerateMealPlanParams>({
    mutationFn: async (params) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      console.log('🍽️ Starting meal plan generation (background)');

      const response = await supabase.functions.invoke('meal-plan-generator', {
        body: params,
      });

      if (response.error) {
        console.error('❌ Meal plan generation error:', response.error);
        throw new Error(response.error.message || 'Failed to generate meal plan');
      }

      console.log('✅ Meal plan generation started successfully');
      return response.data;
    },
    onSuccess: async (data) => {
      // Show success message immediately
      toast.success('Meal plan is being generated!', {
        description: 'You can continue using the app. We\'ll notify you when it\'s ready.',
      });

      // Invalidate and refetch meal plan queries
      await queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.mealPlans });
      await queryClient.refetchQueries({
        queryKey: [...queryKeys.nutrition.mealPlans, 'latest'],
      });

      // Return the data for component-level onSuccess callback
      return data;
    },
    onError: (error: Error) => {
      console.error('❌ Meal plan generation failed:', error);
      toast.error('Failed to generate meal plan', {
        description: error.message,
      });
    },
  });
}

// Get user's meal plans
export function useMealPlans() {
  return useQuery<MealPlan[], Error>({
    queryKey: queryKeys.nutrition.mealPlans,
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Get most recently created meal plan (for newly generated plans)
export function useLatestMealPlan() {
  return useQuery<MealPlan | null, Error>({
    queryKey: [...queryKeys.nutrition.mealPlans, 'latest'],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching latest meal plan:', error);
        throw error;
      }

      return data || null;
    },
    staleTime: 1 * 60 * 1000, // 1 minute (short stale time for fresh data)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Get current active meal plan
export function useCurrentMealPlan() {
  const today = new Date().toISOString().split('T')[0];

  return useQuery<MealPlan | null, Error>({
    queryKey: [...queryKeys.nutrition.mealPlans, 'current', today],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Get active meal plan for today's date range
      let { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', session.user.id)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // If no active plan found for current date, get the most recent plan
      if (!data && (!error || error.code === 'PGRST116')) {
        const { data: recentData, error: recentError } = await supabase
          .from('meal_plans')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        data = recentData;
        error = recentError;
      }

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching current meal plan:', error);
        throw error;
      }

      return data || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Get grocery list for a meal plan
export function useGroceryList(mealPlanId?: string) {
  return useQuery<GroceryList | null, Error>({
    queryKey: [...queryKeys.nutrition.groceryLists, mealPlanId],
    queryFn: async () => {
      if (!mealPlanId) return null;

      const { data, error } = await supabase
        .from('grocery_lists')
        .select('*')
        .eq('meal_plan_id', mealPlanId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching grocery list:', error);
        throw error;
      }

      return data || null;
    },
    enabled: !!mealPlanId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Update grocery list completion status
export function useUpdateGroceryListStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    GroceryList,
    Error,
    { listId: string; isCompleted?: boolean; completedItems?: any[] }
  >({
    mutationFn: async ({ listId, isCompleted, completedItems }) => {
      const updates: any = { updated_at: new Date().toISOString() };
      if (isCompleted !== undefined) updates.is_completed = isCompleted;
      if (completedItems !== undefined) updates.completed_items = completedItems;

      const { data, error } = await supabase
        .from('grocery_lists')
        .update(updates)
        .eq('id', listId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.groceryLists });
    },
  });
}