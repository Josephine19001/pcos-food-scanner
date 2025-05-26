import { View } from 'react-native';
import { Text } from './text';
import type { HairFact } from '@/lib/types/hair-fact';

type FactCardProps = {
  fact: HairFact;
};

const FactCard = ({ fact }: FactCardProps) => {
  return (
    <View className="bg-orange-100 p-4 rounded-xl">
      <Text className="text-orange-900 font-bold mb-4">Did you know? 🤔</Text>
      <Text className="text-orange-800 mb-4">{fact.fact}</Text>
      <Text className="text-orange-800 mb-4">{fact.description}</Text>
      <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-orange-200">
        <Text className="text-orange-700 font-medium">{fact.source}</Text>
        <Text className="text-orange-600">{fact.year}</Text>
      </View>
    </View>
  );
};

export default FactCard;
