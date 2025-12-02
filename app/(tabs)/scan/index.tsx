import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  CameraPermission,
  CameraHeader,
  CameraControls,
  ScanFrame,
} from '@/components/scan';
// import { useCreateScan } from '@/lib/hooks/use-scans';

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // TODO: Uncomment when backend is ready
  // const createScan = useCreateScan();

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const toggleFlash = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlash((prev) => !prev);
  }, []);

  const toggleCameraFacing = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  const processImage = useCallback(async (_imageUri: string) => {
    // TODO: Send image to backend for analysis
    // For now, show a placeholder message
    Alert.alert(
      'Photo Captured',
      'Food analysis feature coming soon! We will analyze this food item for PCOS compatibility.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  }, [router]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo?.uri) {
        await processImage(photo.uri);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, processImage]);

  const handlePickImage = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await processImage(result.assets[0].uri);
    }
  }, [processImage]);

  // Loading state
  if (!permission) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Loading camera...</Text>
      </View>
    );
  }

  // Permission not granted
  if (!permission.granted) {
    return (
      <CameraPermission
        onRequestPermission={requestPermission}
        onClose={handleClose}
      />
    );
  }

  // Camera view
  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        enableTorch={flash}
      >
        <SafeAreaView className="flex-1">
          <CameraHeader
            flash={flash}
            onClose={handleClose}
            onToggleFlash={toggleFlash}
          />

          <ScanFrame />

          <CameraControls
            onCapture={handleCapture}
            onFlipCamera={toggleCameraFacing}
            onPickImage={handlePickImage}
            isCapturing={isCapturing}
          />
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
