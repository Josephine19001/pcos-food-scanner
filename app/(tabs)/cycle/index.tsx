import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import PageLayout from '@/components/layouts/page-layout';
import { Calendar, Heart, CalendarHeart } from 'lucide-react-native';
import { router } from 'expo-router';

import {
  useCurrentCycleInfo,
  usePeriodCycles,
  useStartPeriod,
  useEndPeriod,
  useDeletePeriodCycle,
  useCycleSettingsV2,
  type PeriodCycle,
} from '@/lib/hooks/use-cycle-v2';
import { useMoodForDate } from '@/lib/hooks/use-daily-moods';
import { useSymptomsForDate } from '@/lib/hooks/use-daily-symptoms';

import { TodaysMood } from '@/components/cycle/TodaysMood';
import { TodaysSupplements } from '@/components/cycle/TodaysSupplements';
import { TodaysSymptoms } from '@/components/cycle/TodaysSymptoms';
import { CyclePhase } from '@/components/cycle/CyclePhase';
import { PeriodModal } from '@/components/cycle/PeriodModal';
import { CyclePageSkeleton } from '@/components/cycle/cycle-skeleton';
import { PredictionInfoModal } from '@/components/cycle/PredictionInfoModal';
import { FullCalendarModal } from '@/components/cycle/FullCalendarModal';
import { PeriodPredictionButton } from '@/components/cycle/PeriodPredictionButton';

import { getLocalDateString } from '@/lib/utils/date-helpers';
import { AnimatedWavyCard } from '@/components/cycle/animated-wavy-card';

