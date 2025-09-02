import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';

export const AnimatedWavyCard = ({ children }: { children: React.ReactNode }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#F9A8D4', '#F472B6', '#F9A8D4'], // light pink -> medium pink -> light pink
  });

  const transform = [
    {
      scaleY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.02],
      }),
    },
  ];

  return (
    <View className="rounded-2xl mx-4 mb-4 shadow-lg overflow-hidden">
      <Animated.View
        style={{
          backgroundColor,
          transform,
          padding: 24,
          paddingHorizontal: 32,
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
};
