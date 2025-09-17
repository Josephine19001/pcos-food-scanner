import { View, ScrollView, Pressable, Modal, SafeAreaView, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Calendar } from 'lucide-react-native';
import { useTheme } from '@/context/theme-provider';
import { useState } from 'react';

export type QuestionnaireStep = {
  key: string;
  title: string;
  subtitle: string;
  options: Array<{
    value: string;
    label: string;
    description: string;
    icon?: string;
  }>;
  inputType?: 'text' | 'date';
  placeholder?: string;
  multiSelect?: boolean;
  showIf?: { [key: string]: string };
};

export type QuestionnaireProps = {
  visible: boolean;
  onClose: () => void;
  steps: QuestionnaireStep[];
  currentStepIndex: number;
  selectedValues: Record<string, string | string[] | null>;
  onSelectValue: (stepKey: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  progress: number;
  isGenerating: boolean;
  accentColor?: string;
  onOpenDatePicker?: (stepKey: string) => void;
};

export default function Questionnaire({
  visible,
  steps,
  currentStepIndex,
  selectedValues,
  onSelectValue,
  onNext,
  onBack,
  onComplete,
  progress,
  isGenerating,
  accentColor = '#ec4899', // default pink-500
  onOpenDatePicker,
}: QuestionnaireProps) {
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isComplete = currentStepIndex >= steps.length;
  const { theme } = useTheme();


  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  const renderOption = (option: any, stepKey: string, isMultiSelect = false) => {
    const selectedValue = selectedValues[stepKey];
    const isSelected = isMultiSelect 
      ? Array.isArray(selectedValue) && selectedValue.includes(option.value)
      : selectedValue === option.value;

    const handlePress = () => {
      if (isMultiSelect) {
        const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
        const newValues = isSelected 
          ? currentValues.filter(v => v !== option.value)
          : [...currentValues, option.value];
        onSelectValue(stepKey, newValues);
      } else {
        onSelectValue(stepKey, option.value);
      }
    };

    return (
      <Pressable
        key={option.value}
        onPress={handlePress}
        className={`p-6 rounded-2xl mb-4 ${theme === 'dark' ? '' : 'border border-pink-100'}`}
        style={{
          backgroundColor: isSelected ? accentColor : theme === 'dark' ? '#374151' : '#ffffff',
        }}
      >
        {option.icon && (
          <View className="flex-row items-center mb-2">
            <Text className="text-2xl mr-3">{option.icon}</Text>
            <Text
              className={`text-xl font-semibold ${
                isSelected ? 'text-white' : theme === 'dark' ? 'text-gray-100' : 'text-black'
              }`}
            >
              {option.label}
            </Text>
          </View>
        )}

        {!option.icon && (
          <Text
            className={`text-xl font-semibold mb-2 ${
              isSelected ? 'text-white' : theme === 'dark' ? 'text-gray-100' : 'text-black'
            }`}
          >
            {option.label}
          </Text>
        )}

        <Text
          className={`${
            isSelected ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          } ${option.icon ? '' : 'ml-0'}`}
        >
          {option.description}
        </Text>
      </Pressable>
    );
  };

  const renderInputField = (step: QuestionnaireStep) => {
    if (step.inputType === 'text') {
      return (
        <TextInput
          className={`p-6 rounded-2xl mb-4 text-xl ${
            theme === 'dark' 
              ? 'bg-gray-700 text-white placeholder-gray-400' 
              : 'bg-white text-gray-900 placeholder-gray-500'
          }`}
          placeholder={step.placeholder}
          value={textInputs[step.key] || ''}
          onChangeText={(text) => {
            setTextInputs(prev => ({ ...prev, [step.key]: text }));
            onSelectValue(step.key, text);
          }}
          placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
        />
      );
    }

    if (step.inputType === 'date') {
      return (
        <Pressable
          onPress={() => onOpenDatePicker?.(step.key)}
          className={`p-6 rounded-2xl mb-4 flex-row items-center ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-white'
          }`}
        >
          <Calendar size={24} color={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
          <Text className={`ml-4 text-xl ${
            selectedValues[step.key] 
              ? theme === 'dark' ? 'text-white' : 'text-gray-900'
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {selectedValues[step.key] || step.placeholder || 'Select date'}
          </Text>
        </Pressable>
      );
    }

    return null;
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header with Back Button and Progress */}
        <View className="px-4 py-4">
          <View className="flex-row items-center mb-4">
            <Pressable onPress={onBack} className="mr-4 p-2">
              <ArrowLeft size={24} color={theme === 'dark' ? '#F3F4F6' : '#374151'} />
            </Pressable>
            <View className="flex-1">
              <View
                className={`rounded-full h-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                <View
                  className="rounded-full h-1 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 px-4">
          {isComplete || isGenerating ? (
            <View className="flex-1 justify-center items-center">
              <View
                className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
                  theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'
                }`}
              >
                <Check size={40} color="#22c55e" />
              </View>
              <Text
                className={`text-3xl font-bold text-center mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Generating your goals...
              </Text>
              <Text
                className={`text-center text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                This will take just a moment
              </Text>
            </View>
          ) : currentStep ? (
            <View>
              <Text
                className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {currentStep.title}
              </Text>
              <Text className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentStep.subtitle}
              </Text>

              {/* Render input field for text/date inputs */}
              {(currentStep.inputType === 'text' || currentStep.inputType === 'date') && renderInputField(currentStep)}

              {/* Render options for select/multi-select */}
              {currentStep.options.length > 0 && currentStep.options.map((option) => 
                renderOption(option, currentStep.key, currentStep.multiSelect)
              )}
            </View>
          ) : null}
        </ScrollView>

        {!isComplete && !isGenerating && currentStep && (
          <View className="p-4">
            <Button
              title={isLastStep ? 'Complete Setup' : 'Next'}
              className="w-full"
              onPress={handleNext}
              disabled={!currentStep || (
                // For text/date inputs, check if value exists
                (currentStep.inputType === 'text' || currentStep.inputType === 'date') 
                  ? !selectedValues[currentStep.key] || selectedValues[currentStep.key] === ''
                  // For multi-select, check if at least one option is selected
                  : currentStep.multiSelect
                    ? !selectedValues[currentStep.key] || (Array.isArray(selectedValues[currentStep.key]) && (selectedValues[currentStep.key] as string[]).length === 0)
                    // For single select, check if option is selected
                    : !selectedValues[currentStep.key]
              )}
            />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
