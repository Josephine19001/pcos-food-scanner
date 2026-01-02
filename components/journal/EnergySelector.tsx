import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Battery, BatteryMedium, BatteryFull } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EnergySelectorProps {
  selected: number | null;
  onSelect: (level: number) => void;
}

const ENERGY_LEVELS = [
  { value: 1, labelKey: 'low', icon: Battery, color: '#DC2626' },
  { value: 3, labelKey: 'normal', icon: BatteryMedium, color: '#D97706' },
  { value: 5, labelKey: 'high', icon: BatteryFull, color: '#059669' },
];

export function EnergySelector({ selected, onSelect }: EnergySelectorProps) {
  const { t } = useTranslation();

  const handleSelect = (value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(value);
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.label}>{t('journal.energy.title')}</Text>
      <View style={styles.optionsRow}>
        {ENERGY_LEVELS.map(({ value, labelKey, icon: Icon, color }) => {
          const isSelected = selected === value;
          return (
            <Pressable
              key={value}
              onPress={() => handleSelect(value)}
              style={[
                styles.option,
                isSelected && { backgroundColor: `${color}15`, borderColor: color },
              ]}
            >
              <Icon size={24} color={isSelected ? color : '#9CA3AF'} />
              <Text style={[styles.optionText, isSelected && { color, fontWeight: '600' }]}>
                {t(`journal.energy.${labelKey}`)}
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(229, 231, 235, 0.8)',
    gap: 6,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
});
