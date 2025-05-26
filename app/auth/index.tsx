import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
export default function AuthScreen() {
  const router = useRouter();
  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign in
    router.push('/(tabs)/routines');
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple sign in
    router.push('/(tabs)/routines');
  };

  return (
    <View className="flex-1 bg-white px-4">
      <View className="flex-1 justify-center items-center">
        <Text className="text-4xl font-bold mb-20">Create or sign in</Text>

        {/* Apple Sign In Button */}
        <Pressable
          onPress={handleAppleSignIn}
          className="w-full flex-row items-center justify-center space-x-2 bg-black rounded-full py-4 mb-4"
        >
          <Image source={require('@/assets/images/apple-logo.png')} className="w-6 h-6 mr-2 " />
          <Text className="text-white text-lg font-medium">Sign in with Apple</Text>
        </Pressable>

        <Pressable
          onPress={handleGoogleSignIn}
          className="w-full flex-row items-center justify-center space-x-2 bg-white border border-gray-200 rounded-full py-4"
        >
          <Image source={require('@/assets/images/google-logo.png')} className="w-6 h-6 mr-2" />
          <Text className="text-black text-lg font-medium">Sign in with Google</Text>
        </Pressable>
      </View>
    </View>
  );
}
