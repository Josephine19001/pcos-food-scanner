import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Moon, TrendingUp, Sun, Heart, Droplets, Brain, Sparkles } from 'lucide-react-native';
import { useCurrentCyclePhase } from '@/lib/hooks/use-cycle-settings';

interface CycleDashboardProps {
  onNavigateToTracker: () => void;
}

export function CycleDashboard({ onNavigateToTracker }: CycleDashboardProps) {
  const { data: currentPhase } = useCurrentCyclePhase();

  const getPhaseIcon = () => {
    if (!currentPhase) return Moon;
    switch (currentPhase.phase) {
      case 'menstrual':
        return Moon;
      case 'follicular':
        return TrendingUp;
      case 'ovulatory':
        return Sun;
      case 'luteal':
        return Moon;
      default:
        return Moon;
    }
  };

  const getPhaseColor = () => {
    if (!currentPhase) return '#6B7280';
    switch (currentPhase.phase) {
      case 'menstrual':
        return '#DC2626';
      case 'follicular':
        return '#059669';
      case 'ovulatory':
        return '#F59E0B';
      case 'luteal':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getDailyInsights = () => {
    if (!currentPhase) return [];

    const baseInsights = {
      menstrual: [
        { icon: Heart, text: 'Be gentle with yourself today', color: '#DC2626' },
        { icon: Droplets, text: 'Stay hydrated & use heat therapy', color: '#059669' },
        { icon: Brain, text: 'Your skin may be more sensitive', color: '#8B5CF6' },
      ],
      follicular: [
        { icon: Sparkles, text: 'Great time to try new products', color: '#059669' },
        { icon: TrendingUp, text: 'Energy levels are rising', color: '#F59E0B' },
        { icon: Brain, text: 'Your skin is becoming more resilient', color: '#059669' },
      ],
      ovulatory: [
        { icon: Sun, text: 'Your skin is at its most glowing', color: '#F59E0B' },
        { icon: Sparkles, text: 'Perfect time for active ingredients', color: '#F59E0B' },
        { icon: Heart, text: 'You may need oil control products', color: '#F97316' },
      ],
      luteal: [
        { icon: Moon, text: 'Focus on calming, anti-inflammatory products', color: '#8B5CF6' },
        { icon: Brain, text: 'Your skin may become more reactive', color: '#EF4444' },
        { icon: Heart, text: 'Time to prep for your next cycle', color: '#8B5CF6' },
      ],
    };

    return baseInsights[currentPhase.phase] || [];
  };

  const PhaseIcon = getPhaseIcon();
  const phaseColor = getPhaseColor();
  const dailyInsights = getDailyInsights();

  if (!currentPhase) {
    return (
      <View className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-semibold text-black mb-2">Start Cycle Tracking</Text>
        <Text className="text-gray-600 mb-4">
          Track your cycle to get personalized beauty and wellness insights
        </Text>
        <TouchableOpacity
          onPress={onNavigateToTracker}
          className="bg-pink-500 py-3 px-4 rounded-xl"
        >
          <Text className="text-white font-semibold text-center">Get Started</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="mx-4 mb-4">
      {/* Current Phase Card */}
      <TouchableOpacity
        onPress={onNavigateToTracker}
        className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: `${phaseColor}20` }}
            >
              <PhaseIcon size={20} color={phaseColor} />
            </View>
            <View className="ml-3">
              <Text className="text-lg font-semibold text-black">{currentPhase.name}</Text>
              <Text className="text-gray-600 text-sm">
                Day {currentPhase.day_in_cycle} • {currentPhase.days_remaining} days left
              </Text>
            </View>
          </View>
          <View className="px-3 py-1 rounded-full" style={{ backgroundColor: `${phaseColor}10` }}>
            <Text className="font-medium text-sm" style={{ color: phaseColor }}>
              {currentPhase.energy_level}
            </Text>
          </View>
        </View>

        <Text className="text-gray-700 text-sm mb-3">{currentPhase.description}</Text>

        {/* Exercise Recommendations */}
        {currentPhase.recommended_exercises && currentPhase.recommended_exercises.length > 0 && (
          <View className="bg-gray-50 rounded-xl p-3">
            <Text className="font-medium text-gray-900 mb-2">Today's Exercise</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {currentPhase.recommended_exercises.slice(0, 3).map((exercise, index) => (
                  <View
                    key={index}
                    className="bg-white px-3 py-2 rounded-lg mr-2 border border-gray-200"
                  >
                    <Text className="text-gray-700 text-sm">{exercise}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </TouchableOpacity>

      {/* Daily Insights */}
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <Text className="text-lg font-semibold text-black mb-3">Today's Insights</Text>
        <View className="space-y-3">
          {dailyInsights.map((insight, index) => {
            const InsightIcon = insight.icon;
            return (
              <View key={index} className="flex-row items-center">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${insight.color}20` }}
                >
                  <InsightIcon size={16} color={insight.color} />
                </View>
                <Text className="text-gray-700 flex-1">{insight.text}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={onNavigateToTracker}
          className="mt-4 py-2 px-4 bg-gray-100 rounded-xl"
        >
          <Text className="text-gray-700 font-medium text-center text-sm">
            View Full Cycle Calendar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
