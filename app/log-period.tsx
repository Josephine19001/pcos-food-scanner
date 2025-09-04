import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SubPageLayout from '@/components/layouts/sub-page';
import { MonthlyCalendar } from '@/components/cycle/MonthlyCalendar';
import { PeriodActionButtons } from '@/components/cycle/PeriodActionButtons';
import { getLocalDateString } from '@/lib/utils/date-helpers';
import {
  useCurrentCycleInfo,
  usePeriodCycles,
  useStartPeriod,
  useUpdateCycleDates,
  useDeletePeriodCycle,
  type PeriodCycle,
} from '@/lib/hooks/use-cycle-flo-style';

export default function LogPeriodScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const initialDate = date ? new Date(date) : new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const {
    data: currentCycleInfo,
  } = useCurrentCycleInfo(getLocalDateString(selectedDate));

  const { data: periodCycles = [] } = usePeriodCycles(10);
  
  const startPeriod = useStartPeriod();
  const updateCycleDates = useUpdateCycleDates();
  const deletePeriodCycle = useDeletePeriodCycle();

  const handleDateSelect = React.useCallback((date: Date) => {
    if (!date || isNaN(date.getTime())) {
      console.warn('Invalid date passed to handleDateSelect:', date);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    if (selectedDay > today) {
      setSelectedDate(today);
    } else {
      setSelectedDate(date);
    }
  }, []);

  const hasOngoingPeriod = React.useCallback(() => {
    return periodCycles.some((cycle: PeriodCycle) => cycle.end_date === null);
  }, [periodCycles]);

  // Get all period dates for calendar display (actual + predicted)
  const getAllPeriodDatesForCalendar = () => {
    const allDates: string[] = [];

    try {
      // Add actual period dates from completed cycles
      periodCycles.forEach((cycle: PeriodCycle) => {
        try {
          const startDate = new Date(cycle.start_date);
          if (isNaN(startDate.getTime())) {
            console.warn('Invalid start date in cycle:', cycle.start_date);
            return;
          }

          let endDate: Date;

          if (cycle.end_date) {
            // Completed cycle
            endDate = new Date(cycle.end_date);
          } else if (cycle.predicted_end_date) {
            // Ongoing cycle with predicted end
            endDate = new Date(cycle.predicted_end_date);
          } else {
            // Ongoing cycle without prediction, use today
            endDate = new Date();
          }

          if (isNaN(endDate.getTime())) {
            console.warn('Invalid end date in cycle:', cycle);
            return;
          }

          const currentDate = new Date(startDate);
          while (currentDate <= endDate && !isNaN(currentDate.getTime())) {
            allDates.push(getLocalDateString(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);

            // Safety check to prevent infinite loop
            if (allDates.length > 1000) {
              console.warn('Too many dates generated, breaking loop');
              break;
            }
          }
        } catch (error) {
          console.error('Error processing cycle:', cycle, error);
        }
      });
    } catch (error) {
      console.error('Error generating calendar dates:', error);
    }

    return allDates;
  };

  // Get predicted next period dates for calendar
  const getPredictedPeriodDates = () => {
    if (!currentCycleInfo?.next_period_prediction) return [];

    const prediction = currentCycleInfo.next_period_prediction;
    return [prediction.start_date];
  };

  const handleStartPeriod = (date: Date) => {
    const startDateString = getLocalDateString(date);

    // If there's an ongoing period, end it first, then start new one
    if (hasOngoingPeriod()) {
      const ongoingCycle = periodCycles.find((cycle: PeriodCycle) => cycle.end_date === null);
      if (ongoingCycle) {
        // Delete the ongoing period first
        deletePeriodCycle.mutate(ongoingCycle.id, {
          onSuccess: () => {
            // Then start the new period
            startPeriod.mutate({
              start_date: startDateString,
              flow_intensity: 'moderate',
              notes: 'Period started',
            }, {
              onSuccess: () => {
                router.push('/(tabs)/cycle');
              }
            });
          },
        });
        return;
      }
    }

    // Normal case: no ongoing period
    startPeriod.mutate({
      start_date: startDateString,
      flow_intensity: 'moderate',
      notes: 'Period started',
    }, {
      onSuccess: () => {
        router.push('/(tabs)/cycle');
      }
    });
  };

  const handleEndPeriod = (date: Date) => {
    const endDateString = getLocalDateString(date);
    
    // Find the current ongoing cycle
    const ongoingCycle = periodCycles.find((cycle: PeriodCycle) => cycle.end_date === null);
    
    if (!ongoingCycle) {
      console.error('No ongoing cycle found to end');
      return;
    }
    
    // Use update-cycle-dates which should work once backend removes period_length calculation
    updateCycleDates.mutate({
      cycle_id: ongoingCycle.id,
      end_date: endDateString,
    }, {
      onSuccess: () => {
        router.push('/(tabs)/cycle');
      },
      onError: (error) => {
        console.error('Failed to update cycle end date:', error);
      }
    });
  };

  return (
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
          {/* Calendar Content */}
          <View className="mb-8">
            <MonthlyCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              loggedDates={getAllPeriodDatesForCalendar()}
              startDates={periodCycles.map((cycle: PeriodCycle) => cycle.start_date)}
              endDates={periodCycles
                .map((cycle: PeriodCycle) => cycle.end_date)
                .filter((date: string | null): date is string => date !== null)}
              predictedDates={getPredictedPeriodDates()}
              onDatePress={handleDateSelect}
            />
          </View>

          {/* Action Buttons */}
          <PeriodActionButtons
            selectedDate={selectedDate}
            hasOngoingPeriod={hasOngoingPeriod()}
            currentCycleInfo={currentCycleInfo}
            onStartPeriod={handleStartPeriod}
            onEndPeriod={handleEndPeriod}
          />
        </View>
      </ScrollView>
    </SubPageLayout>
  );
}