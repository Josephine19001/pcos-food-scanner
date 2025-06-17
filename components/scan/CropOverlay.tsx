import { View, PanResponder } from 'react-native';
import { Move, Crop } from 'lucide-react-native';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropOverlayProps {
  cropArea: CropArea;
  onCropAreaChange: (newCropArea: CropArea) => void;
  screenWidth: number;
  screenHeight: number;
}

export function CropOverlay({
  cropArea,
  onCropAreaChange,
  screenWidth,
  screenHeight,
}: CropOverlayProps) {
  // Pan responder for moving the crop area
  const movePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const { dx, dy } = gestureState;

      onCropAreaChange({
        ...cropArea,
        x: Math.max(20, Math.min(screenWidth - cropArea.width - 20, cropArea.x + dx)),
        y: Math.max(120, Math.min(screenHeight - cropArea.height - 200, cropArea.y + dy)),
      });
    },
  });

  // Pan responder for resizing the crop area
  const resizePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const { dx, dy } = gestureState;

      const minSize = 120;
      const maxWidth = screenWidth - cropArea.x - 20;
      const maxHeight = screenHeight - cropArea.y - 200;

      const newWidth = Math.max(minSize, Math.min(maxWidth, cropArea.width + dx));
      const newHeight = Math.max(minSize, Math.min(maxHeight, cropArea.height + dy));

      onCropAreaChange({
        ...cropArea,
        width: newWidth,
        height: newHeight,
      });
    },
  });

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Dark overlay with hole for crop area */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Top overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: cropArea.y,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        />
        {/* Bottom overlay */}
        <View
          style={{
            position: 'absolute',
            top: cropArea.y + cropArea.height,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        />
        {/* Left overlay */}
        <View
          style={{
            position: 'absolute',
            top: cropArea.y,
            left: 0,
            width: cropArea.x,
            height: cropArea.height,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        />
        {/* Right overlay */}
        <View
          style={{
            position: 'absolute',
            top: cropArea.y,
            left: cropArea.x + cropArea.width,
            right: 0,
            height: cropArea.height,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        />
      </View>

      {/* Crop frame border - Yellow with rounded edges */}
      <View
        style={{
          position: 'absolute',
          left: cropArea.x - 3,
          top: cropArea.y - 3,
          width: cropArea.width + 6,
          height: cropArea.height + 6,
          borderWidth: 2,
          borderColor: '#FFD700',
          borderRadius: 20,
        }}
      />

      {/* Draggable crop area */}
      <View
        {...movePanResponder.panHandlers}
        style={{
          position: 'absolute',
          left: cropArea.x,
          top: cropArea.y,
          width: cropArea.width,
          height: cropArea.height,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: 'rgba(255,215,0,0.4)',
          borderStyle: 'dashed',
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Move handle in center */}
        <View
          style={{
            backgroundColor: 'rgba(255,215,0,0.9)',
            borderRadius: 25,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: '#FFD700',
          }}
        >
          <Move size={20} color="#000" />
        </View>
      </View>

      {/* Corner indicators */}
      {[
        { top: cropArea.y - 15, left: cropArea.x - 15 },
        { top: cropArea.y - 15, left: cropArea.x + cropArea.width - 15 },
        { top: cropArea.y + cropArea.height - 15, left: cropArea.x - 15 },
        { top: cropArea.y + cropArea.height - 15, left: cropArea.x + cropArea.width - 15 },
      ].map((corner, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            top: corner.top,
            left: corner.left,
            width: 30,
            height: 30,
            backgroundColor: '#FFD700',
            borderRadius: 15,
            borderWidth: 3,
            borderColor: '#000000',
          }}
        />
      ))}

      {/* Resize handle */}
      <View
        {...resizePanResponder.panHandlers}
        style={{
          position: 'absolute',
          top: cropArea.y + cropArea.height - 25,
          left: cropArea.x + cropArea.width - 25,
          width: 50,
          height: 50,
          backgroundColor: '#FFD700',
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: '#000000',
        }}
      >
        <Crop size={24} color="#000" />
      </View>
    </View>
  );
}
