import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { UtensilsCrossed, Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import * as Haptics from 'expo-haptics';

interface JournalEmptyStateProps {
  onAddEntry: () => void;
  variant?: 'full' | 'compact';
}

export function JournalEmptyState({ onAddEntry, variant = 'full' }: JournalEmptyStateProps) {
  const { t } = useTranslation();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddEntry();
  };

  if (variant === 'compact') {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={styles.compactContainer}>
        <View style={styles.compactIconContainer}>
          <UtensilsCrossed size={28} color="#0D9488" />
        </View>
        <Text style={styles.compactTitle}>{t('journal.noMeals.title')}</Text>
        <Text style={styles.compactDescription}>{t('journal.noMeals.description')}</Text>
        <Pressable onPress={handlePress} style={styles.compactButton}>
          <Plus size={18} color="#fff" strokeWidth={2.5} />
          <Text style={styles.compactButtonText}>{t('journal.noMeals.cta')}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <View style={styles.glassCard}>
        <View style={styles.iconContainer}>
          <UtensilsCrossed size={32} color="#0D9488" />
        </View>
        <Text style={styles.title}>{t('journal.noEntries.title')}</Text>
        <Text style={styles.description}>{t('journal.noEntries.description')}</Text>
        <View style={styles.buttonContainer}>
          <Button title={t('journal.noEntries.cta')} onPress={onAddEntry} size="medium" />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  glassCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    width: '100%',
    maxWidth: 320,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.2)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },

  // Compact variant styles
  compactContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  compactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  compactDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  compactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0D9488',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  compactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
