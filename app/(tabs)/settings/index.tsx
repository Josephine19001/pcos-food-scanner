import { View, Pressable, Linking, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { UserRound, FileText, Shield, UserMinus, LogOut, Camera } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ConfirmationModal, Skeleton } from '@/components/ui';
import PageLayout from '@/components/layouts/page-layout';
import { useAuth } from '@/context/auth-provider';
import { toast } from 'sonner-native';
import { useAccount, useUpdateAccountAvatar, useDeleteAccount } from '@/lib/hooks/use-accounts';
import * as ImagePickerExpo from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  cancelAnimation,
} from 'react-native-reanimated';

function AnimatedDots() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 500 }), withTiming(0.3, { duration: 500 })),
      -1, // Infinite repeat
      true // Reverse
    );

    return () => {
      cancelAnimation(opacity);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[{ color: '#3B82F6', marginLeft: 2 }, animatedStyle]}>...</Animated.Text>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <View className="bg-white mx-4 rounded-2xl shadow mb-4 overflow-hidden">
      <View className="p-6 flex-row items-center">
        <Skeleton width={64} height={64} borderRadius={32} className="mr-4" />
        <View className="flex-1">
          <Skeleton width={150} height={20} className="mb-2" />
          <Skeleton width={200} height={16} />
        </View>
      </View>
    </View>
  );
}

function SettingsPageSkeleton() {
  return (
    <>
      <ProfileHeaderSkeleton />

      <View className="bg-white mx-4 rounded-2xl shadow mb-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} className="p-4 border-b border-gray-100 last:border-b-0">
            <View className="flex-row items-center">
              <Skeleton width={20} height={20} className="mr-3" />
              <Skeleton width={120} height={16} />
            </View>
          </View>
        ))}
      </View>

      <View className="bg-white mx-4 rounded-2xl shadow mb-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} className="p-4 border-b border-gray-100 last:border-b-0">
            <View className="flex-row items-center">
              <Skeleton width={20} height={20} className="mr-3" />
              <Skeleton width={140} height={16} />
            </View>
          </View>
        ))}
      </View>

      <View className="bg-white mx-4 rounded-2xl shadow mb-8">
        <View className="p-4">
          <View className="flex-row items-center">
            <Skeleton width={20} height={20} className="mr-3" />
            <Skeleton width={80} height={16} />
          </View>
        </View>
      </View>
    </>
  );
}

