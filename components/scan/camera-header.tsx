import { View, Text, Pressable } from 'react-native';
import { X, Zap, ZapOff } from 'lucide-react-native';

interface CameraHeaderProps {
  title?: string;
  flash: boolean;
  onClose: () => void;
  onToggleFlash: () => void;
}

export function CameraHeader({
  title = 'Scan Food',
  flash,
  onClose,
  onToggleFlash,
}: CameraHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-2">
      <Pressable
        onPress={onClose}
        className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
      >
        <X size={24} color="#FFFFFF" />
      </Pressable>
      <Text className="text-white text-lg font-semibold">{title}</Text>
      <Pressable
        onPress={onToggleFlash}
        className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
      >
        {flash ? (
          <Zap size={22} color="#FFD700" fill="#FFD700" />
        ) : (
          <ZapOff size={22} color="#FFFFFF" />
        )}
      </Pressable>
    </View>
  );
}
