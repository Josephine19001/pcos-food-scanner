import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ArrowUp, ArrowDown } from 'lucide-react-native';

type ProgressCardProps = {
  title: string;
  value: string;
  change: string;
  period: string;
};

export function ProgressCard({ title, value, change, period }: ProgressCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <View className="flex-1 bg-white p-4 rounded-2xl">
      <Text className="text-gray-600 mb-1">{title}</Text>
      <Text className="text-2xl font-semibold mb-2">{value}</Text>
      <View className="flex-row items-center">
        {isPositive ? (
          <ArrowUp size={16} color="#22C55E" />
        ) : (
          <ArrowDown size={16} color="#EF4444" />
        )}
        <Text className={`ml-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change} {period}
        </Text>
      </View>
    </View>
  );
}
