import { useState, useEffect, useRef } from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { X, Flashlight, Camera } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

import { ProductDetailModal } from '@/components/saves/ProductDetailModal';
import * as ImageManipulator from 'expo-image-manipulator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '@/context/subscription-provider';
import { FreemiumGate } from '@/components/freemium-gate';
import { toast } from 'sonner-native';

let CameraView: any = null;
let useCameraPermissions: any = null;
let cameraAvailable = false;

try {
  const expoCamera = require('expo-camera');
  CameraView = expoCamera.CameraView;
  useCameraPermissions = expoCamera.useCameraPermissions;
  cameraAvailable = !!(CameraView && useCameraPermissions);
} catch (error) {
  cameraAvailable = false;
}

type ScanMode = 'camera';

interface ProductScanResult {
  id: string;
  name: string;
  brand: string;
  category: string;
  safetyScore: number;
  image?: string;
  keyIngredients: Array<{
    name: string;
    type: 'beneficial' | 'harmful' | 'neutral';
    description: string;
  }>;
  price?: string;
  rating?: number;
  isAvailable?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export function ScanScreen() {
  // Only use camera hooks if available and safe
  const [permission, requestPermission] =
    cameraAvailable && useCameraPermissions ? useCameraPermissions() : [null, null];

  const [scanMode] = useState<ScanMode>('camera');

  const [flashOn, setFlashOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showAnalysisSheet, setShowAnalysisSheet] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showFreemiumGate, setShowFreemiumGate] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ProductScanResult | null>(null);
  const [convertedProduct, setConvertedProduct] = useState<any | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);

  const cropX = useSharedValue(screenWidth * 0.125); // Center position for 75% width
  const cropY = useSharedValue((screenHeight - screenWidth * 0.75) / 2 - 80);
  const cropWidth = useSharedValue(screenWidth * 0.75);
  const cropHeight = useSharedValue(screenWidth * 0.75);

  const cameraRef = useRef<any>(null);
  const { canAccessFeature, incrementFreeUsage } = useSubscription();

  useEffect(() => {
    if (cameraAvailable && permission && !permission.granted) {
      setShowPermissionModal(true);
    }
  }, [permission]);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const handleCameraPermission = async (allow: boolean) => {
    setShowPermissionModal(false);
    if (allow && requestPermission) {
      await requestPermission();
    }
  };

  const takePicture = async () => {
    if (!isCameraReady) {
      toast.error('Camera is starting up, please wait...');
      return;
    }

    if (!cameraAvailable || !CameraView || !permission?.granted) {
      toast.error('Camera not available');
      return;
    }

    setIsScanning(true);
    setScanningProgress(0);

    const interval = setInterval(() => {
      setScanningProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    try {
      console.log('📸 Taking picture...');

      // Capture the full camera image
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo?.uri) {
        throw new Error('Failed to capture image');
      }

      console.log('✂️ Cropping image to selected area...');

      // Get current crop dimensions (convert from shared values)
      const currentCropX = cropX.value;
      const currentCropY = cropY.value;
      const currentCropWidth = cropWidth.value;
      const currentCropHeight = cropHeight.value;

      // Calculate crop ratios relative to screen dimensions
      const cropRatioX = currentCropX / screenWidth;
      const cropRatioY = currentCropY / screenHeight;
      const cropRatioWidth = currentCropWidth / screenWidth;
      const cropRatioHeight = currentCropHeight / screenHeight;

      // Crop the captured image using ImageManipulator
      const croppedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: cropRatioX * photo.width,
              originY: cropRatioY * photo.height,
              width: cropRatioWidth * photo.width,
              height: cropRatioHeight * photo.height,
            },
          },
          { resize: { width: 800 } }, // Resize for consistent sizing
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      console.log('🔍 Processing cropped image...');
      setCapturedImage(croppedImage.uri);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      clearInterval(interval);
      setScanningProgress(100);

      // Mock product results with the cropped image
      const mockProducts = [
        {
          id: 'mock-product-1',
          name: 'Shea Moisture Coconut Oil',
          brand: 'Shea Moisture',
          category: 'Hair',
          safetyScore: 8.5,
          image: { uri: croppedImage.uri }, // Use cropped image
          keyIngredients: [
            {
              name: 'Coconut Oil',
              type: 'beneficial' as const,
              description: 'Deeply moisturizes and nourishes hair while reducing protein loss.',
            },
            {
              name: 'Shea Butter',
              type: 'beneficial' as const,
              description: 'Provides intense moisture and helps repair damaged hair.',
            },
            {
              name: 'Sulfates',
              type: 'harmful' as const,
              description: 'Can strip natural oils and cause dryness and irritation.',
            },
          ],
          dateScanned: new Date().toISOString(),
        },
        {
          id: 'mock-product-2',
          name: 'Olaplex Hair Perfector',
          brand: 'Olaplex',
          category: 'Hair',
          safetyScore: 9.2,
          image: { uri: croppedImage.uri }, // Use cropped image
          keyIngredients: [
            {
              name: 'Bis-Aminopropyl Diglycol Dimaleate',
              type: 'beneficial' as const,
              description: 'Rebuilds broken disulfide bonds to repair damaged hair.',
            },
            {
              name: 'Phenoxyethanol',
              type: 'neutral' as const,
              description: 'Preservative that keeps the product fresh and safe.',
            },
          ],
          dateScanned: new Date().toISOString(),
        },
        {
          id: 'mock-product-3',
          name: 'TRESemmé Keratin Smooth',
          brand: 'TRESemmé',
          category: 'Hair',
          safetyScore: 6.8,
          image: { uri: croppedImage.uri }, // Use cropped image
          keyIngredients: [
            {
              name: 'Keratin',
              type: 'beneficial' as const,
              description: 'Strengthens hair and reduces frizz for smoother results.',
            },
            {
              name: 'Sodium Lauryl Sulfate',
              type: 'harmful' as const,
              description: 'Harsh detergent that can strip natural oils and cause dryness.',
            },
            {
              name: 'Parabens',
              type: 'harmful' as const,
              description: 'Preservatives that may disrupt hormones with long-term use.',
            },
          ],
          dateScanned: new Date().toISOString(),
        },
      ];

      // Randomly select a mock product for variety
      const mockProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];

      setConvertedProduct(mockProduct);

      setTimeout(() => {
        setIsScanning(false);
        setScanningProgress(0);
        setShowProductModal(true);
      }, 500);
    } catch (error: any) {
      console.error('❌ Scanning failed:', error);
      toast.error(`Scan error: ${error?.message || 'Unknown error'}`);
      clearInterval(interval);
      setIsScanning(false);
      setScanningProgress(0);
    }
  };

  const renderPermissionModal = () => (
    <View className="absolute inset-0 bg-black/80 items-center justify-center z-50">
      <View className="bg-gray-800 rounded-3xl p-6 mx-8 max-w-sm">
        <Text className="text-white text-xl font-bold text-center mb-4">
          "hair-deets" Would Like to Access the Camera
        </Text>
        <Text className="text-gray-300 text-center mb-8 leading-6">
          This allows you to scan and identify objects around you.
        </Text>
        <View className="flex-row">
          <Pressable onPress={() => handleCameraPermission(false)} className="flex-1 py-3 mr-2">
            <Text className="text-blue-400 text-center font-semibold">Don't Allow</Text>
          </Pressable>
          <Pressable onPress={() => handleCameraPermission(true)} className="flex-1 py-3 ml-2">
            <Text className="text-blue-400 text-center font-semibold">Allow</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const handleSaveScan = (scanId: string) => {
    console.log('Saving scan:', scanId);
  };

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = cropX.value;
      context.startY = cropY.value;
    },
    onActive: (event, context: any) => {
      cropX.value = Math.max(
        0,
        Math.min(screenWidth - cropWidth.value, context.startX + event.translationX)
      );
      cropY.value = Math.max(
        100,
        Math.min(screenHeight - cropHeight.value - 200, context.startY + event.translationY)
      );
    },
  });

  const resizeGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startWidth = cropWidth.value;
      context.startHeight = cropHeight.value;
    },
    onActive: (event, context: any) => {
      const newWidth = Math.max(
        200,
        Math.min(screenWidth - cropX.value, context.startWidth + event.translationX)
      );
      const newHeight = Math.max(
        200,
        Math.min(screenHeight - cropY.value - 200, context.startHeight + event.translationY)
      );
      cropWidth.value = newWidth;
      cropHeight.value = newHeight;
    },
  });

  const cropAreaStyle = useAnimatedStyle(() => ({
    left: cropX.value,
    top: cropY.value,
    width: cropWidth.value,
    height: cropHeight.value,
  }));

  const renderScanningFrame = () => {
    return (
      <View className="absolute inset-0">
        <View className="absolute inset-0 bg-black/30" />

        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View
            style={[
              cropAreaStyle,
              {
                borderWidth: 2,
                borderColor: '#FBBF24',
                borderRadius: 16,
                borderStyle: 'dashed',
              },
            ]}
            className="absolute"
          >
            <View className="flex-1" style={{ backgroundColor: 'transparent' }} />

            {isScanning && (
              <View
                className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
                style={{
                  height: `${scanningProgress}%`,
                  backgroundColor: 'rgba(75, 85, 99, 0.7)',
                }}
              />
            )}

            <PanGestureHandler onGestureEvent={resizeGestureHandler}>
              <Animated.View
                className="absolute w-8 h-8 bg-yellow-400 rounded-full border-2 border-white"
                style={{
                  bottom: -12,
                  right: -12,
                }}
              />
            </PanGestureHandler>

            <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <View className="w-8 h-8 bg-yellow-400/20 rounded-full items-center justify-center">
                <View className="w-4 h-4 bg-yellow-400 rounded-full" />
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>

        <View className="absolute bottom-32 left-0 right-0 px-6">
          <Text className="text-white text-center text-sm opacity-80">
            Drag to move • Pull corner to resize
          </Text>
        </View>

        {/* Scanning status text */}
        {isScanning && (
          <View className="absolute bottom-40 left-0 right-0 items-center">
            <Text className="text-white text-center font-medium">
              Analyzing product... {Math.round(scanningProgress)}%
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-black">
        {permission?.granted && cameraAvailable && CameraView && (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            enableTorch={flashOn}
            facing="back"
            onCameraReady={onCameraReady}
          />
        )}

        <SafeAreaView className="flex-1">
          <View className="flex-row justify-between items-center px-4 pt-2 pb-4 z-10">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center"
            >
              <X size={26} color="white" />
            </Pressable>

            <Pressable
              onPress={() => setFlashOn(!flashOn)}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                flashOn ? 'bg-yellow-500' : 'bg-yellow-400'
              }`}
            >
              <Flashlight size={24} color={flashOn ? 'black' : 'black'} />
            </Pressable>
          </View>

          {permission?.granted && renderScanningFrame()}

          <View className="absolute bottom-0 left-0 right-0 pb-8 px-6">
            <View className="items-center">
              <Pressable
                onPress={takePicture}
                disabled={isScanning || !isCameraReady}
                className="w-20 h-20 bg-white rounded-full items-center justify-center border-4 border-gray-300"
              >
                <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center">
                  <Camera size={32} color="#374151" />
                </View>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>

        {showPermissionModal && renderPermissionModal()}

        <ProductDetailModal
          visible={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setScannedProduct(null);
            setConvertedProduct(null);
          }}
          product={convertedProduct}
          onToggleFavorite={handleSaveScan}
          modalHeight="80%"
        />

        <FreemiumGate
          visible={showFreemiumGate}
          feature="product_scan"
          featureName="Product Scanning"
          featureDescription="Analyze hair product ingredients with AI-powered insights"
          icon="camera-outline"
          onClose={() => setShowFreemiumGate(false)}
        />
      </View>
    </GestureHandlerRootView>
  );
}
