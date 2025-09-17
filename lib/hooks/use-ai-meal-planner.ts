import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

interface UserContext {
  cyclePhase?: string;
  cycleDay?: number;
  symptoms?: string[];
  nutritionGoals?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    primary_goal?: string;
    activity_level?: string;
  };
  dietaryRestrictions?: string[];
  preferences?: string[];
}

interface MealPlanRequest {
  message: string;
  context: 'meal-planning' | 'grocery-list';
  userContext?: UserContext;
}

interface MealPlanResponse {
  message: string;
  structuredData?: any;
  userContext?: UserContext;
}

export function useAIMealPlanner() {
  return useMutation({
    mutationFn: async ({ message, context, userContext }: MealPlanRequest): Promise<string> => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-meal-planner`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            context,
            userContext,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get AI response');
      }

      const data: MealPlanResponse = await response.json();
      return data.message;
    },
    onError: (error: Error) => {
      console.error('Error with AI meal planner:', error);
    },
  });
}