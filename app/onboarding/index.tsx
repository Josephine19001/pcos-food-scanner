import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChatOnboarding } from '@/components/onboarding/chat-onboarding';
import { useThemedStyles } from '@/lib/utils/theme';

export default function OnboardingScreen() {
  const params = useLocalSearchParams();
  const selectedPlan = (params.plan as 'yearly' | 'monthly') || 'yearly';
  const [visible, setVisible] = useState(true); // Show immediately
  const themed = useThemedStyles();

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => router.back(), 300);
  };

  return (
    <View className={themed('flex-1 bg-white', 'flex-1 bg-gray-900')}>
      <ChatOnboarding 
        selectedPlan={selectedPlan}
        visible={visible}
        onClose={handleClose}
      />
    </View>
  );
}
