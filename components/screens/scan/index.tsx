import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { router } from 'expo-router';
import { X, HelpCircle, Zap } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { ScanOptionSelector } from '@/components/scan-option-selector';
import { HelpModal } from './help-modal';
import { askForCameraPermission, askForGalleryPermissions } from '@/lib/utils/permission';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScanMode = 'product' | 'barcode' | 'gallery';

export function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>('product');
  const [showHelp, setShowHelp] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    (async () => {
      const granted = await askForCameraPermission();
      setHasPermission(granted);
    })();
  }, []);

  useEffect(() => {
    if (scanMode === 'gallery') {
      (async () => {
        const granted = await askForGalleryPermissions();
        if (!granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
          const uri = result.assets[0].uri;
          console.log('Selected image from gallery:', uri);
        }
      })();
    }
  }, [scanMode]);

  if (!hasPermission && scanMode !== 'gallery') {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {scanMode !== 'gallery' && (
        <CameraView style={StyleSheet.absoluteFillObject} enableTorch={flashOn} facing="back" />
      )}

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-2">
          <Pressable onPress={() => router.back()}>
            <X size={26} color="white" />
          </Pressable>

          <Text className="text-white text-xl font-semibold">
            {scanMode === 'product'
              ? 'Scan Ingredients'
              : scanMode === 'barcode'
                ? 'Barcode Scanner'
                : 'Import from Gallery'}
          </Text>

          <Pressable onPress={() => setShowHelp(true)}>
            <HelpCircle size={26} color="white" />
          </Pressable>
        </View>

        {scanMode !== 'gallery' && (
          <View className="flex-1 justify-center items-center">
            <View className="w-[80%] aspect-[4/3] border-2 border-white rounded-xl" />
          </View>
        )}

        <View className="bg-black/60 pt-4 pb-8 px-2">
          <ScanOptionSelector
            selected={scanMode}
            onSelect={(mode) => setScanMode(mode as ScanMode)}
            options={[
              { label: 'Product', value: 'product' },
              { label: 'Barcode', value: 'barcode' },
              { label: 'Gallery', value: 'gallery' },
            ]}
          />

          {scanMode !== 'gallery' && (
            <Pressable
              onPress={() => setFlashOn((prev) => !prev)}
              className="self-center mt-4 bg-white/20 p-3 rounded-full"
            >
              <Zap size={24} color="white" />
            </Pressable>
          )}
        </View>
      </SafeAreaView>

      <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} />
    </View>
  );
}
