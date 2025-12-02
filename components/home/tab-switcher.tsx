import { View, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

export type TabType = 'all' | 'saves';

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

// Grid/All icon
function AllIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
    </Svg>
  );
}

// Bookmark/Saves icon
function SavesIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="light" style={styles.blurView}>
        <View style={styles.tabsWrapper}>
          <Pressable
            onPress={() => onTabChange('all')}
            style={[
              styles.tabButton,
              activeTab === 'all' && styles.tabButtonActive,
            ]}
          >
            <AllIcon color={activeTab === 'all' ? '#0D9488' : '#6B7280'} size={16} />
          </Pressable>
          <Pressable
            onPress={() => onTabChange('saves')}
            style={[
              styles.tabButton,
              activeTab === 'saves' && styles.tabButtonActive,
            ]}
          >
            <SavesIcon color={activeTab === 'saves' ? '#0D9488' : '#6B7280'} size={16} />
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(229, 231, 235, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(209, 213, 219, 0.5)',
  },
  blurView: {
    flex: 1,
  },
  tabsWrapper: {
    flexDirection: 'row',
    padding: 3,
    gap: 2,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
});
