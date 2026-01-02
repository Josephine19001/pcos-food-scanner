import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { FoodSymptomKey } from '@/lib/types/journal';

// Food-related symptoms with emojis for display
export const FOOD_SYMPTOMS: { key: FoodSymptomKey; emoji: string }[] = [
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

interface SymptomSelectorProps {
  selectedSymptoms: FoodSymptomKey[];
  onToggle: (symptom: FoodSymptomKey) => void;
  optional?: boolean;
}

export function SymptomSelector({ selectedSymptoms, onToggle, optional = false }: SymptomSelectorProps) {
  const { t } = useTranslation();

  const handleToggle = (symptom: FoodSymptomKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(symptom);
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.label}>{t('journal.symptoms.title')}</Text>
      <Text style={styles.hint}>{t('journal.symptoms.hint')}</Text>
      <View style={styles.symptomsGrid}>
        {FOOD_SYMPTOMS.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom.key);
          return (
            <Pressable
              key={symptom.key}
              onPress={() => handleToggle(symptom.key)}
              style={[
                styles.symptomChip,
                isSelected && styles.symptomChipSelected,
              ]}
            >
              <Text style={styles.symptomEmoji}>{symptom.emoji}</Text>
              <Text
                style={[
                  styles.symptomText,
                  isSelected && styles.symptomTextSelected,
                ]}
              >
                {t(`journal.symptoms.${symptom.key}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {optional && selectedSymptoms.length === 0 && (
        <Text style={styles.noSymptoms}>{t('journal.symptoms.none')}</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  hint: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
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
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(229, 231, 235, 0.8)',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  symptomEmoji: {
    fontSize: 16,
  },
  symptomChipSelected: {
    backgroundColor: 'rgba(209, 250, 244, 0.9)',
    borderColor: '#0D9488',
    shadowOpacity: 0.12,
  },
  symptomText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  symptomTextSelected: {
    color: '#0D9488',
    fontWeight: '600',
  },
  noSymptoms: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
