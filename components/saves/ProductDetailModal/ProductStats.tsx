import { View, Text } from 'react-native';
import { CheckCircle, AlertTriangle, Info, Sparkles, Heart, Award, Zap } from 'lucide-react-native';
import { ScannedProductUI } from '@/lib/types/product';
import { StatCard } from './StatCard';

interface ProductStatsProps {
  product: ScannedProductUI;
}

export function ProductStats({ product }: ProductStatsProps) {
  const beneficialCount = (product.keyIngredients || []).filter(
    (i) => i.type === 'beneficial'
  ).length;
  const harmfulCount = (product.keyIngredients || []).filter((i) => i.type === 'harmful').length;

  const getCategoryIcon = (category: string) => {
    switch ((category || '').toLowerCase()) {
      case 'hair':
        return Sparkles;
      case 'skin':
        return Heart;
      case 'face':
        return Award;
      case 'perfume':
        return Zap;
      default:
        return Info;
    }
  };

  const CategoryIcon = getCategoryIcon(product.category);

  return (
    <View className="px-6 mb-6">
      <View className="flex-row gap-4 items-center">
        <View className="flex-1">
          <StatCard
            icon={CategoryIcon}
            title="Category"
            value={product.category || 'Unknown'}
            color="#6B7280"
            bgColor="#6B728015"
          />
        </View>
        <View className="flex-1">
          <StatCard
            icon={CheckCircle}
            title="Benefits"
            value={beneficialCount.toString()}
            color="#10B981"
            bgColor="#10B98115"
          />
        </View>
        <View className="flex-1">
          <StatCard
            icon={AlertTriangle}
            title="Concerns"
            value={harmfulCount.toString()}
            color="#EF4444"
            bgColor="#EF444415"
          />
        </View>
      </View>
    </View>
  );
}
