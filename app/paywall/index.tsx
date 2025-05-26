import { View, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import { Check, ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';

const FEATURES = [
  {
    title: 'Get your personal hair plan',
    description: 'Built from your answers, backed by real science.',
  },
  {
    title: 'Decode your products',
    description: "Scan any label — we'll flag what's good or harmful.",
  },
  {
    title: 'Learn what your hair actually needs',
    description: 'From porosity to moisture — we break it down simply.',
  },
];

const PRICES = {
  monthly: 5.99,
  yearly: 34.99, // 40% off
};

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleStartJourney = () => {
    // TODO: Implement subscription logic
    router.push('/auth');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-5 pt-4 pb-6 justify-between">
          <View className="flex-row justify-between items-center mb-4">
            <ChevronLeft size={24} onPress={() => router.back()} />
            <Text className="text-base text-gray-800">Restore</Text>
          </View>

          <View className="flex-1 flex-col justify-between">
            <View>
              <Text className="text-[24px] font-bold text-center mb-6 leading-snug">
                Simply choose your plan
              </Text>

              <View className="rounded-2xl px-4 py-5 flex-col gap-5">
                {FEATURES.map((feature, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <View key={index} className="flex-row items-start bg-gray-50 rounded-xl p-4">
                    <View>
                      <Text className="text-lg font-semibold">{feature.title}</Text>
                      <Text className="text-base text-gray-500">{feature.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View>
              <View className="gap-3 mb-6">
                <Pressable
                  className={`p-4 border rounded-xl ${
                    selectedPlan === 'monthly' ? 'border-black bg-black/5' : 'border-gray-200'
                  }`}
                  onPress={() => setSelectedPlan('monthly')}
                >
                  <Text className="text-base font-semibold mb-1">Monthly</Text>
                  <Text className="text-base">5,99 € / mo</Text>
                </Pressable>

                <Pressable
                  className={`p-4 border rounded-xl ${
                    selectedPlan === 'yearly' ? 'border-black bg-black/5' : 'border-gray-200'
                  }`}
                  onPress={() => setSelectedPlan('yearly')}
                >
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-base font-semibold">Yearly</Text>
                    <View className="bg-black rounded-full px-2 py-1">
                      <Text className="text-white text-xs font-medium">Save 40%</Text>
                    </View>
                  </View>
                  <Text className="text-base">{(PRICES[selectedPlan] / 12).toFixed(2)} € / mo</Text>
                  <Text className="text-xs text-gray-500">
                    Billed {PRICES[selectedPlan]} € yearly
                  </Text>
                </Pressable>
              </View>

              <View className="flex-row items-center justify-center mb-6">
                <Check size={18} className="text-black mr-2" />
                <Text className="text-sm text-gray-700">No commitment — cancel anytime</Text>
              </View>

              <Button
                className="w-full py-4 bg-black rounded-xl"
                onPress={handleStartJourney}
                label="Start My Journey"
              />

              <Text className="text-center text-gray-400 text-xs mt-3">
                {selectedPlan === 'monthly'
                  ? `Just ${PRICES.monthly} € per month`
                  : `Just ${PRICES.yearly} € per year (${(PRICES.yearly / 12).toFixed(2)} €/mo)`}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
