import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { TimeAfterEating } from '@/lib/types/journal';

interface TimeAfterSelectorProps {
  selected: TimeAfterEating | null;
  onSelect: (time: TimeAfterEating) => void;
}

const TIME_OPTIONS: { value: TimeAfterEating; labelKey: string }[] = [
  { value: 'immediate', labelKey: 'immediate' },
  { value: '30min', labelKey: 'thirtyMin' },
  { value: '1hour', labelKey: 'oneHour' },
  { value: '2hours', labelKey: 'twoHours' },
  { value: 'next_day', labelKey: 'nextDay' },
];

export function TimeAfterSelector({ selected, onSelect }: TimeAfterSelectorProps) {
  const { t } = useTranslation();

  const handleSelect = (time: TimeAfterEating) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(time);
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={styles.headerRow}>
        <Clock size={18} color="#6B7280" />
        <Text style={styles.label}>{t('journal.timeAfter.title')}</Text>
      </View>
      <View style={styles.optionsRow}>
        {TIME_OPTIONS.map(({ value, labelKey }) => {
          const isSelected = selected === value;
          return (
            <Pressable
              key={value}
              onPress={() => handleSelect(value)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {t(`journal.timeAfter.${labelKey}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.8)',
  },
  optionSelected: {
    backgroundColor: 'rgba(209, 250, 244, 0.9)',
    borderColor: '#0D9488',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionTextSelected: {
    color: '#0D9488',
    fontWeight: '600',
  },
});
