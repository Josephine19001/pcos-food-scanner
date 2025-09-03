import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { X, ChevronLeft, Check, AlertCircle } from 'lucide-react-native';

interface FoodScanGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const { width: screenWidth } = Dimensions.get('window');
const imageWidth = screenWidth * 0.7;
const imageHeight = 300; // Fixed height to ensure everything fits on screen

const ImageContainer = ({ image }: { image: string }) => {
  return (
    <View style={styles.imageContainer}>
      <Image
        style={styles.image}
        source={image}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        priority="high"
      />
    </View>
  );
};

export function FoodScanGuideModal({ visible, onClose }: FoodScanGuideModalProps) {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      title: 'Show the whole plate',
      subtitle: 'Good',
      type: 'good' as const,
      tips: [
        'Keep the entire dish within the scan frame.',
        'Ensure nothing is cropped out on the edges.',
        'Take the photo in clear, bright light.',
      ],
    },
    {
      title: 'Common mistakes',
      subtitle: 'Bad',
      type: 'bad' as const,
      tips: [
        'Don’t shoot from sharp angles or only the side view.',
        'Avoid low light or heavy shadows.',
        'Keep foods separate so they don’t overlap or blur together.',
      ],
    },
  ];

  const currentScreenData = screens[currentScreen];

  // Images are preloaded at app startup, so no need for component-level preloading

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleClose = () => {
    setCurrentScreen(0);
    onClose();
  };

  const GoodExamplePlaceholder = () => (
    <View className="items-center mb-4">
      {/* Status indicator */}
      <View className="bg-green-100 w-12 h-12 rounded-full items-center justify-center mb-3">
        <Check size={24} color="#16a34a" />
      </View>
      <Text className="text-green-700 font-semibold text-lg mb-4">
        {currentScreenData.subtitle}
      </Text>

      {/* Food scan example image */}
      <ImageContainer image="https://res.cloudinary.com/josephine19001/image/upload/v1756900375/LunaSync/good-sca_jpfemp.png" />
    </View>
  );

  const BadExamplePlaceholder = () => (
    <View className="items-center mb-4">
      {/* Status indicator */}
      <View className="bg-red-100 w-12 h-12 rounded-full items-center justify-center mb-3">
        <AlertCircle size={24} color="#dc2626" />
      </View>
      <Text className="text-red-700 font-semibold text-lg mb-4">{currentScreenData.subtitle}</Text>

      {/* Food scan example image */}
      <ImageContainer image="https://res.cloudinary.com/josephine19001/image/upload/v1756900375/LunaSync/bad-scan_lpfnig.png" />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center">
            {currentScreen > 0 && (
              <TouchableOpacity onPress={handlePrevious} className="mr-4">
                <ChevronLeft size={24} color="#6b7280" />
              </TouchableOpacity>
            )}
            <Text className="text-xl font-bold">Food Scanning Guide</Text>
          </View>

          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Progress indicator */}
        <View className="flex-row px-6 py-4">
          {screens.map((_, index) => (
            <View
              key={index}
              className={`flex-1 h-1 rounded-full mx-1 ${
                index <= currentScreen ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </View>

        <View className="flex-1 px-6 py-4">
          {/* Image placeholder */}
          <View className="mb-4">
            {currentScreenData.type === 'good' ? (
              <GoodExamplePlaceholder />
            ) : (
              <BadExamplePlaceholder />
            )}
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-center mb-6">{currentScreenData.title}</Text>

          {/* Tips section */}
          <View>
            {currentScreenData.tips.map((tip, index) => (
              <View key={index} className="flex-row items-start mb-3">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-4 mt-0.5">
                  <View className="w-6 h-6 rounded-full bg-gray-800 items-center justify-center">
                    <Text className="text-white text-xs font-bold">{index + 1}</Text>
                  </View>
                </View>
                <Text className="text-gray-700 text-base flex-1 leading-5">{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom navigation */}
        <View className="px-6 py-4 pb-8">
          <TouchableOpacity
            onPress={currentScreen < screens.length - 1 ? handleNext : handleClose}
            className="bg-pink-500 rounded-full py-4 px-6 flex-row items-center justify-center"
          >
            <Text className="text-white font-semibold text-lg">
              {currentScreen < screens.length - 1 ? 'Next' : 'Got it!'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: imageWidth,
    height: imageHeight,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
