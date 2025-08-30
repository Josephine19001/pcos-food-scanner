import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronRight, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { usePeriodCycles } from '@/lib/hooks/use-cycle-data';

interface SimpleCycleHistoryProps {
  periodLogs: any[];
  isLoading?: boolean;
}

export function SimpleCycleHistory({ periodLogs = [], isLoading }: SimpleCycleHistoryProps) {
  // Use backend cycles data as single source of truth
  const { data: backendCycles = [], isLoading: cyclesLoading } = usePeriodCycles();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get last 6 periods from backend cycles
  const getRecentPeriods = () => {
    if (backendCycles.length === 0) return [];

    return backendCycles.slice(0, 6).map((cycle: any, index: number) => {
      // Check if this is the current/most recent period
      const isCurrentPeriod = index === 0;

      // Calculate cycle day for current period
      let cycleDay = null;
      if (isCurrentPeriod && cycle.is_ongoing) {
        const today = new Date();
        const startDate = new Date(cycle.start_date);
        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        cycleDay = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }

      return {
        startDate: cycle.start_date,
        endDate: cycle.end_date,
        totalDays: cycle.duration || 0,
        isCurrentPeriod,
        isOngoing: cycle.is_ongoing,
        cycleDay,
      };
    });
  };

  const recentPeriods = getRecentPeriods();

  // Use backend cycles loading state
  const isDataLoading = isLoading || cyclesLoading;

  if (isDataLoading) {
    return (
      <View className="mx-4 mb-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <View className="animate-pulse">
            <View className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <View className="h-4 bg-gray-200 rounded w-full mb-2" />
            <View className="h-4 bg-gray-200 rounded w-2/3" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="mx-4 mb-6">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xl font-bold text-gray-900">Period history</Text>
          <TouchableOpacity
            onPress={() => router.push('/cycle-history')}
            className="flex-row items-center"
          >
            <Text className="text-gray-400 text-sm mr-1">See all</Text>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Recent Periods */}
        {recentPeriods.map((period: any, index: number) => (
          <TouchableOpacity
            key={period.startDate}
            className="mb-4"
            onPress={() =>
              router.push({
                pathname: '/edit-period',
                params: {
                  startDate: period.startDate,
                  endDate: period.endDate || '',
                },
              })
            }
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-semibold text-gray-900">
                {period.isCurrentPeriod && period.isOngoing
                  ? `Current cycle: Day ${period.cycleDay}`
                  : period.isOngoing
                    ? `Ongoing period (${period.totalDays} days so far)`
                    : `${period.totalDays} day period`}
              </Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </View>
            <Text className="text-gray-500 text-sm mb-2">
              Started {formatDate(period.startDate)}
              {period.endDate && ` - Ended ${formatDate(period.endDate)}`}
            </Text>
            <Text className="text-gray-500 text-sm mb-3">
              {period.totalDays} period days logged
            </Text>

            {/* Red dots showing period days */}
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500 mr-2">Period days:</Text>
              <View className="flex-row gap-1">
                {Array.from({ length: Math.min(period.totalDays, 10) }, (_, dotIndex) => (
                  <View key={dotIndex} className="w-2 h-2 rounded-full bg-red-400" />
                ))}
                {period.totalDays > 10 && (
                  <Text className="text-xs text-gray-500 ml-2">+{period.totalDays - 10} more</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {periodLogs.length === 0 && (
          <View className="items-center py-8">
            <Calendar size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-center text-lg font-medium mt-4 mb-2">
              No period data yet
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Start logging your period to see history and patterns
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
