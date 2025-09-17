import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/context/theme-provider';
import { useThemedStyles } from '@/lib/utils/theme';
import { router } from 'expo-router';
import { getLocalDateString } from '@/lib/utils/date-helpers';
import {
  Dumbbell,
  Heart,
  Clock,
  Flame,
  CheckCircle,
  Edit3,
  X,
  Save,
  Zap,
  Bike,
  Waves,
  RotateCcw,
  TreePine,
  Sparkles,
} from 'lucide-react-native';
import {
  useDeleteExerciseEntry,
  useUpdateExerciseEntry,
  useCreateExerciseEntry,
} from '@/lib/hooks/use-exercise-tracking';
import { PlannedExerciseItem } from './planned-exercise-item';

// Exercise type icons mapping
const getExerciseIcon = (exerciseType: string) => {
  const type = exerciseType.toLowerCase();
  switch (type) {
    case 'cardio':
    case 'running':
    case 'jogging':
      return Heart;
    case 'strength':
    case 'weightlifting':
    case 'resistance':
      return Dumbbell;
    case 'cycling':
    case 'bike':
      return Bike;
    case 'swimming':
      return Waves;
    case 'yoga':
    case 'stretching':
    case 'flexibility':
      return RotateCcw;
    case 'hiit':
    case 'interval':
      return Zap;
    case 'outdoor':
    case 'hiking':
      return TreePine;
    default:
      return Dumbbell;
  }
};

const getExerciseColor = (exerciseType: string) => {
  const type = exerciseType.toLowerCase();
  switch (type) {
    case 'cardio':
    case 'running':
    case 'jogging':
      return '#DC2626'; // Red
    case 'strength':
    case 'weightlifting':
    case 'resistance':
      return '#8B5CF6'; // Purple
    case 'cycling':
    case 'bike':
      return '#059669'; // Green
    case 'swimming':
      return '#0891B2'; // Cyan
    case 'yoga':
    case 'stretching':
    case 'flexibility':
      return '#7C3AED'; // Violet
    case 'hiit':
    case 'interval':
      return '#F59E0B'; // Orange
    case 'outdoor':
    case 'hiking':
      return '#059669'; // Green
    default:
      return '#8B5CF6'; // Purple
  }
};

interface TodaysWorkoutSectionProps {
  currentWeeklyPlan?: any;
  exerciseEntries?: any[];
  isLoading: boolean;
  selectedDate: Date;
}

