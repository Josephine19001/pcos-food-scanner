import { useState, useMemo, useCallback } from 'react';
import { View, StatusBar, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Sparkles, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { HomeHeader, ScanList, type TabType } from '@/components/home';
import { useScans, useToggleFavorite, useDeleteScan, useScansRealtime } from '@/lib/hooks/use-scans';
import { usePendingScan } from '@/context/pending-scan-provider';
import { useRevenueCat } from '@/context/revenuecat-provider';
import { DEMO_MODE, DEMO_SCANS } from '@/lib/config/demo-data';
import type { ScanResult } from '@/lib/types/scan';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [demoScans, setDemoScans] = useState(DEMO_SCANS);
  const { isSubscribed, freeScansRemaining, maxFreeScans } = useRevenueCat();

  // Fetch scans from backend (only when not in demo mode)
  const { data: apiScans = [], isLoading: apiLoading, refetch, isRefetching } = useScans();
  const toggleFavorite = useToggleFavorite();
  const deleteScan = useDeleteScan();
  const { pendingScan } = usePendingScan();

  // Enable realtime updates for scans (invalidates queries on INSERT/UPDATE/DELETE)
  useScansRealtime();

  // Use demo data or real data based on DEMO_MODE
  const scans = DEMO_MODE ? demoScans : apiScans;
  const isLoading = DEMO_MODE ? false : apiLoading;

  // Create a pending scan item for the list if there's an active scan
  const pendingScanItem: ScanResult | null = pendingScan ? {
    id: pendingScan.id,
    user_id: 'pending',
    name: 'Analyzing...',
    image_url: pendingScan.imagePreviewUri,
    status: 'pending',
    summary: '',
    progress: Math.round(pendingScan.progress),
    is_favorite: false,
    scanned_at: pendingScan.createdAt.toISOString(),
    created_at: pendingScan.createdAt.toISOString(),
    updated_at: pendingScan.createdAt.toISOString(),
  } : null;

  // Filter scans based on active tab and search query
  const filteredScans = useMemo(() => {
    const baseScans = scans.filter((scan) => {
      // Skip undefined/null scans
      if (!scan) return false;
      const matchesSearch = scan.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
      const matchesTab = activeTab === 'all' || (activeTab === 'saves' && scan.is_favorite);
      return matchesSearch && matchesTab;
    });

    // Add pending scan at the top if it exists and we're on 'all' tab
    if (pendingScanItem && activeTab === 'all') {
      return [pendingScanItem, ...baseScans];
    }

    return baseScans;
  }, [scans, activeTab, searchQuery, pendingScanItem]);

  const handleScanPress = useCallback((scan: ScanResult) => {
    // Don't navigate for pending scans
    if (scan.status === 'pending') return;
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

  const handleDeleteScan = useCallback((scan: ScanResult) => {
    if (DEMO_MODE) {
      // Delete in demo mode locally
      setDemoScans((prev) => prev.filter((s) => s.id !== scan.id));
    } else {
      deleteScan.mutate(scan.id);
    }
  }, [deleteScan]);

  const handleUpgradeBanner = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/paywall');
  }, [router]);

  // Determine urgency level for banner styling
  const isLastScan = freeScansRemaining === 1;
  const isLowScans = freeScansRemaining <= 2 && freeScansRemaining > 0;
  const isOutOfScans = freeScansRemaining === 0;
  const showFreeScansBanner = !isSubscribed;

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <StatusBar barStyle="dark-content" />

      <HomeHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Free Scans Remaining Banner */}
      {showFreeScansBanner && (
        <Pressable
          onPress={handleUpgradeBanner}
          style={[
            styles.freeScansBanner,
            isLowScans && styles.freeScansBannerWarning,
            (isLastScan || isOutOfScans) && styles.freeScansBannerUrgent,
          ]}
        >
          <View style={styles.freeScansBannerLeft}>
            <View style={styles.freeScansBannerIcon}>
              <Sparkles size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[
                styles.freeScansBannerTitle,
                (isLastScan || isOutOfScans) && styles.freeScansBannerTitleUrgent,
              ]}>
                {isOutOfScans
                  ? t('home.freeScans.allUsed')
                  : isLastScan
                    ? t('home.freeScans.lastScan')
                    : t('home.freeScans.remaining', { count: freeScansRemaining, max: maxFreeScans })}
              </Text>
              <Text style={styles.freeScansBannerSubtitle}>
                {t('home.freeScans.upgradeCta')}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#FFFFFF" />
        </Pressable>
      )}

      <ScanList
        scans={filteredScans}
        isLoading={isLoading}
        isRefreshing={DEMO_MODE ? false : isRefetching}
        onRefresh={handleRefresh}
        activeTab={activeTab}
        searchQuery={searchQuery}
        onScanPress={handleScanPress}
        onToggleFavorite={handleToggleFavorite}
        onDeleteScan={handleDeleteScan}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Free scans banner styles
  freeScansBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#14B8A6',
    borderRadius: 16,
  },
  freeScansBannerWarning: {
    backgroundColor: '#F59E0B',
  },
  freeScansBannerUrgent: {
    backgroundColor: '#DC2626',
  },
  freeScansBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  freeScansBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeScansBannerIconUrgent: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  freeScansBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  freeScansBannerTitleUrgent: {
    color: '#FFFFFF',
  },
  freeScansBannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
