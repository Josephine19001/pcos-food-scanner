import { OnboardingData } from '@/types/onboarding';
import { OnboardingStorage } from '@/lib/utils/onboarding-storage';

/**
 * Hook for managing onboarding data storage
 */
export function useOnboardingStorage() {
  const setOnboardingData = async (data: Partial<OnboardingData>) => {
    await OnboardingStorage.save(data as OnboardingData);
  };

  const completeOnboarding = async () => {
    // Mark onboarding as complete - this can be used by the main app
    // to determine if user has completed onboarding
    return Promise.resolve();
  };

  return {
    setOnboardingData,
    completeOnboarding,
  };
}