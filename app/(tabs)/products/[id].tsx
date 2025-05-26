import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { ArrowLeft, MoreVertical, Bookmark } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import products from '@/mock/products.json';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) return null;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <ArrowLeft size={24} />
        </Pressable>
        <Text className="text-xl font-semibold">Selected food</Text>
        <Pressable className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
          <MoreVertical size={24} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Title */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-semibold">{product.name}</Text>
          <Pressable>
            <Bookmark size={24} />
          </Pressable>
        </View>

        {/* Product Info */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-lg font-medium mb-2">Product Details</Text>
          <View className="space-y-2">
            <InfoRow label="Brand" value={product.brand} />
            <InfoRow label="Type" value={product.type} />
            <InfoRow label="Size" value={product.size} />
            <InfoRow label="Made in" value={product.made_in} />
          </View>
        </View>

        {/* Features */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-lg font-medium mb-2">Features</Text>
          <View className="space-y-2">
            <InfoRow label="Sulfate Free" value={product.sulfate_free ? 'Yes' : 'No'} />
            <InfoRow label="Silicone Free" value={product.silicone_free ? 'Yes' : 'No'} />
            <InfoRow label="Cruelty Free" value={product.cruelty_free ? 'Yes' : 'No'} />
          </View>
        </View>

        {/* Ingredients */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-lg font-medium mb-2">Ingredients</Text>
          {product.ingredients.map((ingredient, index) => (
            <View key={index} className="mb-3">
              <Text className="font-medium">{ingredient.name}</Text>
              <Text className="text-gray-500">{ingredient.effect}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-gray-500">{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}
