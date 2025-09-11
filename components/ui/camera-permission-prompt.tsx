import { View, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Text } from '@/components/ui/text';

interface CameraPermissionPromptProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onRequestPermission?: () => void;
  style?: 'dark' | 'light';
  redirectToSettings?: boolean;
}

export const CameraPermissionPrompt = ({
  title = 'Camera Access Needed',
  message = 'We need your permission to access the camera',
  buttonText = 'Continue',
  onRequestPermission,
  style = 'dark',
  redirectToSettings = false,
}: CameraPermissionPromptProps) => {
  const isDark = style === 'dark';
  
  const handlePress = async () => {
    if (redirectToSettings) {
      Alert.alert(
        'Open Settings',
        'To enable camera access, go to Settings > Privacy & Security > Camera and enable access for this app.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
    } else if (onRequestPermission) {
      onRequestPermission();
    }
  };
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#000000' : '#FFFFFF' }
    ]}>
      <View style={styles.permissionContainer}>
        {title && (
          <Text style={[
            styles.permissionTitle,
            { color: isDark ? '#FFFFFF' : '#000000' }
          ]}>
            {title}
          </Text>
        )}
        <Text style={[
          styles.permissionText,
          { color: isDark ? '#FFFFFF' : '#666666' }
        ]}>
          {message}
        </Text>
        <TouchableOpacity 
          onPress={handlePress} 
          style={[
            styles.permissionButton,
            { backgroundColor: isDark ? '#FFFFFF' : '#10B981' }
          ]}
        >
          <Text style={[
            styles.permissionButtonText,
            { color: isDark ? '#000000' : '#FFFFFF' }
          ]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});