import { View, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { X, Calendar } from 'lucide-react-native';
import { cn } from '@/lib/utils';

type PeriodType = '90days' | '6months' | '1year' | 'alltime';

interface PeriodSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPeriod: PeriodType;
  onSelectPeriod: (period: PeriodType) => void;
}

const periodOptions = [
  { label: '90 Days', value: '90days' as PeriodType, description: 'Last 3 months' },
  { label: '6 Months', value: '6months' as PeriodType, description: 'Half year view' },
  { label: '1 Year', value: '1year' as PeriodType, description: 'Annual overview' },
  { label: 'All Time', value: 'alltime' as PeriodType, description: 'Complete history' },
];

export function PeriodSelectionModal({
  visible,
  onClose,
  selectedPeriod,
  onSelectPeriod,
}: PeriodSelectionModalProps) {
  const handleSelectPeriod = (period: PeriodType) => {
    onSelectPeriod(period);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-t-3xl"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle Bar */}
          <View className="items-center py-3">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-4">
            <View className="flex-row items-center">
              <Calendar size={24} color="#374151" />
              <Text className="text-xl font-semibold ml-2">Select Time Period</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <X size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Period Options */}
          <View className="px-6 pb-8">
            {periodOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelectPeriod(option.value)}
                className={cn(
                  'flex-row items-center justify-between py-4 px-4 rounded-2xl mb-3',
                  selectedPeriod === option.value ? 'bg-pink-50 border border-pink-200' : 'bg-gray-50'
                )}
              >
                <View className="flex-1">
                  <Text className={cn(
                    'text-lg font-medium',
                    selectedPeriod === option.value ? 'text-pink-700' : 'text-gray-900'
                  )}>
                    {option.label}
                  </Text>
                  <Text className={cn(
                    'text-sm mt-1',
                    selectedPeriod === option.value ? 'text-pink-600' : 'text-gray-500'
                  )}>
                    {option.description}
                  </Text>
                </View>
                {selectedPeriod === option.value && (
                  <View className="w-6 h-6 rounded-full bg-pink-600 items-center justify-center">
                    <View className="w-2 h-2 rounded-full bg-white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}