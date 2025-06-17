import { View, Text, Image } from 'react-native';
import { Shield, AlertTriangle } from 'lucide-react-native';
import { ScannedProductUI } from '@/lib/types/product';

interface ProductHeroProps {
  product: ScannedProductUI;
}

export function ProductHero({ product }: ProductHeroProps) {
  const getScoreConfig = (score: number) => {
    if (score >= 8)
      return {
        color: '#10B981',
        label: 'Safe',
        icon: Shield,
        bgColor: '#10B98115',
      };
    if (score >= 6)
      return {
        color: '#F59E0B',
        label: 'Moderate',
        icon: AlertTriangle,
        bgColor: '#F59E0B15',
      };
    return {
      color: '#EF4444',
      label: 'Caution',
      icon: AlertTriangle,
      bgColor: '#EF444415',
    };
  };

  const scoreConfig = getScoreConfig(product.safetyScore || 0);

  return (
    <View className="items-center px-6 py-6">
      <View className="relative mb-6">
        <Image
          source={typeof product.image === 'string' ? { uri: product.image } : product.image}
          className="w-32 h-32 rounded-3xl"
          resizeMode="cover"
        />
        {/* Safety Score Badge */}
        <View
          className="absolute -top-2 -right-2 w-12 h-12 rounded-full items-center justify-center shadow-lg"
          style={{ backgroundColor: scoreConfig.color }}
        >
          <Text className="text-white text-lg font-bold">{product.safetyScore}</Text>
        </View>
      </View>

      {/* Product Info */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-black text-center mb-2">{product.name}</Text>
        <Text className="text-lg text-gray-600 mb-4">{product.brand}</Text>

        {/* Safety Status */}
        <View className="px-6 py-3 rounded-2xl" style={{ backgroundColor: scoreConfig.bgColor }}>
          <Text className="text-lg font-bold" style={{ color: scoreConfig.color }}>
            {scoreConfig.label}
          </Text>
        </View>
      </View>
    </View>
  );
}
