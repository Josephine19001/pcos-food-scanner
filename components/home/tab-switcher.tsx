import { View, Text, Pressable } from 'react-native';

export type TabType = 'all' | 'favorites';

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <View className="flex-row mx-4 mb-4 bg-gray-100 rounded-xl p-1">
      <Pressable
        onPress={() => onTabChange('all')}
        className={`flex-1 py-2.5 rounded-lg ${
          activeTab === 'all' ? 'bg-white shadow-sm' : ''
        }`}
      >
        <Text
          className={`text-center font-medium ${
            activeTab === 'all' ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          All Scans
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onTabChange('favorites')}
        className={`flex-1 py-2.5 rounded-lg ${
          activeTab === 'favorites' ? 'bg-white shadow-sm' : ''
        }`}
      >
        <Text
          className={`text-center font-medium ${
            activeTab === 'favorites' ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          Favorites
        </Text>
      </Pressable>
    </View>
  );
}
