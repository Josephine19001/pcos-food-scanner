import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { X, Check } from 'lucide-react-native';
import { useTheme } from '@/context/theme-provider';
import { ElegantPeriodCalendar } from './ElegantPeriodCalendar';
import { getLocalDateString } from '@/lib/utils/date-helpers';

interface PeriodEditingModalProps {
  visible: boolean;
  onClose: () => void;
  initialPeriodDates: string[];
  onSave: (periodDates: string[]) => void;
  title?: string;
}

const { height: screenHeight } = Dimensions.get('window');

export function PeriodEditingModal({
  visible,
  onClose,
  initialPeriodDates,
  onSave,
  title = 'Edit Period Dates',
}: PeriodEditingModalProps) {
  const { isDark } = useTheme();
  const [periodDates, setPeriodDates] = useState<string[]>(initialPeriodDates);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setPeriodDates(initialPeriodDates);
      setHasChanges(false);
    }
  }, [visible, initialPeriodDates]);

  const handleDateToggle = useCallback(
    (date: Date, isPeriodDate: boolean) => {
      const dateString = getLocalDateString(date);

      setPeriodDates((currentDates) => {
        let newDates: string[];

        if (isPeriodDate) {
          // Remove date from period dates
          newDates = currentDates.filter((d) => d !== dateString);
        } else {
          // Add date to period dates
          newDates = [...currentDates, dateString].sort();
        }

        // Check if there are changes
        const hasActualChanges =
          newDates.length !== initialPeriodDates.length ||
          !newDates.every((date) => initialPeriodDates.includes(date));

        setHasChanges(hasActualChanges);

        return newDates;
      });
    },
    [initialPeriodDates]
  );

  const handleSave = useCallback(() => {
    if (!hasChanges) {
      onClose();
      return;
    }

    onSave(periodDates);
    onClose();
  }, [hasChanges, periodDates, onSave, onClose]);

  const handleCancel = useCallback(() => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to cancel?',
        [
          {
            text: 'Keep Editing',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: onClose,
          },
        ]
      );
    } else {
      onClose();
    }
  }, [hasChanges, onClose]);

  const getPeriodStats = useCallback(() => {
    if (periodDates.length === 0) return 'No period dates selected';
    if (periodDates.length === 1) return '1 day selected';
    return `${periodDates.length} days selected`;
  }, [periodDates]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header */}
        <View
          className={`px-4 py-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleCancel} className="p-2 -ml-2">
              <X size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>

            <View className="flex-1 items-center">
              <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {getPeriodStats()}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSave}
              className={`p-2 -mr-2 ${hasChanges ? 'opacity-100' : 'opacity-50'}`}
              disabled={!hasChanges}
            >
              <Check
                size={24}
                color={
                  hasChanges ? (isDark ? '#10B981' : '#10B981') : isDark ? '#6B7280' : '#9CA3AF'
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar */}
        <ElegantPeriodCalendar
          periodDates={periodDates}
          onDateToggle={handleDateToggle}
          editMode={true}
          minDate={new Date(2024, 0, 1)} // January 1, 2024
          maxDate={new Date()}
        />
      </View>
    </Modal>
  );
}
