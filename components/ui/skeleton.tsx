import { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle } from 'react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-provider';

interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  className?: string;
  style?: ViewStyle;
}

export function Skeleton({
  width = 100,
  height = 20,
  borderRadius = 4,
  className,
  style,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E7EB', '#F3F4F6'], // Light colors only
  });

  return (
    <Animated.View
      className={cn('', className)}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

export function ProductItemSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <View className={`p-4 rounded-xl shadow-sm mb-3 mx-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <View className="flex-row items-center">
        <Skeleton width={60} height={60} borderRadius={8} className="mr-3" />
        <View className="flex-1">
          <Skeleton width={200} height={16} className="mb-2" />
          <Skeleton width={120} height={14} className="mb-2" />
          <View className="flex-row mt-2">
            <Skeleton width={60} height={20} borderRadius={10} className="mr-2" />
            <Skeleton width={80} height={20} borderRadius={10} />
          </View>
        </View>
        <Skeleton width={24} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

export function SettingsItemSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <View className={`p-4 rounded-xl shadow-sm mb-3 mx-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Skeleton width={20} height={20} className="mr-3" />
          <Skeleton width={150} height={16} />
        </View>
        <Skeleton width={80} height={14} />
      </View>
    </View>
  );
}

export function HairGoalsSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <View className={`mx-4 p-4 rounded-2xl shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <View className="gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} className="flex-row justify-between items-center py-2">
            <Skeleton width={120} height={16} />
            <Skeleton width={100} height={14} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function PersonalDetailsSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <View className={`mx-4 p-4 rounded-2xl shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <View className="gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} className="flex-row justify-between items-center py-3">
            <Skeleton width={80} height={16} />
            <Skeleton width={120} height={14} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View className="px-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductItemSkeleton key={index} />
      ))}
    </View>
  );
}

export function PreferencesStepSkeleton() {
  return (
    <View className="flex-1 bg-teal-50">
      {/* Header with back button and progress bar */}
      <View className="flex-row items-center py-4 px-6 mt-14">
        <Skeleton width={40} height={40} borderRadius={20} className="mr-3" />
        <View className="flex-1">
          <Skeleton width="100%" height={6} borderRadius={3} />
        </View>
      </View>

      {/* Title */}
      <View className="px-6 mb-6 mt-2">
        <Skeleton width={250} height={28} className="mb-2" />
        <Skeleton width={180} height={16} />
      </View>

      {/* Option cards */}
      <View className="px-6 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            width="100%"
            height={56}
            borderRadius={16}
            style={{ opacity: 1 - index * 0.1 }}
          />
        ))}
      </View>

      {/* Bottom button */}
      <View className="absolute bottom-10 left-6 right-6">
        <Skeleton width="100%" height={56} borderRadius={16} />
      </View>
    </View>
  );
}

export function JournalStatsSkeleton() {
  return (
    <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 16 }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 12,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Skeleton width={32} height={32} borderRadius={8} style={{ marginBottom: 6 }} />
          <Skeleton width={30} height={20} style={{ marginBottom: 4 }} />
          <Skeleton width={40} height={11} />
        </View>
      ))}
    </View>
  );
}

export function JournalMealCardSkeleton() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <Skeleton width={52} height={52} borderRadius={12} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Skeleton width={140} height={16} style={{ marginBottom: 6 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Skeleton width={70} height={20} borderRadius={6} />
          <Skeleton width={50} height={13} />
        </View>
      </View>
      <Skeleton width={32} height={32} borderRadius={16} style={{ marginRight: 8 }} />
      <Skeleton width={18} height={18} borderRadius={9} />
    </View>
  );
}

export function JournalMealsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      {Array.from({ length: count }).map((_, index) => (
        <JournalMealCardSkeleton key={index} />
      ))}
    </View>
  );
}

export function JournalLoadingModal() {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      {/* Stats skeleton */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <Skeleton width={32} height={32} borderRadius={8} style={{ marginBottom: 6 }} />
            <Skeleton width={30} height={18} style={{ marginBottom: 4 }} />
            <Skeleton width={40} height={10} />
          </View>
        ))}
      </View>

      {/* Meals skeleton */}
      <View style={{ gap: 10 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F9FAFB',
              borderRadius: 12,
              padding: 12,
            }}
          >
            <Skeleton width={48} height={48} borderRadius={10} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Skeleton width={60} height={18} borderRadius={6} />
                <Skeleton width={45} height={12} />
              </View>
            </View>
            <Skeleton width={28} height={28} borderRadius={14} />
          </View>
        ))}
      </View>
    </View>
  );
}