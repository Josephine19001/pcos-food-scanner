import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemedStyles } from '@/lib/utils/theme';
import { LineChart, BarChart } from 'react-native-chart-kit';

interface PersonalizedInsight {
  cycleInsights: {
    phase: string;
    description: string;
    tips: string[];
  };
  workoutPlan: {
    thisWeek: Array<{
      day: string;
      type: string;
      duration: number;
      intensity: 'low' | 'medium' | 'high';
      exercises: string[];
    }>;
    reasoning: string;
  };
  nutritionPlan: {
    dailyCalories: number;
    macros: {
      protein: number;
      carbs: number;
      fats: number;
    };
    mealSuggestions: string[];
    cycleSpecificTips: string[];
  };
  progressPredictions: {
    oneWeek: string;
    oneMonth: string;
    threeMonths: string;
  };
  charts: {
    energyLevels: number[];
    recommendedIntensity: number[];
    cycleDays: string[];
  };
}

interface PersonalizedInsightsProps {
  insights: PersonalizedInsight;
  userName: string;
}

export function PersonalizedInsights({ insights, userName }: PersonalizedInsightsProps) {
  const themed = useThemedStyles();
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const energyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: insights.charts.energyLevels.slice(0, 28).reduce((acc, val, idx) => {
          const weekIndex = Math.floor(idx / 7);
          acc[weekIndex] = acc[weekIndex] ? (acc[weekIndex] + val) / 2 : val;
          return acc;
        }, [] as number[]).slice(0, 4),
        color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const intensityColors = {
    low: '#10B981',
    medium: '#F59E0B', 
    high: '#EF4444'
  };

  return (
    <ScrollView className={themed('flex-1 bg-white', 'flex-1 bg-gray-900')}>
      <View className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className={themed('text-3xl font-bold text-gray-900 mb-2', 'text-3xl font-bold text-white mb-2')}>
            🎯 Your Personalized Luna Preview
          </Text>
          <Text className={themed('text-lg text-gray-600', 'text-lg text-gray-400')}>
            Hey {userName}! Here's what Luna has prepared just for you
          </Text>
        </View>

        {/* Cycle Insights Card */}
        <View className={themed('bg-pink-50 rounded-2xl p-6 mb-6', 'bg-pink-900/20 rounded-2xl p-6 mb-6')}>
          <Text className={themed('text-xl font-bold text-gray-900 mb-3', 'text-xl font-bold text-white mb-3')}>
            🌙 {insights.cycleInsights.phase}
          </Text>
          <Text className={themed('text-gray-700 mb-4', 'text-gray-300 mb-4')}>
            {insights.cycleInsights.description}
          </Text>
          <View className="space-y-2">
            {insights.cycleInsights.tips.map((tip, index) => (
              <Text key={index} className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
                • {tip}
              </Text>
            ))}
          </View>
        </View>

        {/* Energy Chart */}
        <View className={themed('bg-white rounded-2xl p-6 mb-6 shadow-sm', 'bg-gray-800 rounded-2xl p-6 mb-6')}>
          <Text className={themed('text-xl font-bold text-gray-900 mb-4', 'text-xl font-bold text-white mb-4')}>
            📈 Your Energy Cycle
          </Text>
          <LineChart
            data={energyData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <Text className={themed('text-sm text-gray-600 text-center mt-2', 'text-sm text-gray-400 text-center mt-2')}>
            Predicted energy levels throughout your cycle
          </Text>
        </View>

        {/* Workout Plan */}
        <View className={themed('bg-purple-50 rounded-2xl p-6 mb-6', 'bg-purple-900/20 rounded-2xl p-6 mb-6')}>
          <Text className={themed('text-xl font-bold text-gray-900 mb-3', 'text-xl font-bold text-white mb-3')}>
            💪 Your Workout Plan
          </Text>
          <Text className={themed('text-gray-700 mb-4', 'text-gray-300 mb-4')}>
            {insights.workoutPlan.reasoning}
          </Text>
          
          <View className="space-y-3">
            {insights.workoutPlan.thisWeek.slice(0, 3).map((workout, index) => (
              <View key={index} className={themed('bg-white rounded-lg p-4', 'bg-gray-700 rounded-lg p-4')}>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className={themed('font-semibold text-gray-900', 'font-semibold text-white')}>
                    {workout.day}
                  </Text>
                  <View 
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: intensityColors[workout.intensity] + '20' }}
                  >
                    <Text 
                      className="text-sm font-medium capitalize"
                      style={{ color: intensityColors[workout.intensity] }}
                    >
                      {workout.intensity}
                    </Text>
                  </View>
                </View>
                <Text className={themed('text-gray-700 font-medium', 'text-gray-300 font-medium')}>
                  {workout.type} • {workout.duration}min
                </Text>
                <Text className={themed('text-sm text-gray-600 mt-1', 'text-sm text-gray-400 mt-1')}>
                  {workout.exercises.slice(0, 3).join(', ')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Nutrition Plan */}
        <View className={themed('bg-green-50 rounded-2xl p-6 mb-6', 'bg-green-900/20 rounded-2xl p-6 mb-6')}>
          <Text className={themed('text-xl font-bold text-gray-900 mb-3', 'text-xl font-bold text-white mb-3')}>
            🥗 Your Nutrition Plan
          </Text>
          
          <View className="flex-row justify-around mb-4">
            <View className="items-center">
              <Text className={themed('text-2xl font-bold text-green-600', 'text-2xl font-bold text-green-400')}>
                {insights.nutritionPlan.dailyCalories}
              </Text>
              <Text className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
                Calories/day
              </Text>
            </View>
            <View className="items-center">
              <Text className={themed('text-lg font-bold text-gray-900', 'text-lg font-bold text-white')}>
                {insights.nutritionPlan.macros.protein}g
              </Text>
              <Text className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
                Protein
              </Text>
            </View>
            <View className="items-center">
              <Text className={themed('text-lg font-bold text-gray-900', 'text-lg font-bold text-white')}>
                {insights.nutritionPlan.macros.carbs}g
              </Text>
              <Text className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
                Carbs
              </Text>
            </View>
            <View className="items-center">
              <Text className={themed('text-lg font-bold text-gray-900', 'text-lg font-bold text-white')}>
                {insights.nutritionPlan.macros.fats}g
              </Text>
              <Text className={themed('text-sm text-gray-600', 'text-sm text-gray-400')}>
                Fats
              </Text>
            </View>
          </View>

          <View className="space-y-2">
            <Text className={themed('font-semibold text-gray-900', 'font-semibold text-white')}>
              Meal Suggestions:
            </Text>
            {insights.nutritionPlan.mealSuggestions.slice(0, 2).map((meal, index) => (
              <Text key={index} className={themed('text-sm text-gray-700', 'text-sm text-gray-300')}>
                • {meal}
              </Text>
            ))}
          </View>
        </View>

        {/* Progress Predictions */}
        <View className={themed('bg-blue-50 rounded-2xl p-6 mb-6', 'bg-blue-900/20 rounded-2xl p-6 mb-6')}>
          <Text className={themed('text-xl font-bold text-gray-900 mb-4', 'text-xl font-bold text-white mb-4')}>
            📈 What to Expect
          </Text>
          
          <View className="space-y-3">
            <View>
              <Text className={themed('font-semibold text-blue-600', 'font-semibold text-blue-400')}>
                1 Week:
              </Text>
              <Text className={themed('text-gray-700', 'text-gray-300')}>
                {insights.progressPredictions.oneWeek}
              </Text>
            </View>
            <View>
              <Text className={themed('font-semibold text-blue-600', 'font-semibold text-blue-400')}>
                1 Month:
              </Text>
              <Text className={themed('text-gray-700', 'text-gray-300')}>
                {insights.progressPredictions.oneMonth}
              </Text>
            </View>
            <View>
              <Text className={themed('font-semibold text-blue-600', 'font-semibold text-blue-400')}>
                3 Months:
              </Text>
              <Text className={themed('text-gray-700', 'text-gray-300')}>
                {insights.progressPredictions.threeMonths}
              </Text>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 mb-6">
          <Text className="text-xl font-bold text-white mb-2">
            ✨ This is just the beginning!
          </Text>
          <Text className="text-white/90 mb-4">
            With Luna Pro, you'll get daily personalized workouts, cycle-synced meal plans, progress tracking with charts, and AI insights that get smarter every day.
          </Text>
          <Text className="text-2xl font-bold text-white text-center">
            💎 Ready to unlock your full potential?
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}