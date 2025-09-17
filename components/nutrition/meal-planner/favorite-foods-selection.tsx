import React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemedStyles } from '@/lib/utils/theme';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/context/theme-provider';

interface FavoriteFood {
  id: string;
  food_name: string;
  category?: string;
}

interface FavoriteFoodsSelectionProps {
  favoriteFoods: FavoriteFood[];
  selectedFavoriteFoods: string[];
  toggleFavoriteFood: (foodId: string) => void;
  isLoading: boolean;
}

export default function FavoriteFoodsSelection({
  favoriteFoods,
  selectedFavoriteFoods,
  toggleFavoriteFood,
  isLoading,
}: FavoriteFoodsSelectionProps) {
  const themed = useThemedStyles();
  const { isDark } = useTheme();

  const renderFavoriteFood = ({ item }: { item: FavoriteFood }) => {
    const isSelected = selectedFavoriteFoods.includes(item.id);
    
    return (
      <TouchableOpacity
        onPress={() => toggleFavoriteFood(item.id)}
        className={`flex-row items-center p-3 rounded-lg border mb-2 ${
          isSelected
            ? themed('bg-green-50 border-green-200', 'bg-green-900/20 border-green-600')
            : themed('bg-white border-gray-200', 'bg-gray-800 border-gray-600')
        }`}
      >
        <View className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
          isSelected
            ? 'bg-green-500 border-green-500'
            : themed('border-gray-300', 'border-gray-600')
        }`}>
          {isSelected && <Check size={12} color="#FFFFFF" />}
        </View>
        
        <View className="flex-1">
          <Text className={themed("font-medium text-gray-900", "font-medium text-white")}>
            {item.food_name}
          </Text>
          {item.category && (
            <Text className={themed("text-sm text-gray-600", "text-sm text-gray-400")}>
              {item.category}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-6">
      <Text className={themed("text-lg font-semibold text-gray-900 mb-3", "text-lg font-semibold text-white mb-3")}>
        Include Favorite Foods
      </Text>
      
      {isLoading ? (
        <Text className={themed("text-gray-600", "text-gray-400")}>Loading favorite foods...</Text>
      ) : favoriteFoods.length === 0 ? (
        <View className={themed("p-4 bg-gray-50 rounded-lg border border-gray-200", "p-4 bg-gray-800 rounded-lg border border-gray-600")}>
          <Text className={themed("text-gray-600 text-center", "text-gray-400 text-center")}>
            No favorite foods saved yet
          </Text>
        </View>
      ) : (
        <View className="max-h-48">
          <FlatList
            data={favoriteFoods}
            renderItem={renderFavoriteFood}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          />
        </View>
      )}
      
      {selectedFavoriteFoods.length > 0 && (
        <Text className={themed("text-sm text-green-600 mt-2", "text-sm text-green-400 mt-2")}>
          {selectedFavoriteFoods.length} favorite food{selectedFavoriteFoods.length > 1 ? 's' : ''} selected
        </Text>
      )}
    </View>
  );
}