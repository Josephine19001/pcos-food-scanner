import { View, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/theme-provider';
import { X, Calendar, Lock } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useRevenueCat } from '@/context/revenuecat-provider';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

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
  const { theme } = useTheme();
  const { requiresSubscriptionForFeature } = useRevenueCat();
  const router = useRouter();
  
  const handleSelectPeriod = (period: PeriodType) => {
    // All period filters require premium - only weekly tabs are free
    if (requiresSubscriptionForFeature('progress-filters')) {
      onClose();
      try {
        router.push('/paywall');
      } catch (error) {
        console.error('Navigation error:', error);
        toast.error('Please upgrade to premium for extended progress views');
      }
      return;
    }
    
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
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl`}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle Bar */}
          <View className="items-center py-3">
            <View className={`w-12 h-1 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`} />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-4">
            <View className="flex-row items-center">
              <Calendar size={24} color={theme === 'dark' ? '#F3F4F6' : '#374151'} />
              <Text className={`text-xl font-semibold ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Select Time Period</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className={`w-8 h-8 items-center justify-center rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <X size={18} color={theme === 'dark' ? '#D1D5DB' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          {/* Period Options */}
          <View className="px-6 pb-8">
            {periodOptions.map((option) => {
              const isPremiumFeature = requiresSubscriptionForFeature('progress-filters');
              
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelectPeriod(option.value)}
                  className={cn(
                    'flex-row items-center justify-between py-4 px-4 rounded-2xl mb-3',
                    selectedPeriod === option.value 
                      ? theme === 'dark' ? 'bg-pink-900/30 border border-pink-400' : 'bg-pink-50 border border-pink-200'
                      : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
                    isPremiumFeature && (theme === 'dark' ? 'border border-yellow-600/30' : 'border border-yellow-400/30')
                  )}
                >
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className={cn(
                        'text-lg font-medium',
                        selectedPeriod === option.value 
                          ? theme === 'dark' ? 'text-pink-300' : 'text-pink-700'
                          : theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {option.label}
                      </Text>
                      {isPremiumFeature && (
                        <View className="ml-2 flex-row items-center">
                          <Lock 
                            size={16} 
                            color={theme === 'dark' ? '#FCD34D' : '#F59E0B'} 
                          />
                          <Text className="text-xs font-semibold ml-1 text-yellow-600">PRO</Text>
                        </View>
                      )}
                    </View>
                    <Text className={cn(
                      'text-sm mt-1',
                      selectedPeriod === option.value 
                        ? theme === 'dark' ? 'text-pink-400' : 'text-pink-600'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    )}>
                      {isPremiumFeature ? 'Premium feature' : option.description}
                    </Text>
                  </View>
                  {selectedPeriod === option.value && (
                    <View className="w-6 h-6 rounded-full bg-pink-600 items-center justify-center">
                      <View className="w-2 h-2 rounded-full bg-white" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}