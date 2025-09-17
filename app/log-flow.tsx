import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import SubPageLayout from '@/components/layouts/sub-page';
import { useTheme } from '@/context/theme-provider';
import { FlowLevels, type FlowLevel } from '@/components/icons/flow-icons';
import { Droplet } from 'lucide-react-native';
import { useFlowForDate, useSaveFlow } from '@/lib/hooks/use-cycle-flo-style';
import { useAppNavigation } from '@/lib/hooks/use-navigation';

export default function LogFlowScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const selectedDate = date ? new Date(date) : new Date();
  const dateString = selectedDate.toISOString().split('T')[0];

  const { isDark } = useTheme();
  const { goBack } = useAppNavigation();
  const { data: existingFlowData, isLoading } = useFlowForDate(dateString);
  const saveFlowMutation = useSaveFlow();

  const [selectedFlow, setSelectedFlow] = useState<FlowLevel | null>(
    existingFlowData?.flow_intensity || null
  );

  // Update state when data loads
  React.useEffect(() => {
    if (existingFlowData) {
      setSelectedFlow(existingFlowData.flow_intensity || null);
    }
  }, [existingFlowData]);

  const flowOptions: FlowLevel[] = ['spotting', 'light', 'moderate', 'heavy'];

  const getDropletCount = (level: FlowLevel): number => {
    switch (level) {
      case 'spotting':
        return 1;
      case 'light':
        return 2;
      case 'moderate':
        return 3;
      case 'heavy':
        return 4;
      default:
        return 1;
    }
  };

  const handleSave = async () => {
    if (!selectedFlow) {
      return;
    }

    try {
      await saveFlowMutation.mutateAsync({
        date: dateString,
        flow_intensity: selectedFlow,
      });
      goBack();
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Failed to save flow data:', error);
    }
  };

  if (isLoading) {
    return (
      <SubPageLayout title="Log Flow" onBack={goBack}>
        <View className="flex-1 justify-center items-center">
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</Text>
        </View>
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout
      title="Log Flow"
      onBack={goBack}
      rightElement={
        <TouchableOpacity
          onPress={handleSave}
          disabled={!selectedFlow || saveFlowMutation.isPending}
          className={`px-4 py-2 rounded-full ${
            selectedFlow && !saveFlowMutation.isPending
              ? isDark
                ? 'bg-pink-600'
                : 'bg-pink-500'
              : isDark
              ? 'bg-gray-700'
              : 'bg-gray-300'
          }`}
        >
          <Text
            className={`font-medium ${
              selectedFlow && !saveFlowMutation.isPending
                ? 'text-white'
                : isDark
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            {saveFlowMutation.isPending ? 'Logging...' : 'Log'}
          </Text>
        </TouchableOpacity>
      }
    >
      <View className="flex-1 px-4 py-6">
        {/* Flow Level Selection */}
        <View className="mb-8">
          <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Flow Level
          </Text>

          <View>
            {flowOptions.map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setSelectedFlow(level)}
                className={`flex-row items-center p-4 rounded-xl border mb-3 ${
                  selectedFlow === level
                    ? isDark
                      ? 'bg-pink-900/30 border-pink-600'
                      : 'bg-pink-50 border-pink-500'
                    : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <View className="mr-4 flex-row">
                  {Array.from({ length: getDropletCount(level) }).map((_, index) => (
                    <Droplet
                      key={index}
                      size={20}
                      color={selectedFlow === level ? '#DC2626' : isDark ? '#9CA3AF' : '#6B7280'}
                      className={index > 0 ? 'ml-1' : ''}
                    />
                  ))}
                </View>

                <View className="flex-1">
                  <Text
                    className={`text-base font-medium ${
                      selectedFlow === level
                        ? isDark
                          ? 'text-pink-100'
                          : 'text-pink-900'
                        : isDark
                        ? 'text-gray-200'
                        : 'text-gray-900'
                    }`}
                  >
                    {FlowLevels[level]}
                  </Text>
                </View>

                {selectedFlow === level && (
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center ${
                      isDark ? 'bg-pink-600' : 'bg-pink-500'
                    }`}
                  >
                    <View className="w-2 h-2 rounded-full bg-white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SubPageLayout>
  );
}
