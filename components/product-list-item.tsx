import { View, Text, Pressable } from 'react-native';
import { Plus, Bookmark } from 'lucide-react-native';
import { cn } from '@/lib/utils';

type ProductListItemProps = {
  name: string;
  category: string;
  brand?: string;
  isSaved?: boolean;
  onPress?: () => void;
};

export default function ProductListItem({
  name,
  category,
  brand,
  isSaved = false,
  onPress,
}: ProductListItemProps) {
  return (
    <View className="flex-row items-center justify-between bg-gray-50 dark:bg-neutral-900 px-4 py-3 rounded-2xl mb-3">
      <View>
        <Text className="text-base font-semibold text-black dark:text-white">{name}</Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
          {brand ? `${brand} · ` : ''}
          {category}
        </Text>
      </View>

      <Pressable
        onPress={onPress}
        className={cn(
          'w-9 h-9 rounded-full items-center justify-center',
          isSaved ? 'bg-gray-200 dark:bg-gray-700' : 'bg-black'
        )}
      >
        {isSaved ? (
          <Bookmark size={18} color={isSaved ? 'black' : 'white'} />
        ) : (
          <Plus size={20} color="white" />
        )}
      </Pressable>
    </View>
  );
}
