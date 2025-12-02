import { View, Text, Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { ScanResult, ScanStatus } from '@/lib/types/scan';
import { DEMO_IMAGES } from '@/lib/config/demo-data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 36) / 2; // 12px padding on each side + 12px gap

interface ScanCardProps {
  scan: ScanResult;
  index: number;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

// Bookmark icon
function BookmarkIcon({ filled = false, size = 16 }: { filled?: boolean; size?: number }) {
  const color = filled ? '#0D9488' : '#FFFFFF';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

const statusConfig: Record<ScanStatus, { label: string; color: string; bgColor: string }> = {
  safe: {
    label: 'Safe',
    color: '#059669',
    bgColor: 'rgba(209, 250, 229, 0.95)',
  },
  caution: {
    label: 'Caution',
    color: '#D97706',
    bgColor: 'rgba(254, 243, 199, 0.95)',
  },
  avoid: {
    label: 'Avoid',
    color: '#DC2626',
    bgColor: 'rgba(254, 226, 226, 0.95)',
  },
};

export function ScanCard({ scan, index, onPress, onToggleFavorite }: ScanCardProps) {
  const status = statusConfig[scan.status];

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).duration(300)}
      style={styles.wrapper}
    >
      <Pressable onPress={onPress} style={styles.container}>
        {/* Food Image */}
        <View style={styles.imageContainer}>
          {scan.image_url ? (
            scan.image_url.startsWith('local:') ? (
              <Image
                source={DEMO_IMAGES[scan.image_url.replace('local:', '') as keyof typeof DEMO_IMAGES]}
                style={styles.image}
              />
            ) : (
              <Image source={{ uri: scan.image_url }} style={styles.image} />
            )
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderEmoji}>🍽️</Text>
            </View>
          )}

          {/* Bookmark button on image */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.bookmarkButton}
          >
            <BookmarkIcon filled={scan.is_favorite} />
          </Pressable>

          {/* Status Badge on image */}
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {scan.name}
          </Text>
          <Text style={styles.summary} numberOfLines={2}>
            {scan.summary}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 36,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: 12,
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  summary: {
    fontSize: 12,
    lineHeight: 16,
    color: '#6B7280',
  },
});
