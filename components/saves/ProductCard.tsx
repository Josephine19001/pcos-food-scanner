import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Heart } from 'lucide-react-native';

export interface SavedProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  safetyScore: number;
  scannedAt?: string;
  savedAt?: string;
  isFavorite: boolean;
  image: any;
  ingredients: string[];
  keyIngredients: {
    name: string;
    type: 'beneficial' | 'harmful' | 'neutral';
    description: string;
  }[];
}

interface ProductCardProps {
  product: SavedProduct;
  showDate: string;
  onPress: (product: SavedProduct) => void;
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
      className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100"
      onPress={() => onPress(product)}
    >
      <View className="items-center">
        {/* Product Image with Score Badge */}
        <View className="relative mb-4">
          <Image source={product.image} className="w-20 h-20 rounded-2xl" resizeMode="cover" />
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
            className="absolute top-3 right-3 p-2"
          >
            <Heart size={20} color="#000" fill={product.isFavorite ? '#000' : 'transparent'} />
          </TouchableOpacity>
        </View>

        {/* Product Name */}
        <Text className="text-lg font-bold text-black text-center mb-1" numberOfLines={2}>
          {product.name}
        </Text>

        {/* Brand */}
        <Text className="text-gray-600 text-sm mb-3">{product.brand}</Text>

        {/* Safety Status Card */}
        <View
          className="px-4 py-2 rounded-xl mb-3"
          style={{ backgroundColor: `${getScoreColor(product.safetyScore)}15` }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: getScoreColor(product.safetyScore) }}
          >
            {getScoreLabel(product.safetyScore)}
          </Text>
        </View>

        {/* Category and Benefits Row */}
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-1 items-center">
            <Text className="text-xs text-gray-500 mb-1">Category</Text>
            <Text className="text-sm font-medium text-black">{product.category}</Text>
          </View>

          <View className="w-px h-8 bg-gray-200 mx-3" />

          <View className="flex-1 items-center">
            <Text className="text-xs text-gray-500 mb-1">Benefits</Text>
            <Text className="text-sm font-medium text-black">
              {product.keyIngredients.filter((i) => i.type === 'beneficial').length}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
