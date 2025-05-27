import { View, ScrollView, Pressable, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { Calendar } from 'lucide-react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useState } from 'react';
import { format } from 'date-fns';

type TimeFilterOption = {
  label: string;
  value: string;
};

type TimeFilterProps = {
  value: string;
  onChange: (value: string) => void;
  onDateSelect?: (date: string) => void;
  options: TimeFilterOption[];
};

export function TimeFilter({ value, onChange, onDateSelect, options }: TimeFilterProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    onDateSelect?.(date);
    setShowCalendar(false);
    // When a date is selected, switch to daily view
    onChange('daily');
  };

  const getDisplayDate = () => {
    if (!selectedDate) return 'Select Date';
    return format(new Date(selectedDate), 'MMM d, yyyy');
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row gap-2">
        {options.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => {
              onChange(option.value);
              // Clear selected date when switching to other views
              if (option.value !== 'daily') {
                setSelectedDate('');
              }
            }}
            className={`px-4 py-2 rounded-full ${
              value === option.value ? 'bg-black' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-base ${value === option.value ? 'text-white' : 'text-gray-600'}`}
            >
              {option.value === 'daily' && selectedDate ? getDisplayDate() : option.label}
            </Text>
          </Pressable>
        ))}

        <Pressable
          onPress={() => setShowCalendar(true)}
          className="px-4 py-2 rounded-full bg-gray-100 flex-row items-center"
        >
          <Calendar size={20} color="#4B5563" />
        </Pressable>
      </View>

      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <Pressable
          className="flex-1 bg-black/20 justify-center p-4"
          onPress={() => setShowCalendar(false)}
        >
          <View className="bg-white rounded-2xl overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-medium">Select Date</Text>
            </View>
            <RNCalendar
              onDayPress={(day) => handleDateSelect(day.dateString)}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: 'black' },
              }}
              theme={{
                todayTextColor: '#000',
                selectedDayBackgroundColor: '#000',
                arrowColor: '#000',
                monthTextColor: '#000',
                textDayFontFamily: 'Inter',
                textMonthFontFamily: 'Inter',
                textDayHeaderFontFamily: 'Inter',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
            <View className="p-4 border-t border-gray-100">
              <Pressable
                onPress={() => setShowCalendar(false)}
                className="bg-gray-100 py-3 rounded-xl"
              >
                <Text className="text-center text-base">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
