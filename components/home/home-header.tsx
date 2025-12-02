import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export type TabType = 'all' | 'saves';

interface HomeHeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

// Grid/All icon
function AllIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
    </Svg>
  );
}

// Bookmark/Saves icon
function SavesIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

// Search icon
function SearchIcon({ color = '#6B7280', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8" />
      <Path d="m21 21-4.35-4.35" />
    </Svg>
  );
}

// X/Close icon
function CloseIcon({ color = '#6B7280', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  );
}

export function HomeHeader({ activeTab, onTabChange, searchQuery, onSearchChange }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    if (isSearchOpen) {
      onSearchChange('');
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Main Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Scans</Text>

        <View style={styles.actions}>
          {/* Search Button */}
          <Pressable onPress={toggleSearch} style={styles.iconButton}>
            <View style={[styles.iconButtonInner, isSearchOpen && styles.iconButtonActive]}>
              {isSearchOpen ? (
                <CloseIcon color="#0D9488" size={18} />
              ) : (
                <SearchIcon color="#6B7280" size={18} />
              )}
            </View>
          </Pressable>

          {/* Tab Switcher */}
          <View style={styles.tabSwitcher}>
            <View style={styles.tabsWrapper}>
              <Pressable
                onPress={() => onTabChange('all')}
                style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
              >
                <AllIcon color={activeTab === 'all' ? '#0D9488' : '#6B7280'} />
              </Pressable>
              <Pressable
                onPress={() => onTabChange('saves')}
                style={[styles.tabButton, activeTab === 'saves' && styles.tabButtonActive]}
              >
                <SavesIcon color={activeTab === 'saves' ? '#0D9488' : '#6B7280'} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Expandable Search Bar */}
      {isSearchOpen && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={styles.searchContainer}
        >
          <View style={styles.searchWrapper}>
            <SearchIcon color="#9CA3AF" size={18} />
            <TextInput
              placeholder="Search scans..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={onSearchChange}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => onSearchChange('')} hitSlop={10}>
                <CloseIcon color="#9CA3AF" size={16} />
              </Pressable>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 2,
  },
  iconButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229, 231, 235, 0.9)',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(209, 250, 244, 0.9)',
  },
  tabSwitcher: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(229, 231, 235, 0.9)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    marginTop: 14,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(243, 244, 246, 0.95)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
});
