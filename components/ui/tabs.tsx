import { View, Pressable, ScrollView } from 'react-native';
import { Text } from './text';

type Tab = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChangeTab: (tabId: string) => void;
};

export function Tabs({ tabs, activeTab, onChangeTab }: TabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="border-b border-gray-200 px-4"
    >
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onChangeTab(tab.id)}
          className={`px-4 py-3 border-b-2 ${
            activeTab === tab.id ? 'border-black' : 'border-transparent'
          }`}
        >
          <Text className={activeTab === tab.id ? 'text-black' : 'text-gray-500'}>{tab.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
