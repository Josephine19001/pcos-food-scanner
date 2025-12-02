import { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Linking, Pressable } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useTabBar } from '@/context/tab-bar-provider';
import {
  CameraHeader,
  CameraControls,
  ScanFrame,
} from '@/components/scan';
// import { useCreateScan } from '@/lib/hooks/use-scans';

export default function ScanScreen() {
  const router = useRouter();
  const { hideTabBar, showTabBar } = useTabBar();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Hide tab bar when screen is focused, show when leaving
  useFocusEffect(
    useCallback(() => {
      hideTabBar();
      return () => showTabBar();
    }, [hideTabBar, showTabBar])
  );

  // Request permission on mount if not determined
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

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

  const handleOpenSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  // Loading state - show black screen
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Permission denied and can't ask again - show message on black background
  if (!permission.granted && !permission.canAskAgain) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.permissionContainer}>
          <CameraHeader
            flash={false}
            onClose={handleClose}
            onToggleFlash={() => {}}
          />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionText}>
              To scan food items, please enable camera access in your device settings.
            </Text>
            <Pressable onPress={handleOpenSettings} style={styles.settingsButton}>
              <Text style={styles.settingsButtonText}>Open Settings</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Permission not granted yet (waiting for native alert response)
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.permissionContainer}>
          <CameraHeader
            flash={false}
            onClose={handleClose}
            onToggleFlash={() => {}}
          />
        </SafeAreaView>
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        enableTorch={flash}
      >
        <SafeAreaView style={styles.cameraContent}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraContent: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
  },
  permissionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  settingsButton: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
