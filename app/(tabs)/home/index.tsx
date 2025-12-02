import { useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { PageLayout } from '@/components/layouts';
import { SearchBar, TabSwitcher, ScanList, type TabType } from '@/components/home';
import { useScans, useToggleFavorite } from '@/lib/hooks/use-scans';
import type { ScanResult } from '@/lib/types/scan';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch scans from backend
  const { data: scans = [], isLoading, refetch, isRefetching } = useScans();
  const toggleFavorite = useToggleFavorite();

  // Filter scans based on active tab and search query
  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const matchesSearch = scan.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || (activeTab === 'favorites' && scan.is_favorite);
      return matchesSearch && matchesTab;
    });
  }, [scans, activeTab, searchQuery]);

  const handleScanPress = useCallback((scan: ScanResult) => {
    // TODO: Navigate to scan detail screen
    router.push(`/scan/${scan.id}`);
  }, [router]);

  const handleToggleFavorite = useCallback((scan: ScanResult) => {
    toggleFavorite.mutate(scan);
  }, [toggleFavorite]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageLayout title="My Scans">
      <View className="flex-1">
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        <ScanList
          scans={filteredScans}
          isLoading={isLoading}
          isRefreshing={isRefetching}
          onRefresh={handleRefresh}
          activeTab={activeTab}
          searchQuery={searchQuery}
          onScanPress={handleScanPress}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>
    </PageLayout>
  );
}
