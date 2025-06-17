import { View, Text } from 'react-native';
import { ScannedProductUI } from '@/lib/types/product';
import { IngredientCard } from './IngredientCard';

interface IngredientsSectionProps {
  product: ScannedProductUI;
}

export function IngredientsSection({ product }: IngredientsSectionProps) {
  return (
    <View className="px-6 mb-6">
      <Text className="text-xl font-bold text-black mb-4">What's Inside</Text>
      {(product.keyIngredients || []).length > 0 ? (
        (product.keyIngredients || []).map((ingredient, index) => (
          <IngredientCard key={index} ingredient={ingredient} />
        ))
      ) : (
        <View className="bg-gray-50 rounded-2xl p-6 items-center">
          <Text className="text-gray-500 text-center">
            No ingredient details available for this product
          </Text>
        </View>
      )}
    </View>
  );
}
