import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Heart } from 'lucide-react-native';
import { ScannedProductUI } from '@/lib/types/product';

interface CompactProductCardProps {
  product: ScannedProductUI;
  showDate: string;
  onPress: (product: ScannedProductUI) => void;
  onToggleFavorite: (productId: string) => void;
}

export function CompactProductCard({
  product,
  showDate,
  onPress,
  onToggleFavorite,
}: CompactProductCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return '#10B981'; // Green
    if (score >= 6) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
      style={{ height: 160, width: 140 }} // Compact size
      onPress={() => onPress(product)}
    >
      <View className="flex-1 items-center justify-between">
        {/* Product Image with Score Badge */}
        <View className="relative mb-2">
          <Image
            source={typeof product.image === 'string' ? { uri: product.image } : product.image}
            className="w-16 h-16 rounded-xl"
            resizeMode="cover"
          />
          {/* Safety Score Badge */}
          <View
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: getScoreColor(product.safetyScore) }}
          >
            <Text className="text-white text-xs font-bold">{product.safetyScore}</Text>
          </View>

          {/* Favorite Icon */}
          <TouchableOpacity
            onPress={() => onToggleFavorite(product.id)}
            className="absolute -top-1 -left-1 w-5 h-5 bg-white rounded-full items-center justify-center shadow-sm"
          >
            <Heart size={12} color="#000" fill={product.isFavorite ? '#000' : 'transparent'} />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View className="flex-1 items-center justify-center px-1">
          {/* Product Name */}
          <Text
            className="text-sm font-bold text-black text-center leading-4 mb-1"
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {/* Brand */}
          <Text className="text-gray-600 text-xs mb-2" numberOfLines={1}>
            {product.brand}
          </Text>
        </View>

        {/* Date */}
        <View className="w-full">
          <Text className="text-xs text-gray-500 text-center">{showDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
