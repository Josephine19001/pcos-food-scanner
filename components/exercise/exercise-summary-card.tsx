import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { DailyExerciseSummary } from '@/lib/hooks/use-exercise-tracking';
import CircularProgress from '@/components/CircularProgress';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame } from 'lucide-react-native';
import { useThemedStyles } from '@/lib/utils/theme';
import { useTheme } from '@/context/theme-provider';

interface ExerciseSummaryCardProps {
  dailySummary?: DailyExerciseSummary;
  isLoading?: boolean;
}

export function ExerciseSummaryCard({ dailySummary, isLoading }: ExerciseSummaryCardProps) {
  if (isLoading) {
    return <ExerciseSummaryCardSkeleton />;
  }

  const totalMinutes = dailySummary?.total_minutes || 0;
  const totalCalories = dailySummary?.total_calories || 0;
  const totalWorkouts = dailySummary?.total_workouts || 0;

  // Daily goals instead of weekly
  const dailyMinutesTarget = 30; // 30 minutes per day is a good daily goal

  const themed = useThemedStyles();
  const { isDark } = useTheme();

  return (
    <View className="mx-4 mb-6">
      <View
        className={themed('rounded-3xl p-6 shadow-lg', 'rounded-3xl p-6 shadow-lg')}
        style={{
          backgroundColor: isDark ? '#111827' : 'white',
          shadowColor: '#8B5CF6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          elevation: 12,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <View className="flex-row items-baseline">
              <Text
                className={themed(
                  'text-purple-600 text-6xl font-bold mb-1',
                  'text-purple-400 text-6xl font-bold mb-1'
                )}
              >
                {totalMinutes}
              </Text>
              <Text
                className={themed(
                  'text-gray-500 text-lg font-medium ml-2',
                  'text-gray-400 text-lg font-medium ml-2'
                )}
              >
                minutes
              </Text>
            </View>
          </View>

          {/* Circular Progress Ring */}
          <CircularProgress
            consumed={totalMinutes}
            target={dailyMinutesTarget}
            size={80}
            strokeWidth={6}
            color="#8B5CF6"
            isDark={isDark}
            showCenterText={false}
            animated={true}
            showOverflow={true}
          >
            <View
              className={themed(
                'w-12 h-12 bg-orange-100 rounded-full items-center justify-center',
                'w-12 h-12 bg-orange-900/30 rounded-full items-center justify-center'
              )}
            >
              <Flame size={20} color="#F59E0B" />
            </View>
          </CircularProgress>
        </View>

        {/* Stats Row */}
        <View
          className={themed(
            'flex-row justify-between pt-4 border-t border-gray-100',
            'flex-row justify-between pt-4 border-t '
          )}
        >
          <View className="items-center">
            <Text
              className={themed(
                'text-gray-400 text-xs font-medium uppercase tracking-wide',
                'text-gray-500 text-xs font-medium uppercase tracking-wide'
              )}
            >
              Daily Goal
            </Text>
            <Text
              className={themed(
                'text-gray-900 text-lg font-bold mt-1',
                'text-white text-lg font-bold mt-1'
              )}
            >
              {dailyMinutesTarget}min
            </Text>
          </View>
          <View className="items-center">
            <Text
              className={themed(
                'text-gray-400 text-xs font-medium uppercase tracking-wide',
                'text-gray-500 text-xs font-medium uppercase tracking-wide'
              )}
            >
              Workouts
            </Text>
            <Text
              className={themed(
                'text-gray-900 text-lg font-bold mt-1',
                'text-white text-lg font-bold mt-1'
              )}
            >
              {totalWorkouts}
            </Text>
          </View>
          <View className="items-center">
            <Text
              className={themed(
                'text-gray-400 text-xs font-medium uppercase tracking-wide',
                'text-gray-500 text-xs font-medium uppercase tracking-wide'
              )}
            >
              Calories
            </Text>
            <Text
              className={themed(
                'text-gray-900 text-lg font-bold mt-1',
                'text-white text-lg font-bold mt-1'
              )}
            >
              {totalCalories}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function ExerciseSummaryCardSkeleton() {
  const themed = useThemedStyles();
  const { isDark } = useTheme();

  return (
    <View className="mx-4 mb-6">
      <View
        className={themed('rounded-3xl p-6 shadow-lg', 'rounded-3xl p-6 shadow-lg')}
        style={{
          backgroundColor: isDark ? '#111827' : 'white',
          shadowColor: '#8B5CF6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          elevation: 12,
        }}
      >
        {/* Header Skeleton */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <View className="flex-row items-baseline">
              <View
                className={themed(
                  'w-20 h-16 bg-gray-200 rounded mb-1',
                  'w-20 h-16 bg-gray-700 rounded mb-1'
                )}
              />
              <View
                className={themed(
                  'w-16 h-5 bg-gray-200 rounded ml-2',
                  'w-16 h-5 bg-gray-700 rounded ml-2'
                )}
              />
            </View>
          </View>

          {/* Circular Progress Ring Skeleton */}
          <View className="relative w-20 h-20">
            <Skeleton width={80} height={80} borderRadius={40} />
            {/* Center icon placeholder */}
            <View className="absolute inset-0 items-center justify-center">
              <Skeleton width={32} height={32} borderRadius={16} />
            </View>
          </View>
        </View>

        {/* Stats Row Skeleton */}
        <View
          className={themed(
            'flex-row justify-between pt-4 border-t border-gray-100',
            'flex-row justify-between pt-4 border-t '
          )}
        >
          <View className="items-center">
            <View
              className={themed(
                'w-16 h-3 bg-gray-200 rounded mb-1',
                'w-16 h-3 bg-gray-700 rounded mb-1'
              )}
            />
            <View
              className={themed('w-10 h-5 bg-gray-200 rounded', 'w-10 h-5 bg-gray-700 rounded')}
            />
          </View>
          <View className="items-center">
            <View
              className={themed(
                'w-16 h-3 bg-gray-200 rounded mb-1',
                'w-16 h-3 bg-gray-700 rounded mb-1'
              )}
            />
            <View
              className={themed('w-4 h-5 bg-gray-200 rounded', 'w-4 h-5 bg-gray-700 rounded')}
            />
          </View>
          <View className="items-center">
            <View
              className={themed(
                'w-16 h-3 bg-gray-200 rounded mb-1',
                'w-16 h-3 bg-gray-700 rounded mb-1'
              )}
            />
            <View
              className={themed('w-8 h-5 bg-gray-200 rounded', 'w-8 h-5 bg-gray-700 rounded')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
