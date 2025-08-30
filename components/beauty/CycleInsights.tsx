import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Heart, AlertTriangle, Shield, CheckCircle } from 'lucide-react-native';
import { ScannedProductUI } from '@/lib/types/product';

interface CycleInsightsProps {
  product: ScannedProductUI;
}

export function CycleInsights({ product }: CycleInsightsProps) {
  // Simplified - just show if it's good or concerning for women's health
  if (!product.hormoneImpact && !product.keyIngredients) {
    return null;
  }

  // Simple categorization of ingredients
  const goodIngredients = product.keyIngredients?.filter((ing) => ing.type === 'beneficial') || [];
  const concerningIngredients =
    product.keyIngredients?.filter((ing) => ing.type === 'harmful') || [];

  const hasHormoneIssues =
    product.hormoneImpact?.mayWorsenPms || product.hormoneImpact?.mayCauseBreakouts;

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-3">
        <Heart size={18} color="#EC4899" />
        <Text className="text-lg font-semibold text-black ml-2">Women's Health</Text>
      </View>

      {/* Overall Safety for Women */}
      <View className="mb-4">
        <View
          className={`p-3 rounded-xl border ${
            hasHormoneIssues ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
          }`}
        >
          <View className="flex-row items-center mb-2">
            {hasHormoneIssues ? (
              <AlertTriangle size={16} color="#F97316" />
            ) : (
              <CheckCircle size={16} color="#10B981" />
            )}
            <Text
              className={`font-semibold ml-2 ${
                hasHormoneIssues ? 'text-orange-700' : 'text-green-700'
              }`}
            >
              {hasHormoneIssues ? 'Use with caution' : 'Generally safe for women'}
            </Text>
          </View>
          <Text className={`text-sm ${hasHormoneIssues ? 'text-orange-600' : 'text-green-600'}`}>
            {hasHormoneIssues
              ? 'Contains ingredients that may affect hormones or worsen PMS'
              : "No concerning ingredients for women's hormonal health detected"}
          </Text>
        </View>
      </View>

      {/* Specific Concerns */}
      {hasHormoneIssues && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-600 mb-2">Specific concerns:</Text>
          <View className="space-y-2">
            {product.hormoneImpact?.mayWorsenPms && (
              <View className="flex-row items-center p-2 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle size={14} color="#EF4444" />
                <Text className="text-red-700 text-sm ml-2">May worsen PMS symptoms</Text>
              </View>
            )}
            {product.hormoneImpact?.mayCauseBreakouts && (
              <View className="flex-row items-center p-2 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle size={14} color="#F97316" />
                <Text className="text-orange-700 text-sm ml-2">May trigger hormonal breakouts</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Good Ingredients */}
      {goodIngredients.length > 0 && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-600 mb-2">✅ Good ingredients:</Text>
          <View className="flex-row flex-wrap gap-1">
            {goodIngredients.slice(0, 3).map((ingredient, index) => (
              <View
                key={index}
                className="bg-green-50 px-2 py-1 rounded-lg border border-green-200"
              >
                <Text className="text-green-700 text-xs font-medium">{ingredient.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Concerning Ingredients */}
      {concerningIngredients.length > 0 && (
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-600 mb-2">⚠️ Watch out for:</Text>
          <View className="flex-row flex-wrap gap-1">
            {concerningIngredients.slice(0, 3).map((ingredient, index) => (
              <View key={index} className="bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                <Text className="text-red-700 text-xs font-medium">{ingredient.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text className="text-gray-400 text-xs mt-2 text-center">
        Analysis focused on women's hormonal health and sensitive skin
      </Text>
    </View>
  );
}
