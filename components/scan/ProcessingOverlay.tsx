import { View, ActivityIndicator, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Scissors } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ProcessingOverlayProps {
  visible: boolean;
}

export function ProcessingOverlay({ visible }: ProcessingOverlayProps) {
  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <View
        style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 20,
          padding: 30,
          alignItems: 'center',
          minWidth: 200,
          maxWidth: screenWidth * 0.8,
        }}
      >
        <View
          style={{
            backgroundColor: '#FFD700',
            borderRadius: 30,
            padding: 15,
            marginBottom: 20,
          }}
        >
          <Scissors size={30} color="#000" />
        </View>

        <ActivityIndicator size="large" color="#FFD700" style={{ marginBottom: 15 }} />

        <Text className="text-xl font-bold text-black text-center mb-2">Processing Image</Text>

        <Text className="text-gray-600 text-center text-sm mb-4">
          Cropping and preparing your image for analysis...
        </Text>

        <Text className="text-gray-500 text-center text-xs">This may take a few moments</Text>
      </View>
    </View>
  );
}
