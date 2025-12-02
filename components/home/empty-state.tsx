import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EmptyStateProps {
  type: 'all' | 'favorites' | 'search';
  searchQuery?: string;
}

export function EmptyState({ type, searchQuery }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'favorites':
        return {
          emoji: '💜',
          title: 'No Favorites Yet',
          description: 'Tap the heart on any scan to save it to your favorites',
        };
      case 'search':
        return {
          emoji: '🔍',
          title: 'No Results Found',
          description: `No scans matching "${searchQuery}"`,
        };
      case 'all':
      default:
        return {
          emoji: '📷',
          title: 'No Scans Yet',
          description: "Scan your first food item to see if it's PCOS-friendly",
        };
    }
  };

  const content = getContent();

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="flex-1 items-center justify-center py-20"
    >
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
        <Text className="text-4xl">{content.emoji}</Text>
      </View>
      <Text className="text-gray-900 font-semibold text-lg mb-2">{content.title}</Text>
      <Text className="text-gray-500 text-center px-8">{content.description}</Text>
    </Animated.View>
  );
}
