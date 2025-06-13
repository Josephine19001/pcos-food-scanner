import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { supabase } from '@/lib/supabase/client';
import { queryKeys } from './query-keys';
import { handleError } from './utils';
import { AVATAR_BUCKET } from '@/constants/images';

export interface Account {
  id: string;
  name: string;
  avatar: string | null;
  onboarding_completed: boolean;
  subscription_status: string;
  subscription_plan: string;
  subscription_platform: string;
  subscription_expires: string | null;
  subscription_billing_frequency: string | null;
  subscription_receipt_id: string | null;
  subscription_original_purchase: string | null;
  subscription_product: string | null;
  subscription_last_verified_at: string | null;
  created_at: string;
  updated_at: string;
  date_of_birth: string | null;
}

export function useAccount(
  options?: Omit<UseQueryOptions<Account, Error, Account>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.accounts.detail(),
    queryFn: async () => {
      const { data, error } = (await supabase.rpc('get_account_for_user')) as {
        data: Account | null;
        error: Error | null;
      };
      if (error) throw error;
      return data!;
    },
    ...options,
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name?: string;
      onboarding_completed?: boolean;
      date_of_birth?: string;
    }) => {
      const { error } = await supabase.rpc('update_account_profile', {
        p_name: payload.name ?? undefined,
        p_avatar: undefined,
        p_onboarding_done: payload.onboarding_completed ?? undefined,
        p_date_of_birth: payload.date_of_birth ?? undefined,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.accounts.detail() });
      toast.success('Account updated');
    },
    onError: (err: any) => handleError(err, 'Failed to update account'),
  });
}

export function useUpdateAccountAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ fileUri, fileBase64 }: { fileUri: string; fileBase64: string }) => {
      const fileName = fileUri.split('/').pop()!;
      const { data: upload, error: upErr } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(`${fileName}`, fileBase64, {
          contentType: 'image/jpeg',
          upsert: true,
        });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(upload.path);
      const publicUrl = data.publicUrl;

      const { error: rpcErr } = await supabase.rpc('update_account_profile', {
        p_name: undefined,
        p_avatar: publicUrl,
        p_onboarding_done: undefined,
      });
      if (rpcErr) throw rpcErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.accounts.detail() });
    },
    onError: (err: any) => handleError(err, 'Failed to update avatar'),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      qc.clear();
      toast.success('Signed out');
    },
    onError: (err: any) => handleError(err, 'Failed to sign out'),
  });
}

export interface Subscription {
  status: string;
  plan: string;
  platform: string;
  expires: string | null;
  billing_frequency: string | null;
  receipt_id: string | null;
  original_purchase: string | null;
  product: string | null;
  last_verified_at: string | null;
}

export function useSubscription(
  options?: Omit<UseQueryOptions<Subscription, Error, Subscription>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.accounts.subscription(),
    queryFn: async () => {
      const { data, error } = (await supabase.rpc('get_account_for_user')) as {
        data: Account | null;
        error: Error | null;
      };
      if (error) throw error;
      return {
        status: data!.subscription_status,
        plan: data!.subscription_plan,
        platform: data!.subscription_platform,
        expires: data!.subscription_expires,
        billing_frequency: data!.subscription_billing_frequency,
        receipt_id: data!.subscription_receipt_id,
        original_purchase: data!.subscription_original_purchase,
        product: data!.subscription_product,
        last_verified_at: data!.subscription_last_verified_at,
      };
    },
    ...options,
  });
}
