import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { ExternalLink } from 'lucide-react-native';
import { ScannedProductUI } from '@/lib/types/product';

interface ProductLinksProps {
  product: ScannedProductUI;
}

export function ProductLinks({ product }: ProductLinksProps) {
  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  if (!product.productLinks || product.productLinks.length === 0) {
    return null;
  }

  return (
    <View className="px-6 mb-8">
      <Text className="text-2xl font-bold text-black mb-6">Where to Buy</Text>
      <View className="gap-3">
        {product.productLinks.map((link, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openLink(link.url)}
            className="flex-row items-center p-4 bg-white rounded-2xl border border-gray-100"
          >
            {link.thumbnailUrl && (
              <Image
                source={{ uri: link.thumbnailUrl }}
                className="w-12 h-12 rounded-xl mr-4"
                resizeMode="cover"
              />
            )}
            <View className="flex-1">
              <Text className="font-semibold text-black mb-1" numberOfLines={2}>
                {link.title}
              </Text>
              <Text className="text-sm text-gray-600">{link.source}</Text>
            </View>
            <ExternalLink size={20} color="#6B7280" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
