import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-provider';
import * as Haptics from 'expo-haptics';
import { AppleIcon, GoogleIcon } from '@/components/icons/tab-icons';
import { APP_URLS } from '@/lib/config/urls';

export default function AuthScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: 'signin' | 'signup' }>();
  const { signInWithApple, signInWithGoogle, loading: authLoading } = useAuth();
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isSignUp = mode === 'signup';
  const isLoading = authLoading || appleLoading || googleLoading;

  const handleAppleAuth = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAppleLoading(true);
    try {
      await signInWithApple();
      // Navigation is handled by auth state change listener
    } catch (error) {
      console.error('Apple auth error:', error);
    } finally {
      setAppleLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Navigation is handled by auth state change listener
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6 justify-between pb-8">
          <View className="flex-1 justify-center">
            {/* Title */}
            <View className="mb-10">
              <Text className="text-gray-900 text-3xl font-bold text-center mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Text>
              <Text className="text-gray-500 text-center">
                {isSignUp
                  ? 'Sign up to start your PCOS journey'
                  : 'Sign in to continue your progress'}
              </Text>
            </View>

            {/* Auth Buttons */}
            <View className="mb-8">
              {/* Apple Sign In - iOS only */}
              {Platform.OS === 'ios' && (
                <Pressable
                  onPress={handleAppleAuth}
                  disabled={isLoading}
                  className={`rounded-2xl overflow-hidden mb-3 ${isLoading ? 'opacity-70' : ''}`}
                >
                  <View className="bg-black py-4 px-6 flex-row items-center justify-center">
                    {appleLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <AppleIcon size={20} color="#fff" />
                        <Text className="text-white font-semibold text-lg ml-3">
                          Continue with Apple
                        </Text>
                      </>
                    )}
                  </View>
                </Pressable>
              )}

              {/* Google Sign In - temporarily disabled */}
              {/* <Pressable
                onPress={handleGoogleAuth}
                disabled={isLoading}
                className={`rounded-2xl overflow-hidden ${
                  isLoading ? 'opacity-70' : ''
                }`}
              >
                <View className="bg-gray-100 border border-gray-200 rounded-2xl py-4 px-6 flex-row items-center justify-center">
                  {googleLoading ? (
                    <ActivityIndicator color="#111827" />
                  ) : (
                    <>
                      <GoogleIcon size={20} />
                      <Text className="text-gray-900 font-semibold text-lg ml-3">
                        Continue with Google
                      </Text>
                    </>
                  )}
                </View>
              </Pressable> */}
            </View>

            {/* Toggle Auth Mode */}
            <Pressable
              onPress={() => {
                if (isSignUp) {
                  router.setParams({ mode: 'signin' });
                } else {
                  router.push('/onboarding');
                }
              }}
              className="py-3"
            >
              <Text className="text-gray-500 text-center">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <Text className="text-teal-600 font-semibold">Sign In</Text>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <Text className="text-teal-600 font-semibold">Get Started</Text>
                  </>
                )}
              </Text>
            </Pressable>
          </View>

          {/* Terms */}
          <Text className="text-gray-400 text-xs text-center">
            By continuing, you agree to our{' '}
            <Text
              className="text-gray-500 underline"
              onPress={() => Linking.openURL(APP_URLS.terms)}
            >
              Terms
            </Text>
            {' & '}
            <Text
              className="text-gray-500 underline"
              onPress={() => Linking.openURL(APP_URLS.privacy)}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
