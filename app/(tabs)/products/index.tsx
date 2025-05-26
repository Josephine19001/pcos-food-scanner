import { View, Pressable, TextInput, ScrollView } from 'react-native';
import { Search, Camera, Plus, Bookmark } from 'lucide-react-native';
import { useState } from 'react';
import { Tabs } from '@/components/ui';
import { router } from 'expo-router';
import EmptyState from '@/components/empty-state';
import PageLayout from '@/components/layouts/page-layout';
import Research from '@/assets/svg/research';
import Toiletries from '@/assets/svg/toiletries';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'my-products', label: 'My products' },
  { id: 'saved-products', label: 'Saved products' },
];

const emptyStates = {
  'my-products': {
    icon: Toiletries,
    title: 'You have no routine products.',
    description: 'Add some products to your routine to get started.',
    action: {
      label: 'Add a Product',
      onPress: () => router.push('/scan'),
      icon: Plus,
    },
  },
  'saved-products': {
    icon: Research,
    title: 'No saved products',
    description: 'Save products you want to try later.',
    action: {
      label: 'Save a Product',
      onPress: () => router.push('/scan'),
      icon: Bookmark,
    },
  },
};

export default function ProductsScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasScannedItems, setHasScannedItems] = useState(false);

  return (
    <PageLayout title="Products">
      <View className="px-4 pt-5 pb-4">
        <View className="flex-row items-center space-x-3 gap-4">
          <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-2 shadow-sm">
            <View className="w-10 h-10 items-center justify-center">
              <Search size={20} color="#666" />
            </View>
            <TextInput
              placeholder="Search shampoos, conditioners, etc."
              className="flex-1 ml-2 text-base h-10"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Pressable
            onPress={() => router.push('/scan')}
            className="w-10 h-10 bg-black rounded-xl items-center justify-center"
          >
            <Camera size={24} color="white" />
          </Pressable>
        </View>
      </View>

      <Tabs tabs={tabs} activeTab={activeTab} onChangeTab={setActiveTab} />

      <ScrollView className="flex-1 px-4">
        {activeTab !== 'all' && (
          <EmptyState
            icon={emptyStates[activeTab as keyof typeof emptyStates]?.icon}
            title={emptyStates[activeTab as keyof typeof emptyStates]?.title}
            description={emptyStates[activeTab as keyof typeof emptyStates]?.description}
            action={emptyStates[activeTab as keyof typeof emptyStates]?.action}
          />
        )}
      </ScrollView>
    </PageLayout>
  );
}
