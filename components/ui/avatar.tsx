import { TouchableOpacity, Image, View } from 'react-native';
import { useAvatar } from '@/lib/hooks/use-avatar';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';

interface AvatarProps {
  size?: number;
  onPress?: () => void;
  navigateToSettings?: boolean;
}

export function Avatar({ size = 48, onPress, navigateToSettings = false }: AvatarProps) {
  const { data: avatarUrl } = useAvatar();
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigateToSettings) {
      router.push('/settings');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      activeOpacity={0.7}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <User size={size * 0.5} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
}