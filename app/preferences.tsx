import { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  GoalStep,
  SymptomsStep,
  StrugglesStep,
  FoodRelationshipStep,
  FavoriteFoodsStep,
  ActivityStep,
} from '@/components/onboarding/steps';
import { useOnboardingProfile, useSaveOnboardingProfile } from '@/lib/hooks/use-accounts';
import { useOnboarding } from '@/context/onboarding-provider';
import { PreferencesStepSkeleton } from '@/components/ui/skeleton';

type Step =
  | 'goal'
  | 'symptoms'
  | 'struggles'
  | 'food-relationship'
  | 'favorite-foods'
  | 'activity';

export default function PreferencesScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('goal');
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

  const { data: profile, isLoading: isLoadingProfile } = useOnboardingProfile();
  const { mutateAsync: saveProfile, isPending: isSaving } = useSaveOnboardingProfile();
  const { data: onboardingData, loadFromProfile } = useOnboarding();

  // Load saved profile data into context when it becomes available
  useEffect(() => {
    if (profile && !hasLoadedProfile) {
      loadFromProfile(profile);
      setHasLoadedProfile(true);
    }
  }, [profile, hasLoadedProfile, loadFromProfile]);

  const steps: Step[] = [
    'goal',
    'symptoms',
    'struggles',
    'food-relationship',
    'favorite-foods',
    'activity',
  ];
  const totalSteps = steps.length;

  const goBack = () => {
    const i = steps.indexOf(step);
    if (i > 0) {
      setStep(steps[i - 1]);
    } else {
      router.back();
    }
  };

  const goNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const i = steps.indexOf(step);
    if (i < steps.length - 1) {
      setStep(steps[i + 1]);
    } else {
      // Last step - save preferences and go back to settings
      await saveProfile({
        primary_goal: onboardingData.primaryGoal,
        symptoms: onboardingData.symptoms,
        daily_struggles: onboardingData.dailyStruggles,
        food_relationship: onboardingData.foodRelationship,
        feel_good_foods: onboardingData.feelGoodFoods,
        guilt_foods: onboardingData.guiltFoods,
        activity_level: onboardingData.activityLevel,
        referral_source: onboardingData.referralSource,
      });
      router.back();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'goal':
        return (
          <GoalStep
            currentStep={1}
            totalSteps={totalSteps}
            onBack={goBack}
            onNext={goNext}
          />
        );

      case 'symptoms':
        return (
          <SymptomsStep
            currentStep={2}
            totalSteps={totalSteps}
            onBack={goBack}
            onNext={goNext}
          />
        );

      case 'struggles':
        return (
          <StrugglesStep
            currentStep={3}
            totalSteps={totalSteps}
            onBack={goBack}
            onNext={goNext}
          />
        );

      case 'food-relationship':
        return (
          <FoodRelationshipStep
            currentStep={4}
            totalSteps={totalSteps}
            onBack={goBack}
            onNext={goNext}
          />
        );

      case 'favorite-foods':
        return (
          <FavoriteFoodsStep
            currentStep={5}
            totalSteps={totalSteps}
            onBack={goBack}
            onNext={goNext}
          />
        );

      case 'activity':
        return (
          <ActivityStep
            currentStep={6}
            totalSteps={totalSteps}
            onBack={goBack}
            onNext={goNext}
          />
        );

      default:
        return null;
    }
  };

  // Show skeleton loader while fetching profile
  if (isLoadingProfile) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <PreferencesStepSkeleton />
      </>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      {renderStep()}
    </View>
  );
}
