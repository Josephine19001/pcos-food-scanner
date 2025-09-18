import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemedStyles } from '@/lib/utils/theme';

interface PlanDurationSectionProps {
  planDuration: '3_days' | '7_days';
  setPlanDuration: (duration: '3_days' | '7_days') => void;
}

const durationOptions = [
  { id: '3_days' as const, label: '3 Days' },
  { id: '7_days' as const, label: '1 Week' },
];

export default function PlanDurationSection({ planDuration, setPlanDuration }: PlanDurationSectionProps) {
  const themed = useThemedStyles();

  return (
    <View className="mb-6">
      <Text className={themed("text-lg font-semibold text-gray-900 mb-3", "text-lg font-semibold text-white mb-3")}>
        Plan Duration
      </Text>
      <View className="flex-row gap-3">
        {durationOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => setPlanDuration(option.id)}
            className={`flex-1 p-3 rounded-xl border ${
              planDuration === option.id
                ? themed('bg-green-50 border-green-200', 'bg-green-900/20 border-green-600')
                : themed('bg-white border-gray-200', 'bg-gray-800 border-gray-600')
            }`}
          >
            <Text className={`text-center font-medium ${
              planDuration === option.id
                ? themed('text-green-700', 'text-green-300')
                : themed('text-gray-700', 'text-gray-300')
            }`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}