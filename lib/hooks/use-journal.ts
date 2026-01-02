import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/auth-provider';
import type {
  FoodReaction,
  CreateFoodReactionInput,
  UpdateFoodReactionInput,
  FoodOption,
} from '@/lib/types/journal';

// Query keys for food reactions
export const journalKeys = {
  all: ['foodReactions'] as const,
  lists: () => [...journalKeys.all, 'list'] as const,
  details: () => [...journalKeys.all, 'detail'] as const,
  detail: (id: string) => [...journalKeys.details(), id] as const,
  byFood: (foodName: string) => [...journalKeys.all, 'food', foodName] as const,
  recentFoods: () => [...journalKeys.all, 'recentFoods'] as const,
  streak: () => [...journalKeys.all, 'streak'] as const,
};

// Fetch all food reactions for the current user
export function useFoodReactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: journalKeys.lists(),
    queryFn: async (): Promise<FoodReaction[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('food_reactions')
        .select('*')
        .eq('user_id', user.id)
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// Fetch a single food reaction by ID
export function useFoodReaction(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: journalKeys.detail(id),
    queryFn: async (): Promise<FoodReaction | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('food_reactions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user && !!id,
  });
}

// Fetch recent scanned foods for selection (excludes pending scans)
export function useRecentFoods(limit = 20) {
  const { user } = useAuth();

  return useQuery({
    queryKey: journalKeys.recentFoods(),
    queryFn: async (): Promise<FoodOption[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('scans')
        .select('id, name, image_url, status, scanned_at')
        .eq('user_id', user.id)
        .neq('status', 'pending')
        .order('scanned_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map((scan) => ({
        id: scan.id,
        name: scan.name,
        image_url: scan.image_url,
        status: scan.status as 'safe' | 'caution' | 'avoid',
        scanned_at: scan.scanned_at,
      }));
    },
    enabled: !!user,
  });
}

// Create a new food reaction
export function useCreateFoodReaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateFoodReactionInput): Promise<FoodReaction> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('food_reactions')
        .insert({
          user_id: user.id,
          scan_id: input.scan_id || null,
          food_name: input.food_name,
          food_image_url: input.food_image_url || null,
          meal_type: input.meal_type || null,
          reaction: input.reaction,
          symptoms: input.symptoms || [],
          severity: input.severity || null,
          time_after_eating: input.time_after_eating || null,
          energy_level: input.energy_level || null,
          notes: input.notes || null,
          consumed_at: input.consumed_at || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    },
  });
}

// Update an existing food reaction
export function useUpdateFoodReaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: UpdateFoodReactionInput & { id: string }): Promise<FoodReaction> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('food_reactions')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: journalKeys.detail(data.id) });
    },
  });
}

// Delete a food reaction
export function useDeleteFoodReaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('food_reactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
    },
  });
}

// Realtime subscription for food reactions
export function useFoodReactionsRealtime() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('food-reactions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'food_reactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
            queryClient.invalidateQueries({ queryKey: journalKeys.streak() });
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as FoodReaction;
            queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
            queryClient.invalidateQueries({ queryKey: journalKeys.detail(updated.id) });
          } else if (payload.eventType === 'DELETE') {
            queryClient.invalidateQueries({ queryKey: journalKeys.lists() });
            queryClient.invalidateQueries({ queryKey: journalKeys.streak() });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}

// Calculate consecutive days streak
function calculateStreak(reactions: FoodReaction[]): number {
  if (reactions.length === 0) return 0;

  // Get unique dates (in local timezone) when user logged food
  const loggedDates = new Set<string>();
  reactions.forEach((reaction) => {
    const date = new Date(reaction.consumed_at);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    loggedDates.add(dateStr);
  });

  // Sort dates in descending order (most recent first)
  const sortedDates = Array.from(loggedDates).sort((a, b) => b.localeCompare(a));

  // Get today's date string
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Get yesterday's date string
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  // Streak must start from today or yesterday
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 0;
  }

  // Count consecutive days
  let streak = 0;
  let currentDate = new Date(sortedDates[0]);

  for (const dateStr of sortedDates) {
    const expectedStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

    if (dateStr === expectedStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dateStr < expectedStr) {
      // Gap in dates, streak ends
      break;
    }
  }

  return streak;
}

// Hook to get the user's current streak
export function useJournalStreak() {
  const { data: reactions = [] } = useFoodReactions();

  return {
    streak: calculateStreak(reactions),
  };
}
