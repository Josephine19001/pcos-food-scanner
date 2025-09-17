import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { X, Globe, Check } from 'lucide-react-native';
import { toast } from 'sonner-native';
import { supabase } from '@/lib/supabase/client';
import { Exercise } from '@/data/exercisesData';
import { Dropdown, DropdownOption } from '@/components/ui/dropdown';
import { IconDropdown } from '@/components/ui/icon-dropdown';
import { useThemedStyles } from '@/lib/utils/theme';
import { useTheme } from '@/context/theme-provider';
import {
  MUSCLE_GROUPS,
  EQUIPMENT_OPTIONS,
  DIFFICULTY_LEVELS,
  EXERCISE_CATEGORIES,
} from './exercise-form-constants';

interface CreateExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onExerciseCreated: (exercise: Exercise) => void;
}

export const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  visible,
  onClose,
  onExerciseCreated,
}) => {
  // Form state
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseType, setNewExerciseType] = useState('');
  const [newExerciseIcon, setNewExerciseIcon] = useState('Globe');
  const [newExerciseMuscleGroups, setNewExerciseMuscleGroups] = useState<string[]>([]);
  const [newExerciseEquipment, setNewExerciseEquipment] = useState('bodyweight');
  const [newExerciseDifficulty, setNewExerciseDifficulty] = useState('beginner');
  const [newExerciseCaloriesPerMinute, setNewExerciseCaloriesPerMinute] = useState('5');
  const [newExerciseInstructions, setNewExerciseInstructions] = useState('');
  const [shareWithCommunity, setShareWithCommunity] = useState(false);

  const themed = useThemedStyles();
  const { isDark } = useTheme();

  // Convert constants to dropdown options
  const categoryOptions: DropdownOption[] = EXERCISE_CATEGORIES.map((cat) => ({
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: cat,
  }));

  const muscleGroupOptions: DropdownOption[] = MUSCLE_GROUPS.map((muscle) => ({
    label: muscle.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    value: muscle,
  }));

  const equipmentOptions: DropdownOption[] = EQUIPMENT_OPTIONS.map((equipment) => ({
    label: equipment.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    value: equipment,
  }));

  const difficultyOptions: DropdownOption[] = DIFFICULTY_LEVELS.map((difficulty) => ({
    label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    value: difficulty,
  }));

  const resetForm = () => {
    setNewExerciseName('');
    setNewExerciseType('');
    setNewExerciseIcon('Globe');
    setNewExerciseMuscleGroups([]);
    setNewExerciseEquipment('bodyweight');
    setNewExerciseDifficulty('beginner');
    setNewExerciseCaloriesPerMinute('5');
    setNewExerciseInstructions('');
    setShareWithCommunity(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addCustomExercise = async () => {
    if (newExerciseName.trim() && newExerciseType.trim()) {
      const newId = newExerciseName.toLowerCase().replace(/\s+/g, '_');
      const newExercise: Exercise = {
        id: newId,
        name: newExerciseName.trim(),
        category: newExerciseType.trim(),
        icon: newExerciseIcon,
        color: '#8B5CF6',
        metrics: {
          primary: 'time',
          units: {
            primary: 'min',
          },
        },
        description: newExerciseInstructions.trim() || 'Community contributed exercise',
        muscleGroups: newExerciseMuscleGroups,
        equipment: newExerciseEquipment,
        difficulty: newExerciseDifficulty,
        caloriesPerMinute: parseFloat(newExerciseCaloriesPerMinute) || 5,
      };

      // Add to local state immediately
      onExerciseCreated(newExercise);

      // If user wants to share with community, invoke AI moderation
      if (shareWithCommunity) {
        try {
          const { data: user } = await supabase.auth.getUser();
          if (user.user) {
            const exerciseEntryId = `custom_${Date.now()}`;
            const exerciseData = {
              name: newExercise.name,
              category: newExercise.category,
              muscleGroups:
                newExerciseMuscleGroups.length > 0 ? newExerciseMuscleGroups : ['full_body'],
              equipment: newExerciseEquipment,
              difficulty: newExerciseDifficulty,
              instructions: newExerciseInstructions.trim() || 'Community contributed exercise',
              caloriesPerMinute: parseFloat(newExerciseCaloriesPerMinute) || 5,
            };

            const moderationStart = Date.now();
            const { data: moderationResponse, error: moderationError } =
              await supabase.functions.invoke('ai-exercise-moderator', {
                body: {
                  exercise_entry_id: exerciseEntryId,
                  exercise_items: [exerciseData],
                  user_id: user.user.id,
                },
              });
            const moderationTime = Date.now() - moderationStart;
            if (moderationError) {
              console.error('❌ AI moderation call failed:', moderationError);
              toast.error(
                'Failed to submit for community review, but exercise was created successfully'
              );
            }
          }
        } catch (error) {
          console.error('Error during AI moderation:', error);
          toast.error(
            'Failed to submit for community review, but exercise was created successfully'
          );
        }
      }

      resetForm();
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={handleClose}>
      <View className={themed('flex-1 bg-white', 'flex-1 bg-gray-900')}>
        <View className="flex-1 p-6 pt-16">
          <View className="flex-row items-center justify-between mb-6">
            <Text
              className={themed(
                'text-xl font-semibold text-black',
                'text-xl font-semibold text-white'
              )}
            >
              Create New Exercise
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* Exercise Name */}
            <View className="mb-4">
              <Text
                className={themed(
                  'text-base font-medium text-black mb-2',
                  'text-base font-medium text-white mb-2'
                )}
              >
                Exercise Name *
              </Text>
              <View
                className={themed(
                  'bg-gray-50 rounded-xl p-4 border border-gray-200',
                  'bg-gray-800 rounded-xl p-4 border border-gray-600'
                )}
              >
                <TextInput
                  value={newExerciseName}
                  onChangeText={setNewExerciseName}
                  placeholder="e.g., Push-ups, Pilates, Boxing"
                  className={themed('text-base text-black', 'text-base text-white')}
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                />
              </View>
            </View>

            {/* Icon Selection Dropdown */}
            <IconDropdown label="Icon" value={newExerciseIcon} onSelect={setNewExerciseIcon} />

            {/* Category Dropdown */}
            <Dropdown
              label="Category *"
              value={newExerciseType}
              onSelect={(value) => setNewExerciseType(value as string)}
              options={categoryOptions}
              placeholder="Select exercise category"
            />

            {/* Muscle Groups Dropdown */}
            <Dropdown
              label="Muscle Groups"
              value={newExerciseMuscleGroups}
              onSelect={(value) => setNewExerciseMuscleGroups(value as string[])}
              options={muscleGroupOptions}
              placeholder="Select muscle groups"
              multiSelect={true}
            />

            {/* Equipment Dropdown */}
            <Dropdown
              label="Equipment"
              value={newExerciseEquipment}
              onSelect={(value) => setNewExerciseEquipment(value as string)}
              options={equipmentOptions}
              placeholder="Select equipment"
            />

            {/* Difficulty & Calories Row */}
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Dropdown
                  label="Difficulty"
                  value={newExerciseDifficulty}
                  onSelect={(value) => setNewExerciseDifficulty(value as string)}
                  options={difficultyOptions}
                  placeholder="Select difficulty"
                />
              </View>

              <View className="flex-1">
                <Text
                  className={themed(
                    'text-base font-medium text-black mb-2',
                    'text-base font-medium text-white mb-2'
                  )}
                >
                  Calories/Min
                </Text>
                <View
                  className={themed(
                    'bg-gray-50 rounded-xl p-4 border border-gray-200',
                    'bg-gray-800 rounded-xl p-4 border border-gray-600'
                  )}
                >
                  <TextInput
                    value={newExerciseCaloriesPerMinute}
                    onChangeText={setNewExerciseCaloriesPerMinute}
                    placeholder="5"
                    keyboardType="numeric"
                    className={themed(
                      'text-base text-black text-center',
                      'text-base text-white text-center'
                    )}
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  />
                </View>
              </View>
            </View>

            {/* Instructions */}
            <View className="mb-6">
              <Text
                className={themed(
                  'text-base font-medium text-black mb-2',
                  'text-base font-medium text-white mb-2'
                )}
              >
                Instructions (Optional)
              </Text>
              <View
                className={themed(
                  'bg-gray-50 rounded-xl p-4 border border-gray-200',
                  'bg-gray-800 rounded-xl p-4 border border-gray-600'
                )}
              >
                <TextInput
                  value={newExerciseInstructions}
                  onChangeText={setNewExerciseInstructions}
                  placeholder="Describe how to perform this exercise..."
                  className={themed('text-base text-black', 'text-base text-white')}
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Section */}
          <View className={themed('pt-4 border-t border-gray-100', 'pt-4 border-t ')}>
            {/* Share with Community Option */}
            <TouchableOpacity
              onPress={() => setShareWithCommunity(!shareWithCommunity)}
              className={themed(
                `rounded-2xl p-4 border mb-4 ${
                  shareWithCommunity ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`,
                `rounded-2xl p-4 border mb-4 ${
                  shareWithCommunity
                    ? 'bg-purple-900/30 border-purple-600'
                    : 'bg-gray-800 border-gray-600'
                }`
              )}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <View
                  className={themed(
                    `w-6 h-6 rounded-full border mr-4 items-center justify-center ${
                      shareWithCommunity
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white border-gray-300'
                    }`,
                    `w-6 h-6 rounded-full border mr-4 items-center justify-center ${
                      shareWithCommunity
                        ? 'bg-purple-600 border-purple-600'
                        : 'bg-gray-700 border-gray-500'
                    }`
                  )}
                >
                  {shareWithCommunity && <Check size={14} color="white" />}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Globe size={24} color="#10B981" />
                    <Text
                      className={themed(
                        `text-base font-semibold ml-2 ${
                          shareWithCommunity ? 'text-blue-900' : 'text-gray-900'
                        }`,
                        `text-base font-semibold ml-2 ${
                          shareWithCommunity ? 'text-purple-300' : 'text-white'
                        }`
                      )}
                    >
                      Share with Community
                    </Text>
                  </View>
                  <Text
                    className={themed(
                      `text-sm ${shareWithCommunity ? 'text-blue-700' : 'text-gray-600'}`,
                      `text-sm ${shareWithCommunity ? 'text-purple-400' : 'text-gray-400'}`
                    )}
                  >
                    Contribute this exercise to our community database for everyone to use
                  </Text>
                </View>
                {shareWithCommunity && (
                  <View
                    className={themed(
                      'bg-blue-100 px-3 py-1 rounded-full ml-2',
                      'bg-purple-900/30 px-3 py-1 rounded-full ml-2'
                    )}
                  >
                    <Text
                      className={themed(
                        'text-blue-800 text-xs font-medium',
                        'text-purple-300 text-xs font-medium'
                      )}
                    >
                      Active
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <Button
              title="Create Exercise"
              onPress={addCustomExercise}
              variant="primary"
              size="large"
              disabled={!newExerciseName.trim() || !newExerciseType.trim()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
