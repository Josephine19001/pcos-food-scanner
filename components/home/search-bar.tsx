import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle } from 'react-native-svg';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

// Search icon
function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8" />
      <Path d="m21 21-4.35-4.35" />
    </Svg>
  );
}

// X/Close icon
function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  );
}

export function SearchBar({ value, onChangeText, placeholder = 'Search scans...' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <BlurView intensity={60} tint="light" style={styles.blurView}>
          <View style={styles.searchContent}>
            <SearchIcon />
            <TextInput
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              value={value}
              onChangeText={onChangeText}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {value.length > 0 && (
              <Pressable onPress={() => onChangeText('')} hitSlop={10}>
                <CloseIcon />
              </Pressable>
            )}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(229, 231, 235, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(209, 213, 219, 0.5)',
  },
  blurView: {
    flex: 1,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
});
