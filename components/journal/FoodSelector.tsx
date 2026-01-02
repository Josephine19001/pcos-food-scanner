import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check, Edit3 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRecentFoods } from '@/lib/hooks/use-journal';
import type { FoodOption } from '@/lib/types/journal';

interface FoodSelectorProps {
  selectedFood: { id?: string; name: string; image_url?: string } | null;
  onSelectFood: (food: { id?: string; name: string; image_url?: string }) => void;
}

const STATUS_COLORS = {
  safe: '#059669',
  caution: '#D97706',
  avoid: '#DC2626',
};

export function FoodSelector({ selectedFood, onSelectFood }: FoodSelectorProps) {
  const { t } = useTranslation();
  const { data: recentFoods = [], isLoading } = useRecentFoods();
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualFoodName, setManualFoodName] = useState('');

  const handleSelectScan = (food: FoodOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsManualEntry(false);
    onSelectFood({
      id: food.id,
      name: food.name,
      image_url: food.image_url,
    });
  };

  const handleManualEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsManualEntry(true);
    onSelectFood({ name: manualFoodName });
  };

  const handleManualNameChange = (text: string) => {
    setManualFoodName(text);
    if (isManualEntry) {
      onSelectFood({ name: text });
    }
  };

  const renderFoodItem = ({ item }: { item: FoodOption }) => {
    const isSelected = selectedFood?.id === item.id;
    return (
      <Pressable
        onPress={() => handleSelectScan(item)}
        style={[styles.foodItem, isSelected && styles.foodItemSelected]}
      >
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.foodImage} />
        ) : (
          <View style={[styles.foodImage, styles.foodImagePlaceholder]}>
            <Text style={styles.foodImagePlaceholderText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.foodInfo}>
          <Text style={styles.foodName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
        </View>
        {isSelected && (
          <View style={styles.checkIcon}>
            <Check size={16} color="#0D9488" strokeWidth={3} />
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.label}>{t('journal.food.selectFood')}</Text>

      {/* Manual Entry Toggle */}
      <Pressable onPress={handleManualEntry} style={styles.manualEntryToggle}>
        <Edit3 size={18} color={isManualEntry ? '#0D9488' : '#6B7280'} />
        <Text style={[styles.manualEntryText, isManualEntry && styles.manualEntryTextActive]}>
          {t('journal.food.manualEntry')}
        </Text>
      </Pressable>

      {/* Manual Entry Input */}
      {isManualEntry && (
        <Animated.View entering={FadeIn.duration(200)}>
          <TextInput
            style={styles.manualInput}
            placeholder={t('journal.food.foodNamePlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={manualFoodName}
            onChangeText={handleManualNameChange}
            autoFocus
          />
        </Animated.View>
      )}

      {/* Recent Scans List */}
      {!isManualEntry && (
        <>
          <Text style={styles.sectionLabel}>{t('journal.food.recentScans')}</Text>
          {recentFoods.length === 0 ? (
            <Text style={styles.emptyText}>{t('journal.food.noRecentScans')}</Text>
          ) : (
            <FlatList
              data={recentFoods}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.foodList}
            />
          )}
        </>
      )}

      {/* Selected Food Display */}
      {selectedFood?.name && (
        <View style={styles.selectedDisplay}>
          <Text style={styles.selectedLabel}>Selected:</Text>
          <Text style={styles.selectedName}>{selectedFood.name}</Text>
        </View>
      )}
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
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  manualEntryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  manualEntryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  manualEntryTextActive: {
    color: '#0D9488',
    fontWeight: '600',
  },
  manualInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0D9488',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  foodList: {
    gap: 12,
    paddingVertical: 4,
  },
  foodItem: {
    width: 100,
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(229, 231, 235, 0.8)',
  },
  foodItemSelected: {
    borderColor: '#0D9488',
    backgroundColor: 'rgba(209, 250, 244, 0.5)',
  },
  foodImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  foodImagePlaceholder: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodImagePlaceholderText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0D9488',
  },
  foodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  foodName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    maxWidth: 70,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(209, 250, 244, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  selectedDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(209, 250, 244, 0.5)',
    borderRadius: 8,
    marginTop: 4,
  },
  selectedLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  selectedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D9488',
  },
});
