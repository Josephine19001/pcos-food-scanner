import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { supabase } from '@/lib/supabase/client';
import { queryKeys } from './query-keys';
import { handleError } from './utils';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '@/lib/utils/image-upload';

export interface AvatarData {
  avatarUrl: string | null;
  userId: string;
}

/**
 * Hook to get current avatar URL
 */
export function useAvatar(
  options?: Omit<UseQueryOptions<string | null, Error, string | null>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.settings.avatar(),
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();

      if (!user.user) {
        return null;
      }

      const { data, error } = await supabase.rpc('get_account_for_user');

      if (error) throw error;
      return data?.avatar || null;
    },
    ...options,
  });
}

/**
 * Hook to request camera and media library permissions
 */
export function useAvatarPermissions() {
  return useMutation({
    mutationFn: async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted') {
        throw new Error('Camera access is required to take photos');
      }

      if (mediaLibraryPermission.status !== 'granted') {
        throw new Error('Photo library access is required to select images');
      }

      return true;
    },
    onError: (err: any) => handleError(err, 'Failed to get permissions'),
  });
}

/**
 * Hook to pick image from camera or library
 */
export function useImagePicker() {
  return useMutation({
    mutationFn: async ({ useCamera = false }: { useCamera?: boolean } = {}) => {
      // Request permissions first
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted') {
        throw new Error('Camera access is required to take photos');
      }

      if (mediaLibraryPermission.status !== 'granted') {
        throw new Error('Photo library access is required to select images');
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for avatars
        quality: 0.5, // Reduce quality to keep file size under 5MB
        base64: false,
      };

      let result: ImagePicker.ImagePickerResult;

      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (result.canceled) {
        return null; // Don't throw error for user cancellation
      }

      return result.assets[0].uri;
    },
    onError: (err: any) => {
      // Don't show error toast for user cancellation
      if (!err.message.includes('cancelled')) {
        handleError(err, 'Failed to pick image');
      }
    },
  });
}

/**
 * Hook to upload avatar image
 */
export function useUploadAvatar() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (imageUri: string) => {
      const { data: user } = await supabase.auth.getUser();

      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // Create file path for avatar
      const fileName = `${user.user.id}-${Date.now()}.jpg`;
      const filePath = `${user.user.id}/${fileName}`;

      // Use common upload utility with avatar-specific settings
      const { publicUrl } = await uploadImage(imageUri, 'avatars', filePath, {
        maxSize: 800,
        quality: 0.7,
        upsert: true,
      });

      // Update account with new avatar URL
      const { error: updateError } = await supabase.rpc('update_account_profile', {
        p_avatar: publicUrl,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      return publicUrl;
    },
    onSuccess: (avatarUrl) => {
      qc.invalidateQueries({ queryKey: queryKeys.settings.avatar() });
      qc.invalidateQueries({ queryKey: queryKeys.settings.detail() });
      qc.invalidateQueries({ queryKey: queryKeys.accounts.detail() });
    },
    onError: (err: any) => handleError(err, 'Failed to upload avatar'),
  });
}

/**
 * Hook to delete current avatar
 */
export function useDeleteAvatar() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();

      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // Update account to remove avatar URL
      const { error } = await supabase.rpc('update_account_profile', {
        p_avatar: null,
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.settings.avatar() });
      qc.invalidateQueries({ queryKey: queryKeys.settings.detail() });
      qc.invalidateQueries({ queryKey: queryKeys.accounts.detail() });
    },
    onError: (err: any) => handleError(err, 'Failed to remove avatar'),
  });
}

/**
 * Convenience hook that combines image picking and uploading
 */
export function useAvatarUpload() {
  const pickImage = useImagePicker();
  const uploadAvatar = useUploadAvatar();

  return useMutation({
    mutationFn: async ({ useCamera = false }: { useCamera?: boolean } = {}) => {
      // First pick the image
      const imageUri = await pickImage.mutateAsync({ useCamera });

      // If user cancelled, return early without error
      if (!imageUri) {
        return null;
      }

      // Then upload it
      const avatarUrl = await uploadAvatar.mutateAsync(imageUri);

      return avatarUrl;
    },
    onError: (err: any) => {
      // Don't show error for user cancellation
      if (err && !err.message?.includes('cancelled')) {
        console.error('Avatar upload error:', err);
        // Don't use handleError here to avoid duplicate toasts
        // The uploadAvatar hook already handles errors
      }
    },
  });
}
