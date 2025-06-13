import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { ScanLine } from 'lucide-react-native';

export interface Category {
  label: string;
  img: any;
  icon: any;
  color: string;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/scan?category=${category.label.toLowerCase()}`)}
      className="w-[48%] mb-4"
    >
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Icon instead of image */}
        <View
          className="w-full h-24 rounded-xl mb-3 items-center justify-center"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <category.icon size={32} color={category.color} />
        </View>
        {/* Scan overlay */}
        <ScanLine
          size={24}
          color={category.color}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            opacity: 0.9,
          }}
        />
        <Text className="text-lg font-semibold text-black text-center">{category.label}</Text>
      </View>
    </TouchableOpacity>
  );
}
