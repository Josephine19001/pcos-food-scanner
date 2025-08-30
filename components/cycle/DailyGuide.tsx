import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  Moon,
  TrendingUp,
  Sun,
  Heart,
  Sparkles,
  Shield,
  Coffee,
  Activity,
  Droplets,
  Brain,
} from 'lucide-react-native';
import { useCurrentCyclePhase } from '@/lib/hooks/use-cycle-settings';

interface DailyGuideProps {
  onNavigateToProduct?: (category: string) => void;
}

export function DailyGuide({ onNavigateToProduct }: DailyGuideProps) {
  const { data: currentPhase } = useCurrentCyclePhase();

  if (!currentPhase) {
    return null;
  }

  const getPhaseRecommendations = () => {
    const phaseData = {
      menstrual: {
        color: '#DC2626',
        icon: Moon,
        title: 'Nurture & Restore',
        skincare: [
          { icon: Heart, text: 'Use gentle, fragrance-free cleansers', category: 'cleanser' },
          { icon: Droplets, text: 'Hydrating masks for comfort', category: 'mask' },
          { icon: Shield, text: 'Barrier repair creams', category: 'moisturizer' },
        ],
        lifestyle: [
          { icon: Coffee, text: 'Warm herbal teas instead of caffeine' },
          { icon: Activity, text: 'Gentle yoga or light stretching' },
          { icon: Brain, text: 'Extra sleep for hormone recovery' },
        ],
        avoid: ['Harsh exfoliants', 'Strong actives', 'Heavy fragrance'],
      },
      follicular: {
        color: '#059669',
        icon: TrendingUp,
        title: 'Energize & Experiment',
        skincare: [
          { icon: Sparkles, text: 'Perfect time for vitamin C serums', category: 'serum' },
          { icon: TrendingUp, text: 'Light exfoliation 2-3x week', category: 'exfoliant' },
          { icon: Sun, text: 'Lightweight, SPF-rich moisturizers', category: 'sunscreen' },
        ],
        lifestyle: [
          { icon: Activity, text: 'High-energy workouts feel great' },
          { icon: Brain, text: 'Try new hobbies or challenges' },
          { icon: Coffee, text: 'Your energy is naturally high' },
        ],
        avoid: ['Over-doing active ingredients', 'Skipping sunscreen'],
      },
      ovulatory: {
        color: '#F59E0B',
        icon: Sun,
        title: 'Glow & Control',
        skincare: [
          { icon: Sparkles, text: 'Retinoids work best now', category: 'treatment' },
          { icon: Sun, text: 'Oil-control cleansers', category: 'cleanser' },
          { icon: Shield, text: 'Niacinamide for pore control', category: 'serum' },
        ],
        lifestyle: [
          { icon: Activity, text: 'Peak performance for intense workouts' },
          { icon: Brain, text: 'Schedule important meetings' },
          { icon: Droplets, text: 'Extra hydration for glowing skin' },
        ],
        avoid: ['Heavy oils', 'Over-moisturizing T-zone'],
      },
      luteal: {
        color: '#8B5CF6',
        icon: Moon,
        title: 'Calm & Prepare',
        skincare: [
          { icon: Shield, text: 'Anti-inflammatory ingredients', category: 'treatment' },
          { icon: Heart, text: 'Soothing face masks', category: 'mask' },
          { icon: Brain, text: 'Gentle, non-comedogenic products', category: 'moisturizer' },
        ],
        lifestyle: [
          { icon: Activity, text: 'Moderate exercise, avoid overexertion' },
          { icon: Coffee, text: 'Limit caffeine for better sleep' },
          { icon: Brain, text: 'Focus on stress management' },
        ],
        avoid: ['New products', 'Harsh treatments', 'Stress triggers'],
      },
    };

    return phaseData[currentPhase.phase as keyof typeof phaseData];
  };

  const recommendations = getPhaseRecommendations();
  if (!recommendations) return null;

  const PhaseIcon = recommendations.icon;

  return (
    <View className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-sm border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${recommendations.color}20` }}
        >
          <PhaseIcon size={20} color={recommendations.color} />
        </View>
        <View>
          <Text className="text-lg font-semibold text-black">{recommendations.title}</Text>
          <Text className="text-gray-600 text-sm">
            Today's {currentPhase.name.toLowerCase()} guide
          </Text>
        </View>
      </View>

      {/* Skincare Recommendations */}
      <View className="mb-4">
        <Text className="font-medium text-gray-900 mb-3">✨ Skincare Focus</Text>
        <View className="space-y-2">
          {recommendations.skincare.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onNavigateToProduct?.(item.category || 'skincare')}
                className="flex-row items-center p-3 bg-gray-50 rounded-xl"
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${recommendations.color}20` }}
                >
                  <ItemIcon size={14} color={recommendations.color} />
                </View>
                <Text className="text-gray-700 flex-1">{item.text}</Text>
                <Text className="text-gray-400 text-xs">Tap to shop</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Lifestyle Tips */}
      <View className="mb-4">
        <Text className="font-medium text-gray-900 mb-3">🌿 Lifestyle</Text>
        <View className="space-y-2">
          {recommendations.lifestyle.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <View key={index} className="flex-row items-center p-2">
                <View
                  className="w-6 h-6 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${recommendations.color}20` }}
                >
                  <ItemIcon size={12} color={recommendations.color} />
                </View>
                <Text className="text-gray-700 flex-1">{item.text}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* What to Avoid */}
      <View
        className="p-3 rounded-xl border"
        style={{
          backgroundColor: '#FEF2F2',
          borderColor: '#FECACA',
        }}
      >
        <Text className="font-medium text-red-900 mb-2">⚠️ Avoid Today</Text>
        <View className="flex-row flex-wrap">
          {recommendations.avoid.map((item, index) => (
            <View
              key={index}
              className="bg-white px-2 py-1 rounded-lg mr-2 mb-1 border border-red-200"
            >
              <Text className="text-red-700 text-sm">{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Phase Progress */}
      <View className="mt-4 pt-4 border-t border-gray-100">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-600 text-sm">
            Day {currentPhase.day_in_cycle} of {currentPhase.name}
          </Text>
          <Text className="text-gray-500 text-xs">
            {currentPhase.days_remaining} days remaining
          </Text>
        </View>
        <View className="mt-2 bg-gray-200 rounded-full h-2">
          <View
            className="h-2 rounded-full"
            style={{
              backgroundColor: recommendations.color,
              width: `${((currentPhase.day_in_cycle || 1) / 28) * 100}%`,
            }}
          />
        </View>
      </View>
    </View>
  );
}
