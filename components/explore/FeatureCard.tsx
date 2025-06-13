import { View, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';

export interface Feature {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  image: any;
}

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <TouchableOpacity
      onPress={() => router.push('/scan')}
      className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-2xl font-bold text-black mb-2">{feature.title}</Text>
          <Text className="text-gray-600 text-lg mb-4 leading-6">{feature.subtitle}</Text>
          <TouchableOpacity
            className="self-start rounded-2xl px-6 py-3"
            style={{ backgroundColor: feature.color }}
            onPress={() => router.push('/scan')}
          >
            <View className="flex-row items-center">
              <feature.icon size={20} color="white" />
              <Text className="text-white font-semibold text-base ml-2">Start Scan</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="relative">
          <View
            className="w-32 h-32 rounded-2xl items-center justify-center"
            style={{ backgroundColor: feature.bgColor }}
          >
            <Image source={feature.image} className="w-20 h-20 rounded-xl" resizeMode="cover" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
