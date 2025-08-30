import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { X, Calendar, Play, Square } from 'lucide-react-native';

interface PeriodModalProps {
  isVisible: boolean;
  selectedDate: Date;
  isLoggedDate: boolean;
  isStartDate: boolean;
  hasOngoingPeriod: boolean; // Is there a period currently ongoing
  onClose: () => void;
  onStartPeriod: () => void;
  onEndPeriod: () => void;
  onRemovePeriod: () => void;
}

export function PeriodModal({
  isVisible,
  selectedDate,
  isLoggedDate,
  isStartDate,
  hasOngoingPeriod,
  onClose,
  onStartPeriod,
  onEndPeriod,
  onRemovePeriod,
}: PeriodModalProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPastDate = selectedDate < new Date();

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 pt-4">
          {/* Handle Bar */}
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

          {/* Close Button */}
          <View className="flex-row justify-end mb-4">
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            >
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-pink-100 rounded-full items-center justify-center mb-3">
              <Calendar size={24} color="#EC4899" />
            </View>
            <Text className="text-xl font-bold text-black text-center">
              {isToday ? 'Today' : formatDate(selectedDate)}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {isToday ? 'Log your period' : 'Update period log'}
            </Text>
          </View>

          {/* Current Status */}
          {isLoggedDate && (
            <View className="bg-pink-50 rounded-2xl p-4 mb-6 flex-row items-center">
              <Text className="text-2xl mr-3">{isStartDate ? '🔴' : '🩸'}</Text>
              <View className="flex-1">
                <Text className="text-pink-900 font-semibold">
                  {isStartDate ? 'Period start day' : 'Period day'}
                </Text>
                <Text className="text-pink-700 text-sm">Already logged for this date</Text>
              </View>
            </View>
          )}

          {/* Actions */}
          <View className="mb-4">
            {!isLoggedDate ? (
              <View>
                {/* Start Period Button */}
                <TouchableOpacity
                  onPress={onStartPeriod}
                  className="bg-red-500 py-4 rounded-2xl flex-row items-center justify-center mb-3"
                >
                  <Calendar size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">Start period</Text>
                </TouchableOpacity>

                {/* End Period Button - only show if there's an ongoing period */}
                {hasOngoingPeriod && (
                  <TouchableOpacity
                    onPress={onEndPeriod}
                    className="bg-purple-500 py-4 rounded-2xl flex-row items-center justify-center"
                  >
                    <Calendar size={20} color="white" />
                    <Text className="text-white font-semibold text-lg ml-2">End period</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <TouchableOpacity
                onPress={onRemovePeriod}
                className="bg-gray-500 py-4 rounded-2xl flex-row items-center justify-center"
              >
                <X size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">Remove period log</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Helper Text */}
          <View className="bg-blue-50 rounded-2xl p-4 mb-4">
            <Text className="text-blue-900 text-sm font-medium text-center">
              {!isLoggedDate
                ? hasOngoingPeriod
                  ? 'You can start a new period or end your current one on this date'
                  : "Tap 'Start period' to begin tracking your cycle from this date"
                : 'You can remove this period log if it was added by mistake'}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
