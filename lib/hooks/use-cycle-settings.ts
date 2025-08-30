import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { queryKeys } from './query-keys';
// Import new backend hooks
import {
  useCycleSettings as useNewCycleSettings,
  useCurrentCyclePhase as useNewCurrentCyclePhase,
} from './use-cycle-data';

export interface CycleSettings {
  id: string;
  user_id: string;
  cycle_length: number;
  period_length: number;
  last_period_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CyclePhase {
  name: string;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  day_in_cycle: number;
  days_remaining: number;
  energy_level: 'low' | 'medium' | 'high';
  recommended_exercises: string[];
}

/**
 * Hook to get user's cycle settings
 * Updated to use new backend edge function
 */
export function useCycleSettings() {
  // Use new backend function but maintain same interface
  return useNewCycleSettings();
}

/**
 * Hook to get current cycle phase with exercise recommendations
 * Updated to use new backend edge function
 */
export function useCurrentCyclePhase() {
  // Use new backend function but maintain same interface
  return useNewCurrentCyclePhase();
}
