import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThumbsUp, Meh, ThumbsDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { ReactionType } from '@/lib/types/journal';

interface ReactionSelectorProps {
  selected: ReactionType | null;
  onSelect: (reaction: ReactionType) => void;
}

const REACTIONS: { type: ReactionType; icon: typeof ThumbsUp; color: string; bgColor: string }[] = [
  { type: 'good', icon: ThumbsUp, color: '#059669', bgColor: 'rgba(5, 150, 105, 0.1)' },
  { type: 'okay', icon: Meh, color: '#D97706', bgColor: 'rgba(217, 119, 6, 0.1)' },
  { type: 'bad', icon: ThumbsDown, color: '#DC2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
];

export function ReactionSelector({ selected, onSelect }: ReactionSelectorProps) {
  const { t } = useTranslation();

  const handleSelect = (reaction: ReactionType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(reaction);
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.label}>{t('journal.reaction.title')}</Text>
      <View style={styles.reactionsRow}>
        {REACTIONS.map(({ type, icon: Icon, color, bgColor }) => {
          const isSelected = selected === type;
          return (
            <Pressable
              key={type}
              onPress={() => handleSelect(type)}
              style={[
                styles.reactionButton,
                { backgroundColor: isSelected ? bgColor : 'rgba(255, 255, 255, 0.85)' },
                isSelected && { borderColor: color },
              ]}
            >
              <Icon
                size={28}
                color={isSelected ? color : '#9CA3AF'}
                strokeWidth={isSelected ? 2.5 : 2}
              />
              <Text
                style={[
                  styles.reactionLabel,
                  isSelected && { color, fontWeight: '600' },
                ]}
              >
                {t(`journal.reaction.${type}`)}
              </Text>
              <Text
                style={[
                  styles.reactionDesc,
                  isSelected && { color },
                ]}
              >
                {t(`journal.reaction.${type}Desc`)}
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
  reactionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  reactionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(229, 231, 235, 0.8)',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  reactionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 8,
  },
  reactionDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
