import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemedStyles } from '@/lib/utils/theme';

interface FoodGroupSelectionProps {
  selectedFoodGroups: string[];
  toggleFoodGroup: (group: string) => void;
}

const foodGroups = [
  'Proteins',
  'Whole Grains',
  'Leafy Greens',
  'Fruits',
  'Healthy Fats',
  'Dairy/Alternatives',
  'Legumes',
  'Nuts & Seeds',
];

export default function FoodGroupSelection({
  selectedFoodGroups,
  toggleFoodGroup,
}: FoodGroupSelectionProps) {
  const themed = useThemedStyles();

  return (
    <View className="mb-6">
      <Text
        className={themed(
          'text-lg font-semibold text-gray-900 mb-3',
          'text-lg font-semibold text-white mb-3'
        )}
      >
        Nutritional Focus
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {foodGroups.map((group) => (
          <TouchableOpacity
            key={group}
            onPress={() => toggleFoodGroup(group)}
            className={`px-4 py-2 rounded-full border ${
              selectedFoodGroups.includes(group)
                ? themed('bg-green-50 border-green-200', 'bg-green-900/20 border-green-600')
                : themed('bg-white border-gray-200', 'bg-gray-800 border-gray-600')
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedFoodGroups.includes(group)
                  ? themed('text-green-700', 'text-green-300')
                  : themed('text-gray-700', 'text-gray-300')
              }`}
            >
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
