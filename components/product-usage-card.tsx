import { View } from 'react-native';
import { Text } from '@/components/ui/text';

type ProductUsageCardProps = {
  name: string;
  brand: string;
  type: string;
  amountUsed: number;
  amountLeft: number;
};

export function ProductUsageCard({
  name,
  brand,
  type,
  amountUsed,
  amountLeft,
}: ProductUsageCardProps) {
  return (
    <View className="bg-white p-4 rounded-2xl">
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-base font-medium">{name}</Text>
          <Text className="text-sm text-gray-600">
            {brand} · {type}
          </Text>
        </View>
        <Text className="text-sm text-gray-600">{amountLeft}% left</Text>
      </View>

      {/* Progress Bar */}
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View className="h-full bg-black rounded-full" style={{ width: `${amountLeft}%` }} />
      </View>

      <Text className="text-sm text-gray-600 mt-2">Used {amountUsed}ml this session</Text>
    </View>
  );
}
