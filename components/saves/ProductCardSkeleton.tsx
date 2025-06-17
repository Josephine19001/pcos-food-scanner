import { View } from 'react-native';

export function ProductCardSkeleton() {
  return (
    <View
      className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
      style={{ height: 280 }} // Fixed height matching ProductCard
    >
      <View className="flex-1 items-center justify-between">
        {/* Product Image Skeleton with Score Badge */}
        <View className="relative mb-3">
          {/* Image skeleton */}
          <View className="w-20 h-20 rounded-2xl bg-gray-200" />

          {/* Safety Score Badge skeleton */}
          <View className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-200" />

          {/* Favorite Icon skeleton */}
          <View className="absolute -top-1 -left-1 w-6 h-6 bg-gray-200 rounded-full" />
        </View>

        {/* Product Info Skeleton - Fixed height container */}
        <View className="flex-1 items-center justify-center px-2">
          {/* Product Name skeleton - Fixed height */}
          <View className="h-12 justify-center mb-2 w-full">
            <View className="h-4 bg-gray-200 rounded-lg mb-1 w-full" />
            <View className="h-4 bg-gray-200 rounded-lg w-3/4 self-center" />
          </View>

          {/* Brand skeleton */}
          <View className="h-4 bg-gray-200 rounded-lg mb-3 w-20" />

          {/* Safety Status Card skeleton */}
          <View className="px-3 py-2 rounded-xl mb-3 bg-gray-100">
            <View className="h-4 bg-gray-200 rounded-lg w-16" />
          </View>
        </View>

        {/* Bottom Section Skeleton - Category and Benefits */}
        <View className="w-full">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 items-center">
              <View className="h-3 bg-gray-200 rounded-lg mb-1 w-12" />
              <View className="h-4 bg-gray-200 rounded-lg w-16" />
            </View>

            <View className="w-px h-8 bg-gray-200 mx-3" />

            <View className="flex-1 items-center">
              <View className="h-3 bg-gray-200 rounded-lg mb-1 w-12" />
              <View className="h-4 bg-gray-200 rounded-lg w-4" />
            </View>
          </View>

          {/* Date skeleton */}
          <View className="mt-3 pt-3 border-t border-gray-100">
            <View className="h-3 bg-gray-200 rounded-lg w-16 self-center" />
          </View>
        </View>
      </View>
    </View>
  );
}
