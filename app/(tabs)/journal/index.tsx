import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
  RefreshControl,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Zap,
  ChevronRight,
  Flame,
  Sun,
  Coffee,
  Moon,
  Cookie,
  Lock,
  BookOpen,
  CircleOff,
  Battery,
  Search,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  useFoodReactions,
  useFoodReactionsRealtime,
  useJournalStreak,
} from '@/lib/hooks/use-journal';
import { BlurView } from 'expo-blur';
import { JournalEmptyState } from '@/components/journal/JournalEmptyState';
import { JournalLoadingModal } from '@/components/ui/skeleton';
import { useRevenueCat } from '@/context/revenuecat-provider';
import { useTranslation } from 'react-i18next';
import type { FoodReaction, ReactionType, MealType } from '@/lib/types/journal';
import {
  getWeekDays,
  filterReactionsByDate,
  calculateDailyStats,
  formatTime,
  getReactionColor,
  getMealTypeInfo,
} from '@/lib/utils/journal-utils';

export default function JournalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { isSubscribed, loading: subscriptionLoading } = useRevenueCat();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const { data: allReactions = [], refetch, isRefetching, isLoading } = useFoodReactions();
  useFoodReactionsRealtime();
  const { streak } = useJournalStreak();

  const handleUnlockPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/paywall');
  }, [router]);

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const todayReactions = useMemo(
    () => filterReactionsByDate(allReactions, selectedDate),
    [allReactions, selectedDate]
  );
  const stats = useMemo(() => calculateDailyStats(todayReactions), [todayReactions]);

  const handleSelectDay = useCallback((date: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(date);
  }, []);

  const handleAddEntry = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/journal/add');
  }, [router]);

  const handleReactionPress = useCallback(
    (reaction: FoodReaction) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(`/journal/${reaction.id}`);
    },
    [router]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const getReactionIcon = (reaction: ReactionType) => {
    const color = getReactionColor(reaction);
    switch (reaction) {
      case 'good':
        return <ThumbsUp size={16} color={color} />;
      case 'bad':
        return <ThumbsDown size={16} color={color} />;
      default:
        return <Meh size={16} color={color} />;
    }
  };

  const getMealTypeIcon = (mealType: MealType | null | undefined) => {
    const info = getMealTypeInfo(mealType);
    if (!info) return null;
    switch (mealType) {
      case 'breakfast':
        return <Sun size={12} color={info.color} />;
      case 'lunch':
        return <Coffee size={12} color={info.color} />;
      case 'dinner':
        return <Moon size={12} color={info.color} />;
      case 'snack':
        return <Cookie size={12} color={info.color} />;
      default:
        return null;
    }
  };

  // Render meal item
  const renderMealItem = ({ item, index }: { item: FoodReaction; index: number }) => {
    const mealTypeInfo = getMealTypeInfo(item.meal_type);
    const mealTypeIcon = getMealTypeIcon(item.meal_type);

    return (
      <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
        <Pressable onPress={() => handleReactionPress(item)} style={styles.mealCard}>
          {item.food_image_url ? (
            <Image source={{ uri: item.food_image_url }} style={styles.mealImage} />
          ) : (
            <View style={[styles.mealImage, styles.mealImagePlaceholder]}>
              <Text style={styles.mealImageText}>{item.food_name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.mealInfo}>
            <Text style={styles.mealName} numberOfLines={1}>
              {item.food_name}
            </Text>
            <View style={styles.mealMeta}>
              {mealTypeInfo && (
                <View
                  style={[styles.mealTypeBadge, { backgroundColor: `${mealTypeInfo.color}15` }]}
                >
                  {mealTypeIcon}
                  <Text style={[styles.mealTypeText, { color: mealTypeInfo.color }]}>
                    {mealTypeInfo.label}
                  </Text>
                </View>
              )}
              <Text style={styles.mealTime}>{formatTime(item.consumed_at)}</Text>
            </View>
          </View>
          <View
            style={[
              styles.reactionBadge,
              { backgroundColor: `${getReactionColor(item.reaction)}15` },
            ]}
          >
            {getReactionIcon(item.reaction)}
          </View>
          <ChevronRight size={18} color="#D1D5DB" />
        </Pressable>
      </Animated.View>
    );
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const showLoadingOverlay = subscriptionLoading || isLoading;
  // const showPremiumGate = subscriptionLoading && isSubscribed;
  const showPremiumGate = !subscriptionLoading && !isSubscribed;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>{t('journal.title')}</Text>
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Flame size={14} color="#F97316" />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
          <Pressable onPress={handleAddEntry} style={styles.addButton}>
            <Plus size={20} color="#fff" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>

      {/* Calendar Strip */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarStrip}>
          {weekDays.map((day) => (
            <Pressable
              key={day.date.toISOString()}
              onPress={() => handleSelectDay(day.date)}
              style={[styles.dayItem, day.isSelected && styles.dayItemSelected]}
            >
              <Text style={[styles.dayName, day.isSelected && styles.dayNameSelected]}>
                {day.dayName}
              </Text>
              <View
                style={[
                  styles.dayNumContainer,
                  day.isSelected && styles.dayNumContainerSelected,
                  day.isToday && !day.isSelected && styles.dayNumContainerToday,
                ]}
              >
                <Text
                  style={[
                    styles.dayNum,
                    day.isSelected && styles.dayNumSelected,
                    day.isToday && !day.isSelected && styles.dayNumToday,
                  ]}
                >
                  {day.dayNum}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Daily Overview - 3 compact cards */}
      {stats.hasData ? (
        <Animated.View entering={FadeIn.duration(300)} style={styles.summaryContainer}>
          <View style={styles.statsRow}>
            {/* Energy Card */}
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Zap size={16} color="#D97706" />
              </View>
              <Text style={styles.statValue}>
                {stats.avgEnergy > 0 ? stats.avgEnergy.toFixed(1) : '—'}
              </Text>
              <Text style={styles.statLabel}>Energy</Text>
            </View>

            {/* Good Reactions Card */}
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#D1FAE5' }]}>
                <ThumbsUp size={16} color="#059669" />
              </View>
              <Text style={[styles.statValue, { color: '#059669' }]}>{stats.good}</Text>
              <Text style={styles.statLabel}>Good</Text>
            </View>

            {/* Bad Reactions Card */}
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FEE2E2' }]}>
                <ThumbsDown size={16} color="#DC2626" />
              </View>
              <Text style={[styles.statValue, { color: '#DC2626' }]}>{stats.bad}</Text>
              <Text style={styles.statLabel}>Bad</Text>
            </View>
          </View>
        </Animated.View>
      ) : null}

      {/* Meals List */}
      <View style={styles.mealsSection}>
        <View style={styles.mealsSectionHeader}>
          <Text style={styles.mealsSectionTitle}>
            {isToday
              ? "Today's Meals"
              : selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
          </Text>
          <Text style={styles.mealsSectionCount}>{todayReactions.length} logged</Text>
        </View>

        {todayReactions.length === 0 && !isLoading ? (
          <JournalEmptyState onAddEntry={handleAddEntry} variant="compact" />
        ) : (
          <FlatList
            data={todayReactions}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.mealsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                tintColor="#0D9488"
              />
            }
          />
        )}
      </View>

      {/* Loading Modal Overlay */}
      {showLoadingOverlay && (
        <BlurView intensity={20} tint="light" style={styles.loadingOverlay}>
          <JournalLoadingModal />
        </BlurView>
      )}

      {/* Premium Gate Overlay */}
      {showPremiumGate && (
        <BlurView intensity={20} tint="light" style={styles.loadingOverlay}>
          <View style={styles.premiumGateCard}>
            <View style={styles.premiumIconContainer}>
              <BookOpen size={48} color="#0D9488" />
            </View>
            <Text style={styles.premiumGateTitle}>{t('journal.premium.title')}</Text>
            <Text style={styles.premiumGateDescription}>{t('journal.premium.description')}</Text>

            {/* Feature list */}
            <View style={styles.premiumFeatureList}>
              <View style={styles.premiumFeatureItem}>
                <View style={[styles.premiumFeatureIcon, { backgroundColor: '#FEE2E2' }]}>
                  <CircleOff size={16} color="#DC2626" />
                </View>
                <Text style={styles.premiumFeatureText}>{t('journal.premium.feature1')}</Text>
              </View>
              <View style={styles.premiumFeatureItem}>
                <View style={[styles.premiumFeatureIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Battery size={16} color="#D97706" />
                </View>
                <Text style={styles.premiumFeatureText}>{t('journal.premium.feature2')}</Text>
              </View>
              <View style={styles.premiumFeatureItem}>
                <View style={[styles.premiumFeatureIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Search size={16} color="#2563EB" />
                </View>
                <Text style={styles.premiumFeatureText}>{t('journal.premium.feature3')}</Text>
              </View>
            </View>

            <Pressable onPress={handleUnlockPress} style={styles.unlockButton}>
              <LinearGradient
                colors={['#14B8A6', '#0D9488', '#0F766E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Lock size={18} color="#fff" />
              <Text style={styles.unlockButtonText}>{t('journal.premium.unlock')}</Text>
            </Pressable>
          </View>
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F97316',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // Calendar
  calendarContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  calendarStrip: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 16,
  },
  dayItemSelected: {
    backgroundColor: '#F0FDFA',
  },
  dayName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  dayNameSelected: {
    color: '#0D9488',
  },
  dayNumContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumContainerSelected: {
    backgroundColor: '#0D9488',
  },
  dayNumContainerToday: {
    borderWidth: 2,
    borderColor: '#0D9488',
  },
  dayNum: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  dayNumSelected: {
    color: '#fff',
  },
  dayNumToday: {
    color: '#0D9488',
  },

  // Stats Row - 3 compact cards
  summaryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },

  // Meals Section
  mealsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mealsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  mealsSectionCount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  mealsList: {
    paddingBottom: 180,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  mealImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  mealImagePlaceholder: {
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealImageText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D9488',
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  mealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  mealTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  mealTime: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  reactionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  reactionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Premium Gate Styles
  premiumGateCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 24,
    width: '90%',
    maxWidth: 360,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  premiumIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  premiumGateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  premiumGateDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  premiumFeatureList: {
    width: '100%',
    marginBottom: 24,
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  premiumFeatureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  premiumFeatureText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  unlockButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
