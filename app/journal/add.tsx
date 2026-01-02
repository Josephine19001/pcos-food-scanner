import { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import {
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Meh,
  ThumbsDown,
  Edit3,
  Check,
  Zap,
  ZapOff,
  Activity,
  Clock,
  MessageSquare,
  Sun,
  Coffee,
  Moon,
  Cookie,
  Search,
  ChevronDown,
  X,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeInRight,
  FadeOutLeft,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { useCreateFoodReaction, useRecentFoods } from '@/lib/hooks/use-journal';
import type {
  FoodSymptomKey,
  ReactionType,
  TimeAfterEating,
  FoodOption,
  MealType,
} from '@/lib/types/journal';

// Food-related symptoms with emojis for display
const SYMPTOMS: { key: FoodSymptomKey; emoji: string }[] = [
  { key: 'bloating', emoji: '🎈' },
  { key: 'nausea', emoji: '🤢' },
  { key: 'stomachPain', emoji: '🤕' },
  { key: 'heartburn', emoji: '🔥' },
  { key: 'gas', emoji: '💨' },
  { key: 'diarrhea', emoji: '🚽' },
  { key: 'constipation', emoji: '🧱' },
  { key: 'headache', emoji: '🤯' },
  { key: 'fatigue', emoji: '😴' },
  { key: 'brainFog', emoji: '🌫️' },
  { key: 'skinBreakout', emoji: '🔴' },
  { key: 'cravings', emoji: '🍫' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Step configuration
const STEPS = ['food', 'reaction', 'details'] as const;
type Step = (typeof STEPS)[number];

// Status colors for food items
const STATUS_COLORS = {
  safe: '#059669',
  caution: '#D97706',
  avoid: '#DC2626',
};

// Reaction options - labels are translation keys
const REACTIONS: {
  type: ReactionType;
  icon: typeof ThumbsUp;
  labelKey: string;
  descKey: string;
  color: string;
  bgColor: string;
}[] = [
  {
    type: 'good',
    icon: ThumbsUp,
    labelKey: 'journal.addFlow.feltGreat',
    descKey: 'journal.addFlow.noIssues',
    color: '#059669',
    bgColor: '#ECFDF5',
  },
  {
    type: 'okay',
    icon: Meh,
    labelKey: 'journal.addFlow.justOkay',
    descKey: 'journal.addFlow.minorDiscomfort',
    color: '#D97706',
    bgColor: '#FFFBEB',
  },
  {
    type: 'bad',
    icon: ThumbsDown,
    labelKey: 'journal.addFlow.feltBad',
    descKey: 'journal.addFlow.triggeredSymptoms',
    color: '#DC2626',
    bgColor: '#FEF2F2',
  },
];

// Energy options - labels are translation keys
const ENERGY_OPTIONS = [
  { value: 1, icon: ZapOff, labelKey: 'journal.energy.low', color: '#DC2626' },
  { value: 3, icon: Activity, labelKey: 'journal.energy.normal', color: '#D97706' },
  { value: 5, icon: Zap, labelKey: 'journal.energy.high', color: '#059669' },
];

// Time after options - labels are translation keys
const TIME_OPTIONS: { value: TimeAfterEating; labelKey: string }[] = [
  { value: 'immediate', labelKey: 'journal.addFlow.rightAway' },
  { value: '30min', labelKey: 'journal.timeAfter.thirtyMin' },
  { value: '1hour', labelKey: 'journal.timeAfter.oneHour' },
  { value: '2hours', labelKey: 'journal.timeAfter.twoHours' },
  { value: 'next_day', labelKey: 'journal.timeAfter.nextDay' },
];

// Meal type options - labels are translation keys
const MEAL_TYPE_OPTIONS: { value: MealType; icon: typeof Sun; labelKey: string; color: string }[] =
  [
    { value: 'breakfast', icon: Sun, labelKey: 'journal.mealType.breakfast', color: '#F59E0B' },
    { value: 'lunch', icon: Coffee, labelKey: 'journal.mealType.lunch', color: '#0284C7' },
    { value: 'dinner', icon: Moon, labelKey: 'journal.mealType.dinner', color: '#7C3AED' },
    { value: 'snack', icon: Cookie, labelKey: 'journal.mealType.snack', color: '#EC4899' },
  ];

// Severity levels
const SEVERITY_COLORS = ['#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#DC2626'];

export default function AddFoodReactionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const createReaction = useCreateFoodReaction();
  const { data: recentFoods = [] } = useRecentFoods();
  const scrollRef = useRef<ScrollView>(null);

  // Current step
  const [currentStep, setCurrentStep] = useState<Step>('food');
  const stepIndex = STEPS.indexOf(currentStep);

  // Form state
  const [selectedFood, setSelectedFood] = useState<{
    id?: string;
    name: string;
    image_url?: string;
  } | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualFoodName, setManualFoodName] = useState('');
  const [reaction, setReaction] = useState<ReactionType | null>(null);
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<FoodSymptomKey[]>([]);
  const [severity, setSeverity] = useState<number>(0);
  const [timeAfter, setTimeAfter] = useState<TimeAfterEating | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [showAllFoods, setShowAllFoods] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState('');

  // Number of items to show initially
  const INITIAL_FOOD_COUNT = 4;

  // Filter and limit foods based on search and expanded state
  const displayedFoods = useMemo(() => {
    let foods = recentFoods;

    // Apply search filter if query exists
    if (foodSearchQuery.trim()) {
      const query = foodSearchQuery.toLowerCase().trim();
      foods = foods.filter((food) => food.name.toLowerCase().includes(query));
    }

    // Limit to initial count if not expanded and no search
    if (!showAllFoods && !foodSearchQuery.trim()) {
      return foods.slice(0, INITIAL_FOOD_COUNT);
    }

    return foods;
  }, [recentFoods, showAllFoods, foodSearchQuery]);

  const hasMoreFoods = recentFoods.length > INITIAL_FOOD_COUNT;

  const handleToggleSymptom = useCallback((symptom: FoodSymptomKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }, []);

  const handleSelectFood = (food: FoodOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsManualEntry(false);
    setSelectedFood({
      id: food.id,
      name: food.name,
      image_url: food.image_url,
    });
  };

  const handleManualEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsManualEntry(true);
    setSelectedFood({ name: manualFoodName });
  };

  const handleManualNameChange = (text: string) => {
    setManualFoodName(text);
    setSelectedFood({ name: text });
  };

  const handleSelectReaction = (type: ReactionType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setReaction(type);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1]);
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    if (!selectedFood?.name) {
      toast.error(t('journal.errors.noFood'));
      return;
    }
    if (!reaction) {
      toast.error(t('journal.errors.noReaction'));
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      await createReaction.mutateAsync({
        scan_id: selectedFood.id,
        food_name: selectedFood.name,
        food_image_url: selectedFood.image_url,
        meal_type: mealType ?? undefined,
        reaction,
        symptoms: selectedSymptoms,
        severity: selectedSymptoms.length > 0 && severity > 0 ? severity : undefined,
        time_after_eating: selectedSymptoms.length > 0 ? timeAfter ?? undefined : undefined,
        energy_level: energyLevel ?? undefined,
        notes: notes.trim() || undefined,
      });

      // toast.success(t('journal.success.created'));
      router.back();
    } catch (error) {
      toast.error(t('journal.errors.saveFailed'));
    }
  };

  // Can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 'food':
        return !!selectedFood?.name;
      case 'reaction':
        return !!reaction;
      case 'details':
        return true;
      default:
        return false;
    }
  };

  // Step indicator dots
  const StepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <View
          key={step}
          style={[
            styles.stepDot,
            index <= stepIndex && styles.stepDotActive,
            index === stepIndex && styles.stepDotCurrent,
          ]}
        />
      ))}
    </View>
  );

  // Render food item for selection
  const renderFoodItem = ({ item }: { item: FoodOption }) => {
    const isSelected = selectedFood?.id === item.id;
    return (
      <Pressable
        onPress={() => handleSelectFood(item)}
        style={[styles.foodCard, isSelected && styles.foodCardSelected]}
      >
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.foodCardImage} />
        ) : (
          <View style={[styles.foodCardImage, styles.foodCardImagePlaceholder]}>
            <Text style={styles.foodCardImageText}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.foodCardName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={[styles.foodCardStatus, { backgroundColor: STATUS_COLORS[item.status] }]} />
        {isSelected && (
          <View style={styles.foodCardCheck}>
            <Check size={14} color="#fff" strokeWidth={3} />
          </View>
        )}
      </Pressable>
    );
  };

  // Step 1: Food Selection
  const renderFoodStep = () => (
    <Animated.View
      key="food"
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContent}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{t('journal.addFlow.whatDidYouEat')}</Text>
        <Text style={styles.stepSubtitle}>{t('journal.addFlow.selectOrEnter')}</Text>
      </View>

      {/* Manual Entry Toggle */}
      <Pressable
        onPress={handleManualEntry}
        style={[styles.manualToggle, isManualEntry && styles.manualToggleActive]}
      >
        <Edit3 size={20} color={isManualEntry ? '#0D9488' : '#6B7280'} />
        <Text style={[styles.manualToggleText, isManualEntry && styles.manualToggleTextActive]}>
          {t('journal.addFlow.enterManually')}
        </Text>
      </Pressable>

      {/* Manual Entry Input */}
      {isManualEntry ? (
        <Animated.View entering={FadeIn.duration(200)} style={styles.manualInputContainer}>
          <TextInput
            style={styles.manualInput}
            placeholder={t('journal.addFlow.foodPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={manualFoodName}
            onChangeText={handleManualNameChange}
            autoFocus
          />
        </Animated.View>
      ) : (
        <>
          {recentFoods.length > 0 ? (
            <>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionLabel}>{t('journal.addFlow.recentScans')}</Text>
                {!showAllFoods && hasMoreFoods && (
                  <Text style={styles.foodCountHint}>{recentFoods.length} total</Text>
                )}
              </View>

              {/* Search Input - only show when expanded */}
              {showAllFoods && (
                <Animated.View entering={FadeIn.duration(200)} style={styles.searchContainer}>
                  <Search size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder={t('journal.addFlow.searchFoods')}
                    placeholderTextColor="#9CA3AF"
                    value={foodSearchQuery}
                    onChangeText={setFoodSearchQuery}
                  />
                  {foodSearchQuery.length > 0 && (
                    <Pressable onPress={() => setFoodSearchQuery('')} hitSlop={8}>
                      <X size={18} color="#9CA3AF" />
                    </Pressable>
                  )}
                </Animated.View>
              )}

              <FlatList
                data={displayedFoods}
                renderItem={renderFoodItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.foodGrid}
                showsVerticalScrollIndicator={false}
                scrollEnabled={showAllFoods}
                style={showAllFoods ? styles.expandedFoodList : undefined}
                contentContainerStyle={styles.foodListContent}
                ListFooterComponent={
                  hasMoreFoods ? (
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowAllFoods(!showAllFoods);
                        if (showAllFoods) {
                          setFoodSearchQuery('');
                        }
                      }}
                      style={styles.viewMoreButton}
                    >
                      <Text style={styles.viewMoreText}>
                        {showAllFoods
                          ? t('journal.addFlow.showLess')
                          : t('journal.addFlow.viewAllScans', { count: recentFoods.length })}
                      </Text>
                      <ChevronDown
                        size={16}
                        color="#0D9488"
                        style={{ transform: [{ rotate: showAllFoods ? '180deg' : '0deg' }] }}
                      />
                    </Pressable>
                  ) : null
                }
                ListEmptyComponent={
                  foodSearchQuery.trim() ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>{t('journal.addFlow.noMatches')}</Text>
                      <Text style={styles.emptySubtext}>
                        {t('journal.addFlow.tryDifferentSearch')}
                      </Text>
                    </View>
                  ) : null
                }
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('journal.addFlow.noRecentScans')}</Text>
              <Text style={styles.emptySubtext}>{t('journal.addFlow.useManualEntry')}</Text>
            </View>
          )}
        </>
      )}
    </Animated.View>
  );

  // Step 2: Reaction Selection
  const renderReactionStep = () => (
    <Animated.View
      key="reaction"
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContent}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{t('journal.addFlow.howDidItMakeYouFeel')}</Text>
        <Text style={styles.stepSubtitle}>
          {t('journal.addFlow.afterEating', { food: selectedFood?.name })}
        </Text>
      </View>

      <View style={styles.reactionGrid}>
        {REACTIONS.map(({ type, icon: Icon, labelKey, descKey, color, bgColor }) => {
          const isSelected = reaction === type;
          return (
            <Pressable
              key={type}
              onPress={() => handleSelectReaction(type)}
              style={[
                styles.reactionCard,
                { backgroundColor: isSelected ? bgColor : '#fff' },
                isSelected && { borderColor: color, borderWidth: 2 },
              ]}
            >
              <View
                style={[
                  styles.reactionIconCircle,
                  { backgroundColor: isSelected ? color : '#F3F4F6' },
                ]}
              >
                <Icon size={32} color={isSelected ? '#fff' : '#9CA3AF'} strokeWidth={2} />
              </View>
              <Text style={[styles.reactionLabel, isSelected && { color }]}>{t(labelKey)}</Text>
              <Text style={styles.reactionDesc}>{t(descKey)}</Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );

  // Step 3: Details (Optional)
  const renderDetailsStep = () => (
    <Animated.View
      key="details"
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContent}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{t('journal.addFlow.addMoreDetails')}</Text>
        <Text style={styles.stepSubtitle}>{t('journal.addFlow.allFieldsOptional')}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.detailsScroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Meal Type Section */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>{t('journal.addFlow.typeOfMeal')}</Text>
          <View style={styles.mealTypeRow}>
            {MEAL_TYPE_OPTIONS.map(({ value, icon: Icon, labelKey, color }) => {
              const isSelected = mealType === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setMealType(isSelected ? null : value);
                  }}
                  style={[
                    styles.mealTypeCard,
                    isSelected && { backgroundColor: `${color}15`, borderColor: color },
                  ]}
                >
                  <Icon size={20} color={isSelected ? color : '#9CA3AF'} />
                  <Text style={[styles.mealTypeLabel, isSelected && { color, fontWeight: '600' }]}>
                    {t(labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Symptoms Section */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>{t('journal.symptoms.title')}</Text>
          <View style={styles.symptomsGrid}>
            {SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.key);
              return (
                <Pressable
                  key={symptom.key}
                  onPress={() => handleToggleSymptom(symptom.key)}
                  style={[styles.symptomChip, isSelected && styles.symptomChipSelected]}
                >
                  <Text style={[styles.symptomEmoji]}>{symptom.emoji}</Text>
                  <Text style={[styles.symptomText, isSelected && styles.symptomTextSelected]}>
                    {t(`journal.symptoms.${symptom.key}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Severity (only if symptoms selected) */}
        {selectedSymptoms.length > 0 && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.detailSection}>
            <Text style={styles.detailLabel}>{t('journal.addFlow.howSevere')}</Text>
            <View style={styles.severityRow}>
              {[1, 2, 3, 4, 5].map((level) => (
                <Pressable
                  key={level}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSeverity(level);
                  }}
                  style={[
                    styles.severityDot,
                    {
                      backgroundColor: level <= severity ? SEVERITY_COLORS[level - 1] : '#E5E7EB',
                      transform: [{ scale: level === severity ? 1.15 : 1 }],
                    },
                  ]}
                />
              ))}
              <Text style={styles.severityLabel}>
                {severity === 0
                  ? ''
                  : severity <= 2
                  ? t('journal.severity.mild')
                  : severity <= 4
                  ? t('journal.severity.moderate')
                  : t('journal.severity.severe')}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Time After (only if symptoms selected) */}
        {selectedSymptoms.length > 0 && (
          <Animated.View entering={FadeIn.duration(200).delay(100)} style={styles.detailSection}>
            <View style={styles.detailLabelRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.detailLabel}>{t('journal.addFlow.whenSymptomsAppear')}</Text>
            </View>
            <View style={styles.timeGrid}>
              {TIME_OPTIONS.map(({ value, labelKey }) => {
                const isSelected = timeAfter === value;
                return (
                  <Pressable
                    key={value}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setTimeAfter(value);
                    }}
                    style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                  >
                    <Text style={[styles.timeChipText, isSelected && styles.timeChipTextSelected]}>
                      {t(labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Energy Level */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>{t('journal.addFlow.energyAfterEating')}</Text>
          <View style={styles.energyRow}>
            {ENERGY_OPTIONS.map(({ value, icon: Icon, labelKey, color }) => {
              const isSelected = energyLevel === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setEnergyLevel(value);
                  }}
                  style={[
                    styles.energyCard,
                    isSelected && { backgroundColor: `${color}15`, borderColor: color },
                  ]}
                >
                  <Icon size={24} color={isSelected ? color : '#9CA3AF'} />
                  <Text style={[styles.energyLabel, isSelected && { color, fontWeight: '600' }]}>
                    {t(labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.detailSection}>
          <View style={styles.detailLabelRow}>
            <MessageSquare size={16} color="#6B7280" />
            <Text style={styles.detailLabel}>{t('journal.addFlow.additionalNotes')}</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            placeholder={t('journal.addFlow.notesPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={handleBack} style={styles.backButton} hitSlop={12}>
            <ChevronLeft size={24} color="#111827" />
          </Pressable>
          <StepIndicator />
          <View style={styles.headerSpacer} />
        </View>

        {/* Step Content */}
        <View style={styles.contentContainer}>
          {currentStep === 'food' && renderFoodStep()}
          {currentStep === 'reaction' && renderReactionStep()}
          {currentStep === 'details' && renderDetailsStep()}
        </View>

        {/* Bottom Action */}
        <View style={[styles.bottomAction, { paddingBottom: insets.bottom + 16 }]}>
          {currentStep === 'details' ? (
            <Button
              title={t('journal.addFlow.saveEntry')}
              onPress={handleSave}
              loading={createReaction.isPending}
              disabled={!reaction}
            />
          ) : (
            <Pressable
              onPress={handleNext}
              disabled={!canProceed()}
              style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
            >
              <Text style={[styles.nextButtonText, !canProceed() && styles.nextButtonTextDisabled]}>
                {t('journal.addFlow.continue')}
              </Text>
              <ChevronRight size={20} color={canProceed() ? '#fff' : '#9CA3AF'} />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#fff',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerSpacer: {
    width: 44,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  stepDotActive: {
    backgroundColor: '#0D9488',
  },
  stepDotCurrent: {
    width: 24,
    borderRadius: 12,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },

  // Food Step
  manualToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  manualToggleActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#0D9488',
  },
  manualToggleText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  manualToggleTextActive: {
    color: '#0D9488',
  },
  manualInputContainer: {
    marginBottom: 20,
  },
  manualInput: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 17,
    color: '#111827',
    borderWidth: 2,
    borderColor: '#0D9488',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  foodCountHint: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    padding: 0,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D9488',
  },
  foodGrid: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  foodCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  foodCardSelected: {
    borderColor: '#0D9488',
    backgroundColor: '#ECFDF5',
  },
  foodCardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 10,
  },
  foodCardImagePlaceholder: {
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodCardImageText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#0D9488',
  },
  foodCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
  },
  foodCardStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  foodCardCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedFoodList: {
    maxHeight: 400,
  },
  foodListContent: {
    paddingBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
  },

  // Reaction Step
  reactionGrid: {
    gap: 16,
  },
  reactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reactionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  reactionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  reactionDesc: {
    fontSize: 13,
    color: '#9CA3AF',
    position: 'absolute',
    bottom: 20,
    left: 96,
  },

  // Details Step
  detailsScroll: {
    paddingBottom: 24,
    gap: 28,
  },
  detailSection: {
    gap: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  symptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  symptomChipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#0D9488',
  },
  symptomEmoji: {
    fontSize: 16,
  },
  symptomText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  symptomTextSelected: {
    color: '#0D9488',
    fontWeight: '600',
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  severityDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  timeChipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#0D9488',
  },
  timeChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeChipTextSelected: {
    color: '#0D9488',
    fontWeight: '600',
  },
  energyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  energyCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  energyLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  mealTypeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mealTypeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  mealTypeLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
  },

  // Bottom Action
  bottomAction: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(240, 253, 250, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(204, 251, 241, 0.5)',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D9488',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  nextButtonTextDisabled: {
    color: '#9CA3AF',
  },
});
