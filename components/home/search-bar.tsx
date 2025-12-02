import { View, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search scans...' }: SearchBarProps) {
  return (
    <View className="px-4 mb-4">
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
        <Search size={20} color="#9CA3AF" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          className="flex-1 ml-3 text-gray-900 text-base"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText('')} hitSlop={10}>
            <X size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
