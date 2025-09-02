import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner-native';

// Types for daily symptoms
export interface DailySymptoms {
  id?: string;
  user_id?: string;
  date: string;
  symptoms: string[];
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Common symptom categories for better organization
export const SYMPTOM_CATEGORIES = {
  physical: [
    'Cramps',
    'Bloating',
    'Headache',
    'Back pain',
    'Breast tenderness',
    'Fatigue',
    'Nausea',
    'Dizziness',
    'Hot flashes',
    'Joint pain',
  ],
  emotional: [
    'Mood swings',
    'Irritability',
    'Anxiety',
    'Depression',
    'Crying spells',
    'Stress',
    'Brain fog',
    'Difficulty concentrating',
  ],
  skin: ['Acne breakouts', 'Dry skin', 'Oily skin', 'Skin sensitivity', 'Dark circles'],
  sleep: ['Insomnia', 'Excessive sleepiness', 'Restless sleep', 'Night sweats'],
  digestive: [
    'Constipation',
    'Diarrhea',
    'Food cravings',
    'Loss of appetite',
    'Increased appetite',
  ],
};

// Query keys for daily symptoms
export const dailySymptomsQueryKeys = {
  all: ['daily-symptoms'] as const,
  list: (startDate?: string, endDate?: string) =>
    [...dailySymptomsQueryKeys.all, 'list', { startDate, endDate }] as const,
  today: () => [...dailySymptomsQueryKeys.all, 'today'] as const,
  date: (date: string) => [...dailySymptomsQueryKeys.all, 'date', date] as const,
};

// Direct Supabase operations (no edge function needed for simple CRUD)

// Hooks for fetching symptoms data

/**
 * Get daily symptoms for a date range
 */
export function useDailySymptoms(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: dailySymptomsQueryKeys.list(startDate, endDate),
    queryFn: async () => {
      let query = supabase.from('daily_symptoms').select('*').order('date', { ascending: false });

      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get today's symptoms entry
 */
export function useTodaysSymptoms() {
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: dailySymptomsQueryKeys.today(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_symptoms')
        .select('*')
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data || null;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Get symptoms for a specific date
 */
export function useSymptomsForDate(date: string) {
  return useQuery({
    queryKey: dailySymptomsQueryKeys.date(date),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_symptoms')
        .select('*')
        .eq('date', date)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!date,
  });
}

// Hooks for symptoms mutations

/**
 * Log or update daily symptoms
 */
export function useLogDailySymptoms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (symptomsData: DailySymptoms) => {
      // Validate symptoms array
      if (!symptomsData.symptoms || symptomsData.symptoms.length === 0) {
        throw new Error('At least one symptom is required');
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('daily_symptoms')
        .upsert({
          user_id: user.id,
          date: symptomsData.date,
          symptoms: symptomsData.symptoms,
          severity: symptomsData.severity,
          notes: symptomsData.notes,
        }, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate symptoms queries
      queryClient.invalidateQueries({ queryKey: dailySymptomsQueryKeys.all });

      // Update specific date cache
      queryClient.setQueryData(dailySymptomsQueryKeys.date(variables.date), data);
    },
    onError: (error: Error) => {
      toast.error('Failed to log symptoms', {
        description: error.message,
      });
    },
  });
}

/**
 * Delete daily symptoms for a specific date
 */
export function useDeleteDailySymptoms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      const { error } = await supabase.from('daily_symptoms').delete().eq('date', date);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
    onSuccess: (_, variables) => {
      // Invalidate symptoms queries
      queryClient.invalidateQueries({ queryKey: dailySymptomsQueryKeys.all });

      // Clear specific date cache
      queryClient.setQueryData(dailySymptomsQueryKeys.date(variables), null);
    },
    onError: (error: Error) => {
      toast.error('Failed to delete symptoms entry', {
        description: error.message,
      });
    },
  });
}

// Helper functions

/**
 * Get symptoms data for the last N days
 */
export function useRecentSymptoms(days = 7) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  const startDateStr = startDate.toISOString().split('T')[0];

  return useDailySymptoms(startDateStr, endDate);
}

/**
 * Check if symptoms were logged for today
 */
export function useHasSymptomsToday() {
  const { data: todaysSymptoms, isLoading } = useTodaysSymptoms();

  return {
    hasSymptoms: !!todaysSymptoms && todaysSymptoms.symptoms.length > 0,
    symptoms: todaysSymptoms,
    isLoading,
  };
}

/**
 * Get symptom statistics for a date range
 */
export function useSymptomStats(startDate?: string, endDate?: string) {
  const { data: symptomsEntries = [], isLoading } = useDailySymptoms(startDate, endDate);

  return useQuery({
    queryKey: ['symptom-stats', startDate, endDate],
    queryFn: () => {
      if (symptomsEntries.length === 0) {
        return {
          totalEntries: 0,
          totalSymptoms: 0,
          mostCommonSymptoms: [],
          symptomCounts: {},
          severityCounts: {},
          averageSymptomsPerDay: 0,
          symptomsByCategory: {},
        };
      }

      // Calculate symptom statistics
      const symptomCounts: Record<string, number> = {};
      const severityCounts: Record<string, number> = {};
      const symptomsByCategory: Record<string, Record<string, number>> = {};
      let totalSymptoms = 0;

      symptomsEntries.forEach((entry: DailySymptoms) => {
        // Count severity
        if (entry.severity) {
          severityCounts[entry.severity] = (severityCounts[entry.severity] || 0) + 1;
        }

        // Count individual symptoms
        entry.symptoms.forEach((symptom) => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
          totalSymptoms++;

          // Categorize symptoms
          Object.entries(SYMPTOM_CATEGORIES).forEach(([category, symptoms]) => {
            if (symptoms.includes(symptom)) {
              if (!symptomsByCategory[category]) {
                symptomsByCategory[category] = {};
              }
              symptomsByCategory[category][symptom] =
                (symptomsByCategory[category][symptom] || 0) + 1;
            }
          });
        });
      });

      // Find most common symptoms (top 5)
      const mostCommonSymptoms = Object.entries(symptomCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([symptom, count]) => ({ symptom, count }));

      const averageSymptomsPerDay =
        symptomsEntries.length > 0 ? totalSymptoms / symptomsEntries.length : 0;

      return {
        totalEntries: symptomsEntries.length,
        totalSymptoms,
        mostCommonSymptoms,
        symptomCounts,
        severityCounts,
        averageSymptomsPerDay,
        symptomsByCategory,
      };
    },
    enabled: !isLoading && symptomsEntries.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get flat list of all unique symptoms used by the user
 */
export function useUserSymptoms(days = 30) {
  const { data: symptomsEntries = [] } = useRecentSymptoms(days);

  return useQuery({
    queryKey: ['user-symptoms', days],
    queryFn: () => {
      const uniqueSymptoms = new Set<string>();

      symptomsEntries.forEach((entry: DailySymptoms) => {
        entry.symptoms.forEach((symptom) => {
          uniqueSymptoms.add(symptom);
        });
      });

      return Array.from(uniqueSymptoms).sort();
    },
    enabled: symptomsEntries.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Helper to get all available symptoms organized by category
 */
export function getAllSymptomsByCategory() {
  return SYMPTOM_CATEGORIES;
}

/**
 * Helper to get flat list of all predefined symptoms
 */
export function getAllSymptoms() {
  return Object.values(SYMPTOM_CATEGORIES).flat().sort();
}
