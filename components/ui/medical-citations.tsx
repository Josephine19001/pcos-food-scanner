import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Info, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export function MedicalCitations() {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="bg-gray-50 rounded-xl p-4 mb-4"
      onPress={() => router.push('/settings/medical-sources')}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Info size={16} color="#6B7280" />
          <Text className="text-sm text-gray-700 ml-2 font-medium">
            Recommendations based on scientific evidence
          </Text>
        </View>
        <ChevronRight size={16} color="#6B7280" />
      </View>
      
      <Text className="text-xs text-gray-500 mt-2">
        Tap to learn how Luna makes recommendations
      </Text>
    </TouchableOpacity>
  );
}