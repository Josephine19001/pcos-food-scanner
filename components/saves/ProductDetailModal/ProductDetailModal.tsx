import React from 'react';
import { View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { ScannedProductUI } from '@/lib/types/product';
import { ProductHero } from './ProductHero';
import { ProductStats } from './ProductStats';
import { IngredientsSection } from './IngredientsSection';
import { ProductLinks } from './ProductLinks';

interface ProductDetailModalProps {
  product: ScannedProductUI | null;
  visible: boolean;
  onClose: () => void;
  onToggleFavorite?: (productId: string) => void;
  modalHeight?: 'full' | '80%';
  onSaveScan?: () => void;
  isSavingScan?: boolean;
  isScanSaved?: boolean;
}

export function ProductDetailModal({
  product,
  visible,
  onClose,
  onToggleFavorite,
  modalHeight = 'full',
  onSaveScan,
  isSavingScan = false,
  isScanSaved = false,
}: ProductDetailModalProps) {
  if (!product) return null;

  if (modalHeight === '80%') {
    return (
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="h-4/5 bg-slate-50 rounded-t-3xl">
            <SafeAreaView className="flex-1 mt-4" edges={['bottom']}>
              {/* Header */}
              <View className="flex-row items-center justify-between px-6 py-4 bg-slate-50 rounded-t-3xl">
                <TouchableOpacity
                  onPress={onClose}
                  className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
                >
                  <ArrowLeft size={20} color="#000" />
                </TouchableOpacity>

                <View className="flex-1" />

                {onToggleFavorite && (
                  <TouchableOpacity
                    onPress={() => onToggleFavorite(product.id)}
                    className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
                  >
                    <Heart
                      size={20}
                      color="#000"
                      fill={product.isFavorite ? '#000' : 'transparent'}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <ProductHero product={product} />
                <ProductStats product={product} />
                <IngredientsSection product={product} />
                <ProductLinks product={product} />
              </ScrollView>

              {/* Save Button */}
              {onSaveScan && (
                <View className="px-6 pb-6">
                  <TouchableOpacity
                    onPress={onSaveScan}
                    disabled={isSavingScan || isScanSaved}
                    className={`w-full py-4 rounded-2xl items-center ${
                      isScanSaved ? 'bg-green-500' : 'bg-black'
                    }`}
                  >
                    <Text className="text-white text-lg font-bold">
                      {isScanSaved ? 'Saved!' : isSavingScan ? 'Saving...' : 'Save Scan'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    );
  }

  // Full height modal
  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-slate-50 mt-4" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
          >
            <ArrowLeft size={20} color="#000" />
          </TouchableOpacity>

          <View className="flex-1" />

          {onToggleFavorite && (
            <TouchableOpacity
              onPress={() => onToggleFavorite(product.id)}
              className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
            >
              <Heart size={20} color="#000" fill={product.isFavorite ? '#000' : 'transparent'} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <ProductHero product={product} />
          <ProductStats product={product} />
          <IngredientsSection product={product} />
          <ProductLinks product={product} />
        </ScrollView>

        {/* Save Button */}
        {onSaveScan && (
          <View className="px-6 pb-6">
            <TouchableOpacity
              onPress={onSaveScan}
              disabled={isSavingScan || isScanSaved}
              className={`w-full py-4 rounded-2xl items-center ${
                isScanSaved ? 'bg-green-500' : 'bg-black'
              }`}
            >
              <Text className="text-white text-lg font-bold">
                {isScanSaved ? 'Saved!' : isSavingScan ? 'Saving...' : 'Save Scan'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
