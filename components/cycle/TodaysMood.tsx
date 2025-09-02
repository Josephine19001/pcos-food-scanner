import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Heart, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import {
  AmazingIcon,
  SmileIcon,
  OkayIcon,
  ToughIcon,
  StrugglingIcon,
} from '@/components/icons/mood-icons';

interface TodaysMoodProps {
  selectedDate: Date;
  moodData?: {
    mood: string;
    energy_level: string;
    notes?: string;
  };
  isLoading?: boolean;
}

export function TodaysMood({ selectedDate, moodData, isLoading }: TodaysMoodProps) {
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isFuture = selectedDate > new Date() && !isToday;

  const getMoodIcon = (mood: string, size?: number, color?: string) => {
    switch (mood) {
      case 'happy':
        return <AmazingIcon size={size || 40} color={color || '#10B981'} />;
      case 'normal':
        return <SmileIcon size={size || 40} color={color || '#F59E0B'} />;
      case 'sad':
        return <OkayIcon size={size || 40} color={color || '#EF4444'} />;
      case 'irritable':
        return <ToughIcon size={size || 40} color={color || '#6B7280'} />;
      case 'anxious':
        return <StrugglingIcon size={size || 40} color={color || '#6B7280'} />;
      default:
        return <SmileIcon size={size || 40} color={color || '#F59E0B'} />;
    }
  };

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 'Amazing';
      case 'normal':
        return 'Good';
      case 'sad':
        return 'Okay';
      case 'irritable':
        return 'Tough';
      case 'anxious':
        return 'Struggling';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <View className="px-4 mb-6">
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-2xl bg-purple-100 items-center justify-center mr-3">
                <Heart size={20} color="#8B5CF6" />
              </View>
              <Text className="text-lg font-semibold text-black">Mood</Text>
            </View>
          </View>
          <View className="animate-pulse">
            <View className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <View className="h-3 bg-gray-200 rounded w-1/3" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="px-4 mb-6">
      <View className="bg-white rounded-2xl p-5 border border-gray-100">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center">
            <View className="w-11 h-11 rounded-2xl items-center justify-center mr-3 bg-pink-50">
              <Heart size={20} color="#f6339a" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Mood</Text>
          </View>
          {!isFuture && (
            <TouchableOpacity
              onPress={() => router.push(`/log-mood?date=${selectedDate.toISOString().split('T')[0]}`)}
              className="w-9 h-9 rounded-xl items-center justify-center bg-pink-50"
            >
              <Plus size={16} color="#f6339a" />
            </TouchableOpacity>
          )}
        </View>

        {moodData ? (
          <View className="flex">
            {/* Main Mood Card */}
            <View
              className="bg-pink-50 rounded-2xl p-4"
              style={{
                shadowColor: '#EC4899',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <View className="flex flex-col items-center">
                {/* Mood Icon */}
                <View className="rounded-2xl items-center justify-center my-8">
                  <View style={{ transform: [{ scale: 1.6 }] }}>
                    {getMoodIcon(moodData.mood, 60, '#10B981')}
                  </View>
                </View>

                {/* Mood Info */}
                <View>
                  <Text className="text-gray-900 text-2xl font-bold">
                    {getMoodLabel(moodData.mood)}
                  </Text>
                  {/* <View className="flex-row items-center">
                    <View
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: getEnergyColor(moodData.energy_level) }}
                    />
                    <Text
                      className="text-sm font-medium"
                      style={{ color: getEnergyColor(moodData.energy_level) }}
                    >
                      {getEnergyLabel(moodData.energy_level)}
                    </Text>
                  </View> */}
                </View>
              </View>
            </View>

            {/* Notes Section */}
            {/* {moodData.notes && (
              <View
                className="rounded-xl p-4"
                style={{
                  backgroundColor: '#F9FAFB',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <View className="flex-row items-center mb-2">
                  <View
                    className="w-1 h-4 rounded-full mr-2"
                    style={{ backgroundColor: '#A855F7' }}
                  />
                  <Text className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Notes
                  </Text>
                </View>
                <Text className="text-gray-700 text-sm leading-relaxed pl-3">{moodData.notes}</Text>
              </View>
            )} */}
          </View>
        ) : (
          <View className="items-center py-6">
            {/* Empty State Icon */}
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
              style={{
                backgroundColor: '#F8FAFC',
                borderWidth: 2,
                borderColor: '#E2E8F0',
                borderStyle: 'dashed',
              }}
            >
              <Heart size={24} color="#94A3B8" />
            </View>

            {/* Empty State Text */}
            <Text className="text-gray-800 text-center text-base font-semibold mb-2">
              No mood logged
            </Text>
            <Text className="text-gray-500 text-center text-sm mb-5 px-6 leading-relaxed">
              Track your emotional wellness by logging how you're feeling today
            </Text>

            {/* Action Button */}
            {!isFuture && (
              <TouchableOpacity
                onPress={() => router.push(`/log-mood?date=${selectedDate.toISOString().split('T')[0]}`)}
                className="rounded-xl px-6 py-3 flex-row items-center bg-pink-500"
              >
                <Plus size={16} color="white" style={{ marginRight: 6 }} />
                <Text className="text-white font-semibold text-sm">Log Mood</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
