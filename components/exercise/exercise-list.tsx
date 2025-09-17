import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { InfiniteScrollList } from '@/components/common/infinite-scroll-list';
import { Exercise } from '@/data/exercisesData';
import { getIconComponent } from '@/lib/utils/get-icon-component';
import { useThemedStyles } from '@/lib/utils/theme';
import { useTheme } from '@/context/theme-provider';

interface ExerciseListProps {
  exercises: Exercise[];
  onExercisePress: (exercise: Exercise) => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  onExercisePress,
  isLoading = false,
  hasNextPage = false,
  onLoadMore,
  refreshing = false,
  onRefresh,
}) => {
  const themed = useThemedStyles();
  const { isDark } = useTheme();

  const renderExerciseItem = ({ item: exercise }: { item: Exercise }) => {
    const IconComponent = getIconComponent(exercise.icon);

    // Create lighter background color based on exercise category
    const getLightBackgroundColor = (category: string) => {
      if (isDark) {
        switch (category.toLowerCase()) {
          case 'cardio':
            return '#1E3A8A20'; // Dark blue with opacity
          case 'strength':
            return '#065F4620'; // Dark green with opacity
          case 'flexibility':
            return '#92400E20'; // Dark yellow with opacity
          case 'sports':
            return '#3730A320'; // Dark indigo with opacity
          case 'balance':
            return '#BE185D20'; // Dark pink with opacity
          default:
            return '#6B728020'; // Dark gray with opacity
        }
      } else {
        switch (category.toLowerCase()) {
          case 'cardio':
            return '#EBF8FF'; // Light blue
          case 'strength':
            return '#F0FDF4'; // Light green
          case 'flexibility':
            return '#FEF3C7'; // Light yellow
          case 'sports':
            return '#DBEAFE'; // Light indigo
          case 'balance':
            return '#FCE7F3'; // Light pink
          default:
            return '#F3F4F6'; // Light gray
        }
      }
    };

    // Get icon color based on category - using purple theme for dark mode
    const getIconColor = (category: string) => {
      if (isDark) {
        switch (category.toLowerCase()) {
          case 'cardio':
            return '#60A5FA'; // Lighter blue for dark mode
          case 'strength':
            return '#34D399'; // Lighter green for dark mode
          case 'flexibility':
            return '#FBBF24'; // Lighter yellow for dark mode
          case 'sports':
            return '#A78BFA'; // Purple for dark mode
          case 'balance':
            return '#F472B6'; // Lighter pink for dark mode
          default:
            return '#9CA3AF'; // Lighter gray for dark mode
        }
      } else {
        switch (category.toLowerCase()) {
          case 'cardio':
            return '#3B82F6'; // Blue
          case 'strength':
            return '#10B981'; // Green
          case 'flexibility':
            return '#F59E0B'; // Yellow
          case 'sports':
            return '#6366F1'; // Indigo
          case 'balance':
            return '#EC4899'; // Pink
          default:
            return '#6B7280'; // Gray
        }
      }
    };

    return (
      <TouchableOpacity
        onPress={() => onExercisePress(exercise)}
        className={themed(
          'bg-white rounded-2xl p-4 border border-gray-100 mb-3',
          'bg-gray-900 rounded-2xl p-4  mb-3'
        )}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
            style={{ backgroundColor: getLightBackgroundColor(exercise.category) }}
          >
            <IconComponent size={20} color={getIconColor(exercise.category)} />
          </View>
          <View className="flex-1">
            <Text
              className={themed(
                'text-base font-semibold text-black',
                'text-base font-semibold text-white'
              )}
            >
              {exercise.name}
            </Text>
            <Text
              className={themed(
                'text-sm text-gray-600 capitalize mt-1',
                'text-sm text-purple-400 capitalize mt-1'
              )}
            >
              {exercise.category}
            </Text>
            {exercise.description && (
              <Text
                className={themed('text-xs text-gray-500 mt-1', 'text-xs text-gray-400 mt-1')}
                numberOfLines={1}
              >
                {exercise.description}
              </Text>
            )}
          </View>
          <View className="items-end">
            <Text
              className={themed(
                'text-xs text-gray-500 capitalize',
                'text-xs text-gray-400 capitalize'
              )}
            >
              {exercise.metrics.primary}
            </Text>
            <Text className={themed('text-xs text-gray-400', 'text-xs text-gray-500')}>
              {exercise.metrics.units.primary}
            </Text>
            {exercise.caloriesPerMinute && (
              <Text
                className={themed('text-xs text-orange-600 mt-1', 'text-xs text-orange-400 mt-1')}
              >
                {exercise.caloriesPerMinute} cal/min
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <InfiniteScrollList
      data={exercises}
      renderItem={renderExerciseItem}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      onLoadMore={onLoadMore}
      refreshing={refreshing}
      onRefresh={onRefresh}
      emptyStateTitle="No exercises found"
      emptyStateSubtitle="Tap 'Create' to add your first community exercise"
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
};
