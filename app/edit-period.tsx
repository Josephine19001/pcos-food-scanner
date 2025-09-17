import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import SubPageLayout from '@/components/layouts/sub-page';
import { Save } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/theme-provider';
import { ElegantPeriodCalendar } from '@/components/cycle/ElegantPeriodCalendar';
import { getLocalDateString } from '@/lib/utils/date-helpers';
import { useLogPeriodData, useDeletePeriodLog } from '@/lib/hooks/use-cycle-data';

export default function EditPeriodScreen() {
  const params = useLocalSearchParams();
  const startDateParam = params.startDate as string;
  const endDateParam = params.endDate as string;
  const { isDark } = useTheme();

  // Convert date strings to period dates array
  const initialPeriodDates = React.useMemo(() => {
    const dates: string[] = [];

    if (startDateParam) {
      const startDate = new Date(startDateParam);
      const endDate = endDateParam ? new Date(endDateParam) : null;

      // Generate all dates between start and end (inclusive)
      const current = new Date(startDate);
      while (endDate ? current <= endDate : current.toDateString() === startDate.toDateString()) {
        dates.push(getLocalDateString(current));
        if (!endDate || current.toDateString() === endDate.toDateString()) break;
        current.setDate(current.getDate() + 1);
      }
    }

    return dates;
  }, [startDateParam, endDateParam]);

  const [periodDates, setPeriodDates] = useState<string[]>(initialPeriodDates);
  const [isSaving, setIsSaving] = useState(false);

  const logPeriodData = useLogPeriodData();
  const deletePeriodLog = useDeletePeriodLog();

  const handleDateToggle = React.useCallback((date: Date, isPeriodDate: boolean) => {
    const dateString = getLocalDateString(date);

    setPeriodDates((currentDates) => {
      if (isPeriodDate) {
        // Remove date from period dates
        return currentDates.filter((d) => d !== dateString);
      } else {
        // Add date to period dates
        return [...currentDates, dateString].sort();
      }
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Remove all old period dates first
      if (initialPeriodDates.length > 0) {
        for (const dateString of initialPeriodDates) {
          await new Promise((resolve, reject) => {
            deletePeriodLog.mutate(dateString, {
              onSuccess: () => resolve(undefined),
              onError: (error) => reject(error),
            });
          });
        }
      }

      // Add all new period dates
      for (let i = 0; i < periodDates.length; i++) {
        const dateString = periodDates[i];
        const isStartDay = i === 0; // First date is start day

        await new Promise((resolve, reject) => {
          logPeriodData.mutate(
            {
              date: dateString,
              is_start_day: isStartDay,
              notes: isStartDay ? 'Period started' : 'Period day',
            },
            {
              onSuccess: () => resolve(undefined),
              onError: (error) => reject(error),
            }
          );
        });
      }

      // Success - navigate back
      router.back();
    } catch (error) {
      console.error('Error saving period dates:', error);
      Alert.alert('Error', 'Failed to save period dates. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPeriodStats = () => {
    if (periodDates.length === 0) return 'No period dates selected';
    if (periodDates.length === 1) return '1 day selected';
    return `${periodDates.length} days selected`;
  };

  const hasChanges = () => {
    if (periodDates.length !== initialPeriodDates.length) return true;
    return !periodDates.every((date) => initialPeriodDates.includes(date));
  };

  return (
    <SubPageLayout
      title="Edit Period Dates"
      rightElement={
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving || !hasChanges()}
          className={`w-10 h-10 items-center justify-center rounded-full ${
            isSaving || !hasChanges()
              ? isDark
                ? 'bg-gray-700'
                : 'bg-gray-200'
              : isDark
              ? 'bg-pink-600'
              : 'bg-pink-50 border border-pink-200'
          }`}
        >
          <Save
            size={20}
            color={
              isSaving || !hasChanges()
                ? isDark
                  ? '#6B7280'
                  : '#9CA3AF'
                : isDark
                ? '#fff'
                : '#EC4899'
            }
          />
        </TouchableOpacity>
      }
    >
      <View className="flex-1">
        {/* Instructions */}
        <View
          className={`px-4 py-3 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border-b ${
            isDark ? '' : 'border-gray-200'
          }`}
        >
          <Text
            className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'} text-center mb-1`}
          >
            Tap dates to add or remove them from your period
          </Text>
          <Text className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-700'} text-center`}>
            {getPeriodStats()}
          </Text>
        </View>

        {/* New Elegant Calendar in Edit Mode */}
        <ElegantPeriodCalendar
          periodDates={periodDates}
          onDateToggle={handleDateToggle}
          editMode={true}
          minDate={new Date(2024, 0, 1)} // January 1, 2024
          maxDate={new Date()}
        />

        {/* Save Button */}
        <View
          className={`px-4 py-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border-t ${
            isDark ? '' : 'border-gray-200'
          }`}
        >
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || !hasChanges()}
            className={`py-3 rounded-xl ${
              isSaving || !hasChanges()
                ? isDark
                  ? 'bg-gray-700'
                  : 'bg-gray-300'
                : isDark
                ? 'bg-pink-600'
                : 'bg-pink-500'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                isSaving || !hasChanges()
                  ? isDark
                    ? 'text-gray-500'
                    : 'text-gray-500'
                  : 'text-white'
              }`}
            >
              {isSaving ? 'Saving...' : hasChanges() ? 'Save Changes' : 'No Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SubPageLayout>
  );
}
