import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  Heart,
  Shield,
  AlertTriangle,
  Info,
  Baby,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sun,
  Moon,
  Calendar,
} from 'lucide-react-native';
import cycleInsights from '@/data/cycle-insights.json';

interface FertilityWindowProps {
  selectedDate: Date;
  cyclePhase?: {
    phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
    day_in_cycle: number;
    cycle_length: number;
  };
  isLoading?: boolean;
}

export function FertilityWindow({ selectedDate, cyclePhase, isLoading }: FertilityWindowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPhaseData = () => {
    if (!cyclePhase) return null;
    return cycleInsights[cyclePhase.phase];
  };

  const getPregnancyChanceColor = (chance: string) => {
    switch (chance) {
      case 'Very Low':
        return '#10B981';
      case 'Low':
        return '#3B82F6';
      case 'Medium':
        return '#F59E0B';
      case 'High':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getPregnancyIcon = (chance: string) => {
    switch (chance) {
      case 'Very Low':
        return Shield;
      case 'Low':
        return Shield;
      case 'Medium':
        return AlertTriangle;
      case 'High':
        return Baby;
      default:
        return Info;
    }
  };

  if (isLoading) {
    return (
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">What to Expect</Text>
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <View className="animate-pulse">
            <View className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <View className="h-3 bg-gray-200 rounded w-1/3" />
          </View>
        </View>
      </View>
    );
  }

  const phaseData = getPhaseData();

  // Show "No cycle data" when there's no phase information
  if (!phaseData) {
    return (
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">What to Expect</Text>
        <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <View className="items-center py-8">
            <Calendar size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-center text-lg font-medium mt-4 mb-2">
              No cycle data
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Start logging your period to see what to expect
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="mx-4 mb-6">
      <Text className="text-xl font-bold text-gray-900 mb-4">What to Expect</Text>

      <View className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100">
        {/* Main Cards in Row */}
        <View className="flex-row" style={{ gap: 12 }}>
          {/* What to Expect Card */}
          <View className="flex-1 bg-pink-50 rounded-2xl p-4">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-pink-100 rounded-full items-center justify-center">
                <Sparkles size={16} color="#EC4899" />
              </View>
              <Text className="text-pink-900 font-bold text-sm ml-2">Today's Vibe</Text>
            </View>
            <Text className="text-pink-800 text-sm font-medium leading-5">
              {phaseData.what_to_expect}
            </Text>
          </View>

          {/* Pregnancy Chance Card */}
          <View
            className="flex-1 rounded-2xl p-4"
            style={{ backgroundColor: `${getPregnancyChanceColor(phaseData.pregnancy_chance)}20` }}
          >
            <View className="flex-row items-center mb-3">
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{
                  backgroundColor: `${getPregnancyChanceColor(phaseData.pregnancy_chance)}30`,
                }}
              >
                {React.createElement(getPregnancyIcon(phaseData.pregnancy_chance), {
                  size: 16,
                  color: getPregnancyChanceColor(phaseData.pregnancy_chance),
                })}
              </View>
              <Text
                className="font-bold text-sm ml-2"
                style={{ color: getPregnancyChanceColor(phaseData.pregnancy_chance) }}
              >
                Pregnancy
              </Text>
            </View>
            <Text
              className="text-sm font-bold"
              style={{ color: getPregnancyChanceColor(phaseData.pregnancy_chance) }}
            >
              {phaseData.pregnancy_chance}
            </Text>
          </View>
        </View>

        {/* Expandable Section */}
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          className="flex-row items-center justify-center py-4 mt-3"
          style={{ backgroundColor: '#FDF2F8', borderRadius: 16, marginTop: 16 }}
        >
          <Text className="text-pink-600 text-sm font-medium mr-2">
            {isExpanded ? 'Show less' : 'More insights'}
          </Text>
          {isExpanded ? (
            <ChevronUp size={16} color="#EC4899" />
          ) : (
            <ChevronDown size={16} color="#EC4899" />
          )}
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <View className="mt-4">
            {/* Tips Card */}
            <View className="bg-purple-50 rounded-2xl p-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
                  <Heart size={16} color="#8B5CF6" />
                </View>
                <Text className="text-purple-900 font-bold text-sm ml-2">
                  {phaseData.name} Tips
                </Text>
              </View>
              <Text className="text-purple-800 text-sm">{phaseData.quick_tips}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
