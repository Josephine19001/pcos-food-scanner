import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import SubPageLayout from '@/components/layouts/sub-page';
import { MonthlyCalendar } from '@/components/cycle/MonthlyCalendar';
import { formatSelectedDate, type NextPeriodPrediction } from '@/lib/utils/cycle-utils';
import type { CurrentCycleInfo } from '@/lib/hooks/use-cycle-flo-style';

interface LogPeriodProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  loggedDates: string[];
  startDates: string[];
  endDates: string[];
  predictedDates: string[];
  nextPeriodPrediction: NextPeriodPrediction | null;
  onDatePress: (date: Date) => void;
  onStartPeriod: (date: Date) => void;
  onEndPeriod: (date: Date) => void;
  hasOngoingPeriod?: boolean;
  currentCycleInfo?: CurrentCycleInfo | null;
}

export default function LogPeriod({
  selectedDate,
  onDateSelect,
  loggedDates,
  startDates,
  endDates,
  predictedDates,
  nextPeriodPrediction,
  onDatePress,
  onStartPeriod,
  onEndPeriod,
  hasOngoingPeriod,
  currentCycleInfo,
}: LogPeriodProps) {
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
    <View className="flex-1" style={{ backgroundColor: '#F5F1E8' }}>
      <SubPageLayout
        title="Log Period"
        onBack={() => router.back()}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-4 pt-6">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-4">
                Track your cycle
              </Text>
              <Text className="text-gray-600 text-base">
                Select dates to log your period and track your cycle.
              </Text>
            </View>

            {/* Calendar Content */}
            <View className="mb-8">
              <MonthlyCalendar
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
                loggedDates={loggedDates}
                startDates={startDates}
                endDates={endDates}
                predictedDates={predictedDates}
                onDatePress={onDatePress}
              />
            </View>

            {/* Action Buttons */}
            <View className="px-2 pb-6">
              <View className="flex flex-col gap-4">
                {/* Start Period Button */}
                <TouchableOpacity
                  onPress={() => onStartPeriod(selectedDate)}
                  disabled={!canStartPeriod()}
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: canStartPeriod()
                      ? 'rgba(255, 182, 193, 0.3)'
                      : 'rgba(255, 255, 255, 0.8)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    <Calendar size={24} color={canStartPeriod() ? '#EC4899' : '#9CA3AF'} />
                    <Text className={`font-semibold text-lg ml-3 ${
                      canStartPeriod() ? 'text-pink-600' : 'text-gray-400'
                    }`}>
                      {hasOngoingPeriod ? 'Change Start Date' : 'Start Period'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* End Period Button */}
                <TouchableOpacity
                  onPress={() => onEndPeriod(selectedDate)}
                  disabled={!canEndPeriod()}
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: canEndPeriod()
                      ? 'rgba(239, 68, 68, 0.1)'
                      : 'rgba(255, 255, 255, 0.8)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    <Calendar size={24} color={canEndPeriod() ? '#EF4444' : '#9CA3AF'} />
                    <Text className={`font-semibold text-lg ml-3 ${
                      canEndPeriod() ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      End Period
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SubPageLayout>
    </View>
  );
}
