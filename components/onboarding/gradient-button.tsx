import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';

interface GradientButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  showArrow?: boolean;
  animationDelay?: number;
  animated?: boolean;
}

export function GradientButton({
  onPress,
  disabled = false,
  label = 'Continue',
  showArrow = true,
  animationDelay = 400,
  animated = true,
}: GradientButtonProps) {
  const button = (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-2xl overflow-hidden ${disabled ? 'opacity-40' : ''}`}
    >
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />
      <View className="py-4 flex-row items-center justify-center">
        <Text className="text-white font-bold text-lg mr-2">{label}</Text>
        {showArrow && <ChevronRight size={20} color="#fff" />}
      </View>
    </Pressable>
  );

  if (animated) {
    return (
      <Animated.View entering={FadeInDown.delay(animationDelay).duration(500)}>
        {button}
      </Animated.View>
    );
  }

  return button;
}
