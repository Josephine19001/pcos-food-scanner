import { useState, useCallback, useEffect, useRef } from 'react';
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
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
  Trash2,
  Zap,
  ZapOff,
  Activity,
  Clock,
  MessageSquare,
  Sun,
  Coffee,
  Moon,
  Cookie,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import {
  useFoodReaction,
  useUpdateFoodReaction,
  useDeleteFoodReaction,
} from '@/lib/hooks/use-journal';
import type { FoodSymptomKey, ReactionType, TimeAfterEating, MealType } from '@/lib/types/journal';

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

// Step configuration - for edit, we skip food selection
const STEPS = ['reaction', 'details'] as const;
type Step = (typeof STEPS)[number];

// Reaction options
const REACTIONS: { type: ReactionType; icon: typeof ThumbsUp; label: string; desc: string; color: string; bgColor: string }[] = [
  { type: 'good', icon: ThumbsUp, label: 'Felt Great', desc: 'No issues at all', color: '#059669', bgColor: '#ECFDF5' },
  { type: 'okay', icon: Meh, label: 'Just Okay', desc: 'Minor discomfort', color: '#D97706', bgColor: '#FFFBEB' },
  { type: 'bad', icon: ThumbsDown, label: 'Felt Bad', desc: 'Triggered symptoms', color: '#DC2626', bgColor: '#FEF2F2' },
];

// Energy options
const ENERGY_OPTIONS = [
  { value: 1, icon: ZapOff, label: 'Low', color: '#DC2626' },
  { value: 3, icon: Activity, label: 'Normal', color: '#D97706' },
  { value: 5, icon: Zap, label: 'Energized', color: '#059669' },
];

// Time after options
const TIME_OPTIONS: { value: TimeAfterEating; label: string }[] = [
  { value: 'immediate', label: 'Right away' },
  { value: '30min', label: '30 min' },
  { value: '1hour', label: '1 hour' },
  { value: '2hours', label: '2+ hours' },
  { value: 'next_day', label: 'Next day' },
];

// Meal type options
const MEAL_TYPE_OPTIONS: { value: MealType; icon: typeof Sun; label: string; color: string }[] = [
  { value: 'breakfast', icon: Sun, label: 'Breakfast', color: '#F59E0B' },
  { value: 'lunch', icon: Coffee, label: 'Lunch', color: '#0284C7' },
  { value: 'dinner', icon: Moon, label: 'Dinner', color: '#7C3AED' },
  { value: 'snack', icon: Cookie, label: 'Snack', color: '#EC4899' },
];

// Severity levels
const SEVERITY_COLORS = ['#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#DC2626'];

