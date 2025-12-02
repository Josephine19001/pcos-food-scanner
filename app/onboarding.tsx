import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  Platform,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_URLS } from '@/lib/config/urls';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInRight,
  FadeOutLeft,
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppleIcon } from '@/components/icons/tab-icons';

type Step = 'slide1' | 'slide2' | 'signup';

export default function OnboardingScreen() {
  const router = useRouter();
  const { signInWithApple, loading: authLoading } = useAuth();

  const [step, setStep] = useState<Step>('slide1');
  const [appleLoading, setAppleLoading] = useState(false);

  const isLoading = authLoading || appleLoading;

  const steps: Step[] = ['slide1', 'slide2', 'signup'];
  const progress = steps.indexOf(step);

  const goBack = () => {
    const i = steps.indexOf(step);
    if (i > 0) {
      setStep(steps[i - 1]);
    } else {
      router.back();
    }
  };

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const i = steps.indexOf(step);
    if (i < steps.length - 1) {
      setStep(steps[i + 1]);
    }
  };

  const handleAppleAuth = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Re-enable Apple auth
    // setAppleLoading(true);
    // try {
    //   await signInWithApple();
    // } catch (error) {
    //   console.error('Apple auth error:', error);
    // } finally {
    //   setAppleLoading(false);
    // }
    router.replace('/(tabs)/home');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        {/* Progress Bar with Back Button */}
        <View className="flex-row items-center py-4 px-6">
          <Pressable onPress={goBack} className="flex-row items-center mr-4">
            <ChevronLeft size={24} color="#6B7280" />
          </Pressable>
          <View className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-teal-600 rounded-full"
              style={{ width: `${((progress + 1) / steps.length) * 100}%` }}
            />
          </View>
        </View>

        {/* Slide 1: Scan Food */}
        {step === 'slide1' && (
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            className="flex-1 px-6 justify-between pb-8"
          >
            <View className="flex-1 justify-center items-center">
              {/* Screenshot placeholder for demo - iPhone aspect ratio (9:19.5) scaled down */}
              <Animated.View
                entering={FadeIn.delay(200).duration(500)}
                className="bg-gray-100 rounded-[40px] items-center justify-center mb-6 border-[6px] border-gray-800 overflow-hidden shadow-xl"
                style={{ width: 240, height: 520 }}
              >
                <Image
                  source={require('@/assets/images/demo-scan.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </Animated.View>

              <Animated.Text
                entering={FadeInUp.delay(300).duration(500)}
                className="text-gray-900 text-3xl font-bold text-center mb-3"
              >
                Scan Any Food
              </Animated.Text>
              <Animated.Text
                entering={FadeInUp.delay(400).duration(500)}
                className="text-gray-500 text-lg text-center px-4"
              >
                Point your camera at any food, meal, or package
              </Animated.Text>
            </View>

            {/* Next Button */}
            <Pressable onPress={goNext} className="rounded-2xl overflow-hidden bg-teal-600">
              <View className="py-4 px-6 flex-row items-center justify-center">
                <Text className="text-white font-bold text-lg mr-2">Next</Text>
                <ChevronRight size={20} color="#ffffff" />
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Slide 2: Get Results */}
        {step === 'slide2' && (
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            className="flex-1 px-6 justify-between pb-8"
          >
            <View className="flex-1 justify-center items-center">
              {/* Screenshot placeholder for demo - iPhone aspect ratio (9:19.5) scaled down */}
              <Animated.View
                entering={FadeIn.delay(200).duration(500)}
                className="bg-gray-100 rounded-[40px] items-center justify-center mb-6 border-[6px] border-gray-800 overflow-hidden shadow-xl"
                style={{ width: 240, height: 520 }}
              >
                <Image
                  source={require('@/assets/images/demo-result.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </Animated.View>

              <Animated.Text
                entering={FadeInUp.delay(300).duration(500)}
                className="text-gray-900 text-3xl font-bold text-center mb-3"
              >
                Get Instant Results
              </Animated.Text>
              <Animated.Text
                entering={FadeInUp.delay(400).duration(500)}
                className="text-gray-500 text-lg text-center px-4"
              >
                We'll show you what's good, what's not, and why
              </Animated.Text>
            </View>

            {/* Next Button */}
            <Pressable onPress={goNext} className="rounded-2xl overflow-hidden bg-teal-600">
              <View className="py-4 px-6 flex-row items-center justify-center">
                <Text className="text-white font-bold text-lg mr-2">Get Started</Text>
                <ChevronRight size={20} color="#ffffff" />
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Signup Step */}
        {step === 'signup' && (
          <Animated.View
            entering={FadeInRight.duration(300)}
            className="flex-1 px-6 justify-between pb-8"
          >
            <View className="flex-1 justify-center">
              <Animated.View
                entering={FadeInUp.delay(100).duration(500)}
                className="items-center mb-10"
              >
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={{ width: 80, height: 80 }}
                  resizeMode="contain"
                />
                <Text className="text-gray-900 text-2xl font-bold text-center mt-6 mb-2">
                  Create Your Account
                </Text>
                <Text className="text-gray-500 text-base text-center px-4">
                  Sign in to save your scans and get personalized recommendations
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(300).duration(500)}>
                {Platform.OS === 'ios' && (
                  <Pressable
                    onPress={handleAppleAuth}
                    disabled={isLoading}
                    className={`rounded-2xl overflow-hidden mb-3 ${
                      isLoading ? 'opacity-70' : ''
                    }`}
                  >
                    <View className="bg-black py-4 flex-row items-center justify-center">
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
              </Animated.View>
            </View>

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
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}
