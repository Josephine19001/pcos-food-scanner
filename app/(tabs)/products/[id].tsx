import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { SubPageLayout } from '@/components/layouts';
import products from '@/mock/products.json';
import { useLocalSearchParams } from 'expo-router';
import { Bookmark, MoreVertical } from 'lucide-react-native';
import { useState } from 'react';
import { Accordion } from '@/components/ui';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!product) return null;

  return (
    <SubPageLayout
      title="Selected Product"
      rightElement={
        <View className="flex-row items-center">
          <Pressable onPress={() => setIsBookmarked(!isBookmarked)} className="mr-2 p-2">
            <Bookmark size={24} color="#000" fill={isBookmarked ? '#000' : 'none'} />
          </Pressable>
          {/* <Pressable className="p-2 bg-slate-100 rounded-full">
            <MoreVertical size={24} color="#000" />
          </Pressable> */}
        </View>
      }
    >
      <ScrollView className="flex-1">
        <View className="px-6">
          <Text className="text-2xl font-semibold mb-6">{product.name}</Text>

          <View />

          {/* Key Info */}
          <View className="bg-slate-100 p-4 rounded-2xl mb-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg font-medium">Key Information</Text>
            </View>
            <View className="flex-row flex-wrap gap-4">
              <View className="bg-black p-4 rounded-xl flex-1">
                <Text className="text-gray-400 mb-1">Type</Text>
                <Text className="text-white text-base">{product.type}</Text>
              </View>
              <View className="bg-white p-4 rounded-xl flex-1">
                <Text className="text-gray-600 mb-1">Brand</Text>
                <Text className="text-base">{product.brand}</Text>
              </View>
              <View className="bg-white p-4 rounded-xl flex-1">
                <Text className="text-gray-600 mb-1">Size</Text>
                <Text className="text-base">{product.size}</Text>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-xl mb-4">Ingredients</Text>
            <View className="bg-slate-100 rounded-2xl overflow-hidden ">
              {product.ingredients.map((ing, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <Accordion key={index} title={ing.name}>
                  <View className="space-y-2">
                    <View className="flex-row">
                      <Text className="text-gray-600 flex-1">Purpose</Text>
                      <Text className="text-gray-900 flex-1">{ing.purpose}</Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-gray-600 flex-1">Effect</Text>
                      <Text className="text-gray-900 flex-1">{ing.effect}</Text>
                    </View>
                  </View>
                </Accordion>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-xl mb-4 font-semibold">Other Facts</Text>
            <View className="flex flex-col gap-2 rounded-2xl">
              {[
                { label: 'Sulfate Free', value: product.sulfate_free },
                { label: 'Silicone Free', value: product.silicone_free },
                { label: 'Cruelty Free', value: product.cruelty_free },
                { label: 'Made in', value: product.made_in },
              ].map((fact, index) => (
                <View
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className="flex-row justify-between items-center p-4  bg-slate-100 rounded-xl"
                >
                  <Text className="text-base">{fact.label}</Text>
                  <Text className="text-base">
                    {typeof fact.value === 'boolean' ? (fact.value ? 'Yes' : 'No') : fact.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SubPageLayout>
  );
}
