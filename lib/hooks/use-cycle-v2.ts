import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner-native';

// Types for period cycles
export interface PeriodCycle {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string | null; // Nullable for ongoing periods
  cycle_length: number | null;
  period_length: number | null; // Nullable for ongoing periods
  flow_intensity?: 'light' | 'moderate' | 'heavy';
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface CycleSettings {
  id?: string;
  user_id?: string;
  cycle_length: number;
  period_length: number;
  average_cycle_length?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CurrentCycleInfo {
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  name: string;
  day_in_cycle: number;
  days_remaining: number;
  energy_level: 'low' | 'building' | 'high' | 'declining';
  description: string;
  recommended_exercises: string[];
  pregnancy_chances: {
    level: string;
    color: string;
    description: string;
  };
  next_period_prediction?: {
    date: string;
    daysUntil: number;
    confidence: 'high' | 'medium' | 'low';
  };
}

// Query keys for cycle-related data only
export const cycleQueryKeysV2 = {
  all: ['cycle'] as const,
  currentInfo: (date?: string) => [...cycleQueryKeysV2.all, 'current-info', date] as const,
  cycles: () => [...cycleQueryKeysV2.all, 'cycles'] as const,
  settings: () => [...cycleQueryKeysV2.all, 'settings'] as const,
};

// Edge function helper
async function callCycleFunctionV2(endpoint: string, options?: RequestInit) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/cycle-manager/${endpoint}`,
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
    throw new Error(error.error || 'Failed to call cycle function');
  }

  return response.json();
}

// Hooks for fetching data

/**
 * Get current cycle information including pregnancy chances and predictions
 * This is the main hook that replaces the complex calculations
 */
export function useCurrentCycleInfo(selectedDate?: string) {
  return useQuery({
    queryKey: cycleQueryKeysV2.currentInfo(selectedDate),
    queryFn: () => {
      const params = selectedDate ? `?date=${selectedDate}` : '';
      return callCycleFunctionV2(`current-info${params}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get period cycles history
 */
export function usePeriodCycles(limit = 10) {
  return useQuery({
    queryKey: cycleQueryKeysV2.cycles(),
    queryFn: () => callCycleFunctionV2(`cycles?limit=${limit}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get cycle settings
 */
export function useCycleSettingsV2() {
  return useQuery({
    queryKey: cycleQueryKeysV2.settings(),
    queryFn: () => callCycleFunctionV2('settings'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hooks for mutations

/**
 * Log a complete period cycle (start to end)
 */
export function useLogPeriodCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cycleData: {
      start_date: string;
      end_date: string;
      flow_intensity?: 'light' | 'moderate' | 'heavy';
      notes?: string;
    }) =>
      callCycleFunctionV2('log-cycle', {
        method: 'POST',
        body: JSON.stringify(cycleData),
      }),
    onSuccess: () => {
      // Invalidate all cycle-related queries since predictions will change
      queryClient.invalidateQueries({ queryKey: cycleQueryKeysV2.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to log period cycle', {
        description: error.message,
      });
    },
  });
}

/**
 * Start a new ongoing period
 */
export function useStartPeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (periodData: {
      start_date: string;
      flow_intensity?: 'light' | 'moderate' | 'heavy';
      notes?: string;
    }) =>
      callCycleFunctionV2('start-period', {
        method: 'POST',
        body: JSON.stringify(periodData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cycleQueryKeysV2.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to start period', {
        description: error.message,
      });
    },
  });
}

/**
 * End the current ongoing period
 */
export function useEndPeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (endData: { end_date: string }) =>
      callCycleFunctionV2('end-period', {
        method: 'POST',
        body: JSON.stringify(endData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cycleQueryKeysV2.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to end period', {
        description: error.message,
      });
    },
  });
}

/**
 * Delete a period cycle
 */
export function useDeletePeriodCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cycleId: string) =>
      callCycleFunctionV2('cycle', {
        method: 'DELETE',
        body: JSON.stringify({ id: cycleId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cycleQueryKeysV2.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to delete period cycle', {
        description: error.message,
      });
    },
  });
}
