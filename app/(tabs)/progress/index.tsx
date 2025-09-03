import { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import PageLayout from '@/components/layouts/page-layout';
import { Text } from '@/components/ui/text';
import { useMealEntriesRange } from '@/lib/hooks/use-meal-tracking';
import { useWeightHistoryRange, useBodyMeasurements } from '@/lib/hooks/use-weight-tracking';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react-native';
import { PeriodSelectionModal } from '@/components/progress/period-selection-modal';
import {
  getLocalDateString,
  getStartOfWeek,
  getEndOfWeek,
  subtractDays,
  subtractWeeks,
  subtractMonths,
  subtractYears,
} from '@/lib/utils/date-helpers';
import { DailyBreakdownChart } from '@/components/progress/daily-calories-breakdown-chart';
import { WeightProgressChart } from '@/components/progress/weight-progress-chart';

type PeriodType = '90days' | '6months' | '1year' | 'alltime';
type WeekType = 'thisweek' | 'lastweek' | '2weeksago' | '3weeksago';


interface NutrientProgressData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('90days');
  const [selectedWeek, setSelectedWeek] = useState<WeekType>('thisweek');
  const [showPeriodModal, setShowPeriodModal] = useState(false);


  const weekOptions = [
    { label: 'This week', value: 'thisweek' },
    { label: 'Last week', value: 'lastweek' },
    { label: '2 wks. ago', value: '2weeksago' },
    { label: '3 wks. ago', value: '3weeksago' },
  ];

  const getDateRange = () => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date = today;

    // First apply week selection
    switch (selectedWeek) {
      case 'thisweek':
        startDate = getStartOfWeek(today);
        endDate = getEndOfWeek(today);
        break;
      case 'lastweek':
        const lastWeekRef = subtractWeeks(today, 1);
        startDate = getStartOfWeek(lastWeekRef);
        endDate = getEndOfWeek(lastWeekRef);
        break;
      case '2weeksago':
        const twoWeeksAgoRef = subtractWeeks(today, 2);
        startDate = getStartOfWeek(twoWeeksAgoRef);
        endDate = getEndOfWeek(twoWeeksAgoRef);
        break;
      case '3weeksago':
        const threeWeeksAgoRef = subtractWeeks(today, 3);
        startDate = getStartOfWeek(threeWeeksAgoRef);
        endDate = getEndOfWeek(threeWeeksAgoRef);
        break;
      default:
        startDate = getStartOfWeek(today);
        endDate = getEndOfWeek(today);
    }

    // Then apply period constraint if needed
    let periodStartDate: Date;
    switch (selectedPeriod) {
      case '90days':
        periodStartDate = subtractDays(today, 90);
        break;
      case '6months':
        periodStartDate = subtractMonths(today, 6);
        break;
      case '1year':
        periodStartDate = subtractYears(today, 1);
        break;
      case 'alltime':
      default:
        periodStartDate = new Date('2020-01-01'); // Far back date
        break;
    }

    // Use the later of the two start dates
    const finalStartDate = startDate > periodStartDate ? startDate : periodStartDate;

    return {
      startDate: getLocalDateString(finalStartDate),
      endDate: getLocalDateString(endDate),
    };
  };

  const { startDate, endDate } = getDateRange();
  const { data: mealEntries = [], isLoading } = useMealEntriesRange(startDate, endDate);
  const { data: weightEntries = [] } = useWeightHistoryRange(startDate, endDate);
  const { data: bodyMeasurements } = useBodyMeasurements();

  // Process meal entries to get daily totals
  const processNutrientData = (): NutrientProgressData[] => {
    const dailyTotals: Record<string, NutrientProgressData> = {};

    mealEntries.forEach((entry) => {
      const date = entry.logged_date;
      if (!dailyTotals[date]) {
        dailyTotals[date] = {
          date,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }
      dailyTotals[date].calories += entry.total_calories;
      dailyTotals[date].protein += entry.total_protein;
      dailyTotals[date].carbs += entry.total_carbs;
      dailyTotals[date].fat += entry.total_fat;
    });

    return Object.values(dailyTotals).sort((a, b) => a.date.localeCompare(b.date));
  };

  const nutrientData = processNutrientData();

  // Calculate weekly totals for current selection
  const weeklyTotals = nutrientData.reduce(
    (totals, day) => ({
      calories: totals.calories + day.calories,
      protein: totals.protein + day.protein,
      carbs: totals.carbs + day.carbs,
      fat: totals.fat + day.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Create calendar button for PageLayout
  const CalendarButton = (
    <TouchableOpacity
      onPress={() => setShowPeriodModal(true)}
      className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
    >
      <Calendar size={20} color="#374151" />
    </TouchableOpacity>
  );

  return (
    <>
      <PageLayout title="Progress" theme="progress" btn={CalendarButton}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >

          {/* Week Selection - Tab Style */}
          <View className="px-4 mb-6">
            <View className="bg-gray-100 rounded-2xl p-1 flex-row">
              {weekOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedWeek(option.value as WeekType)}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl items-center justify-center',
                    selectedWeek === option.value ? 'bg-pink-500 shadow-sm' : 'bg-white'
                  )}
                >
                  <Text
                    className={cn(
                      'text-sm font-medium',
                      selectedWeek === option.value ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Daily Breakdown Chart */}
          <DailyBreakdownChart weeklyTotals={weeklyTotals} nutrientData={nutrientData} />

          {/* Weight Progress Chart */}
          <WeightProgressChart 
            weightEntries={weightEntries} 
            goalWeight={bodyMeasurements?.goal_weight}
          />
        </ScrollView>
      </PageLayout>

      {/* Period Selection Modal - Outside of PageLayout to avoid navigation context issues */}
      <PeriodSelectionModal
        visible={showPeriodModal}
        onClose={() => setShowPeriodModal(false)}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
      />
    </>
  );
}
