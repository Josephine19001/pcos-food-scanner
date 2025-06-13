import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSubscription } from '../context/subscription-provider';
import { toast } from 'sonner-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

export default function PaywallScreen() {
  const {
    products,
    loading: subscriptionLoading,
    purchaseSubscription,
    restorePurchases,
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<string>('weekly');
  const [loading, setLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleRestore = async () => {
    try {
      setRestoreLoading(true);
      await restorePurchases();
    } catch (error) {
      console.error('Restore error:', error);
    } finally {
      setRestoreLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem('selected_subscription_plan', selectedPlan);
      router.replace('/auth?mode=signup');
    } catch {
      toast.error('Failed to continue.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueFree = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem('selected_subscription_plan', 'free');
      router.replace('/auth?mode=signup');
    } catch {
      toast.error('Failed to continue.');
    } finally {
      setLoading(false);
    }
  };

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else toast.error('Unable to open link');
    } catch {
      toast.error('Unable to open link');
    }
  };

  const weeklyProduct = products.find((p) => p.productId.includes('week'));
  const yearlyProduct = products.find((p) => p.productId.includes('year'));

  return (
    <View className="flex-1 bg-black">
      <Video
        source={require('@/assets/onboarding/example.mp4')}
        style={{ ...StyleSheet.absoluteFillObject }}
        isLooping
        shouldPlay
        isMuted
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.8)']}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1 justify-end">
        <View className="px-6">
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-white text-center mb-2">
              Scan. Analyze. Own It.
            </Text>
            <View className="w-full mb-4">
              {/* Features */}
              {[
                { icon: 'camera', label: 'Unlimited Scans' },
                { icon: 'analytics', label: 'AI Analysis' },
                { icon: 'heart', label: 'Favourites' },
                { icon: 'time', label: 'History' },
              ].map((f, i) => (
                <View key={i} className="flex-row items-center py-2">
                  <View className="bg-white rounded-lg p-2 mr-3">
                    <Ionicons name={f.icon} size={18} color="#000" />
                  </View>
                  <Text className="text-white text-base font-semibold">{f.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Pricing */}
          <View className="bg-white bg-opacity-10 rounded-xl p-4 mb-6">
            {[
              {
                key: 'yearly',
                title: 'YEARLY ACCESS',
                subtitle: '$49.99 / year',
                badge: 'BEST VALUE',
              },
              {
                key: 'weekly',
                title: '3-DAY FREE TRIAL',
                subtitle: 'then $7.99 / week',
              },
            ].map((plan) => {
              const selected = selectedPlan === plan.key;
              return (
                <TouchableOpacity
                  key={plan.key}
                  onPress={() => setSelectedPlan(plan.key)}
                  className={`flex-row items-center rounded-lg p-3 mb-3 ${
                    selected ? 'bg-white bg-opacity-20' : ''
                  }`}
                >
                  <View className="mr-3">
                    <View
                      className={`w-5 h-5 rounded-full border-2 ${
                        selected ? 'border-white bg-white' : 'border-gray-400'
                      }`}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      {plan.title}{' '}
                      {plan.badge && <Text className="text-white opacity-80">{plan.badge}</Text>}
                    </Text>
                    <Text className="text-white text-sm">{plan.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={handlePurchase}
            disabled={loading}
            className="mb-4 rounded-full overflow-hidden shadow-lg"
          >
            <LinearGradient
              colors={['#000', '#fff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center"
            >
              <Text className="text-lg font-bold">{loading ? 'Loading...' : 'Try for Free'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mb-4">
            <Ionicons name="shield-checkmark" size={18} color="#fff" className="mr-2" />
            <Text className="text-white font-medium">No payment now</Text>
          </View>

          {/* Links */}
          <View className="flex-row justify-center mb-6">
            {[
              { label: 'Restore', url: 'https://yourapp.com/restore' },
              { label: 'Terms', url: 'https://yourapp.com/terms' },
              { label: 'Privacy', url: 'https://yourapp.com/privacy' },
            ].map((link) => (
              <TouchableOpacity
                key={link.label}
                onPress={() => openLink(link.url)}
                className="mx-4"
              >
                <Text className="text-gray-400 text-sm">{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
