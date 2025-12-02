import { View, Text, Pressable } from 'react-native';
import { Heart, Clock, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { ScanResult, ScanStatus } from '@/lib/types/scan';

interface ScanCardProps {
  scan: ScanResult;
  index: number;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

const getStatusColor = (status: ScanStatus) => {
  switch (status) {
    case 'safe':
      return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
    case 'caution':
      return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'avoid':
      return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
  }
};

const getStatusLabel = (status: ScanStatus) => {
  switch (status) {
    case 'safe':
      return 'PCOS Safe';
    case 'caution':
      return 'Use Caution';
    case 'avoid':
      return 'Avoid';
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export function ScanCard({ scan, index, onPress, onToggleFavorite }: ScanCardProps) {
  const statusColors = getStatusColor(scan.status);

  return (
    <Animated.View entering={FadeInUp.delay(index * 50).duration(300)}>
      <Pressable
        onPress={onPress}
        className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden active:opacity-90"
      >
        <View className="p-4 flex-row">
          {/* Food Icon/Image */}
          <View className="w-14 h-14 rounded-xl bg-gray-100 items-center justify-center mr-4">
            <Text className="text-2xl">🍽️</Text>
          </View>

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-gray-900 font-semibold text-base" numberOfLines={1}>
                {scan.name}
              </Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.();
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Heart
                  size={18}
                  color={scan.is_favorite ? '#EF4444' : '#D1D5DB'}
                  fill={scan.is_favorite ? '#EF4444' : 'transparent'}
                />
              </Pressable>
            </View>

            {/* Status Badge */}
            <View className={`self-start px-2 py-0.5 rounded-full ${statusColors.bg} mb-2`}>
              <View className="flex-row items-center">
                <View className={`w-1.5 h-1.5 rounded-full ${statusColors.dot} mr-1.5`} />
                <Text className={`text-xs font-medium ${statusColors.text}`}>
                  {getStatusLabel(scan.status)}
                </Text>
              </View>
            </View>

            <Text className="text-gray-500 text-sm" numberOfLines={1}>
              {scan.summary}
            </Text>

            {/* Time */}
            <View className="flex-row items-center mt-2">
              <Clock size={12} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs ml-1">
                {formatTimeAgo(scan.scanned_at)}
              </Text>
            </View>
          </View>

          <View className="self-center ml-2">
            <ChevronRight size={20} color="#D1D5DB" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
