import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SpecialOfferScreen() {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="flex-row justify-end">
        <X size={24} onPress={() => router.back()} />
      </View>

      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold mb-8">ONE TIME OFFER</Text>

        <View className="bg-black rounded-xl p-6 mb-8 w-full">
          <Text className="text-white text-4xl font-bold text-center">80% OFF</Text>
          <Text className="text-white text-xl text-center">FOREVER</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Text className="text-2xl line-through mr-2">$34.99</Text>
          <Text className="text-2xl">1.91 € /month</Text>
        </View>

        <View className="w-full space-y-4">
          <Button 
            className="w-full py-4 bg-black rounded-xl"
            onPress={() => {/* Handle subscription */}}
            label="CLAIM YOUR ONE TIME OFFER"
          />

          <Text className="text-center text-sm text-gray-600">
            Cancel anytime • Money back guarantee
          </Text>
        </View>
      </View>
    </View>
  );
} 