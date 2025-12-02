import { View, Text, Pressable, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';

export function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/onboarding');
  };

  const handleSignIn = () => {
    router.push('/auth?mode=signin');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6">
          {/* Top Section with Logo/Brand */}
          <View className="flex-1 justify-center items-center">
            {/* App Icon */}
            <Animated.View entering={FadeIn.delay(200).duration(600)} className="mb-6">
              <Image
                source={require('@/assets/images/logo.png')}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
            </Animated.View>

            {/* App Name */}
            <Animated.Text
              entering={FadeInUp.delay(400).duration(600)}
              className="text-gray-900 text-3xl font-bold text-center mb-3"
            >
              PCOS Food Scanner
            </Animated.Text>

            {/* Tagline */}
            <Animated.Text
              entering={FadeInUp.delay(500).duration(600)}
              className="text-gray-500 text-lg text-center px-4"
            >
              Scan any food to check if it's PCOS-friendly
            </Animated.Text>
          </View>

          {/* Bottom Section with Actions */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} className="pb-8">
            {/* Get Started Button */}
            <Pressable
              onPress={handleGetStarted}
              className="rounded-2xl overflow-hidden mb-4 bg-teal-600"
            >
              <View className="py-4 px-6 flex-row items-center justify-center">
                <Text className="text-white font-bold text-lg mr-2">Get Started</Text>
                <ChevronRight size={20} color="#ffffff" />
              </View>
            </Pressable>

            {/* Sign In Link */}
            <Pressable onPress={handleSignIn} className="py-3">
              <Text className="text-gray-500 text-center">
                Already have an account?{' '}
                <Text className="text-teal-600 font-semibold">Sign In</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}
