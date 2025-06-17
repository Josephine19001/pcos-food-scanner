import { View, ActivityIndicator, Dimensions, Animated, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text } from '../ui/text';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';
import { ResizeMode, Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

function VideoBackground({
  videoSource,
  children,
}: {
  videoSource: any;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1">
      <Video
        source={videoSource}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width,
          height,
        }}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
      />
      <View className="flex-1 bg-black/40">{children}</View>
    </View>
  );
}

export function WelcomeScreen() {
  const { user, loading } = useAuth();
  const questionOpacity = useRef(new Animated.Value(0)).current;
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(false);

  const fullAnswerText = "We'll Tell You 😉";

  useEffect(() => {
    // Animate question first
    Animated.timing(questionOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Start typing effect after question is done
      setShowCursor(true);
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex <= fullAnswerText.length) {
          setTypedText(fullAnswerText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          // Stop cursor blinking after typing is done
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, 80); // 80ms per character for natural typing speed

      return () => clearInterval(typeInterval);
    });
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    if (!showCursor) return;

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/explore');
    }
  }, [user, loading]);

  const onGetStarted = useCallback(() => {
    router.replace('/onboarding');
  }, []);

  const onSignIn = useCallback(() => {
    router.push('/auth?mode=signin');
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="mt-4 text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (user) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="mt-4 text-white">Redirecting...</Text>
      </SafeAreaView>
    );
  }

  return (
    <VideoBackground videoSource={require('@/assets/onboarding/example.mp4')}>
      <SafeAreaView className="flex-1 justify-between">
        {/* Main headline positioned at left top */}
        <View className="px-8 pt-12 items-start">
          <Animated.Text
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'left',
              lineHeight: 64,
              opacity: questionOpacity,
            }}
          >
            What's In{'\n'}That Beauty Product?
          </Animated.Text>

          <View className="mt-5">
            <RNText className="text-3xl font-semibold text-white text-left leading-10">
              {typedText}
              {showCursor && <RNText className="text-white text-3xl">|</RNText>}
            </RNText>
          </View>
        </View>

        {/* Bottom section with buttons */}
        <View className="px-8 pb-12">
          <Button
            title="Get Started"
            onPress={onGetStarted}
            variant="primary"
            size="large"
            className="mb-4"
          />

          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-white/80 text-base">Already have an account? </Text>
            <Text onPress={onSignIn} className="text-pink-300 text-base font-bold underline">
              Sign In
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </VideoBackground>
  );
}