// Logged Exercise Item Component
function LoggedExerciseItem({ exercise }: { exercise: any }) {
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteExerciseEntry = useDeleteExerciseEntry();
  const updateExerciseEntry = useUpdateExerciseEntry();
  const themed = useThemedStyles();
  const { isDark } = useTheme();

  const handleDeleteExercise = (exerciseId: string) => {
    Alert.alert('Delete Exercise', 'Are you sure you want to delete this exercise?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteExerciseEntry.mutate(exerciseId);
        },
      },
    ]);
  };

  const handleEditExercise = (exercise: any) => {
    setEditingExercise(exercise);
    setShowEditModal(true);
  };

  const ExerciseIcon = getExerciseIcon(exercise.exercise_type);
  const exerciseColor = getExerciseColor(exercise.exercise_type);

  return (
    <>
      <View
        className={themed('rounded-xl p-4 border', 'rounded-xl p-4 border')}
        style={{
          backgroundColor: isDark ? '#065F4620' : '#DCFCE7',
          borderColor: isDark ? '#065F46' : '#BBF7D0',
        }}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: `${exerciseColor}20` }}
              >
                <ExerciseIcon size={18} color={exerciseColor} />
              </View>
              <View className="flex-1">
                <Text
                  className={themed(
                    'text-gray-900 font-semibold text-base',
                    'text-white font-semibold text-base'
                  )}
                >
                  {exercise.exercise_name}
                </Text>
                <View
                  className={themed(
                    'px-2 py-1 rounded-full self-start mt-1 bg-green-100',
                    'px-2 py-1 rounded-full self-start mt-1 bg-green-900/30'
                  )}
                >
                  <Text
                    className={themed(
                      'text-xs font-medium text-green-700',
                      'text-xs font-medium text-green-400'
                    )}
                  >
                    Completed
                  </Text>
                </View>
              </View>
            </View>

            <Text
              className={themed(
                'text-gray-600 text-sm capitalize mb-2',
                'text-gray-400 text-sm capitalize mb-2'
              )}
            >
              {exercise.exercise_type}
              {exercise.intensity && ` • ${exercise.intensity} intensity`}
            </Text>

            <View className="flex-row" style={{ gap: 16 }}>
              <View className="flex-row items-center">
                <Clock size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text
                  className={themed('text-gray-600 text-sm ml-1', 'text-gray-400 text-sm ml-1')}
                >
                  {exercise.duration_minutes} min
                </Text>
              </View>
              <View className="flex-row items-center">
                <Flame size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text
                  className={themed('text-gray-600 text-sm ml-1', 'text-gray-400 text-sm ml-1')}
                >
                  {exercise.calories_burned} cal
                </Text>
              </View>
            </View>

            {exercise.notes && (
              <Text
                className={themed(
                  'text-gray-500 text-sm mt-2 italic',
                  'text-gray-400 text-sm mt-2 italic'
                )}
              >
                {exercise.notes}
              </Text>
            )}
          </View>

          {/* Time/Action */}
          <View className="items-end">
            <Text className={themed('text-xs text-gray-400 mb-2', 'text-xs text-gray-500 mb-2')}>
              {exercise.logged_time
                ? new Date(`1970-01-01T${exercise.logged_time}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Time not set'}
            </Text>
            <View className="flex-row" style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() => handleEditExercise(exercise)}
                className={themed(
                  'bg-blue-500 px-2 py-1 rounded-lg',
                  'bg-purple-600 px-2 py-1 rounded-lg'
                )}
              >
                <Edit3 size={12} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteExercise(exercise.id)}
                className={themed(
                  'bg-red-500 px-2 py-1 rounded-lg',
                  'bg-red-600 px-2 py-1 rounded-lg'
                )}
              >
                <X size={12} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Exercise Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className={themed(
              'bg-white rounded-2xl p-6 m-4 w-80',
              'bg-gray-900 rounded-2xl p-6 m-4 w-80'
            )}
          >
            <Text
              className={themed(
                'text-lg font-bold text-gray-900 mb-4',
                'text-lg font-bold text-white mb-4'
              )}
            >
              Edit Exercise
            </Text>

            {editingExercise && (
              <View>
                <Text
                  className={themed(
                    'text-base font-semibold text-gray-900 mb-2',
                    'text-base font-semibold text-white mb-2'
                  )}
                >
                  {editingExercise.exercise_name}
                </Text>

                <View className="mb-4">
                  <Text
                    className={themed('text-sm text-gray-600 mb-2', 'text-sm text-gray-400 mb-2')}
                  >
                    Duration (minutes)
                  </Text>
                  <TextInput
                    className={themed(
                      'border border-gray-300 rounded-lg px-3 py-2',
                      'border border-gray-600 rounded-lg px-3 py-2 bg-gray-800 text-white'
                    )}
                    value={editingExercise.duration_minutes?.toString()}
                    onChangeText={(text) =>
                      setEditingExercise({
                        ...editingExercise,
                        duration_minutes: parseInt(text) || 0,
                      })
                    }
                    keyboardType="numeric"
                    placeholder="Duration in minutes"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>

                <View className="mb-4">
                  <Text
                    className={themed('text-sm text-gray-600 mb-2', 'text-sm text-gray-400 mb-2')}
                  >
                    Calories Burned
                  </Text>
                  <TextInput
                    className={themed(
                      'border border-gray-300 rounded-lg px-3 py-2',
                      'border border-gray-600 rounded-lg px-3 py-2 bg-gray-800 text-white'
                    )}
                    value={editingExercise.calories_burned?.toString()}
                    onChangeText={(text) =>
                      setEditingExercise({
                        ...editingExercise,
                        calories_burned: parseInt(text) || 0,
                      })
                    }
                    keyboardType="numeric"
                    placeholder="Calories burned"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>

                <View className="mb-4">
                  <Text
                    className={themed('text-sm text-gray-600 mb-2', 'text-sm text-gray-400 mb-2')}
                  >
                    Notes
                  </Text>
                  <TextInput
                    className={themed(
                      'border border-gray-300 rounded-lg px-3 py-2',
                      'border border-gray-600 rounded-lg px-3 py-2 bg-gray-800 text-white'
                    )}
                    value={editingExercise.notes || ''}
                    onChangeText={(text) =>
                      setEditingExercise({
                        ...editingExercise,
                        notes: text,
                      })
                    }
                    placeholder="Add notes..."
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View className="flex-row" style={{ gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowEditModal(false);
                      setEditingExercise(null);
                    }}
                    className={themed(
                      'flex-1 bg-gray-500 py-3 rounded-lg',
                      'flex-1 bg-gray-700 py-3 rounded-lg'
                    )}
                  >
                    <Text className="text-white font-semibold text-center">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      updateExerciseEntry.mutate({
                        id: editingExercise.id,
                        data: {
                          duration_minutes: editingExercise.duration_minutes,
                          calories_burned: editingExercise.calories_burned,
                          notes: editingExercise.notes,
                        },
                      });
                      setShowEditModal(false);
                      setEditingExercise(null);
                    }}
                    className={themed(
                      'flex-1 bg-purple-500 py-3 rounded-lg',
                      'flex-1 bg-purple-600 py-3 rounded-lg'
                    )}
                  >
                    <Text className="text-white font-semibold text-center">Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

export function TodaysWorkoutSection({
  currentWeeklyPlan,
  exerciseEntries,
  isLoading,
  selectedDate,
}: TodaysWorkoutSectionProps) {
  // Get today's workout from weekly plan
  const getTodaysWorkoutFromPlan = () => {
    if (!currentWeeklyPlan?.plan_data?.days) return null;

    const dateString = getLocalDateString(selectedDate);

    const todaysWorkout = currentWeeklyPlan.plan_data.days.find(
      (day: any) => day.date === dateString
    );

    return todaysWorkout;
  };

  const todaysPlannedWorkout = getTodaysWorkoutFromPlan();
  const { isDark } = useTheme();
  const themed = useThemedStyles();

  if (isLoading) {
    return (
      <View className="mx-4 mb-6">
        <Skeleton width={160} height={24} borderRadius={6} className="mb-4" />
        <View
          className={`${
            isDark ? 'bg-gray-800 ' : 'bg-white border-gray-50'
          } rounded-2xl p-6 shadow-sm border`}
        >
          {/* Workout header skeleton */}
          <View className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl p-4 mb-4`}>
            <Skeleton width={128} height={24} borderRadius={4} className="mb-2" />
            <Skeleton width={192} height={16} borderRadius={4} />
          </View>

          {/* Exercise items skeleton */}
          <View className="gap-2 mb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-3`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Skeleton width={96} height={16} borderRadius={4} className="mb-1" />
                    <Skeleton width={64} height={12} borderRadius={4} />
                  </View>
                  <Skeleton width={24} height={24} borderRadius={4} />
                </View>
              </View>
            ))}
          </View>

          {/* Log Exercise button skeleton */}
          <Skeleton width={300} height={48} borderRadius={24} />
        </View>
      </View>
    );
  }

  return (
    <View className="mx-4 mb-6">
      <Text
        className={themed(
          'text-xl font-bold text-gray-900 mb-4',
          'text-xl font-bold text-white mb-4'
        )}
      >
        {selectedDate.toDateString() === new Date().toDateString()
          ? 'Planned Workout'
          : `${selectedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })} Workout`}
      </Text>

      {todaysPlannedWorkout ? (
        <View
          className={themed(
            'bg-white rounded-2xl p-6 shadow-sm border border-gray-50 w-full',
            'bg-gray-900 rounded-2xl p-6 shadow-sm  w-full'
          )}
        >
          {todaysPlannedWorkout.is_rest_day ? (
            <View className="items-center">
              <View
                className={themed(
                  'w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-3',
                  'w-12 h-12 bg-green-900/30 rounded-full items-center justify-center mb-3'
                )}
              >
                <Heart size={24} color="#10B981" />
              </View>
              <Text
                className={themed(
                  'text-green-700 text-lg font-semibold mb-2',
                  'text-green-400 text-lg font-semibold mb-2'
                )}
              >
                Rest Day
              </Text>
              <Text className={themed('text-gray-600 text-center', 'text-gray-400 text-center')}>
                Take a break and let your body recover
              </Text>
            </View>
          ) : (
            <View className="w-full">
              {/* Today's Time Display */}
              <View
                className={themed(
                  'bg-purple-50 rounded-2xl p-4 mb-4 w-full',
                  'bg-purple-900/30 rounded-2xl p-4 mb-4 w-full'
                )}
              >
                <Text
                  className={themed(
                    'text-purple-900 text-xl font-bold',
                    'text-purple-300 text-xl font-bold'
                  )}
                >
                  {todaysPlannedWorkout.workout_type}
                </Text>
                <Text
                  className={themed('text-purple-700 text-sm mt-1', 'text-purple-400 text-sm mt-1')}
                >
                  {todaysPlannedWorkout.exercises?.length || 0} exercises •{' '}
                  {todaysPlannedWorkout.duration_minutes} min total
                </Text>
              </View>

              {/* Planned Workout Array */}
              <View className="flex-col w-full">
                {todaysPlannedWorkout.exercises?.length > 0 && (
                  <View style={{ gap: 8, marginBottom: 16 }}>
                    {todaysPlannedWorkout.exercises.map((exercise: any, index: number) => (
                      <PlannedExerciseItem
                        key={index}
                        exercise={exercise}
                        planId={currentWeeklyPlan?.id || ''}
                        selectedDate={selectedDate}
                      />
                    ))}
                  </View>
                )}

                {/* Logged Exercises */}
                {exerciseEntries && exerciseEntries.length > 0 && (
                  <View style={{ gap: 8, marginBottom: 16 }}>
                    <Text
                      className={themed(
                        'text-lg font-semibold text-gray-800 mb-2',
                        'text-lg font-semibold text-white mb-2'
                      )}
                    >
                      Logged Exercises
                    </Text>
                    {exerciseEntries.map((exercise: any) => (
                      <LoggedExerciseItem key={exercise.id} exercise={exercise} />
                    ))}
                  </View>
                )}

                {/* Add More Workout Button */}
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/log-exercise?date=${getLocalDateString(selectedDate)}`)
                  }
                  className={themed(
                    'bg-purple-500 py-4 rounded-2xl w-full',
                    'bg-purple-600 py-4 rounded-2xl w-full'
                  )}
                >
                  <Text className="text-white font-semibold text-center">Log Exercise</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        /* No planned workout, but show logged exercises if any */
        <View
          className={themed(
            'bg-white rounded-2xl p-6 shadow-sm border border-gray-50 w-full',
            'bg-gray-900 rounded-2xl p-6 shadow-sm  w-full'
          )}
        >
          {exerciseEntries && exerciseEntries.length > 0 ? (
            <View className="w-full">
              <View
                className={themed(
                  'bg-purple-50 rounded-2xl p-4 mb-4 w-full',
                  'bg-purple-900/30 rounded-2xl p-4 mb-4 w-full'
                )}
              >
                <Text
                  className={themed(
                    'text-purple-900 text-xl font-bold',
                    'text-purple-300 text-xl font-bold'
                  )}
                >
                  Logged Exercises
                </Text>
                <Text
                  className={themed('text-purple-700 text-sm mt-1', 'text-purple-400 text-sm mt-1')}
                >
                  {exerciseEntries.length} exercise{exerciseEntries.length > 1 ? 's' : ''} completed
                </Text>
              </View>

              <View className="flex-col w-full">
                <View style={{ gap: 8, marginBottom: 16 }}>
                  {exerciseEntries.map((exercise: any) => (
                    <LoggedExerciseItem key={exercise.id} exercise={exercise} />
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() =>
                    router.push(`/log-exercise?date=${getLocalDateString(selectedDate)}`)
                  }
                  className={themed(
                    'bg-purple-500 py-4 rounded-2xl w-full',
                    'bg-purple-600 py-4 rounded-2xl w-full'
                  )}
                >
                  <Text className="text-white font-semibold text-center">Log Another Exercise</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="items-center py-8">
              <View
                className={themed(
                  'w-16 h-16 rounded-2xl bg-purple-50 items-center justify-center mb-3',
                  'w-16 h-16 rounded-2xl bg-purple-900/30 items-center justify-center mb-3'
                )}
              >
                <Dumbbell size={24} color="#F97316" />
              </View>
              <Text
                className={themed(
                  'text-gray-600 text-center mb-3',
                  'text-gray-400 text-center mb-3'
                )}
              >
                No planned workout for this day
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push(`/log-exercise?date=${getLocalDateString(selectedDate)}`)
                }
                className={themed(
                  'bg-purple-500 px-4 py-2 rounded-xl',
                  'bg-purple-600 px-4 py-2 rounded-xl'
                )}
              >
                <Text className="text-white font-medium">Add Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
