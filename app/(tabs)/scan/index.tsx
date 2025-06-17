import { useState, useRef, useEffect } from 'react';
import { View, Image, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Text } from '@/components/ui/text';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAnalyzeScan } from '@/lib/hooks/use-analyze-scan';
import { ProductDetailModal } from '@/components/saves/ProductDetailModal';
import { useSaveScan } from '@/lib/hooks/use-scans';
import { useAuth } from '@/context/auth-provider';
import { ProductAnalysisResult, ScannedProductUI, convertToUIFormat } from '@/lib/types/product';
import { toast } from 'sonner-native';
import { router } from 'expo-router';
import {
  CameraPermissionScreen,
  CropOverlay,
  ProcessingOverlay,
  CameraControls,
  CropArea,
} from '@/components/scan';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProductUI | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [showCapturedImage, setShowCapturedImage] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: screenWidth * 0.1,
    y: screenHeight * 0.3,
    width: screenWidth * 0.8,
    height: screenWidth * 0.6,
  });

  const cameraRef = useRef<CameraView>(null);

  const { user } = useAuth();
  const analyzeScan = useAnalyzeScan();
  const saveScan = useSaveScan();

  useEffect(() => {
    if (analyzeScan.data && capturedImage) {
      try {
        const uiProduct = convertToUIFormat(analyzeScan.data, capturedImage);
        setScannedProduct(uiProduct);
        setShowModal(true);
      } catch (error: any) {
        toast.error('Failed to process analysis results. Please try again.');
        analyzeScan.reset();
      }
    }
  }, [analyzeScan.data, capturedImage]);

  useEffect(() => {
    if (analyzeScan.error) {
      toast.error(analyzeScan.error.message || 'Unable to analyze the product. Please try again.', {
        action: {
          label: 'Try Again',
          onClick: () => {
            analyzeScan.reset();
            setShowCapturedImage(false);
            setCapturedImage(null);
            setIsProcessingImage(false);
          },
        },
      });
    }
  }, [analyzeScan.error]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return <CameraPermissionScreen onRequestPermission={requestPermission} />;
  }

  const takePicture = async () => {
    if (!cameraRef.current) {
      toast.error('Camera not ready. Please wait a moment and try again.');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo && photo.uri) {
        setCapturedImage(photo);
        setShowCapturedImage(true);
      } else {
        toast.error('Failed to capture image. Please try again.');
      }
    } catch (error: any) {
      let errorMessage = 'Failed to take picture. Please try again.';

      if (error?.message?.includes('Camera')) {
        errorMessage = 'Camera error. Please restart the app and try again.';
      } else if (error?.message?.includes('permission')) {
        errorMessage = 'Camera permission denied. Please check your settings.';
      }

      toast.error(errorMessage);
    }
  };

  const cropAndAnalyze = async () => {
    if (!capturedImage) {
      toast.error('No image to analyze. Please take a photo first.');
      return;
    }

    setIsProcessingImage(true);

    try {
      // Calculate crop parameters as percentages of image dimensions
      const cropX = cropArea.x / screenWidth;
      const cropY = cropArea.y / screenHeight;
      const cropWidth = cropArea.width / screenWidth;
      const cropHeight = cropArea.height / screenHeight;

      // Crop the image
      const croppedImage = await ImageManipulator.manipulateAsync(
        capturedImage.uri,
        [
          {
            crop: {
              originX: cropX * capturedImage.width,
              originY: cropY * capturedImage.height,
              width: cropWidth * capturedImage.width,
              height: cropHeight * capturedImage.height,
            },
          },
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Update captured image with cropped version
      setCapturedImage(croppedImage);

      // Start analysis
      analyzeScan.mutate({ imageUrl: croppedImage.uri });
    } catch (error: any) {
      toast.error('Failed to process image. Please try again.');
      setIsProcessingImage(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setShowCapturedImage(false);
    setIsProcessingImage(false);
    analyzeScan.reset();
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setCapturedImage(asset);
        setShowCapturedImage(true);
      }
    } catch (error: any) {
      toast.error('Failed to pick image from gallery. Please try again.');
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleTorch = () => {
    setTorch((current) => !current);
  };

  const handleSaveScan = async () => {
    if (!scannedProduct || !user || !analyzeScan.data) return;

    try {
      await saveScan.mutateAsync(analyzeScan.data);
      toast.success('Product saved to your collection!');
    } catch (error: any) {
      toast.error('Failed to save product. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setScannedProduct(null);
    setIsProcessingImage(false);
    analyzeScan.reset();

    // Reset to camera view
    setCapturedImage(null);
    setShowCapturedImage(false);
  };

  const closeScan = () => {
    setScannedProduct(null);
    setShowModal(false);
    setCapturedImage(null);
    setShowCapturedImage(false);
    setIsProcessingImage(false);
    analyzeScan.reset();
    saveScan.reset();

    // Navigate back to the previous screen or home
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/explore');
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Camera or captured image */}
      {showCapturedImage && capturedImage ? (
        <Image source={{ uri: capturedImage.uri }} className="flex-1" resizeMode="cover" />
      ) : (
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} enableTorch={torch} />
      )}

      {/* Crop overlay - always visible to show crop area */}
      <CropOverlay
        cropArea={cropArea}
        onCropAreaChange={setCropArea}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />

      {/* Camera controls */}
      <CameraControls
        torch={torch}
        showCapturedImage={showCapturedImage}
        onToggleTorch={toggleTorch}
        onToggleFacing={toggleCameraFacing}
        onPickImage={pickImage}
        onTakePicture={takePicture}
        onRetakePhoto={retakePhoto}
        onCropAndAnalyze={cropAndAnalyze}
        onClose={closeScan}
      />

      {/* Processing overlay */}
      <ProcessingOverlay visible={isProcessingImage} />

      {/* Analysis overlay */}
      {analyzeScan.isPending && !isProcessingImage && (
        <View className="absolute inset-0 bg-black/80 items-center justify-center z-50">
          <View className="bg-white/95 rounded-2xl p-8 items-center max-w-[80%]">
            <View className="bg-pink-500 rounded-full p-4 mb-5">
              <Text className="text-2xl">🔬</Text>
            </View>
            <Text className="text-xl font-bold text-black text-center mb-2">
              Analyzing Your Product
            </Text>
            <Text className="text-gray-600 text-center text-sm mb-4">
              Our AI is examining the ingredients and safety profile...
            </Text>
            <Text className="text-gray-500 text-center text-xs">
              This usually takes 10-15 seconds
            </Text>
          </View>
        </View>
      )}

      {/* Product detail modal */}
      {showModal && scannedProduct && (
        <ProductDetailModal
          product={scannedProduct}
          visible={showModal}
          onClose={closeModal}
          onSaveScan={handleSaveScan}
          isSavingScan={saveScan.isPending}
        />
      )}
    </View>
  );
}
