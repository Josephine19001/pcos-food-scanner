import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '@/context/auth-provider';
import { useRevenueCat } from '@/context/revenuecat-provider';
import { WelcomeScreen } from '@/components/screens';

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, loading: subscriptionLoading } = useRevenueCat();

  useEffect(() => {
    const navigate = async () => {
      await SplashScreen.hideAsync();

      if (user) {
        // User exists but no active subscription -> show paywall
        if (!isSubscribed) {
          router.replace('/paywall');
        } else {
          // User has active subscription -> go to home
          router.replace('/(tabs)/home');
        }
      }
    };

    // Only navigate when not loading
    if (!authLoading && !subscriptionLoading) {
      navigate();
    }
  }, [user, authLoading, subscriptionLoading, isSubscribed]);

  // Show loading state while checking auth/subscription
  if (authLoading || subscriptionLoading) {
    return (
      <View className="flex-1 bg-[#0F0F0F] items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // No user -> show welcome screen
  if (!user) {
    return (
      <View style={{ flex: 1 }}>
        <WelcomeScreen />
      </View>
    );
  }

  // User exists -> show loader while determining route
  return (
    <View className="flex-1 bg-[#0F0F0F] items-center justify-center">
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}
