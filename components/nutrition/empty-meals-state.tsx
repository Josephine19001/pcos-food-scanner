import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Utensils } from 'lucide-react-native';

export const EmptyMealsState = ({ onAddMealPress }: { onAddMealPress?: () => void }) => (
  <View className="bg-white rounded-2xl p-8 items-center shadow-sm border border-gray-50">
    <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
      <Utensils size={24} color="#9CA3AF" />
    </View>
    <Text className="text-gray-500 text-center mb-2">No meals logged today</Text>
    <TouchableOpacity onPress={onAddMealPress} className="bg-green-500 px-4 py-2 rounded-xl">
      <Text className="text-white font-medium">Log Your First Meal</Text>
    </TouchableOpacity>
  </View>
);
