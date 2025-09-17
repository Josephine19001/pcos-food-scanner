import React from 'react';
import { View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { X, Clock, Flame, Beef, Wheat, Plus } from 'lucide-react-native';
import { useThemedStyles } from '@/lib/utils/theme';
import { useTheme } from '@/context/theme-provider';
import { OliveOilIcon } from '@/components/icons/olive-oil-icon';
import { Button } from '@/components/ui/button';
import { useCreateMealEntry } from '@/lib/hooks/use-meal-tracking';
import { toast } from 'sonner-native';

interface SimpleMealModalProps {
  isVisible: boolean;
  onClose: () => void;
  meal: any;
  mealType: string;
}

export default function SimpleMealModal({
  isVisible,
  onClose,
  meal,
  mealType,
}: SimpleMealModalProps) {
  const themed = useThemedStyles();
  const { isDark } = useTheme();
  const createMealEntry = useCreateMealEntry();

  if (!meal) return null;

  const handleAddToLog = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0];

    // Create meal entry data
    const mealEntryData = {
      meal_type: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      food_items: [{
        quantity: 1,
        food: {
          name: meal.name,
          nutrition: {
            calories: meal.calories || 0,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0,
            fiber: 0,
            sugar: 0,
          },
          detailed_ingredients: meal.ingredients?.map((ingredient: string) => ({
            name: ingredient,
            portion: '1 serving',
          })) || [],
        }
      }],
      logged_date: today,
      logged_time: now,
      notes: `Added from meal plan: ${meal.name}`,
    };

    createMealEntry.mutate(mealEntryData, {
      onSuccess: () => {
        toast.success('Meal added to today\'s log!');
        onClose();
      },
      onError: (error) => {
        toast.error('Failed to add meal to log');
        console.error('Error adding meal to log:', error);
      }
    });
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View className={themed("flex-1 bg-gray-50", "flex-1 bg-gray-950")}>
        {/* Header */}
        <View className={themed("bg-white border-b border-gray-200 pt-12 pb-4 px-4", "bg-gray-900 border-b border-gray-700 pt-12 pb-4 px-4")}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className={themed("text-xl font-bold text-gray-900", "text-xl font-bold text-white")}>
                {meal.name}
              </Text>
              <Text className={themed("text-sm text-gray-600 capitalize", "text-sm text-gray-400 capitalize")}>
                {mealType}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {/* Nutrition Summary */}
          <View className={themed("bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm", "bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700 shadow-sm")}>
            <Text className={themed("font-semibold text-gray-900 mb-4", "font-semibold text-white mb-4")}>
              Nutrition Information
            </Text>
            
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <View className={themed("w-8 h-8 bg-yellow-100 rounded-full items-center justify-center mr-2", "w-8 h-8 bg-yellow-900/30 rounded-full items-center justify-center mr-2")}>
                  <Flame size={14} color="#EAB308" />
                </View>
                <View>
                  <Text className={themed("text-lg font-bold text-gray-900", "text-lg font-bold text-white")}>
                    {meal.calories || 0}
                  </Text>
                  <Text className={themed("text-xs text-gray-500", "text-xs text-gray-400")}>
                    calories
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className={themed("w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-2", "w-8 h-8 bg-red-900/30 rounded-full items-center justify-center mr-2")}>
                  <Beef size={14} color="#EF4444" />
                </View>
                <View>
                  <Text className={themed("text-lg font-bold text-gray-900", "text-lg font-bold text-white")}>
                    {meal.protein || 0}g
                  </Text>
                  <Text className={themed("text-xs text-gray-500", "text-xs text-gray-400")}>
                    protein
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className={themed("w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-2", "w-8 h-8 bg-orange-900/30 rounded-full items-center justify-center mr-2")}>
                  <Wheat size={14} color="#F59E0B" />
                </View>
                <View>
                  <Text className={themed("text-lg font-bold text-gray-900", "text-lg font-bold text-white")}>
                    {meal.carbs || 0}g
                  </Text>
                  <Text className={themed("text-xs text-gray-500", "text-xs text-gray-400")}>
                    carbs
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className={themed("w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-2", "w-8 h-8 bg-purple-900/30 rounded-full items-center justify-center mr-2")}>
                  <OliveOilIcon size={14} color="#8B5CF6" />
                </View>
                <View>
                  <Text className={themed("text-lg font-bold text-gray-900", "text-lg font-bold text-white")}>
                    {meal.fat || 0}g
                  </Text>
                  <Text className={themed("text-xs text-gray-500", "text-xs text-gray-400")}>
                    fat
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Prep Time */}
          {meal.prep_time && (
            <View className={themed("bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm", "bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700 shadow-sm")}>
              <View className="flex-row items-center">
                <Clock size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                <Text className={themed("font-semibold text-gray-900 ml-2", "font-semibold text-white ml-2")}>
                  Prep Time: {meal.prep_time}
                </Text>
              </View>
            </View>
          )}

          {/* Ingredients */}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <View className={themed("bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm", "bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700 shadow-sm")}>
              <Text className={themed("font-semibold text-gray-900 mb-3", "font-semibold text-white mb-3")}>
                Ingredients
              </Text>
              {meal.ingredients.map((ingredient: string, index: number) => (
                <View key={index} className="flex-row items-center py-2">
                  <View className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <Text className={themed("text-gray-700", "text-gray-300")}>
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Instructions */}
          {meal.instructions && (
            <View className={themed("bg-white rounded-2xl p-4 mb-6 border border-gray-100 shadow-sm", "bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700 shadow-sm")}>
              <Text className={themed("font-semibold text-gray-900 mb-3", "font-semibold text-white mb-3")}>
                Instructions
              </Text>
              <Text className={themed("text-gray-700 leading-relaxed", "text-gray-300 leading-relaxed")}>
                {meal.instructions}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Action Button */}
        <View className={themed("p-4 border-t border-gray-200", "p-4 border-t border-gray-700")}>
          <Button
            title="Add to Today's Log"
            variant="primary"
            size="large"
            onPress={handleAddToLog}
            preIcon={<Plus size={18} color="white" />}
            disabled={createMealEntry.isPending}
            className="w-full"
          />
        </View>
      </View>
    </Modal>
  );
}