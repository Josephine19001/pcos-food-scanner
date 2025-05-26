import { View, Modal, Pressable, Dimensions, Text } from 'react-native';
import { X } from 'lucide-react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useEffect, useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const images = [
  require('@/assets/images/scan_label_example.png'),
  require('@/assets/images/scan_barcode_example.png'),
];

export function HelpModal({ visible, onClose }: Props) {
  const { width, height } = Dimensions.get('window');
  const [loadedIndex, setLoadedIndex] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImageLoad = (index: number) => {
    if (!loadedIndex.includes(index)) {
      setLoadedIndex((prev) => [...prev, index]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-white">
        {/* Close Button */}
        <Pressable onPress={onClose} className="absolute top-12 left-4 z-10">
          <X size={28} color="black" />
        </Pressable>

        {/* Fullscreen Carousel */}
        <Carousel
          loop={false}
          width={width}
          height={height}
          data={images}
          scrollAnimationDuration={300}
          onSnapToItem={setActiveIndex}
          renderItem={({ item, index }) => (
            <View className="w-full h-full items-center justify-center bg-white">
              {loadedIndex.includes(index) ? (
                <Animated.Image
                  source={item}
                  resizeMode="contain"
                  className="w-[90%] h-[90%]"
                  entering={FadeIn.duration(400)}
                  onLoad={() => handleImageLoad(index)}
                />
              ) : (
                <>
                  <Skeleton className="w-[80%] h-[80%] rounded-xl bg-gray-200" />
                  <Animated.Image
                    source={item}
                    resizeMode="contain"
                    className="w-[80%] h-[80%] absolute"
                    onLoad={() => handleImageLoad(index)}
                  />
                </>
              )}
            </View>
          )}
        />

        {/* Swipe Indicator */}
        <View className="absolute bottom-20 w-full items-center">
          <View className="px-4 py-1 rounded-full bg-gray-200">
            <Text className="text-gray-600 text-sm font-medium">
              {activeIndex === images.length - 1 ? 'Swipe ←' : 'Swipe →'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
