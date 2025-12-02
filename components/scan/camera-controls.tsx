import { View, Pressable, ActivityIndicator } from 'react-native';
import { RotateCcw, ImagePlus } from 'lucide-react-native';

interface CameraControlsProps {
  onCapture: () => void;
  onFlipCamera: () => void;
  onPickImage?: () => void;
  isCapturing?: boolean;
}

export function CameraControls({
  onCapture,
  onFlipCamera,
  onPickImage,
  isCapturing = false,
}: CameraControlsProps) {
  return (
    <View className="items-center pb-8">
      <View className="flex-row items-center justify-center gap-8">
        {/* Flip Camera Button */}
        <Pressable
          onPress={onFlipCamera}
          className="w-12 h-12 rounded-full bg-white/20 items-center justify-center"
          disabled={isCapturing}
        >
          <RotateCcw size={24} color="#FFFFFF" />
        </Pressable>

        {/* Capture Button */}
        <Pressable onPress={onCapture} disabled={isCapturing}>
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center">
            {isCapturing ? (
              <ActivityIndicator size="large" color="#0D9488" />
            ) : (
              <View className="w-16 h-16 rounded-full border-4 border-primary-500" />
            )}
          </View>
        </Pressable>

        {/* Gallery Button */}
        {onPickImage ? (
          <Pressable
            onPress={onPickImage}
            className="w-12 h-12 rounded-full bg-white/20 items-center justify-center"
            disabled={isCapturing}
          >
            <ImagePlus size={24} color="#FFFFFF" />
          </Pressable>
        ) : (
          <View className="w-12 h-12" />
        )}
      </View>
    </View>
  );
}
