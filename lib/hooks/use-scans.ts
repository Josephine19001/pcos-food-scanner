import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/auth-provider';
import type { ScanResult, CreateScanInput, UpdateScanInput } from '@/lib/types/scan';

export const scanKeys = {
  all: ['scans'] as const,
  lists: () => [...scanKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...scanKeys.lists(), filters] as const,
  favorites: () => [...scanKeys.all, 'favorites'] as const,
  details: () => [...scanKeys.all, 'detail'] as const,
  detail: (id: string) => [...scanKeys.details(), id] as const,
};

// Fetch all scans for the current user
export function useScans() {
  const { user } = useAuth();

  return useQuery({
    queryKey: scanKeys.lists(),
    queryFn: async (): Promise<ScanResult[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('scanned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// Fetch favorite scans
export function useFavoriteScans() {
  const { user } = useAuth();

  return useQuery({
    queryKey: scanKeys.favorites(),
    queryFn: async (): Promise<ScanResult[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .order('scanned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

// Fetch a single scan by ID
export function useScan(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: scanKeys.detail(id),
    queryFn: async (): Promise<ScanResult | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('scans')
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

// Create a new scan
export function useCreateScan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateScanInput): Promise<ScanResult> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('scans')
        .insert({
          ...input,
          user_id: user.id,
          is_favorite: false,
          scanned_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scanKeys.lists() });
    },
  });
}

// Update a scan (e.g., toggle favorite)
export function useUpdateScan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateScanInput & { id: string }): Promise<ScanResult> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('scans')
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
      queryClient.invalidateQueries({ queryKey: scanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scanKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: scanKeys.detail(data.id) });
    },
  });
}

// Delete a scan
export function useDeleteScan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('scans')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scanKeys.favorites() });
    },
  });
}

// Toggle favorite status
export function useToggleFavorite() {
  const updateScan = useUpdateScan();

  return {
    ...updateScan,
    mutate: (scan: ScanResult) => {
      updateScan.mutate({ id: scan.id, is_favorite: !scan.is_favorite });
    },
    mutateAsync: async (scan: ScanResult) => {
      return updateScan.mutateAsync({ id: scan.id, is_favorite: !scan.is_favorite });
    },
  };
}
