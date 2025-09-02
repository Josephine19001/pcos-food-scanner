import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { Calendar, X } from 'lucide-react-native';
import { MonthlyCalendar } from '@/components/cycle/MonthlyCalendar';
import { formatSelectedDate, type NextPeriodPrediction } from '@/lib/utils/cycle-utils';

interface FullCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  loggedDates: string[];
  startDates: string[];
  endDates: string[];
  predictedDates: string[];
  nextPeriodPrediction: NextPeriodPrediction | null;
  onDatePress: (date: Date) => void;
  onLogPeriodPress: () => void;
  hasOngoingPeriod?: boolean;
}

export function FullCalendarModal({
  visible,
  onClose,
  selectedDate,
  onDateSelect,
  loggedDates,
  startDates,
  endDates,
  predictedDates,
  nextPeriodPrediction,
  onDatePress,
  onLogPeriodPress,
  hasOngoingPeriod,
}: FullCalendarModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/30">
        <View className="flex-1 mt-16 bg-white rounded-t-3xl shadow-2xl">
          {/* Modal Header */}
          <View className="px-6 pt-6 pb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-2xl font-bold text-gray-900">Period Calendar</Text>
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              >
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text className="text-gray-600 text-sm">Track your cycle and log period days</Text>
          </View>

          {/* Calendar Content */}
          <View className="flex-1 px-4">
            <MonthlyCalendar
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
              loggedDates={loggedDates}
              startDates={startDates}
              endDates={endDates}
              predictedDates={predictedDates}
              onDatePress={onDatePress}
            />
          </View>

          {/* Log Period Button */}
          <View className="px-6 pb-6 pt-4 border-t border-gray-100">
            <TouchableOpacity
              onPress={onLogPeriodPress}
              className={`py-4 rounded-2xl flex-row items-center justify-center ${
                hasOngoingPeriod ? 'bg-red-500' : 'bg-pink-500'
              }`}
            >
              <Calendar size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold text-lg ml-2">
                {hasOngoingPeriod ? 'End Period' : 'Start Period'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
