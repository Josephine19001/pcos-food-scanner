import { View, Image, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';

const MOCK_IMAGES = [
  require('@/assets/images/porosity-test.png'),
  require('@/assets/images/scan_barcode_example.png'),
  require('@/assets/images/scan_label_example.png'),
  require('@/assets/images/splash-icon.png'),
];

type Photo = {
  uri?: string;
  date: string;
};

type PhotoGridProps = {
  photos: Photo[];
  timeRange: string;
};

export function PhotoGrid({ photos, timeRange }: PhotoGridProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-4">
        {photos.map((photo, index) => (
          <View key={index} className="w-32">
            <Image
              source={MOCK_IMAGES[index % MOCK_IMAGES.length]}
              className="w-32 h-32 rounded-xl"
              resizeMode="cover"
            />
            <Text className="text-gray-600 text-sm mt-2">{photo.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
