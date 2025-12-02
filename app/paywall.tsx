import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Scan, Sparkles, Heart, ShieldCheck, Check } from 'lucide-react-native';
import { useRevenueCat } from '@/context/revenuecat-provider';
import { APP_URLS } from '@/lib/config/urls';

// Fallback prices if RevenueCat fails to load
const FALLBACK_MONTHLY_PRICE = 3.99;
const FALLBACK_YEARLY_PRICE = 29.99;
const TRIAL_DAYS = 7;

type PlanType = 'monthly' | 'yearly';

const features = [
  {
    icon: Scan,
    title: 'Unlimited Food Scans',
    description: 'Scan any food item to check PCOS compatibility',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Analysis',
    description: 'Get detailed ingredient breakdowns and health insights',
  },
  {
    icon: Heart,
    title: 'Personalized Recommendations',
    description: 'Food suggestions tailored to your PCOS needs',
  },
  {
    icon: ShieldCheck,
    title: 'Science-Backed Results',
    description: 'Analysis based on latest PCOS research',
  },
];

export default function PaywallScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const { offerings, purchasePackage, restorePurchases } = useRevenueCat();

  // Get packages from RevenueCat offerings
  const monthlyPackage = offerings?.current?.monthly;
  const yearlyPackage = offerings?.current?.annual;

  // Use RevenueCat formatted price strings (includes currency symbol)
  const monthlyPriceString = monthlyPackage?.product.priceString ?? `$${FALLBACK_MONTHLY_PRICE}`;
  const yearlyPriceString = yearlyPackage?.product.priceString ?? `$${FALLBACK_YEARLY_PRICE}`;
  const yearlyPerMonthString =
    yearlyPackage?.product.pricePerMonthString ?? `$${(FALLBACK_YEARLY_PRICE / 12).toFixed(2)}`;

  // Numeric prices for calculations
  const monthlyPrice = monthlyPackage?.product.price ?? FALLBACK_MONTHLY_PRICE;
  const yearlyPrice = yearlyPackage?.product.price ?? FALLBACK_YEARLY_PRICE;

  const currentPriceString = selectedPlan === 'yearly' ? yearlyPriceString : monthlyPriceString;
  const savingsPercent = Math.round((1 - yearlyPrice / 12 / monthlyPrice) * 100);

  const handleSubscribe = async () => {
    const packageToPurchase = selectedPlan === 'yearly' ? yearlyPackage : monthlyPackage;

    if (!packageToPurchase) {
      return;
    }

    setIsLoading(true);
    const result = await purchasePackage(packageToPurchase);
    setIsLoading(false);

    if (result.success) {
      router.replace('/(tabs)/home');
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const customerInfo = await restorePurchases();
      // Check if user has active entitlements after restore
      const hasActiveSubscription = Object.keys(customerInfo.entitlements.active).length > 0;
      if (hasActiveSubscription) {
        router.replace('/(tabs)/home');
      }
    } catch {
      // Error is handled by the provider
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-6">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-3xl bg-primary-100 items-center justify-center mb-4">
                <Scan size={40} color="#0D9488" />
              </View>
              <Text className="text-gray-900 text-2xl font-bold text-center mb-2">
                Unlock Full Access
              </Text>
              <Text className="text-gray-500 text-center px-4">
                Get unlimited scans and personalized PCOS dietary guidance
              </Text>
            </View>

            {/* Features */}
            <View className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
              {features.map((feature, index) => (
                <View
                  key={feature.title}
                  className={`flex-row items-center ${
                    index < features.length - 1 ? 'pb-4 mb-4 border-b border-gray-200' : ''
                  }`}
                >
                  <View className="w-12 h-12 rounded-xl bg-primary-100 items-center justify-center mr-4">
                    <feature.icon size={24} color="#0D9488" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-base">{feature.title}</Text>
                    <Text className="text-gray-500 text-sm">{feature.description}</Text>
                  </View>
                  <Check size={20} color="#0D9488" />
                </View>
              ))}
            </View>

            {/* Plan Selection */}
            <View className="flex-row mb-6">
              {/* Yearly Plan */}
              <Pressable onPress={() => setSelectedPlan('yearly')} className="flex-1 mr-2">
                <View
                  className={`rounded-2xl p-4 items-center border-2 ${
                    selectedPlan === 'yearly'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Save Badge */}
                  {savingsPercent > 0 && (
                    <View className="absolute -top-2 right-2 bg-primary-500 px-2 py-0.5 rounded-full">
                      <Text className="text-white text-xs font-bold">SAVE {savingsPercent}%</Text>
                    </View>
                  )}
                  <View
                    className={`w-5 h-5 rounded-full border-2 mb-3 items-center justify-center ${
                      selectedPlan === 'yearly'
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedPlan === 'yearly' && <Check size={12} color="#fff" />}
                  </View>
                  <Text className="text-gray-900 font-bold text-lg mb-1">Yearly</Text>
                  <Text className="text-gray-900 font-bold text-2xl">{yearlyPriceString}</Text>
                  <Text className="text-gray-500 text-sm">{yearlyPerMonthString}/mo</Text>
                </View>
              </Pressable>

              {/* Monthly Plan */}
              <Pressable onPress={() => setSelectedPlan('monthly')} className="flex-1 ml-2">
                <View
                  className={`rounded-2xl p-4 items-center border-2 ${
                    selectedPlan === 'monthly'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 mb-3 items-center justify-center ${
                      selectedPlan === 'monthly'
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedPlan === 'monthly' && <Check size={12} color="#fff" />}
                  </View>
                  <Text className="text-gray-900 font-bold text-lg mb-1">Monthly</Text>
                  <Text className="text-gray-900 font-bold text-2xl">{monthlyPriceString}</Text>
                  <Text className="text-gray-500 text-sm">/month</Text>
                </View>
              </Pressable>
            </View>

            {/* Trial Info - Only for Yearly */}
            {selectedPlan === 'yearly' && (
              <View className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-lg bg-amber-100 items-center justify-center mr-3">
                    <Text className="text-amber-600 font-bold text-lg">{TRIAL_DAYS}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-amber-800 font-semibold">{TRIAL_DAYS}-Day Free Trial</Text>
                    <Text className="text-amber-600 text-sm">Try free, cancel anytime</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fixed Bottom Section */}
        <View className="px-6 pb-4 bg-white border-t border-gray-100 pt-4">
          {/* CTA Button */}
          <Pressable
            onPress={handleSubscribe}
            disabled={isLoading || isRestoring}
            className={`rounded-2xl overflow-hidden mb-4 ${isLoading ? 'opacity-70' : ''}`}
          >
            <LinearGradient
              colors={['#0D9488', '#0F766E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View className="py-4 px-6 items-center">
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-white font-bold text-lg">
                    {selectedPlan === 'yearly' ? 'Start Free Trial' : 'Subscribe Now'}
                  </Text>
                  {selectedPlan === 'yearly' ? (
                    <Text className="text-primary-200 text-sm mt-1">
                      Then {currentPriceString}/year after trial
                    </Text>
                  ) : (
                    <Text className="text-primary-200 text-sm mt-1">{currentPriceString}/month</Text>
                  )}
                </>
              )}
            </View>
          </Pressable>

          {/* Restore Purchases */}
          <Pressable
            onPress={handleRestore}
            disabled={isLoading || isRestoring}
            className="mb-4"
          >
            {isRestoring ? (
              <ActivityIndicator color="#6B7280" />
            ) : (
              <Text className="text-gray-500 text-center text-base font-medium">
                Restore Purchases
              </Text>
            )}
          </Pressable>

          {/* Legal Links */}
          <View className="items-center">
            <View className="flex-row items-center">
              <Pressable onPress={() => Linking.openURL(APP_URLS.terms)}>
                <Text className="text-gray-400 text-xs underline">Terms of Service</Text>
              </Pressable>
              <Text className="text-gray-300 mx-3">•</Text>
              <Pressable onPress={() => Linking.openURL(APP_URLS.privacy)}>
                <Text className="text-gray-400 text-xs underline">Privacy Policy</Text>
              </Pressable>
            </View>
            <Text className="text-gray-400 text-xs text-center mt-2 px-4">
              Subscription automatically renews unless canceled at least 24 hours before the end of the current period.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
