import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onNext?: () => void;
  nextButtonLabel?: string;
  currentStep?: number;
  totalSteps?: number;
  allowContinue?: boolean;
  hideContinueButton?: boolean;
  showHeader?: boolean;
}

export function OnboardingLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
  onNext,
  nextButtonLabel = 'Continue',
  currentStep = 1,
  totalSteps = 5,
  allowContinue = false,
  hideContinueButton = false,
  showHeader = true,
}: OnboardingLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {showHeader && (
        <View className="flex-row items-center px-5 h-12 mb-10">
          {showBackButton && (
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 bg-slate-100 rounded-full"
            >
              <ChevronLeft size={24} />
            </Pressable>
          )}

          <View className="flex-1 h-1 bg-gray-100 mx-4 rounded-full">
            <View
              className="h-1 bg-black rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </View>
        </View>
      )}

      <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-1 px-5">
        {title && (
          <Text variant="heading" className="text-2xl font-bold mb-2 text-left">
            {title}
          </Text>
        )}

        {subtitle && <Text className="text-gray-600 mb-6 text-lg">{subtitle}</Text>}

        <View className="flex-1">{children}</View>

        {!hideContinueButton && (
          <View className="py-6">
            <Button
              variant="primary"
              label={nextButtonLabel}
              onPress={onNext}
              disabled={!allowContinue}
            />
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
