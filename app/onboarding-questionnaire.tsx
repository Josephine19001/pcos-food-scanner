import { useState } from 'react';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { Questionnaire } from '@/components/ui';
import { onboardingQuestionnaireSteps } from '@/constants/onboarding-questionnaire';
import { useOnboardingStorage } from '@/lib/hooks/use-onboarding-storage';
import { mapQuestionnaireDataToOnboarding } from '@/lib/utils/onboarding-data-mapper';
import { validateOnboardingData } from '@/lib/utils/onboarding-validators';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

export default function OnboardingQuestionnaireScreen() {
  const router = useRouter();
  const { setOnboardingData, completeOnboarding } = useOnboardingStorage();

  // Questionnaire state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<string>('');

  // Form data - using the same structure as chat onboarding
  const [selectedValues, setSelectedValues] = useState<Record<string, string | string[]>>({});

  // Filter steps based on conditional logic
  const getVisibleSteps = () => {
    return onboardingQuestionnaireSteps.filter(step => {
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
    setSelectedValues(prev => ({
      ...prev,
      [stepKey]: value,
    }));
  };

  const handleOpenDatePicker = (stepKey: string) => {
    setCurrentDateField(stepKey);
    setShowDatePicker(true);
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    
    if (selectedDate && currentDateField) {
      const formattedDate = selectedDate.toLocaleDateString();
      setSelectedValues(prev => ({
        ...prev,
        [currentDateField]: formattedDate,
      }));
    }
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
      
      // Navigate to main app (same as chat)
      router.replace('/');
      
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
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
        onOpenDatePicker={handleOpenDatePicker}
      />

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </>
  );
}