import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import SubPageLayout from '@/components/layouts/sub-page';
import { Calendar, TrendingUp, Clock } from 'lucide-react-native';
import { usePeriodCycles } from '@/lib/hooks/use-cycle-data';

export default function CycleHistoryScreen() {
  // Use backend cycles data as single source of truth
  const { data: periodCycles = [] } = usePeriodCycles();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const periodData = periodCycles;

  return (
    <SubPageLayout title="Period Logs">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Period Logs */}
        <View className="mx-4 mb-6">
          {periodData.map((period: any, index: number) => (
            <View
              key={period.start_date}
              className="p-4 rounded-xl border bg-white border-gray-200 mb-3"
            >
              <Text className="font-semibold text-gray-900 text-base">
                {formatDate(period.start_date)}
                {period.end_date && ` - ${formatDate(period.end_date)}`}
                {period.duration && ` (${period.duration} days)`}
                {period.is_ongoing && ' (ongoing)'}
              </Text>
            </View>
          ))}
        </View>

        {/* Empty State */}
        {periodData.length === 0 && (
          <View className="mx-4 items-center py-12">
            <Calendar size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-center text-lg font-medium mt-4 mb-2">
              No period logs yet
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Start logging your period to see history
            </Text>
          </View>
        )}
      </ScrollView>
    </SubPageLayout>
  );
}
