import { View, Text } from 'react-native';

interface ScanFrameProps {
  message?: string;
}

export function ScanFrame({ message = 'Position the food item within the frame' }: ScanFrameProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-72 h-72 relative">
        {/* Corner brackets */}
        <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-3xl" />
        <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-3xl" />
        <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-3xl" />
        <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-3xl" />
      </View>
      <Text className="text-white/80 text-center mt-6 px-8">{message}</Text>
    </View>
  );
}
