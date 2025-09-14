import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Text } from '../ui/text';
import { Button } from '@/components/ui/button';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useTheme } from '@/context/theme-provider';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { ChevronRight } from 'lucide-react-native';

export function WelcomeScreen() {
  // No automatic redirection logic - handled by main app index now
  const { isDark } = useTheme();

  const [isNavigating, setIsNavigating] = useState(false);

  const onSignIn = useCallback(() => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/auth?mode=signin');
      setIsNavigating(false); // Reset state after navigation
    }, 150);
  }, []);

  const onGetStarted = useCallback(() => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/onboarding');
      setIsNavigating(false); // Reset state after navigation
    }, 150);
  }, []);

  return (
    <View className="flex-1">
      {/* Full screen background image */}
      <Image
        source={{
          uri: 'https://res.cloudinary.com/josephine19001/image/upload/v1757763415/welcome_screen_yxk5ks.png',
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        contentFit="contain"
        contentPosition="top"
      />

      {/* Light overlay for better image visibility */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)',
        }}
      />

      {/* Content */}
      <View className="flex-1 justify-end">
        {/* Solid bottom container with rounded top corners - extends to screen bottom */}
        <View
          style={{
            backgroundColor: isDark ? '#240A34' : '#ffffff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 60, // Account for home indicator
          }}
        >
          <Animated.View entering={FadeIn.delay(300).duration(800)}>
            <Text
              className={`text-5xl font-bold mb-6 leading-tight ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              Wellness, but make it personal
            </Text>
            <Text
              className={`text-2xl mb-8 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Your body, your energy, your rules.
            </Text>

            {/* Action buttons */}
            <View className="space-y-4">
              <Button
                title="Get Started"
                onPress={onGetStarted}
                variant="primary"
                size="large"
                className="bg-pink-500 justify-between"
                postIcon={<ChevronRight size={24} color="white" />}
                disabled={isNavigating}
              />
              <TouchableOpacity onPress={onSignIn} className="py-3">
                <Text
                  className={`text-center text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Part of the community?{' '}
                  <Text className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                    Sign In
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
