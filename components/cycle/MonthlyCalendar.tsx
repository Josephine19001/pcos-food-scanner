import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react-native';

interface MonthlyCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  loggedDates: string[]; // Array of logged period dates
  startDates?: string[]; // Array of period start dates
  endDates?: string[]; // Array of period end dates
  predictedDates?: string[]; // Array of predicted period dates
  onDatePress?: (date: Date) => void; // New prop for handling date clicks
}

export function MonthlyCalendar({
  selectedDate,
  onDateSelect,
  loggedDates = [],
  startDates = [],
  endDates = [],
  predictedDates = [],
  onDatePress,
}: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const today = new Date();
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar grid
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  const handleDayPress = (day: number) => {
    const newDate = new Date(currentYear, currentMonthIndex, day);
    onDateSelect(newDate);

    // If onDatePress is provided, call it for period logging
    if (onDatePress) {
      onDatePress(newDate);
    }
  };

  const isDateLogged = (day: number): boolean => {
    const dateString = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return loggedDates.includes(dateString);
  };

  const isStartDate = (day: number): boolean => {
    const dateString = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return startDates?.includes(dateString) || false;
  };

  const isEndDate = (day: number): boolean => {
    const dateString = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return endDates?.includes(dateString) || false;
  };

  const isPeriodDay = (day: number): boolean => {
    const dateString = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return loggedDates.includes(dateString);
  };

  const isSelectedDate = (day: number): boolean => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonthIndex &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const isToday = (day: number): boolean => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonthIndex &&
      today.getFullYear() === currentYear
    );
  };

  const isPredictedDate = (day: number): boolean => {
    const dateString = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return predictedDates.includes(dateString);
  };

  const isFutureDate = (day: number): boolean => {
    const date = new Date(currentYear, currentMonthIndex, day);
    const todayDate = new Date();
    const isToday = date.toDateString() === todayDate.toDateString();
    return date > todayDate && !isToday;
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className="bg-white rounded-2xl p-4 mx-4 mb-4 shadow-sm border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={goToPreviousMonth} className="p-2">
          <ChevronLeft size={20} color="#6B7280" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black">
          {monthNames[currentMonthIndex]} {currentYear}
        </Text>

        <TouchableOpacity onPress={goToNextMonth} className="p-2">
          <ChevronRight size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Day labels */}
      <View className="flex-row mb-2">
        {dayNames.map((dayName) => (
          <View key={dayName} className="flex-1 items-center py-2">
            <Text className="text-xs font-medium text-gray-500">{dayName}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View className="flex-row flex-wrap">
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => day && !isFutureDate(day) && handleDayPress(day)}
            disabled={!day || isFutureDate(day)}
            className="w-[14.28%] aspect-square items-center justify-center p-1"
          >
            {day ? (
              <View className="relative w-full h-full items-center justify-center">
                {/* Background circle for different states */}
                <View
                  className={`
                    absolute inset-0 rounded-full items-center justify-center
                                         ${
                                           isSelectedDate(day)
                                             ? 'bg-pink-500'
                                             : isPeriodDay(day)
                                               ? 'bg-red-400'
                                               : isPredictedDate(day)
                                                 ? 'bg-purple-100 border-2 border-purple-300 border-dashed'
                                                 : isToday(day)
                                                   ? 'bg-gray-100'
                                                   : 'bg-transparent'
                                         }
                  `}
                >
                  <Text
                    className={`
                      text-sm font-medium
                                             ${
                                               isFutureDate(day)
                                                 ? 'text-gray-300'
                                                 : isSelectedDate(day)
                                                   ? 'text-white'
                                                   : isPeriodDay(day)
                                                     ? 'text-white'
                                                     : isPredictedDate(day)
                                                       ? 'text-purple-700'
                                                       : isToday(day)
                                                         ? 'text-gray-900'
                                                         : 'text-gray-700'
                                             }
                    `}
                  >
                    {day}
                  </Text>
                </View>

                {/* Period indicator dots - only on start and end days */}
                {(isStartDate(day) || isEndDate(day)) && !isSelectedDate(day) && (
                  <View className="absolute bottom-1">
                    <Circle size={4} color="#EF4444" fill="#EF4444" />
                  </View>
                )}
              </View>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>

      {/* Legend */}
      <View className="flex-row justify-center mt-4" style={{ gap: 12 }}>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-red-400 mr-1" />
          <Text className="text-xs text-gray-600">Period days</Text>
        </View>
        <View className="flex-row items-center">
          <View className="relative">
            <View className="w-3 h-3 rounded-full bg-red-400 mr-1" />
            <Circle size={3} color="#EF4444" fill="#EF4444" className="absolute bottom-0 left-0" />
          </View>
          <Text className="text-xs text-gray-600 ml-1">Start/End</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300 border-dashed mr-1" />
          <Text className="text-xs text-gray-600">Predicted</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-pink-500 mr-1" />
          <Text className="text-xs text-gray-600">Selected</Text>
        </View>
      </View>
    </View>
  );
}
