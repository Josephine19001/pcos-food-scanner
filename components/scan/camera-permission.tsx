import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface CameraPermissionProps {
  onRequestPermission: () => void;
  onClose: () => void;
}

export function CameraPermission({ onRequestPermission, onClose }: CameraPermissionProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-6">
          <Text className="text-5xl">📷</Text>
        </View>
        <Text className="text-gray-900 text-2xl font-bold text-center mb-3">
          Camera Access Required
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          We need access to your camera to scan food items and check if they're PCOS-friendly.
        </Text>
        <Pressable onPress={onRequestPermission} className="rounded-2xl overflow-hidden w-full">
          <LinearGradient
            colors={['#0D9488', '#0F766E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View className="py-4 px-6 items-center">
            <Text className="text-white font-bold text-lg">Grant Permission</Text>
          </View>
        </Pressable>
        <Pressable onPress={onClose} className="py-4 mt-4">
          <Text className="text-gray-500">Maybe Later</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
