import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Pill, Plus, CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';

interface TodaysSupplementsProps {
  selectedDate: Date;
  supplementData?: Array<{
    supplement_name: string;
    taken: boolean;
    dosage?: string;
  }>;
  isLoading?: boolean;
}

export function TodaysSupplements({
  selectedDate,
  supplementData = [],
  isLoading,
}: TodaysSupplementsProps) {
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const takenSupplements = supplementData.filter((s) => s.taken);
  const totalSupplements = supplementData.length;

  if (isLoading) {
    return (
      <View className="mx-4 mb-6">
        <Text className="text-xl font-bold text-gray-900 mb-4">Supplements</Text>
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <View className="animate-pulse">
            <View className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <View className="h-3 bg-gray-200 rounded w-1/3" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="mx-4 mb-6">
      <Text className="text-xl font-bold text-gray-900 mb-4">Supplements</Text>

      {supplementData.length > 0 ? (
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          {/* Progress Summary */}
          <View className="bg-green-50 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-green-900 text-lg font-bold">
                  {takenSupplements.length} of {totalSupplements}
                </Text>
                <Text className="text-green-700 text-sm">
                  {takenSupplements.length === totalSupplements
                    ? 'All supplements taken!'
                    : 'supplements completed'}
                </Text>
              </View>
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                <Pill size={20} color="#10B981" />
              </View>
            </View>
          </View>

          {/* Supplement List */}
          <View className="space-y-3 mb-4">
            {supplementData.map((supplement, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">
                    {supplement.supplement_name || 'Vitamin D3'}
                  </Text>
                  {supplement.dosage && (
                    <Text className="text-gray-500 text-sm">{supplement.dosage}</Text>
                  )}
                </View>
                <View className="ml-3">
                  {supplement.taken ? (
                    <View className="flex-row items-center">
                      <CheckCircle size={16} color="#10B981" />
                      <Text className="text-green-600 text-xs ml-1 font-medium">Taken</Text>
                    </View>
                  ) : (
                    <View className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Log Supplements Button */}
          <TouchableOpacity
            onPress={() => router.push('/log-supplements')}
            className="bg-green-500 py-4 rounded-2xl"
          >
            <Text className="text-white font-semibold text-center">
              {takenSupplements.length === 0 ? 'Log Supplements' : 'Update Supplements'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <View className="items-center py-4">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-3">
              <Pill size={24} color="#10B981" />
            </View>
            <Text className="text-gray-500 text-center text-lg font-medium mb-2">
              No supplements tracked
            </Text>
            <Text className="text-gray-400 text-center text-sm mb-4">
              Add supplements like Vitamin D, B12, or Iron
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/log-supplements')}
              className="bg-green-500 py-3 px-6 rounded-xl flex-row items-center"
            >
              <Plus size={16} color="white" />
              <Text className="text-white font-semibold ml-2">Add Supplements</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
