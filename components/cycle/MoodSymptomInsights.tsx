import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Brain, Heart, TrendingUp, TrendingDown, Calendar } from 'lucide-react-native';

interface MoodSymptomInsightsProps {
  periodLogs?: Array<{
    date: string;
    mood?: 'happy' | 'sad' | 'irritable' | 'anxious' | 'normal';
    symptoms: string[];
    isStartDay: boolean;
  }>;
  onViewFullHistory?: () => void;
}

export function MoodSymptomInsights({
  periodLogs = [],
  onViewFullHistory,
}: MoodSymptomInsightsProps) {
  // Get recent mood trends
  const getRecentMoodTrend = () => {
    const recentLogs = periodLogs.slice(0, 7).reverse(); // Last 7 days
    if (recentLogs.length < 2) return null;

    const moodScores = recentLogs.map((log) => {
      switch (log.mood) {
        case 'happy':
          return 5;
        case 'normal':
          return 3;
        case 'sad':
          return 2;
        case 'irritable':
          return 2;
        case 'anxious':
          return 1;
        default:
          return 3;
      }
    });

    const avgRecent = moodScores.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const avgPrevious =
      moodScores.slice(0, -3).reduce((a, b) => a + b, 0) / (moodScores.length - 3);

    return avgRecent > avgPrevious ? 'improving' : avgRecent < avgPrevious ? 'declining' : 'stable';
  };

  // Get most common symptoms
  const getCommonSymptoms = () => {
    const symptomCounts: { [key: string]: number } = {};

    periodLogs.slice(0, 30).forEach((log) => {
      // Last 30 days
      log.symptoms.forEach((symptom) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
      });
    });

    return Object.entries(symptomCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  // Get cycle pattern insights
  const getCyclePatternInsights = () => {
    const periodStarts = periodLogs.filter((log) => log.isStartDay).slice(0, 3); // Last 3 cycles

    if (periodStarts.length < 2) return null;

    const cycleLengths = [];
    for (let i = 0; i < periodStarts.length - 1; i++) {
      const current = new Date(periodStarts[i].date);
      const previous = new Date(periodStarts[i + 1].date);
      const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      cycleLengths.push(diffDays);
    }

    const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    const isRegular = cycleLengths.every((length) => Math.abs(length - avgCycle) <= 3);

    return { avgCycle, isRegular };
  };

  const moodTrend = getRecentMoodTrend();
  const commonSymptoms = getCommonSymptoms();
  const cyclePattern = getCyclePatternInsights();

  if (periodLogs.length === 0) {
    return (
      <View className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-3">
          <Brain size={18} color="#8B5CF6" />
          <Text className="text-lg font-semibold text-black ml-2">Mood & Symptom Insights</Text>
        </View>
        <Text className="text-gray-600 text-center">
          Start tracking your mood and symptoms to see patterns and get personalized insights
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Brain size={18} color="#8B5CF6" />
          <Text className="text-lg font-semibold text-black ml-2">Your Patterns</Text>
        </View>
        {onViewFullHistory && (
          <TouchableOpacity onPress={onViewFullHistory}>
            <Calendar size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      <View className="space-y-4">
        {/* Mood Trend */}
        {moodTrend && (
          <View className="bg-gray-50 rounded-xl p-3">
            <View className="flex-row items-center mb-2">
              {moodTrend === 'improving' ? (
                <TrendingUp size={16} color="#10B981" />
              ) : moodTrend === 'declining' ? (
                <TrendingDown size={16} color="#EF4444" />
              ) : (
                <Heart size={16} color="#6B7280" />
              )}
              <Text className="font-medium text-gray-900 ml-2">Recent Mood</Text>
            </View>
            <Text className="text-gray-700 text-sm">
              {moodTrend === 'improving'
                ? 'Your mood has been improving lately! 😊'
                : moodTrend === 'declining'
                  ? 'You might be feeling a bit low recently. Consider gentle self-care.'
                  : 'Your mood has been fairly stable recently.'}
            </Text>
          </View>
        )}

        {/* Common Symptoms */}
        {commonSymptoms.length > 0 && (
          <View className="bg-gray-50 rounded-xl p-3">
            <Text className="font-medium text-gray-900 mb-2">Most Common Symptoms</Text>
            <View className="flex-row flex-wrap">
              {commonSymptoms.map(([symptom, count], index) => (
                <View
                  key={symptom}
                  className="bg-white px-2 py-1 rounded-lg mr-2 mb-1 border border-gray-200"
                >
                  <Text className="text-gray-700 text-sm">
                    {symptom} ({count})
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Cycle Regularity */}
        {cyclePattern && (
          <View className="bg-gray-50 rounded-xl p-3">
            <Text className="font-medium text-gray-900 mb-2">Cycle Pattern</Text>
            <Text className="text-gray-700 text-sm">
              {cyclePattern.isRegular
                ? `Your cycle is regular at ${cyclePattern.avgCycle} days ✨`
                : `Your cycle varies around ${cyclePattern.avgCycle} days. This is normal!`}
            </Text>
          </View>
        )}

        {/* Recommendations */}
        <View className="bg-purple-50 rounded-xl p-3 border border-purple-200">
          <Text className="font-medium text-purple-900 mb-2">💡 Insight</Text>
          <Text className="text-purple-700 text-sm">
            {commonSymptoms.some(([symptom]) => symptom.toLowerCase().includes('mood'))
              ? 'Track your mood daily to identify patterns with your cycle phases.'
              : commonSymptoms.some(([symptom]) => symptom.toLowerCase().includes('cramp'))
                ? 'Try gentle exercise and heat therapy during your period for cramp relief.'
                : 'Consistent tracking helps you understand your unique cycle patterns.'}
          </Text>
        </View>
      </View>
    </View>
  );
}