export default function EditFoodReactionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  const { data: existingReaction, isLoading } = useFoodReaction(id);
  const updateReaction = useUpdateFoodReaction();
  const deleteReaction = useDeleteFoodReaction();

  // Current step
  const [currentStep, setCurrentStep] = useState<Step>('reaction');
  const stepIndex = STEPS.indexOf(currentStep);

  // Form state
  const [reaction, setReaction] = useState<ReactionType | null>(null);
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<FoodSymptomKey[]>([]);
  const [severity, setSeverity] = useState<number>(0);
  const [timeAfter, setTimeAfter] = useState<TimeAfterEating | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Load existing data
  useEffect(() => {
    if (existingReaction) {
      setReaction(existingReaction.reaction);
      setMealType(existingReaction.meal_type ?? null);
      setSelectedSymptoms(existingReaction.symptoms || []);
      setSeverity(existingReaction.severity ?? 0);
      setTimeAfter(existingReaction.time_after_eating ?? null);
      setEnergyLevel(existingReaction.energy_level ?? null);
      setNotes(existingReaction.notes || '');
    }
  }, [existingReaction]);

  const handleToggleSymptom = useCallback((symptom: FoodSymptomKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }, []);

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
    if (!reaction) {
      toast.error(t('journal.errors.noReaction'));
      return;
    }
    if (!id) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      await updateReaction.mutateAsync({
        id,
        reaction,
        meal_type: mealType,
        symptoms: selectedSymptoms,
        severity: selectedSymptoms.length > 0 && severity > 0 ? severity : undefined,
        time_after_eating: selectedSymptoms.length > 0 ? timeAfter ?? undefined : undefined,
        energy_level: energyLevel ?? undefined,
        notes: notes.trim() || undefined,
      });

      toast.success(t('journal.success.updated'));
      router.back();
    } catch (error) {
      toast.error(t('journal.errors.saveFailed'));
    }
  };

  const handleDelete = () => {
    Alert.alert(t('journal.actions.delete'), t('journal.actions.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          if (!id) return;

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

          try {
            await deleteReaction.mutateAsync(id);
            toast.success(t('journal.success.deleted'));
            router.back();
          } catch (error) {
            toast.error(t('errors.generic'));
          }
        },
      },
    ]);
  };

  // Can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 'reaction':
        return !!reaction;
      case 'details':
        return true;
      default:
        return false;
    }
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
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

  // Step 1: Reaction Selection (with food info at top)
  const renderReactionStep = () => (
    <Animated.View
      key="reaction"
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContent}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>How did it make you feel?</Text>
        <Text style={styles.stepSubtitle}>
          After eating {existingReaction?.food_name}
        </Text>
      </View>

      {/* Food Info Card */}
      <View style={styles.foodInfoCard}>
        {existingReaction?.food_image_url ? (
          <Image source={{ uri: existingReaction.food_image_url }} style={styles.foodImage} />
        ) : (
          <View style={[styles.foodImage, styles.foodImagePlaceholder]}>
            <Text style={styles.foodImageText}>
              {existingReaction?.food_name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{existingReaction?.food_name}</Text>
          <Text style={styles.dateText}>
            {existingReaction?.consumed_at && formatDateTime(existingReaction.consumed_at)}
          </Text>
        </View>
      </View>

      <View style={styles.reactionGrid}>
        {REACTIONS.map(({ type, icon: Icon, label, desc, color, bgColor }) => {
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
              <View style={[styles.reactionIconCircle, { backgroundColor: isSelected ? color : '#F3F4F6' }]}>
                <Icon size={32} color={isSelected ? '#fff' : '#9CA3AF'} strokeWidth={2} />
              </View>
              <Text style={[styles.reactionLabel, isSelected && { color }]}>{label}</Text>
              <Text style={styles.reactionDesc}>{desc}</Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );

  // Step 2: Details (Optional)
  const renderDetailsStep = () => (
    <Animated.View
      key="details"
      entering={SlideInRight.duration(300)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContent}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Add more details</Text>
        <Text style={styles.stepSubtitle}>All fields are optional</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.detailsScroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Meal Type Section */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Type of meal</Text>
          <View style={styles.mealTypeRow}>
            {MEAL_TYPE_OPTIONS.map(({ value, icon: Icon, label, color }) => {
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
                    {label}
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
                  <Text style={styles.symptomEmoji}>{symptom.emoji}</Text>
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
            <Text style={styles.detailLabel}>How severe?</Text>
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
                {severity === 0 ? '' : severity <= 2 ? 'Mild' : severity <= 4 ? 'Moderate' : 'Severe'}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Time After (only if symptoms selected) */}
        {selectedSymptoms.length > 0 && (
          <Animated.View entering={FadeIn.duration(200).delay(100)} style={styles.detailSection}>
            <View style={styles.detailLabelRow}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.detailLabel}>When did symptoms appear?</Text>
            </View>
            <View style={styles.timeGrid}>
              {TIME_OPTIONS.map(({ value, label }) => {
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
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Energy Level */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Energy after eating?</Text>
          <View style={styles.energyRow}>
            {ENERGY_OPTIONS.map(({ value, icon: Icon, label, color }) => {
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
                    {label}
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
            <Text style={styles.detailLabel}>Additional notes</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            placeholder="Add any notes about this meal..."
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

  if (isLoading || !existingReaction) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
            <ChevronLeft size={24} color="#111827" />
          </Pressable>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>
    );
  }

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
          <Pressable onPress={handleDelete} style={styles.deleteButton} hitSlop={12}>
            <Trash2 size={20} color="#EF4444" />
          </Pressable>
        </View>

        {/* Step Content */}
        <View style={styles.contentContainer}>
          {currentStep === 'reaction' && renderReactionStep()}
          {currentStep === 'details' && renderDetailsStep()}
        </View>

        {/* Bottom Action */}
        <View style={[styles.bottomAction, { paddingBottom: insets.bottom + 16 }]}>
          {currentStep === 'details' ? (
            <Button
              title={t('journal.actions.update')}
              onPress={handleSave}
              loading={updateReaction.isPending}
              disabled={!reaction}
            />
          ) : (
            <Pressable
              onPress={handleNext}
              disabled={!canProceed()}
              style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
            >
              <Text style={[styles.nextButtonText, !canProceed() && styles.nextButtonTextDisabled]}>
                Continue
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
  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerSpacer: {
    width: 44,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
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

  // Food Info Card
  foodInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  foodImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  foodImagePlaceholder: {
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodImageText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0D9488',
  },
  foodInfo: {
    flex: 1,
    gap: 2,
  },
  foodName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
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
