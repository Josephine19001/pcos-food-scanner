import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export const askForCameraPermission = async () => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === 'granted';
};

export const askForGalleryPermissions = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};
