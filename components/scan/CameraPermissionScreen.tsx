import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CameraPermissionScreenProps {
  onRequestPermission: () => void;
}

export function CameraPermissionScreen({ onRequestPermission }: CameraPermissionScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-black items-center justify-center">
      <View className="px-6">
        <Text className="text-white text-xl font-bold text-center mb-4">
          Camera Permission Required
        </Text>
        <Text className="text-gray-300 text-center mb-8">
          We need access to your camera to scan products and analyze their ingredients.
        </Text>
        <TouchableOpacity onPress={onRequestPermission} className="bg-white py-4 px-8 rounded-2xl">
          <Text className="text-black font-bold text-center">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
