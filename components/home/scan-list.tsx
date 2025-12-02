import { FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';
import { ScanCard } from './scan-card';
import { EmptyState } from './empty-state';
import type { ScanResult } from '@/lib/types/scan';
import type { TabType } from './tab-switcher';

interface ScanListProps {
  scans: ScanResult[];
  isLoading: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  activeTab: TabType;
  searchQuery: string;
  onScanPress?: (scan: ScanResult) => void;
  onToggleFavorite?: (scan: ScanResult) => void;
}

export function ScanList({
  scans,
  isLoading,
  isRefreshing = false,
  onRefresh,
  activeTab,
  searchQuery,
  onScanPress,
  onToggleFavorite,
}: ScanListProps) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  if (scans.length === 0) {
    const emptyType = searchQuery ? 'search' : activeTab;
    return <EmptyState type={emptyType} searchQuery={searchQuery} />;
  }

  return (
    <FlatList
      data={scans}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <ScanCard
          scan={item}
          index={index}
          onPress={() => onScanPress?.(item)}
          onToggleFavorite={() => onToggleFavorite?.(item)}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#0D9488"
            colors={['#0D9488']}
          />
        ) : undefined
      }
    />
  );
}