function CircularLoader() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
      }),
      -1
    );

    return () => {
      cancelAnimation(rotation);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderTopColor: 'transparent',
  }));

  return <Animated.View style={animatedStyle} />;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: account, isLoading, error, refetch } = useAccount();
  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useUpdateAccountAvatar();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/auth');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete your account. Please try again or contact support.');
      setShowDeleteModal(false);
    }
  };

  const handleEditAvatar = async () => {
    try {
      const result = await ImagePickerExpo.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false, // We'll handle base64 conversion after processing
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        let processedUri = asset.uri;

        // Check if the image is HEIC and convert it
        const isHeic =
          asset.uri.toLowerCase().includes('.heic') ||
          asset.uri.toLowerCase().includes('.heif') ||
          asset.mimeType?.toLowerCase().includes('heic') ||
          asset.mimeType?.toLowerCase().includes('heif');

        if (isHeic) {
          console.log('📷 HEIC image detected, converting to JPEG...');
          toast.loading('Converting HEIC image...');

          // Convert HEIC to JPEG using ImageManipulator
          const convertedImage = await ImageManipulator.manipulateAsync(
            asset.uri,
            [
              { resize: { width: 800 } }, // Resize for consistency
            ],
            {
              compress: 0.8,
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );

          processedUri = convertedImage.uri;
        } else {
          // For non-HEIC images, still process them for consistency
          const processedImage = await ImageManipulator.manipulateAsync(
            asset.uri,
            [
              { resize: { width: 800 } }, // Resize for consistency
            ],
            {
              compress: 0.8,
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );

          processedUri = processedImage.uri;
        }

        // Convert the processed image to base64
        const base64 = await FileSystem.readAsStringAsync(processedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        if (!base64) {
          toast.error('Failed to process image');
          return;
        }

        updateAvatar(
          { fileUri: processedUri, fileBase64: base64 },
          {
            onSuccess: () => {
              toast.success('Avatar updated successfully!');
              refetch();
            },
            onError: (error) => {
              console.error('Avatar update failed:', error);
              toast.error('Failed to update avatar');
            },
          }
        );
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatar = () => {
    return (
      <View className="relative">
        {account?.avatar ? (
          <Image
            source={{ uri: account.avatar }}
            className="w-16 h-16 rounded-full"
            resizeMode="cover"
          />
        ) : account?.name ? (
          <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-xl font-bold text-gray-600">{getUserInitials(account.name)}</Text>
          </View>
        ) : (
          <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
            <UserRound size={32} color="#666" />
          </View>
        )}
        {isUpdatingAvatar && <CircularLoader />}
        <Pressable
          onPress={handleEditAvatar}
          className="absolute -bottom-1 -right-1 bg-black rounded-full p-1"
          disabled={isUpdatingAvatar}
        >
          <Camera size={12} color="white" />
        </Pressable>
      </View>
    );
  };

  const renderFallbackProfile = () => (
    <View className="bg-white mx-4 rounded-2xl shadow mb-4 overflow-hidden">
      <View className="p-6 flex-row items-center">
        <View className="relative">
          <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
            <UserRound size={32} color="#666" />
          </View>
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-xl font-bold text-gray-900">
            {user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text className="text-gray-500 mt-1">{user?.email || ''}</Text>
          {error ? (
            <>
              <Text className="text-sm text-red-500 mt-1">
                Error: {error instanceof Error ? error.message : 'Unknown error'}
              </Text>
              <Pressable onPress={() => refetch()} className="mt-1">
                <Text className="text-sm text-blue-500">Tap to retry</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text className="text-sm text-orange-500 mt-1">Profile data not available</Text>
              <Pressable onPress={() => refetch()} className="mt-1">
                <Text className="text-sm text-blue-500">Tap to retry</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <>
      <PageLayout title="Settings">
        {isLoading ? (
          <SettingsPageSkeleton />
        ) : (
          <>
            {/* Profile Header */}
            {account && !error ? (
              <View className="bg-white mx-4 rounded-2xl shadow mb-4 overflow-hidden">
                <View className="p-6 flex-row items-center">
                  <View className="relative">{renderAvatar()}</View>
                  <View className="ml-4 flex-1">
                    <Text className="text-xl font-bold text-gray-900">
                      {account?.name || 'Loading...'}
                    </Text>
                    <Text className="text-gray-500 mt-1">{user?.email || ''}</Text>
                    {isUpdatingAvatar && (
                      <View className="flex-row items-center mt-1">
                        <Text className="text-sm text-blue-500">Updating avatar</Text>
                        <AnimatedDots />
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              renderFallbackProfile()
            )}

            {/* Settings List */}
            <View className="bg-white mx-4 rounded-2xl shadow">
              <SettingsItem
                icon={UserRound}
                label="Personal details"
                onPress={() => router.push('/settings/personal-details')}
                isLast
              />
            </View>

            <View className="bg-white mx-4 rounded-2xl shadow mt-4">
              <SettingsItem
                icon={FileText}
                label="Terms and Conditions"
                onPress={() => Linking.openURL('https://www.hairdeet.ai/terms')}
              />
              <SettingsItem
                icon={Shield}
                label="Privacy Policy"
                onPress={() => Linking.openURL('https://www.hairdeet.ai/privacy')}
              />
              <SettingsItem
                icon={UserMinus}
                label="Delete Account"
                onPress={() => setShowDeleteModal(true)}
                isLast
              />
            </View>

            {/* Logout */}
            <View className="bg-white mx-4 rounded-2xl shadow mt-4 mb-8">
              <SettingsItem icon={LogOut} label="Logout" isLast onPress={handleLogout} />
            </View>
          </>
        )}
      </PageLayout>

      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete account?"
        message="Are you sure you want to permanently delete your account?"
        destructive
      />
    </>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  isLast,
  onPress,
  textClassName = '',
}: {
  icon: React.ElementType;
  label: string;
  isLast?: boolean;
  onPress?: () => void;
  textClassName?: string;
}) {
  return (
    <Pressable
      className={`flex-row items-center p-4 ${!isLast && 'border-b border-gray-100'}`}
      onPress={onPress}
    >
      <Icon size={20} color="black" />
      <Text className={`text-lg ${textClassName} ml-2`}>{label}</Text>
    </Pressable>
  );
}
