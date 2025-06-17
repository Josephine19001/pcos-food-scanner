import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Heart } from 'lucide-react-native';
import { ScannedProductUI } from '@/lib/types/product';

interface ProductCardProps {
  product: ScannedProductUI;
  showDate: string;
  onPress: (product: ScannedProductUI) => void;
  onToggleFavorite: (productId: string) => void;
}

export function ProductCard({ product, showDate, onPress, onToggleFavorite }: ProductCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return '#10B981'; // Green
    if (score >= 6) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Safe';
    if (score >= 6) return 'Moderate';
    return 'Caution';
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
      style={{ height: 280 }} // Fixed height for consistency
      onPress={() => onPress(product)}
    >
      <View className="flex-1 items-center justify-between">
        {/* Product Image with Score Badge */}
        <View className="relative mb-3">
          <Image
            source={typeof product.image === 'string' ? { uri: product.image } : product.image}
            className="w-20 h-20 rounded-2xl"
            resizeMode="cover"
          />
          {/* Safety Score Badge */}
          <View
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: getScoreColor(product.safetyScore) }}
          >
            <Text className="text-white text-xs font-bold">{product.safetyScore}</Text>
          </View>

          {/* Favorite Icon */}
          <TouchableOpacity
            onPress={() => onToggleFavorite(product.id)}
            className="absolute -top-1 -left-1 w-6 h-6 bg-white rounded-full items-center justify-center shadow-sm"
          >
            <Heart size={14} color="#000" fill={product.isFavorite ? '#000' : 'transparent'} />
          </TouchableOpacity>
        </View>

        {/* Product Info - Fixed height container */}
        <View className="flex-1 items-center justify-center px-2">
          {/* Product Name - Fixed height */}
          <View className="h-12 justify-center mb-2">
            <Text
              className="text-base font-bold text-black text-center leading-5"
              numberOfLines={2}
            >
              {product.name}
            </Text>
          </View>

          {/* Brand */}
          <Text className="text-gray-600 text-sm mb-3" numberOfLines={1}>
            {product.brand}
          </Text>

          {/* Safety Status Card */}
          <View
            className="px-3 py-2 rounded-xl mb-3"
            style={{ backgroundColor: `${getScoreColor(product.safetyScore)}15` }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: getScoreColor(product.safetyScore) }}
            >
              {getScoreLabel(product.safetyScore)}
            </Text>
          </View>
        </View>

        {/* Bottom Section - Category and Benefits */}
        <View className="w-full">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 items-center">
              <Text className="text-xs text-gray-500 mb-1">Category</Text>
              <Text className="text-sm font-medium text-black" numberOfLines={1}>
                {product.category}
              </Text>
            </View>

            <View className="w-px h-8 bg-gray-200 mx-3" />

            <View className="flex-1 items-center">
              <Text className="text-xs text-gray-500 mb-1">Benefits</Text>
              <Text className="text-sm font-medium text-black">
                {(product.keyIngredients || []).filter((i) => i.type === 'beneficial').length}
              </Text>
            </View>
          </View>

          {/* Date */}
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-xs text-gray-500 text-center">{showDate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
