import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

interface EmptyStateProps {
  type: 'all' | 'saves' | 'search';
  searchQuery?: string;
}

// Camera/Scan icon for "No Scans"
function ScanEmptyIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <Circle cx="12" cy="13" r="4" />
    </Svg>
  );
}

// Bookmark icon for "No Saves"
function SavesEmptyIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

// Search icon for "No Results"
function SearchEmptyIcon({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8" />
      <Path d="m21 21-4.35-4.35" />
    </Svg>
  );
}

export function EmptyState({ type, searchQuery }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'saves':
        return {
          icon: <SavesEmptyIcon />,
          title: 'No Saves Yet',
          description: 'Tap the bookmark on any scan to save it here',
        };
      case 'search':
        return {
          icon: <SearchEmptyIcon />,
          title: 'No Results Found',
          description: `No scans matching "${searchQuery}"`,
        };
      case 'all':
      default:
        return {
          icon: <ScanEmptyIcon />,
          title: 'No Scans Yet',
          description: "Scan your first food item to see if it's PCOS-friendly",
        };
    }
  };

  const content = getContent();

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="items-center pt-16 px-8"
    >
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-5">
        {content.icon}
      </View>
      <Text className="text-gray-900 font-semibold text-lg mb-2">{content.title}</Text>
      <Text className="text-gray-500 text-center leading-5">{content.description}</Text>
    </Animated.View>
  );
}