export default function CycleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showPredictionInfoModal, setShowPredictionInfoModal] = useState(false);
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());

  const {
    data: currentCycleInfo,
    isLoading: cycleInfoLoading,
    error: cycleInfoError,
  } = useCurrentCycleInfo(getLocalDateString(selectedDate));

  const { data: cycleSettings, isLoading: settingsLoading } = useCycleSettingsV2();
  const { data: periodCycles = [] } = usePeriodCycles(10);
  const { data: selectedDateMood } = useMoodForDate(getLocalDateString(selectedDate));
  const { data: selectedDateSymptoms } = useSymptomsForDate(getLocalDateString(selectedDate));

  const startPeriod = useStartPeriod();
  const endPeriod = useEndPeriod();
  const deletePeriodCycle = useDeletePeriodCycle();

  const isMainDataLoading = cycleInfoLoading || settingsLoading;
  const hasCriticalErrors = cycleInfoError;

  const handleDateSelect = React.useCallback((date: Date) => {
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

  const handlePeriodPredictionPress = React.useCallback(() => {
    const today = new Date();
    setModalDate(today);
    setShowPeriodModal(true);
  }, []);

  const handleStartPeriod = () => {
    const startDateString = getLocalDateString(modalDate);

    startPeriod.mutate(
      {
        start_date: startDateString,
        flow_intensity: 'moderate',
        notes: 'Period started',
      },
      {
        onSuccess: () => {
          setShowPeriodModal(false);
        },
      }
    );
  };

  const handleEndPeriod = () => {
    const endDateString = getLocalDateString(modalDate);

    endPeriod.mutate(
      {
        end_date: endDateString,
      },
      {
        onSuccess: () => {
          setShowPeriodModal(false);
        },
      }
    );
  };

  const handleRemovePeriod = () => {
    // Find the period cycle that includes this date
    const cycleToRemove = periodCycles.find((cycle: PeriodCycle) => {
      const modalDateString = getLocalDateString(modalDate);
      if (!cycle.end_date) {
        // Ongoing period - check if modal date is after start date
        return modalDateString >= cycle.start_date;
      }
      // Complete period - check if modal date is within range
      return modalDateString >= cycle.start_date && modalDateString <= cycle.end_date;
    });

    if (cycleToRemove) {
      deletePeriodCycle.mutate(cycleToRemove.id, {
        onSuccess: () => {
          setShowPeriodModal(false);
        },
      });
    }
  };

  // Helper functions to check period cycle states
  const isLoggedDate = (date: Date) => {
    const dateString = getLocalDateString(date);
    return periodCycles.some((cycle: PeriodCycle) => {
      if (!cycle.end_date) {
        // Ongoing period - check if date is after start
        return dateString >= cycle.start_date;
      }
      // Complete period - check if date is within range
      return dateString >= cycle.start_date && dateString <= cycle.end_date;
    });
  };

  const isStartDate = (date: Date) => {
    const dateString = getLocalDateString(date);
    return periodCycles.some((cycle: PeriodCycle) => cycle.start_date === dateString);
  };

  const hasOngoingPeriod = () => {
    return periodCycles.some((cycle: PeriodCycle) => cycle.end_date === null);
  };

  // Transform periodCycles to periodLogs format for CyclePhase component
  const transformToPeriodLogs = () => {
    const periodLogs: any[] = [];
    periodCycles.forEach((cycle: PeriodCycle) => {
      const startDate = new Date(cycle.start_date);
      let endDate: Date;

      if (!cycle.end_date) {
        // Ongoing period - use today as end date for display
        endDate = new Date();
      } else {
        endDate = new Date(cycle.end_date);
      }

      // Create log entries for each day in the cycle
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateString = getLocalDateString(currentDate);
        const isStartDay = dateString === cycle.start_date;

        periodLogs.push({
          date: dateString,
          is_start_day: isStartDay,
          notes: cycle.notes,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return periodLogs;
  };

  // All calculations now come from the backend via currentCycleInfo
  const nextPeriodPrediction = currentCycleInfo?.next_period_prediction;
  const pregnancyChances = currentCycleInfo?.pregnancy_chances;

  return (
    <PageLayout
      title="Cycle"
      theme="cycle"
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      loggedDates={periodCycles.map((cycle) => cycle.start_date)}
      btn={
        <TouchableOpacity
          className="bg-pink-500 p-3 rounded-full"
          onPress={() => setShowFullCalendar(true)}
          style={{
            shadowColor: '#EC4899',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Calendar size={18} color="#FFFFFF" />
        </TouchableOpacity>
      }
    >
      {isMainDataLoading ? (
        <CyclePageSkeleton />
      ) : hasCriticalErrors ? (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-4 py-8">
            <View className="bg-white rounded-2xl p-6 border border-gray-100 items-center">
              <View className="w-16 h-16 rounded-2xl bg-pink-50 items-center justify-center mb-4">
                <CalendarHeart size={24} color="#EC4899" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Unable to load cycle data
              </Text>
              <Text className="text-gray-600 text-center text-sm mb-4">
                We're having trouble connecting to your cycle data. Please check your internet
                connection and try again.
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-pink-500 px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-medium">Retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <PeriodPredictionButton
            nextPeriodPrediction={nextPeriodPrediction}
            onPress={handlePeriodPredictionPress}
          />

          <CyclePhase
            selectedDate={selectedDate}
            periodStartDate={
              periodCycles.length > 0 ? new Date(periodCycles[0].start_date) : undefined
            }
            onLogPeriod={() => setShowFullCalendar(true)}
            nextPeriodPrediction={nextPeriodPrediction}
            pregnancyChances={pregnancyChances}
            periodLogs={transformToPeriodLogs()}
            cycleSettings={cycleSettings}
          />

          <TodaysSymptoms
            selectedDate={selectedDate}
            symptomData={
              selectedDateSymptoms
                ? {
                    symptoms: selectedDateSymptoms.symptoms,
                    severity: selectedDateSymptoms.severity,
                    notes: selectedDateSymptoms.notes,
                  }
                : undefined
            }
            isLoading={false}
          />

          <TodaysMood
            selectedDate={selectedDate}
            moodData={
              selectedDateMood
                ? {
                    mood: selectedDateMood.mood,
                    energy_level: selectedDateMood.energy_level,
                    notes: selectedDateMood.notes,
                  }
                : undefined
            }
            isLoading={false}
          />

          {/* <TodaysSupplements selectedDate={selectedDate} /> */}
        </ScrollView>
      )}

      <PeriodModal
        isVisible={showPeriodModal}
        selectedDate={modalDate}
        isLoggedDate={isLoggedDate(modalDate)}
        isStartDate={isStartDate(modalDate)}
        hasOngoingPeriod={hasOngoingPeriod()}
        onClose={() => setShowPeriodModal(false)}
        onStartPeriod={handleStartPeriod}
        onEndPeriod={handleEndPeriod}
        onRemovePeriod={handleRemovePeriod}
      />

      <PredictionInfoModal
        visible={showPredictionInfoModal}
        onClose={() => setShowPredictionInfoModal(false)}
      />

      <FullCalendarModal
        visible={showFullCalendar}
        onClose={() => setShowFullCalendar(false)}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        loggedDates={transformToPeriodLogs().map((log) => log.date)}
        startDates={periodCycles.map((cycle: PeriodCycle) => cycle.start_date)}
        endDates={periodCycles
          .map((cycle: PeriodCycle) => cycle.end_date)
          .filter((date: string | null): date is string => date !== null)}
        predictedDates={nextPeriodPrediction?.predictedPeriodDates || []}
        nextPeriodPrediction={nextPeriodPrediction}
        hasOngoingPeriod={hasOngoingPeriod()}
        onDatePress={(date) => {
          setModalDate(date);
          setSelectedDate(date);
          setShowPeriodModal(true);
        }}
        onLogPeriodPress={() => {
          const today = new Date();
          const hasOngoing = hasOngoingPeriod();

          if (hasOngoing) {
            // End the ongoing period
            const endDateString = getLocalDateString(today);
            endPeriod.mutate({
              end_date: endDateString,
            });
          } else {
            // Start a new period
            const startDateString = getLocalDateString(today);
            startPeriod.mutate({
              start_date: startDateString,
              flow_intensity: 'moderate',
              notes: 'Period started',
            });
          }
        }}
      />
    </PageLayout>
  );
}
