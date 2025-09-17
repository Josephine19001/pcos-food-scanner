import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemedStyles } from '@/lib/utils/theme';
import { ChefHat, Sparkles, TrendingUp, Timer } from 'lucide-react-native';
import { useCurrentMealPlan, useLatestMealPlan, useGenerateMealPlan } from '@/lib/hooks/use-meal-plans';
import { toast } from 'sonner-native';

interface MealPlansSectionProps {
  onShowPlanModal: () => void;
  onShowMealPlan: (plan: any) => void;
  onMealPlanGenerated: (plan: any) => void;
}

export default function MealPlansSection({
  onShowPlanModal,
  onShowMealPlan,
  onMealPlanGenerated,
}: MealPlansSectionProps) {
  const themed = useThemedStyles();
  const { data: currentMealPlan, isLoading: isCurrentMealPlanLoading } = useCurrentMealPlan();
  const { data: latestMealPlan } = useLatestMealPlan();
  const generateMealPlan = useGenerateMealPlan();
  const [hasShownNewPlanToast, setHasShownNewPlanToast] = useState(false);

  // Show toast when new meal plan is ready and automatically trigger callback
  useEffect(() => {
    if (latestMealPlan && !hasShownNewPlanToast) {
      const planCreatedAt = new Date(latestMealPlan.created_at);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      // Only show toast for recently created plans
      if (planCreatedAt > fiveMinutesAgo) {
        toast.success('🍽️ Your meal plan is ready!', {
          description: 'Tap to view your personalized meals and grocery list',
          action: {
            label: 'View Plan',
            onClick: () => onMealPlanGenerated(latestMealPlan),
          },
        });
        setHasShownNewPlanToast(true);
        
        // Auto-trigger callback when meal plan is ready
        onMealPlanGenerated(latestMealPlan);
      }
    }
  }, [latestMealPlan, hasShownNewPlanToast, onMealPlanGenerated]);


  // Show loading state when generating or loading current plan after generation
  const isLoadingMealPlan = generateMealPlan.isPending || (generateMealPlan.isSuccess && isCurrentMealPlanLoading);

  if (currentMealPlan) {
    return (
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => onShowMealPlan(currentMealPlan)}
          className={themed(
            'flex-1 bg-white rounded-xl p-4 border border-gray-100 flex-row items-center justify-center',
            'flex-1 bg-gray-800 rounded-xl p-4 border border-gray-700 flex-row items-center justify-center'
          )}
          activeOpacity={0.8}
        >
          <ChefHat size={18} color="#10B981" />
          <Text className={themed('font-semibold text-gray-900 ml-2', 'font-semibold text-white ml-2')}>
            View All Meal Plans
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShowPlanModal}
          className={themed(
            'bg-green-500 rounded-xl p-4 flex-row items-center justify-center',
            'bg-green-600 rounded-xl p-4 flex-row items-center justify-center'
          )}
          activeOpacity={0.8}
        >
          <Sparkles size={18} color="white" />
          <Text className="font-semibold text-white ml-2">
            New Plan
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No current meal plan - show generate button
  return (
    <TouchableOpacity
      onPress={onShowPlanModal}
      disabled={isLoadingMealPlan}
      className="rounded-2xl p-4"
      style={{
        backgroundColor: isLoadingMealPlan ? '#9CA3AF' : '#10B981',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      }}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Sparkles size={20} color="white" />
            <Text className="text-lg font-bold ml-3" style={{ color: '#FFFFFF' }}>
              {isLoadingMealPlan
                ? 'Creating Your Plan...'
                : 'Generate Meal Plan'}
            </Text>
          </View>

          <Text className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {isLoadingMealPlan
              ? 'We are creating your personalized meal plan and grocery list...'
              : 'Get personalized meal plans with cycle-synced nutrition and auto-generated grocery lists'}
          </Text>
        </View>

        <View className="ml-4">
          {isLoadingMealPlan ? (
            <View className="animate-spin">
              <Timer size={24} color="white" />
            </View>
          ) : (
            <TrendingUp size={24} color="white" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
