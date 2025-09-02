import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner-native';

// Types for daily moods
export interface DailyMood {
  id?: string;
  user_id?: string;
  date: string;
  mood: 'happy' | 'normal' | 'sad' | 'irritable' | 'anxious' | 'excited' | 'stressed' | 'calm';
  energy_level?: 'high' | 'medium' | 'low';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Query keys for daily moods
export const dailyMoodQueryKeys = {
  all: ['daily-moods'] as const,
  list: (startDate?: string, endDate?: string) =>
    [...dailyMoodQueryKeys.all, 'list', { startDate, endDate }] as const,
  today: () => [...dailyMoodQueryKeys.all, 'today'] as const,
  date: (date: string) => [...dailyMoodQueryKeys.all, 'date', date] as const,
};

// Direct Supabase operations (no edge function needed for simple CRUD)

// Hooks for fetching mood data

/**
 * Get daily moods for a date range
 */
export function useDailyMoods(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: dailyMoodQueryKeys.list(startDate, endDate),
    queryFn: async () => {
      let query = supabase.from('daily_moods').select('*').order('date', { ascending: false });

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
 * Get today's mood entry
 */
export function useTodaysMood() {
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: dailyMoodQueryKeys.today(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_moods')
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
 * Get mood for a specific date
 */
export function useMoodForDate(date: string) {
  return useQuery({
    queryKey: dailyMoodQueryKeys.date(date),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_moods')
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

// Hooks for mood mutations

/**
 * Log or update daily mood
 */
export function useLogDailyMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moodData: DailyMood) => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('daily_moods')
        .upsert({
          user_id: user.id,
          date: moodData.date,
          mood: moodData.mood,
          energy_level: moodData.energy_level,
          notes: moodData.notes,
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
      // Invalidate mood queries
      queryClient.invalidateQueries({ queryKey: dailyMoodQueryKeys.all });

      // Update specific date cache
      queryClient.setQueryData(dailyMoodQueryKeys.date(variables.date), data);
    },
    onError: (error: Error) => {
      toast.error('Failed to log mood', {
        description: error.message,
      });
    },
  });
}

/**
 * Delete daily mood for a specific date
 */
export function useDeleteDailyMood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: string) => {
      const { error } = await supabase.from('daily_moods').delete().eq('date', date);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
    onSuccess: (_, variables) => {
      // Invalidate mood queries
      queryClient.invalidateQueries({ queryKey: dailyMoodQueryKeys.all });

      // Clear specific date cache
      queryClient.setQueryData(dailyMoodQueryKeys.date(variables), null);
    },
    onError: (error: Error) => {
      toast.error('Failed to delete mood entry', {
        description: error.message,
      });
    },
  });
}

// Helper functions

/**
 * Get mood data for the last N days
 */
export function useRecentMoods(days = 7) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  const startDateStr = startDate.toISOString().split('T')[0];

  return useDailyMoods(startDateStr, endDate);
}

/**
 * Check if mood was logged for today
 */
export function useHasMoodToday() {
  const { data: todaysMood, isLoading } = useTodaysMood();

  return {
    hasMood: !!todaysMood,
    mood: todaysMood,
    isLoading,
  };
}

/**
 * Get mood statistics for a date range
 */
export function useMoodStats(startDate?: string, endDate?: string) {
  const { data: moods = [], isLoading } = useDailyMoods(startDate, endDate);

  return useQuery({
    queryKey: ['mood-stats', startDate, endDate],
    queryFn: () => {
      if (moods.length === 0) {
        return {
          totalEntries: 0,
          mostCommonMood: null,
          averageEnergyLevel: null,
          moodCounts: {},
          energyLevelCounts: {},
        };
      }

      // Calculate mood statistics
      const moodCounts: Record<string, number> = {};
      const energyLevelCounts: Record<string, number> = {};

      moods.forEach((mood: DailyMood) => {
        moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
        if (mood.energy_level) {
          energyLevelCounts[mood.energy_level] = (energyLevelCounts[mood.energy_level] || 0) + 1;
        }
      });

      // Find most common mood
      const mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
        moodCounts[a] > moodCounts[b] ? a : b
      );

      // Calculate average energy level (converting to numbers)
      const energyLevels = moods
        .filter((mood: DailyMood) => mood.energy_level)
        .map((mood: DailyMood) => {
          switch (mood.energy_level) {
            case 'high':
              return 3;
            case 'medium':
              return 2;
            case 'low':
              return 1;
            default:
              return 2;
          }
        });

      const averageEnergy =
        energyLevels.length > 0
          ? energyLevels.reduce((sum, level) => sum + level, 0) / energyLevels.length
          : null;

      let averageEnergyLevel = null;
      if (averageEnergy !== null) {
        if (averageEnergy >= 2.5) averageEnergyLevel = 'high';
        else if (averageEnergy >= 1.5) averageEnergyLevel = 'medium';
        else averageEnergyLevel = 'low';
      }

      return {
        totalEntries: moods.length,
        mostCommonMood,
        averageEnergyLevel,
        moodCounts,
        energyLevelCounts,
      };
    },
    enabled: !isLoading && moods.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
