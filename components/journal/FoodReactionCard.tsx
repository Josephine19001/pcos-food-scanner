import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ThumbsUp, Meh, ThumbsDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { FoodReaction, ReactionType } from '@/lib/types/journal';

interface FoodReactionCardProps {
  reaction: FoodReaction;
  onPress: (reaction: FoodReaction) => void;
}

const REACTION_CONFIG: Record<ReactionType, { icon: typeof ThumbsUp; color: string; bgColor: string }> = {
  good: { icon: ThumbsUp, color: '#059669', bgColor: 'rgba(5, 150, 105, 0.1)' },
  okay: { icon: Meh, color: '#D97706', bgColor: 'rgba(217, 119, 6, 0.1)' },
  bad: { icon: ThumbsDown, color: '#DC2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
};

function formatDate(dateString: string, t: (key: string) => string): string {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entryDate = new Date(date);
  entryDate.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (entryDate.getTime() === today.getTime()) {
    return t('journal.dates.today');
  }
  if (entryDate.getTime() === yesterday.getTime()) {
    return t('journal.dates.yesterday');
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function FoodReactionCard({ reaction, onPress }: FoodReactionCardProps) {
  const { t } = useTranslation();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(reaction);
  };

  const { icon: ReactionIcon, color, bgColor } = REACTION_CONFIG[reaction.reaction];
  const symptomCount = reaction.symptoms?.length || 0;

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {/* Food Image */}
      {reaction.food_image_url ? (
        <Image source={{ uri: reaction.food_image_url }} style={styles.foodImage} />
      ) : (
        <View style={[styles.foodImage, styles.foodImagePlaceholder]}>
          <Text style={styles.foodImagePlaceholderText}>
            {reaction.food_name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.foodName} numberOfLines={1}>
            {reaction.food_name}
          </Text>
          <Text style={styles.date}>{formatDate(reaction.consumed_at, t)}</Text>
        </View>

        <View style={styles.detailsRow}>
          {/* Reaction Badge */}
          <View style={[styles.reactionBadge, { backgroundColor: bgColor }]}>
            <ReactionIcon size={14} color={color} />
            <Text style={[styles.reactionText, { color }]}>
              {t(`journal.reaction.${reaction.reaction}`)}
            </Text>
          </View>

          {/* Symptoms count */}
          {symptomCount > 0 && (
            <View style={styles.symptomBadge}>
              <Text style={styles.symptomBadgeText}>
                {symptomCount} symptom{symptomCount > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Notes preview */}
        {reaction.notes && (
          <Text style={styles.notesPreview} numberOfLines={1}>
            {reaction.notes}
          </Text>
        )}
      </View>

      {/* Chevron */}
      <ChevronRight size={20} color="#9CA3AF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
    gap: 12,
  },
  foodImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  foodImagePlaceholder: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodImagePlaceholderText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0D9488',
  },
  content: {
    flex: 1,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  reactionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  symptomBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(243, 244, 246, 0.8)',
  },
  symptomBadgeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  notesPreview: {
    fontSize: 13,
    color: '#6B7280',
  },
});
