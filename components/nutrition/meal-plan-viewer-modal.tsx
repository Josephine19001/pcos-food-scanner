import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  X,
  Calendar,
  DollarSign,
  ShoppingCart,
  ChefHat,
  Clock,
  ChevronDown,
  ChevronRight,
  Flame,
  Beef,
  Wheat,
  Plus,
  Sparkles,
  Heart,
} from 'lucide-react-native';
import { OliveOilIcon } from '@/components/icons/olive-oil-icon';
import { useThemedStyles } from '@/lib/utils/theme';
import { useTheme } from '@/context/theme-provider';
import { useGroceryList } from '@/lib/hooks/use-meal-plans';
import DayMealsModal from './day-meals-modal';
import { useCreateMealEntry } from '@/lib/hooks/use-meal-tracking';
import { useAddFavoriteFood, useFavoriteFoods } from '@/lib/hooks/use-favorite-foods';
import { toast } from 'sonner-native';

interface MealPlanViewerModalProps {
  isVisible: boolean;
  onClose: () => void;
  mealPlan: any;
  onRegeneratePlan?: () => void;
}

export default function MealPlanViewerModal({
  isVisible,
  onClose,
  mealPlan,
  onRegeneratePlan,
}: MealPlanViewerModalProps) {
  const themed = useThemedStyles();
  const { isDark } = useTheme();
  const createMealEntry = useCreateMealEntry();
  const addFavoriteFood = useAddFavoriteFood();
  const { data: favoriteFoods, error: favoriteFoodsError } = useFavoriteFoods();
  
  // Debug logging
  console.log('Favorite foods data:', favoriteFoods);
  console.log('Favorite foods error:', favoriteFoodsError);
  const [selectedTab, setSelectedTab] = useState<'meals' | 'grocery'>('meals');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0])); // First day expanded by default
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const { data: groceryList } = useGroceryList(mealPlan?.id);

  if (!mealPlan) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const toggleDay = (dayIndex: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayIndex)) {
        newSet.delete(dayIndex);
      } else {
        newSet.add(dayIndex);
      }
      return newSet;
    });
  };

  const handleDayClick = (day: any) => {
    setSelectedDay(day);
    setShowDayModal(true);
  };

  const handleAddToFavorites = (meal: any) => {
    console.log('Adding meal to favorites:', meal.name);
    
    addFavoriteFood.mutate({
      food_name: meal.name,
      category: 'meal',
      cuisine_type: 'planned_meal',
    }, {
      onSuccess: () => {
        console.log('Successfully added to favorites:', meal.name);
      },
      onError: (error) => {
        console.error('Error adding to favorites:', error);
      },
    });
  };

  const isMealFavorited = (mealName: string) => {
    return favoriteFoods?.some(food => food.food_name === mealName) || false;
  };

  const handleAddMealToLog = (meal: any, mealType: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0];

    const mealEntryData = {
      meal_type: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      food_items: [
        {
          quantity: 1,
          food: {
            id: `meal-plan-${meal.name}-${Date.now()}`,
            name: meal.name,
            servingSize: '1 serving',
            nutrition: {
              calories: meal.calories || 0,
              protein: meal.protein || 0,
              carbs: meal.carbs || 0,
              fat: meal.fat || 0,
              fiber: 0,
              sugar: 0,
            },
          },
        },
      ],
      logged_date: today,
      logged_time: now,
      notes: `Added from meal plan: ${meal.name}`,
      analysis_status: 'completed' as const,
    };

    console.log('Adding meal to log:', { meal: meal.name, mealEntryData });
    
    createMealEntry.mutate(mealEntryData, {
      onSuccess: (data) => {
        console.log('Successfully added meal to log:', data);
        toast.success(`${meal.name} added to today's log!`);
      },
      onError: (error) => {
        console.error('Error adding meal to log:', error);
        toast.error('Failed to add meal to log');
      },
    });
  };

  const renderDayMeal = (meal: any, mealType: string) => {
    if (!meal) return null;

    return (
      <View
        key={mealType}
        className={themed(
          'bg-white rounded-xl p-4 mb-3 border border-gray-100',
          'bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700'
        )}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text
              className={themed(
                'text-sm font-medium text-gray-500 uppercase tracking-wide',
                'text-sm font-medium text-gray-400 uppercase tracking-wide'
              )}
            >
              {mealType}
            </Text>
            <Text
              className={themed(
                'text-lg font-semibold text-gray-900 mt-1',
                'text-lg font-semibold text-white mt-1'
              )}
            >
              {meal.name}
            </Text>
          </View>
          {meal.prep_time && (
            <View className="flex-row items-center">
              <Clock size={12} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text className={themed('text-xs text-gray-500 ml-1', 'text-xs text-gray-400 ml-1')}>
                {meal.prep_time}
              </Text>
            </View>
          )}
        </View>

        {/* Nutrition Row */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <View
              className={themed(
                'w-6 h-6 bg-yellow-100 rounded-full items-center justify-center mr-1',
                'w-6 h-6 bg-yellow-900/30 rounded-full items-center justify-center mr-1'
              )}
            >
              <Flame size={12} color="#EAB308" />
            </View>
            <Text
              className={themed(
                'text-sm font-medium text-gray-900',
                'text-sm font-medium text-white'
              )}
            >
              {meal.calories || 0}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View
              className={themed(
                'w-5 h-5 bg-red-100 rounded-full items-center justify-center mr-1',
                'w-5 h-5 bg-red-900/30 rounded-full items-center justify-center mr-1'
              )}
            >
              <Beef size={10} color="#EF4444" />
            </View>
            <Text className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
              {meal.protein || 0}g
            </Text>
          </View>

          <View className="flex-row items-center">
            <View
              className={themed(
                'w-5 h-5 bg-orange-100 rounded-full items-center justify-center mr-1',
                'w-5 h-5 bg-orange-900/30 rounded-full items-center justify-center mr-1'
              )}
            >
              <Wheat size={10} color="#F59E0B" />
            </View>
            <Text className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
              {meal.carbs || 0}g
            </Text>
          </View>

          <View className="flex-row items-center">
            <View
              className={themed(
                'w-5 h-5 bg-purple-100 rounded-full items-center justify-center mr-1',
                'w-5 h-5 bg-purple-900/30 rounded-full items-center justify-center mr-1'
              )}
            >
              <OliveOilIcon size={10} color="#8B5CF6" />
            </View>
            <Text className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
              {meal.fat || 0}g
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row" style={{ gap: 12 }}>
          {/* Add to Favorites Button - Simplified */}
          <TouchableOpacity
            onPress={() => {
              console.log('Heart button clicked for meal:', meal.name);
              handleAddToFavorites(meal);
            }}
            disabled={addFavoriteFood.isPending}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: isMealFavorited(meal.name) ? '#EF4444' : '#D1D5DB',
              backgroundColor: isMealFavorited(meal.name) ? '#FEE2E2' : '#F9FAFB',
            }}
            activeOpacity={0.8}
          >
            <Heart 
              size={16} 
              color={isMealFavorited(meal.name) ? '#EF4444' : '#6B7280'}
              fill={isMealFavorited(meal.name) ? '#EF4444' : 'transparent'}
            />
            <Text 
              style={{
                fontWeight: '500',
                marginLeft: 8,
                color: isMealFavorited(meal.name) ? '#EF4444' : '#374151',
              }}
            >
              {addFavoriteFood.isPending ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>

          {/* Add to Log Button */}
          <TouchableOpacity
            onPress={() => {
              console.log('Button clicked - Adding meal to log:', { mealName: meal.name, mealType });
              handleAddMealToLog(meal, mealType);
            }}
            disabled={createMealEntry.isPending}
            className={themed(
              'bg-green-500 rounded-xl py-3 px-4 flex-row items-center justify-center flex-1',
              'bg-green-600 rounded-xl py-3 px-4 flex-row items-center justify-center flex-1'
            )}
            activeOpacity={0.8}
          >
            <Plus size={16} color="white" />
            <Text className="text-white font-medium ml-2">
              {createMealEntry.isPending ? 'Adding...' : 'Add to Today\'s Log'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderGroceryCategory = (categoryName: string, items: any[]) => {
    return (
      <View key={categoryName} className="mb-6">
        <Text
          className={themed('font-semibold text-gray-900 mb-3', 'font-semibold text-white mb-3')}
        >
          {categoryName}
        </Text>
        {items.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between py-2 border-b border-gray-200"
          >
            <View className="flex-1">
              <Text className={themed('text-gray-900', 'text-white')}>{item.name}</Text>
              <Text className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
                {item.quantity}
              </Text>
            </View>
            <Text className={themed('font-medium text-gray-900', 'font-medium text-white')}>
              ${item.estimatedPrice}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View className={themed('flex-1 bg-gray-50', 'flex-1 bg-gray-950')}>
        {/* Header */}
        <View
          className={themed(
            'bg-white border-b border-gray-200 pt-12 pb-4 px-4',
            'bg-gray-900 border-b border-gray-700 pt-12 pb-4 px-4'
          )}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className={themed(
                  'w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3',
                  'w-8 h-8 bg-green-900/30 rounded-full items-center justify-center mr-3'
                )}
              >
                <ChefHat size={16} color="#10B981" />
              </View>
              <View>
                <Text
                  className={themed(
                    'text-xl font-bold text-gray-900',
                    'text-xl font-bold text-white'
                  )}
                >
                  {mealPlan.name}
                </Text>
                <Text className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
                  {new Date(mealPlan.start_date).toLocaleDateString()} -{' '}
                  {new Date(mealPlan.end_date).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          {/* Plan Stats */}
          <View className="flex-row justify-between mt-4">
            <View className="items-center">
              <Text
                className={themed(
                  'text-2xl font-bold text-green-600',
                  'text-2xl font-bold text-green-400'
                )}
              >
                {mealPlan.meals_data?.days?.length || 0}
              </Text>
              <Text className={themed('text-xs text-gray-600', 'text-xs text-gray-400')}>Days</Text>
            </View>
            <View className="items-center">
              <Text
                className={themed(
                  'text-2xl font-bold text-green-600',
                  'text-2xl font-bold text-green-400'
                )}
              >
                {mealPlan.nutrition_summary?.avg_calories || 0}
              </Text>
              <Text className={themed('text-xs text-gray-600', 'text-xs text-gray-400')}>
                Avg Calories
              </Text>
            </View>
            <View className="items-center">
              <Text
                className={themed(
                  'text-2xl font-bold text-green-600',
                  'text-2xl font-bold text-green-400'
                )}
              >
                ${mealPlan.estimated_cost || 0}
              </Text>
              <Text className={themed('text-xs text-gray-600', 'text-xs text-gray-400')}>
                Est. Cost
              </Text>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row mt-4">
            <TouchableOpacity
              onPress={() => setSelectedTab('meals')}
              className={`flex-1 py-2 px-4 rounded-lg mr-2 ${
                selectedTab === 'meals'
                  ? themed('bg-green-100', 'bg-green-900/20')
                  : themed('bg-gray-100', 'bg-gray-800')
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  selectedTab === 'meals'
                    ? themed('text-green-700', 'text-green-300')
                    : themed('text-gray-700', 'text-gray-300')
                }`}
              >
                Meals
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab('grocery')}
              className={`flex-1 py-2 px-4 rounded-lg ml-2 ${
                selectedTab === 'grocery'
                  ? themed('bg-green-100', 'bg-green-900/20')
                  : themed('bg-gray-100', 'bg-gray-800')
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  selectedTab === 'grocery'
                    ? themed('text-green-700', 'text-green-300')
                    : themed('text-gray-700', 'text-gray-300')
                }`}
              >
                Grocery List
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {selectedTab === 'meals' ? (
            /* Meals Tab - Accordion Layout */
            <View>
              {mealPlan.meals_data?.days?.map((day: any, dayIndex: number) => {
                const isExpanded = expandedDays.has(dayIndex);

                return (
                  <View key={dayIndex} className="mb-4">
                    {/* Accordion Header */}
                    <TouchableOpacity
                      onPress={() => toggleDay(dayIndex)}
                      className={themed(
                        'bg-white rounded-xl p-4 mb-2 border border-gray-100 shadow-sm',
                        'bg-gray-800 rounded-xl p-4 mb-2 border border-gray-700 shadow-sm'
                      )}
                      activeOpacity={0.7}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <Calendar size={16} color="#10B981" />
                          <View className="ml-3 flex-1">
                            <Text
                              className={themed(
                                'font-semibold text-gray-900',
                                'font-semibold text-white'
                              )}
                            >
                              {day.day} - {formatDate(day.date)}
                            </Text>
                            <View className="flex-row items-center">
                              <View
                                className={themed(
                                  'w-5 h-5 bg-yellow-100 rounded-full items-center justify-center mr-1',
                                  'w-5 h-5 bg-yellow-900/30 rounded-full items-center justify-center mr-1'
                                )}
                              >
                                <Flame size={10} color="#EAB308" />
                              </View>
                              <Text
                                className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}
                              >
                                {day.daily_totals?.calories || 0}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View className="flex-row items-center">
                          <TouchableOpacity
                            onPress={() => handleDayClick(day)}
                            className={themed(
                              'px-3 py-1 bg-blue-100 rounded-full mr-3',
                              'px-3 py-1 bg-blue-900/20 rounded-full mr-3'
                            )}
                            activeOpacity={0.7}
                          >
                            <Text
                              className={themed(
                                'text-xs font-medium text-blue-700',
                                'text-xs font-medium text-blue-300'
                              )}
                            >
                              View Plan
                            </Text>
                          </TouchableOpacity>
                          {isExpanded ? (
                            <ChevronDown size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                          ) : (
                            <ChevronRight size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Accordion Content */}
                    {isExpanded && (
                      <View className="ml-2">
                        {day.meals?.breakfast && renderDayMeal(day.meals.breakfast, 'breakfast')}
                        {day.meals?.lunch && renderDayMeal(day.meals.lunch, 'lunch')}
                        {day.meals?.dinner && renderDayMeal(day.meals.dinner, 'dinner')}
                        {day.meals?.snacks?.map((snack: any, snackIndex: number) =>
                          renderDayMeal(snack, `snack-${snackIndex}`)
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            /* Grocery List Tab */
            <View>
              {groceryList ? (
                <>
                  <View
                    className={themed(
                      'bg-green-50 rounded-xl p-4 mb-6',
                      'bg-green-900/20 rounded-xl p-4 mb-6'
                    )}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={themed(
                          'font-semibold text-green-800',
                          'font-semibold text-green-200'
                        )}
                      >
                        {groceryList.name}
                      </Text>
                      <Text
                        className={themed('font-bold text-green-800', 'font-bold text-green-200')}
                      >
                        Total: ${groceryList.total_estimated_cost}
                      </Text>
                    </View>
                  </View>

                  {groceryList.items?.categories &&
                    Object.entries(groceryList.items.categories).map(
                      ([category, items]: [string, any]) => renderGroceryCategory(category, items)
                    )}
                </>
              ) : (
                <View className="items-center py-8">
                  <ShoppingCart size={48} color="#9CA3AF" />
                  <Text className={themed('text-gray-600 mt-4', 'text-gray-400 mt-4')}>
                    Grocery list not available
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Regenerate Button */}
        {onRegeneratePlan && (
          <View className={themed('p-4 border-t border-gray-200', 'p-4 border-t border-gray-700')}>
            <TouchableOpacity
              onPress={() => {
                onRegeneratePlan();
                onClose();
              }}
              className={themed(
                'bg-green-500 rounded-xl py-4 px-6 flex-row items-center justify-center',
                'bg-green-600 rounded-xl py-4 px-6 flex-row items-center justify-center'
              )}
              activeOpacity={0.8}
            >
              <Sparkles size={20} color="white" />
              <Text className="text-white font-semibold ml-3 text-lg">Regenerate Meal Plan</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Day Meals Modal */}
      <DayMealsModal
        isVisible={showDayModal}
        onClose={() => setShowDayModal(false)}
        day={selectedDay}
      />
    </Modal>
  );
}
