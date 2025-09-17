import { useState } from 'react';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { View, ScrollView, SafeAreaView, Dimensions, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Questionnaire } from '@/components/ui';
import { onboardingQuestionnaireSteps } from '@/constants/onboarding-questionnaire';
import { useOnboardingStorage } from '@/lib/hooks/use-onboarding-storage';
import { mapQuestionnaireDataToOnboarding } from '@/lib/utils/onboarding-data-mapper';
import { validateOnboardingData } from '@/lib/utils/onboarding-validators';
import { useTheme } from '@/context/theme-provider';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

// Commented out chat onboarding - using questionnaire instead
// import { ChatOnboarding } from '@/components/onboarding/chat-onboarding';
// import { useThemedStyles } from '@/lib/utils/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setOnboardingData, completeOnboarding } = useOnboardingStorage();
  const { theme } = useTheme();

  // Questionnaire state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form data - using the same structure as chat onboarding
  const [selectedValues, setSelectedValues] = useState<Record<string, string | string[]>>({});

  // Filter steps based on conditional logic
  const getVisibleSteps = () => {
    return onboardingQuestionnaireSteps.filter((step) => {
      if (!step.showIf) return true;

      for (const [dependentKey, requiredValue] of Object.entries(step.showIf)) {
        if (selectedValues[dependentKey] !== requiredValue) {
          return false;
        }
      }
      return true;
    });
  };

  const visibleSteps = getVisibleSteps();

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < visibleSteps.length) {
      setCurrentStepIndex(nextIndex);
      setProgress((nextIndex / visibleSteps.length) * 100);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex === 0) {
      router.back();
    } else {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setProgress((prevIndex / visibleSteps.length) * 100);
    }
  };

  const handleSelectValue = (stepKey: string, value: string | string[]) => {
    setSelectedValues((prev) => ({
      ...prev,
      [stepKey]: value,
    }));
  };

  const handleComplete = async () => {
    setIsGenerating(true);

    try {
      // Map questionnaire data to onboarding format (same as chat)
      const onboardingData = mapQuestionnaireDataToOnboarding(selectedValues);

      // Validate the data (same validation as chat)
      const validation = validateOnboardingData(onboardingData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Store the data (same as chat)
      await setOnboardingData(onboardingData);

      // Complete onboarding (same as chat)
      await completeOnboarding();

      // Show completion screen first
      setShowCompletion(true);
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const slides = [
    {
      emoji: '😤',
      title: 'Ugh, the endless apps...',
      content:
        'Period tracker, fitness app, nutrition counter, mood diary... You know the drill. Your phone is basically a wellness graveyard at this point.',
      gradient: 'from-red-50 to-orange-50',
      darkGradient: 'from-red-900/20 to-orange-900/20',
    },
    {
      emoji: '🤯',
      title: 'But nothing connects?',
      content:
        "Why does your fitness app tell you to do HIIT when you're literally dying from cramps? Why doesn't your nutrition app know you're PMSing and need those carbs?",
      gradient: 'from-blue-50 to-indigo-50',
      darkGradient: 'from-blue-900/20 to-indigo-900/20',
    },
    {
      emoji: '💡',
      title: "Here's what we figured out",
      content:
        "As women, we're not the same person every day of the month. Our energy, cravings, and motivation literally change with our cycle. So why do we use apps that ignore this?",
      gradient: 'from-yellow-50 to-amber-50',
      darkGradient: 'from-yellow-900/20 to-amber-900/20',
    },
    {
      emoji: '✨',
      title: 'So we built something different',
      content:
        "What if your wellness app actually understood your cycle? What if it worked WITH your body instead of against it? That's what we're trying to figure out together.",
      gradient: 'from-pink-50 to-purple-50',
      darkGradient: 'from-pink-900/20 to-purple-900/20',
    },
  ];

  const { width } = Dimensions.get('window');

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const renderIntroScreen = () => (
    <SafeAreaView className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <View className="px-6 pt-8 pb-4">
        <Text
          className={`text-3xl font-black text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Hey babe! 👋
        </Text>
        <Text
          className={`text-base text-center mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Let me tell you why Luna exists...
        </Text>
      </View>

      {/* Slider */}
      <View className="flex-1 justify-center">
        <View className="px-6">
          <View
            className={`py-12 px-8 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gray-800'
                : `bg-gradient-to-br ${slides[currentSlide].gradient}`
            }`}
          >
            <Text className="text-6xl text-center">{slides[currentSlide].emoji}</Text>
            <Text
              className={`text-2xl font-bold text-center mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {slides[currentSlide].title}
            </Text>
            <Text
              className={`text-lg leading-relaxed text-center ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {slides[currentSlide].content}
            </Text>
          </View>
        </View>

        {/* Navigation */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <Pressable
            onPress={prevSlide}
            disabled={currentSlide === 0}
            className={`p-3 rounded-full ${currentSlide === 0 ? 'opacity-30' : ''} ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} color={theme === 'dark' ? '#F3F4F6' : '#374151'} />
          </Pressable>

          {/* Dots */}
          <View className="flex-row">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${
                  index === currentSlide
                    ? 'bg-pink-500'
                    : theme === 'dark'
                    ? 'bg-gray-700'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </View>

          <Pressable
            onPress={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`p-3 rounded-full ${
              currentSlide === slides.length - 1 ? 'opacity-30' : ''
            } ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
          >
            <ChevronRight size={20} color={theme === 'dark' ? '#F3F4F6' : '#374151'} />
          </Pressable>
        </View>
      </View>

      {/* Bottom CTA */}
      <View className="px-6 pb-8 pt-4">
        <Button
          title="Let's sync with my cycle ✨"
          className="w-full"
          onPress={() => setShowIntro(false)}
        />
        <Text
          className={`text-center text-sm mt-3 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          Just a few questions - takes 2 minutes 💕
        </Text>
        <Text
          className={`text-center text-xs mt-2 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`}
        >
          🔒 Your data stays private and secure
        </Text>
      </View>
    </SafeAreaView>
  );

  const renderCompletionScreen = () => (
    <SafeAreaView
      className={`flex-1 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'
      }`}
    >
      {/* Header with Back Button */}
      <View className="px-6 pt-4 pb-2">
        <Pressable 
          onPress={() => setShowCompletion(false)} 
          className={`p-3 rounded-full w-12 h-12 items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white/80'}`}
        >
          <ChevronLeft size={20} color={theme === 'dark' ? '#F3F4F6' : '#374151'} />
        </Pressable>
      </View>

      <View className="flex-1 justify-center items-center px-6">
        {/* Celebration Elements */}
        <View className="relative mb-8">
          <View className="absolute -top-8 -left-8">
            <Text className="text-4xl">🎉</Text>
          </View>
          <View className="absolute -top-4 -right-12">
            <Text className="text-3xl">✨</Text>
          </View>
          <View className="absolute -bottom-6 -left-12">
            <Text className="text-3xl">💖</Text>
          </View>
          <View className="absolute -bottom-8 -right-8">
            <Text className="text-4xl">🌟</Text>
          </View>

          <View
            className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 items-center justify-center"
            style={{
              shadowColor: '#10B981',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
            }}
          >
            <Text className="text-6xl">✨</Text>
          </View>
        </View>

        <Text
          className={`text-4xl font-black text-center mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Yass! 🎉
        </Text>

        <Text
          className={`text-xl font-bold text-center mb-6 ${
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`}
        >
          You're all set up!
        </Text>

        <Text
          className={`text-lg text-center mb-8 leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Thanks for sharing! Your wellness profile is ready. Now let's finish setting up your
          account so you can start your journey! 💫
        </Text>

        <Button
          title="Finish account sign up ✨"
          className="w-full"
          onPress={() => router.push('/auth?mode=signup')}
        />
      </View>
    </SafeAreaView>
  );

  if (showCompletion) {
    return renderCompletionScreen();
  }

  if (showIntro) {
    return renderIntroScreen();
  }

  return (
    <View className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Questionnaire
        visible={true}
        onClose={() => router.back()}
        steps={visibleSteps}
        currentStepIndex={currentStepIndex}
        selectedValues={selectedValues}
        onSelectValue={handleSelectValue}
        onNext={handleNext}
        onBack={handleBack}
        onComplete={handleComplete}
        progress={progress}
        isGenerating={isGenerating}
        accentColor="#EC4899" // Luna pink
      />
    </View>
  );
}
