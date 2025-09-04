import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Calendar } from 'lucide-react-native';
import type { CurrentCycleInfo } from '@/lib/hooks/use-cycle-flo-style';

interface PeriodActionButtonsProps {
  selectedDate: Date;
  hasOngoingPeriod: boolean;
  currentCycleInfo: CurrentCycleInfo | null | undefined;
  onStartPeriod: (date: Date) => void;
  onEndPeriod: (date: Date) => void;
}

export function PeriodActionButtons({
  selectedDate,
  hasOngoingPeriod,
  currentCycleInfo,
  onStartPeriod,
  onEndPeriod,
}: PeriodActionButtonsProps) {
  // Check if End Period should be enabled
  const canEndPeriod = () => {
    if (!hasOngoingPeriod || !currentCycleInfo?.current_cycle) return false;

    const startDate = new Date(currentCycleInfo.current_cycle.start_date);
    const selectedDay = new Date(selectedDate);

    // Normalize to avoid time issues
    startDate.setHours(0, 0, 0, 0);
    selectedDay.setHours(0, 0, 0, 0);

    // Selected date must be >= start date
    return selectedDay >= startDate;
  };

  // Check if Start Period should be enabled
  const canStartPeriod = () => {
    // Always allow starting a new period (this will replace existing ongoing period)
    return true;
  };

  return (
    <View className="px-6 pb-6 pt-4 border-t border-gray-100">
      <View className="flex flex-col gap-2">
        {/* Start Period Button */}
        <TouchableOpacity
          onPress={() => onStartPeriod(selectedDate)}
          disabled={!canStartPeriod()}
          className={`py-4 rounded-2xl flex-row items-center justify-center ${
            canStartPeriod() ? 'bg-pink-500' : 'bg-gray-300'
          }`}
        >
          <Calendar size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold text-lg ml-2">
            {hasOngoingPeriod ? 'Change Start Date' : 'Start Period'}
          </Text>
        </TouchableOpacity>

        {/* End Period Button */}
        <TouchableOpacity
          onPress={() => onEndPeriod(selectedDate)}
          disabled={!canEndPeriod()}
          className={`py-4 rounded-2xl flex-row items-center justify-center ${
            canEndPeriod() ? 'bg-red-500' : 'bg-gray-300'
          }`}
        >
          <Calendar size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold text-lg ml-2">End Period</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}