import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Bookmark } from 'lucide-react-native';
import type { Product } from '@/lib/types/product';
import { router } from 'expo-router';

type ProductItemProps = {
  product: Product;
};

export default function ProductItem({ product }: ProductItemProps) {
  return (
    <Pressable
      onPress={() => router.push(`/products/${product.id}`)}
      className="flex-row justify-between items-center p-4 bg-white rounded-2xl mb-3"
    >
      <View className="flex-1">
        <Text className="text-lg font-medium mb-1">{product.name}</Text>
        <Text className="text-gray-500">{product.brand}</Text>
        <Text className="text-gray-500">{product.size}</Text>
      </View>
      <Pressable
        onPress={() => {
          /* Handle bookmark */
        }}
        className="p-2"
      >
        <Bookmark size={24} color="#000" />
      </Pressable>
    </Pressable>
  );
}
