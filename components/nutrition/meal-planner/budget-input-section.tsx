import React from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemedStyles } from '@/lib/utils/theme';
import { useTheme } from '@/context/theme-provider';

interface BudgetInputSectionProps {
  customBudget: string;
  setCustomBudget: (value: string) => void;
}

export default function BudgetInputSection({
  customBudget,
  setCustomBudget,
}: BudgetInputSectionProps) {
  const themed = useThemedStyles();
  const { isDark } = useTheme();

  return (
    <View className="mb-6">
      <Text
        className={themed(
          'text-lg font-semibold text-gray-900 mb-3',
          'text-lg font-semibold text-white mb-3'
        )}
      >
        Budget (Optional)
      </Text>
      <TextInput
        value={customBudget}
        onChangeText={setCustomBudget}
        placeholder="e.g., $50-75"
        placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
        className={themed(
          'px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900',
          'px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white'
        )}
      />
    </View>
  );
}
