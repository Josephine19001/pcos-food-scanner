import { useState, useMemo, useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeHeader, ScanList, type TabType } from '@/components/home';
import { useScans, useToggleFavorite } from '@/lib/hooks/use-scans';
import { DEMO_MODE, DEMO_SCANS } from '@/lib/config/demo-data';
import type { ScanResult } from '@/lib/types/scan';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [demoScans, setDemoScans] = useState(DEMO_SCANS);

  // Fetch scans from backend (only when not in demo mode)
  const { data: apiScans = [], isLoading: apiLoading, refetch, isRefetching } = useScans();
  const toggleFavorite = useToggleFavorite();

  // Use demo data or real data based on DEMO_MODE
  const scans = DEMO_MODE ? demoScans : apiScans;
  const isLoading = DEMO_MODE ? false : apiLoading;

  // Filter scans based on active tab and search query
  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const matchesSearch = scan.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || (activeTab === 'saves' && scan.is_favorite);
      return matchesSearch && matchesTab;
    });
  }, [scans, activeTab, searchQuery]);

  const handleScanPress = useCallback((scan: ScanResult) => {
    router.push(`/scan/${scan.id}`);
  }, [router]);

  const handleToggleFavorite = useCallback((scan: ScanResult) => {
    if (DEMO_MODE) {
      // Toggle favorite in demo mode locally
      setDemoScans((prev) =>
        prev.map((s) =>
          s.id === scan.id ? { ...s, is_favorite: !s.is_favorite } : s
        )
      );
    } else {
      toggleFavorite.mutate(scan);
    }
  }, [toggleFavorite]);

  const handleRefresh = useCallback(() => {
    if (!DEMO_MODE) {
      refetch();
    }
  }, [refetch]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <HomeHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ScanList
        scans={filteredScans}
        isLoading={isLoading}
        isRefreshing={DEMO_MODE ? false : isRefetching}
        onRefresh={handleRefresh}
        activeTab={activeTab}
        searchQuery={searchQuery}
        onScanPress={handleScanPress}
        onToggleFavorite={handleToggleFavorite}
      />
    </View>
  );
}
