import { View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { useAuth } from '@/context/auth-provider';
import { Scan, ScanLine } from 'lucide-react-native';

const gridItems = [
  { label: 'Skin', img: require('@/assets/onboarding/example-icon.png') },
  { label: 'Hair', img: require('@/assets/onboarding/example-icon.png') },
  { label: 'Face', img: require('@/assets/onboarding/example-icon.png') },
  { label: 'Perfume', img: require('@/assets/onboarding/example-icon.png') },
];

export function WelcomeScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/explore');
    }
  }, [user, loading]);

  const onGetStarted = useCallback(() => {
    router.replace('/auth?mode=signup');
  }, []);

  const onSignIn = useCallback(() => {
    router.push('/auth?mode=signin');
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (user) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-gray-600">Redirecting...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <View className="flex-1 items-center justify-between w-full">
        {/* Title and subtitle */}
        <View className="w-full items-center mt-16">
          <Text className="text-4xl font-extrabold text-black text-center mb-3">
            Scan Every Beauty Product
          </Text>
          <Text className="text-lg text-gray-500 text-center mb-8 font-medium">
            Know what is in your beauty products
          </Text>
        </View>
        {/* 2x2 grid with scan frame overlays */}
        <View className="w-full items-center mb-8">
          <View className="flex-row flex-wrap w-full max-w-xs justify-center items-center gap-4">
            {gridItems.map((item, idx) => (
              <View
                key={item.label}
                className="w-32 h-32 bg-white rounded-2xl relative items-center justify-center overflow-hidden"
              >
                <Image source={item.img} className="w-full h-full rounded-2xl" resizeMode="cover" />
                {/* Lucide scan frame overlay, centered */}
                <ScanLine
                  size={48}
                  color="#007AFF"
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    right: 12,
                    bottom: 12,
                    opacity: 0.85,
                  }}
                />
                <Text className="absolute bottom-2 left-0 right-0 text-xs font-semibold text-center text-black bg-white/80 rounded-full px-1 py-0.5">
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {/* Standard Get Started button */}
        <Button
          variant="primary"
          label="Get Started"
          onPress={onGetStarted}
          className="w-full mb-4"
        />
        {/* Bottom instruction and sign in */}
        <View className="w-full items-center mb-6">
          <Text className="text-xs text-gray-400 text-center mb-4">
            Press and hold to get started.
          </Text>
          <View className="flex-row items-center justify-center gap-2">
            <Text variant="body" className="text-center">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={onSignIn}>
              <Text variant="body" className="text-black font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
