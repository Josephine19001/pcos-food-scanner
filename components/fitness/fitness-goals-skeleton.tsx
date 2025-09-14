import { View } from 'react-native';
import { useTheme } from '@/context/theme-provider';

export function FitnessGoalsSkeleton() {
  const { isDark } = useTheme();
  
  return (
    <>
      {/* Primary Goal skeleton */}
      <View className={`${isDark ? 'bg-card-dark' : 'bg-white'} rounded-2xl p-6 mb-4 shadow-sm`}>
        <View className="flex-row items-center mb-4">
          <View className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} w-12 h-12 rounded-xl items-center justify-center mr-4`}>
            <View className={`w-6 h-6 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded`} />
          </View>
          <View className="flex-1">
            <View className={`h-4 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-2 w-24`} />
            <View className={`h-3 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded w-32`} />
          </View>
        </View>
        <View className={`h-9 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded w-28`} />
      </View>

      {/* Workout Frequency skeleton */}
      <View className={`${isDark ? 'bg-card-dark' : 'bg-white'} rounded-2xl p-6 mb-4 shadow-sm`}>
        <View className="flex-row items-center mb-4">
          <View className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} w-12 h-12 rounded-xl items-center justify-center mr-4`}>
            <View className={`w-6 h-6 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded`} />
          </View>
          <View className="flex-1">
            <View className={`h-4 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-2 w-32`} />
            <View className={`h-3 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded w-28`} />
          </View>
        </View>
        <View className={`h-9 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded w-40`} />
      </View>

      {/* Experience Level skeleton */}
      <View className={`${isDark ? 'bg-card-dark' : 'bg-white'} rounded-2xl p-6 mb-4 shadow-sm`}>
        <View className="flex-row items-center mb-4">
          <View className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} w-12 h-12 rounded-xl items-center justify-center mr-4`}>
            <View className={`w-6 h-6 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded`} />
          </View>
          <View className="flex-1">
            <View className={`h-4 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-2 w-28`} />
            <View className={`h-3 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded w-36`} />
          </View>
        </View>
        <View className={`h-9 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} rounded w-24`} />
      </View>
    </>
  );
}
