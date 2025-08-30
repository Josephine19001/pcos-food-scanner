import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import SubPageLayout from '@/components/layouts/sub-page';
import { Calendar, Save, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLogPeriodData, useDeletePeriodLog } from '@/lib/hooks/use-cycle-data';

export default function EditPeriodScreen() {
  const params = useLocalSearchParams();
  const startDateParam = params.startDate as string;
  const endDateParam = params.endDate as string;

  const [startDate, setStartDate] = useState(new Date(startDateParam || new Date()));
  const [endDate, setEndDate] = useState(
    endDateParam && endDateParam !== '' ? new Date(endDateParam) : null
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const logPeriodData = useLogPeriodData();
  const deletePeriodLog = useDeletePeriodLog();

  const handleStartDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }
    if (date) {
      setStartDate(date);
      // If end date is before start date, clear it
      if (endDate && date > endDate) {
        setEndDate(null);
      }
    }
  };

  const handleEndDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }
    if (date) {
      setEndDate(date);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Format dates for API
      const startDateString = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;

      // If we're changing the start date, remove the old start date first
      if (startDateParam !== startDateString) {
        await new Promise((resolve, reject) => {
          deletePeriodLog.mutate(startDateParam, {
            onSuccess: () => resolve(undefined),
            onError: (error) => reject(error),
          });
        });
      }

      // Log the start date
      await new Promise((resolve, reject) => {
        logPeriodData.mutate(
          {
            date: startDateString,
            is_start_day: true,
            notes: 'Period started',
          },
          {
            onSuccess: () => resolve(undefined),
            onError: (error) => reject(error),
          }
        );
      });

      // Handle end date changes
      if (endDateParam && endDateParam !== '') {
        // Remove the old end date first (if it exists)
        await new Promise((resolve, reject) => {
          deletePeriodLog.mutate(endDateParam, {
            onSuccess: () => resolve(undefined),
            onError: (error) => reject(error),
          });
        });
      }

      // If end date is set, log the new end date
      if (endDate) {
        const endDateString = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

        await new Promise((resolve, reject) => {
          logPeriodData.mutate(
            {
              date: endDateString,
              is_start_day: false,
              notes: 'Period ended',
            },
            {
              onSuccess: () => resolve(undefined),
              onError: (error) => reject(error),
            }
          );
        });
      }

      // Success - navigate back
      router.back();
    } catch (error) {
      console.error('Error saving period dates:', error);
      Alert.alert('Error', 'Failed to save period dates. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SubPageLayout
      title="Edit Period Dates"
      rightElement={
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          className={`w-10 h-10 items-center justify-center rounded-full border ${
            isSaving ? 'bg-pink-100 border-pink-100' : 'bg-pink-50 border-pink-200'
          }`}
        >
          <Save size={20} color={isSaving ? '#F3B0CC' : '#EC4899'} />
        </TouchableOpacity>
      }
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6">
          {/* Start Date */}
          <View className="mb-6">
            <Text className="text-base font-medium text-black mb-3">Period Start Date</Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Calendar size={20} color="#EC4899" />
                  <Text className="text-black ml-3 font-medium">{formatDate(startDate)}</Text>
                </View>
                <Text className="text-pink-600 text-sm font-medium">Change</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* End Date */}
          <View className="mb-6">
            <Text className="text-base font-medium text-black mb-3">Period End Date</Text>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Calendar size={20} color="#EC4899" />
                  <Text className="text-black ml-3 font-medium">
                    {endDate ? formatDate(endDate) : 'Not set (ongoing)'}
                  </Text>
                </View>
                <Text className="text-pink-600 text-sm font-medium">
                  {endDate ? 'Change' : 'Set'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Clear end date option */}
            {endDate && (
              <TouchableOpacity
                onPress={() => setEndDate(null)}
                className="mt-2 flex-row items-center justify-center py-2"
              >
                <X size={16} color="#6B7280" />
                <Text className="text-gray-500 text-sm ml-1">Mark as ongoing</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Helper Text */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <Text className="text-blue-900 font-medium text-sm mb-2">Tips:</Text>
            <Text className="text-blue-800 text-sm leading-relaxed">
              • Period start is the first day of bleeding{'\n'}• Period end is the last day of
              bleeding{'\n'}• Leave end date unset if period is still ongoing{'\n'}• Typical periods
              last 3-7 days
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            className={`py-4 rounded-2xl mb-8 ${isSaving ? 'bg-pink-300' : 'bg-pink-500'}`}
          >
            <Text className="text-white font-semibold text-center text-lg">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {Platform.OS === 'ios' ? (
        <>
          {/* Start Date Picker */}
          <Modal
            visible={showStartPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowStartPicker(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white rounded-t-3xl">
                <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                  <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                    <Text className="text-pink-600 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <Text className="text-lg font-semibold text-black">Period Start</Text>
                  <TouchableOpacity onPress={() => setShowStartPicker(false)}>
                    <Text className="text-pink-600 font-medium">Done</Text>
                  </TouchableOpacity>
                </View>
                <View className="pb-8">
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="spinner"
                    onChange={handleStartDateChange}
                    maximumDate={new Date()}
                    style={{ height: 200 }}
                  />
                </View>
              </View>
            </View>
          </Modal>

          {/* End Date Picker */}
          <Modal
            visible={showEndPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowEndPicker(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white rounded-t-3xl">
                <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                  <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                    <Text className="text-pink-600 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <Text className="text-lg font-semibold text-black">Period End</Text>
                  <TouchableOpacity onPress={() => setShowEndPicker(false)}>
                    <Text className="text-pink-600 font-medium">Done</Text>
                  </TouchableOpacity>
                </View>
                <View className="pb-8">
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleEndDateChange}
                    minimumDate={startDate}
                    maximumDate={new Date()}
                    style={{ height: 200 }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
              maximumDate={new Date()}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              minimumDate={startDate}
              maximumDate={new Date()}
            />
          )}
        </>
      )}
    </SubPageLayout>
  );
}
