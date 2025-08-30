import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner-native';

// Types
interface BeautyRecommendation {
  id: string;
  cycle_phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  product_category: string;
  recommended_ingredients: string[];
  ingredients_to_avoid: string[];
  recommendation_text: string;
  priority: number;
  personalized?: boolean;
}

interface CycleIngredients {
  recommended: string[];
  avoid: string[];
}

interface ProductCycleAnalysis {
  cycle_insights: {
    menstrual_phase: { recommended: boolean; reason: string };
    follicular_phase: { recommended: boolean; reason: string };
    ovulatory_phase: { recommended: boolean; reason: string };
    luteal_phase: { recommended: boolean; reason: string };
  };
  hormone_impact: {
    may_worsen_pms: boolean;
    may_cause_breakouts: boolean;
    good_for_sensitive_skin: boolean;
    description: string;
  };
  best_cycle_phase: string;
  cycle_specific_benefits: string[];
}

// Query keys
export const beautyQueryKeys = {
  all: ['beauty'] as const,
  recommendations: (cyclePhase: string, userId?: string) =>
    [...beautyQueryKeys.all, 'recommendations', { cyclePhase, userId }] as const,
  ingredients: (cyclePhase: string) => [...beautyQueryKeys.all, 'ingredients', cyclePhase] as const,
};

// Edge function helper
async function callBeautyFunction(endpoint: string, options?: RequestInit) {
  const response = await fetch(
    `${supabase.supabaseUrl}/functions/v1/beauty-cycle-recommendations/${endpoint}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to call beauty function');
  }

  return response.json();
}

async function callAuthenticatedBeautyFunction(endpoint: string, options?: RequestInit) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(
    `${supabase.supabaseUrl}/functions/v1/beauty-cycle-recommendations/${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      ...options,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to call beauty function');
  }

  return response.json();
}

// Hooks
export function useBeautyRecommendations(cyclePhase: string, personalized = false) {
  const {
    data: { user },
  } = supabase.auth.getUser();

  return useQuery({
    queryKey: beautyQueryKeys.recommendations(cyclePhase, personalized ? user?.id : undefined),
    queryFn: () => {
      const params = new URLSearchParams({ cycle_phase: cyclePhase });
      if (personalized && user?.id) {
        params.append('user_id', user.id);
      }

      return callBeautyFunction(`recommendations?${params.toString()}`);
    },
    enabled: !!cyclePhase,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useCycleIngredients(cyclePhase: string) {
  return useQuery({
    queryKey: beautyQueryKeys.ingredients(cyclePhase),
    queryFn: () => callBeautyFunction(`ingredients?cycle_phase=${cyclePhase}`),
    enabled: !!cyclePhase,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Mutations
export function useAnalyzeProduct() {
  return useMutation({
    mutationFn: (productData: any): Promise<ProductCycleAnalysis> =>
      callBeautyFunction('analyze-product', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),
    onError: (error: Error) => {
      toast.error('Failed to analyze product', {
        description: error.message,
      });
    },
  });
}

export function useSaveScanWithInsights() {
  return useMutation({
    mutationFn: (scanData: any) =>
      callAuthenticatedBeautyFunction('save-scan-with-insights', {
        method: 'POST',
        body: JSON.stringify(scanData),
      }),
    onSuccess: () => {},
    onError: (error: Error) => {
      toast.error('Failed to save product', {
        description: error.message,
      });
    },
  });
}

// Utility functions
export function getPhaseColor(phase: string): string {
  const colors = {
    menstrual: '#DC2626',
    follicular: '#059669',
    ovulatory: '#F59E0B',
    luteal: '#8B5CF6',
  };

  return colors[phase as keyof typeof colors] || '#6B7280';
}

export function getPhaseIcon(phase: string): string {
  const icons = {
    menstrual: 'moon',
    follicular: 'trending-up',
    ovulatory: 'sun',
    luteal: 'moon',
  };

  return icons[phase as keyof typeof icons] || 'circle';
}

export function shouldAvoidIngredient(
  ingredient: string,
  currentPhase: string,
  recommendations: BeautyRecommendation[]
): boolean {
  const phaseRecommendations = recommendations.filter((rec) => rec.cycle_phase === currentPhase);

  return phaseRecommendations.some((rec) =>
    rec.ingredients_to_avoid.some(
      (avoid) =>
        avoid.toLowerCase().includes(ingredient.toLowerCase()) ||
        ingredient.toLowerCase().includes(avoid.toLowerCase())
    )
  );
}

export function isRecommendedIngredient(
  ingredient: string,
  currentPhase: string,
  recommendations: BeautyRecommendation[]
): boolean {
  const phaseRecommendations = recommendations.filter((rec) => rec.cycle_phase === currentPhase);

  return phaseRecommendations.some((rec) =>
    rec.recommended_ingredients.some(
      (recommended) =>
        recommended.toLowerCase().includes(ingredient.toLowerCase()) ||
        ingredient.toLowerCase().includes(recommended.toLowerCase())
    )
  );
}

export function getProductRecommendationForPhase(
  product: any,
  phase: string
): { recommended: boolean; reason: string } | null {
  if (!product.cycle_insights) return null;

  const phaseKey = `${phase}_phase` as keyof typeof product.cycle_insights;
  return product.cycle_insights[phaseKey] || null;
}
