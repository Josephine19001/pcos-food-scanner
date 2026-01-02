import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

interface SeveritySelectorProps {
  selected: number | null;
  onSelect: (severity: number) => void;
}

const SEVERITY_LEVELS = [
  { value: 1, labelKey: 'mild', color: '#FCD34D' },
  { value: 2, labelKey: 'mild', color: '#FBBF24' },
  { value: 3, labelKey: 'moderate', color: '#F59E0B' },
  { value: 4, labelKey: 'moderate', color: '#D97706' },
  { value: 5, labelKey: 'severe', color: '#DC2626' },
];

export function SeveritySelector({ selected, onSelect }: SeveritySelectorProps) {
  const { t } = useTranslation();

  const handleSelect = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(value);
  };

  const getLabel = () => {
    if (!selected) return '';
    const level = SEVERITY_LEVELS.find((l) => l.value === selected);
    return level ? t(`journal.severity.${level.labelKey}`) : '';
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.label}>{t('journal.severity.title')}</Text>
      <View style={styles.row}>
        <View style={styles.dotsRow}>
          {SEVERITY_LEVELS.map(({ value, color }) => {
            const isSelected = selected !== null && value <= selected;
            return (
              <Pressable
                key={value}
                onPress={() => handleSelect(value)}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isSelected ? color : 'rgba(229, 231, 235, 0.6)',
                    transform: [{ scale: selected === value ? 1.2 : 1 }],
                  },
                ]}
              />
            );
          })}
        </View>
        {selected && (
          <Text style={[styles.levelLabel, { color: SEVERITY_LEVELS[selected - 1].color }]}>
            {getLabel()}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
