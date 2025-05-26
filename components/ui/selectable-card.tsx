import { Pressable, View } from 'react-native';
import { Text } from './text';
import { Check } from 'lucide-react-native';
import { cn } from '@/lib/utils';

type SelectableCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  className?: string;
  description?: string;
};

export function SelectableCard({
  label,
  selected,
  onPress,
  className,
  description,
}: SelectableCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'p-4 rounded-xl border',
        selected ? 'bg-black border-black' : 'bg-slate-100 border-slate-100',
        className
      )}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className={cn('text-base font-medium', selected ? 'text-white' : 'text-black')}>
            {label}
          </Text>
          {description && (
            <Text className={cn('text-sm mt-1', selected ? 'text-gray-300' : 'text-gray-500')}>
              {description}
            </Text>
          )}
        </View>
        {selected && (
          <View className="ml-2">
            <Check size={20} color="white" />
          </View>
        )}
      </View>
    </Pressable>
  );
}
