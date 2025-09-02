import { useMemo } from 'react';
import { getCyclePhaseForDate } from '@/lib/utils/cycle-utils';
import type { PeriodLog } from '@/lib/utils/cycle-utils';

interface CycleDayHookProps {
  selectedDate: Date;
  periodLogs: PeriodLog[];
  cycleSettings: { cycle_length?: number; period_length?: number } | null;
}

/**
 * Hook to calculate cycle day and phase information for a selected date
 * Uses the centralized cycle calculation logic from cycle-utils
 */
export function useCycleDay({ selectedDate, periodLogs, cycleSettings }: CycleDayHookProps) {
  return useMemo(() => {
    const cyclePhase = getCyclePhaseForDate(selectedDate, periodLogs, cycleSettings);
    
    if (!cyclePhase) {
      return {
        cycleDay: 1,
        cyclePhase: undefined,
        isValidCycleData: false,
      };
    }

    return {
      cycleDay: cyclePhase.day_in_cycle,
      cyclePhase: cyclePhase,
      isValidCycleData: true,
    };
  }, [selectedDate, periodLogs, cycleSettings]);
}

/**
 * Simple function to get cycle day for backwards compatibility
 * This ensures consistent calculation across the app
 */
export function getCycleDay(
  selectedDate: Date,
  periodLogs: PeriodLog[],
  cycleSettings: { cycle_length?: number; period_length?: number } | null
): number {
  const cyclePhase = getCyclePhaseForDate(selectedDate, periodLogs, cycleSettings);
  return cyclePhase?.day_in_cycle || 1;
}