import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Gauge, Flame, HeartPulse, Candy, Activity, Check, ScanLine } from 'lucide-react-native';
import { useRevenueCat } from '@/context/revenuecat-provider';
import { APP_URLS } from '@/lib/config/urls';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import { useResponsive } from '@/lib/utils/responsive';

// Fallback prices if RevenueCat fails to load
const FALLBACK_MONTHLY_PRICE = 3.99;
const FALLBACK_YEARLY_PRICE = 29.99;
const TRIAL_DAYS = 3;

type PlanType = 'monthly' | 'yearly';

export default function PaywallScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const { offerings, purchasePackage, restorePurchases } = useRevenueCat();
  const { isTablet, contentMaxWidth } = useResponsive();

  const features = [
    {
      icon: ScanLine,
      title: t('paywall.features.unlimitedScans.title'),
      description: t('paywall.features.unlimitedScans.description'),
    },
    {
      icon: Gauge,
      title: t('paywall.features.bloodSugar.title'),
      description: t('paywall.features.bloodSugar.description'),
    },
    {
      icon: Flame,
      title: t('paywall.features.inflammation.title'),
      description: t('paywall.features.inflammation.description'),
    },
    {
      icon: HeartPulse,
      title: t('paywall.features.hormones.title'),
      description: t('paywall.features.hormones.description'),
    },
    {
      icon: Candy,
      title: t('paywall.features.hiddenSugars.title'),
      description: t('paywall.features.hiddenSugars.description'),
    },
    {
      icon: Activity,
      title: t('paywall.features.personalizedTips.title'),
      description: t('paywall.features.personalizedTips.description'),
    },
  ];

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
      router.replace('/(tabs)/home');
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
    setIsLoading(true);
    try {
      const customerInfo = await restorePurchases();
      const hasActiveSubscription = Object.keys(customerInfo.entitlements.active).length > 0;
      if (hasActiveSubscription) {
        toast.success(t('paywall.restoreSuccess'));
        router.replace('/(tabs)/home');
      } else {
        toast.info(t('paywall.restoreNone'));
      }
    } catch {
      toast.error(t('paywall.restoreError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic styles for responsive layout
  const dynamicStyles = {
    contentWrapper: {
      maxWidth: isTablet ? contentMaxWidth : undefined,
      alignSelf: isTablet ? ('center' as const) : undefined,
      width: '100%' as const,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background gradient */}
      <LinearGradient
        colors={['#F0FDFA', '#CCFBF1', '#99F6E4', '#F0FDFA']}
        locations={[0, 0.3, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating orbs for liquid glass effect */}
      <Animated.View entering={FadeIn.delay(100).duration(1000)} style={styles.orb1} />
      <Animated.View entering={FadeIn.delay(200).duration(1000)} style={styles.orb2} />
      <Animated.View entering={FadeIn.delay(300).duration(1000)} style={styles.orb3} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, dynamicStyles.contentWrapper]}>
            {/* Header */}
            <View style={styles.headerSection}>
              {/* <View style={styles.iconContainer}>
                <ScanLine size={40} color="#14B8A6" />
              </View> */}
              <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
                {t('paywall.title')}
              </Text>
              {/* <Text style={[styles.headerSubtitle, isTablet && styles.headerSubtitleTablet]}>
                {t('paywall.subtitle')}
              </Text> */}
            </View>

            {/* Features Card */}
            <View style={styles.featuresCard}>
              {features.map((feature, index) => (
                <View
                  key={index}
                  style={[
                    styles.featureItem,
                    index < features.length - 1 && styles.featureItemBorder,
                  ]}
                >
                  <View style={styles.featureIconContainer}>
                    <feature.icon size={20} color="#14B8A6" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle} numberOfLines={1}>
                      {feature.title}
                    </Text>
                    <Text style={styles.featureDescription} numberOfLines={2}>
                      {feature.description}
                    </Text>
                  </View>
                  <Check size={18} color="#14B8A6" />
                </View>
              ))}
            </View>

            {/* Plan Selection - Row Layout */}
            <View style={[styles.plansContainer, isTablet && styles.plansContainerTablet]}>
              {/* Yearly Plan */}
              <Pressable onPress={() => setSelectedPlan('yearly')} style={styles.planWrapper}>
                <View
                  style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
                >
                  {/* Save Badge */}
                  {savingsPercent > 0 && (
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveBadgeText} numberOfLines={1}>
                        {t('paywall.plans.save', { percent: savingsPercent })}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.radioButton,
                      selectedPlan === 'yearly' && styles.radioButtonSelected,
                    ]}
                  >
                    {selectedPlan === 'yearly' && <Check size={10} color="#fff" />}
                  </View>
                  <Text style={styles.planName} numberOfLines={1}>
                    {t('paywall.plans.yearly')}
                  </Text>
                  <Text style={styles.planPriceTotal} numberOfLines={1} adjustsFontSizeToFit>
                    {yearlyPriceString}
                  </Text>
                  <Text style={styles.planPeriod} numberOfLines={1}>
                    {yearlyPerMonthString}
                    {t('paywall.plans.perMonth')}
                  </Text>
                </View>
              </Pressable>

              {/* Monthly Plan */}
              <Pressable onPress={() => setSelectedPlan('monthly')} style={styles.planWrapper}>
                <View
                  style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
                >
                  <View
                    style={[
                      styles.radioButton,
                      selectedPlan === 'monthly' && styles.radioButtonSelected,
                    ]}
                  >
                    {selectedPlan === 'monthly' && <Check size={10} color="#fff" />}
                  </View>
                  <Text style={styles.planName} numberOfLines={1}>
                    {t('paywall.plans.monthly')}
                  </Text>
                  <Text style={styles.planPriceTotal} numberOfLines={1} adjustsFontSizeToFit>
                    {monthlyPriceString}
                  </Text>
                  <Text style={styles.planPeriod} numberOfLines={1}>
                    {t('paywall.plans.perMonthFull')}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, dynamicStyles.contentWrapper]}>
          {/* CTA Button */}
          <Pressable
            onPress={handleSubscribe}
            disabled={isLoading}
            style={[styles.ctaButton, isLoading && styles.buttonDisabled]}
          >
            <LinearGradient
              colors={['#14B8A6', '#0D9488', '#0F766E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.ctaContent}>
                <Text style={styles.ctaButtonText}>
                  {selectedPlan === 'yearly'
                    ? t('paywall.cta.startTrial', { days: TRIAL_DAYS })
                    : t('paywall.cta.subscribeNow')}
                </Text>
                <Text style={styles.ctaSubtext}>
                  {selectedPlan === 'yearly'
                    ? t('paywall.cta.thenPrice', { price: currentPriceString })
                    : t('paywall.cta.perMonth', { price: currentPriceString })}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Continue for Free */}
          <Pressable onPress={() => router.replace('/(tabs)/home')} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>{t('paywall.continueForFree')}</Text>
          </Pressable>

          {/* Legal Links */}
          <View style={styles.legalContainer}>
            <View style={styles.legalLinks}>
              <Pressable onPress={() => Linking.openURL(APP_URLS.terms)}>
                <Text style={styles.legalLink}>{t('paywall.legal.terms')}</Text>
              </Pressable>
              <Text style={styles.legalDot}>|</Text>
              <Pressable onPress={() => Linking.openURL(APP_URLS.privacy)}>
                <Text style={styles.legalLink}>{t('paywall.legal.privacy')}</Text>
              </Pressable>
              <Text style={styles.legalDot}>|</Text>
              <Pressable onPress={handleRestore} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#9CA3AF" />
                ) : (
                  <Text style={styles.legalLink}>{t('paywall.restore')}</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerTitleTablet: {
    fontSize: 28,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  headerSubtitleTablet: {
    fontSize: 17,
    lineHeight: 24,
  },
  featuresCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  plansContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  plansContainerTablet: {
    gap: 16,
  },
  planWrapper: {
    flex: 1,
  },
  planCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 14,
    alignItems: 'center',
  },
  planCardSelected: {
    borderColor: '#14B8A6',
    backgroundColor: 'rgba(240, 253, 250, 0.7)',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#14B8A6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 14,
  },
  saveBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  radioButtonSelected: {
    borderColor: '#14B8A6',
    backgroundColor: '#14B8A6',
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  planPriceTotal: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  planPeriod: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  ctaButton: {
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  ctaSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  continueButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  legalContainer: {
    alignItems: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalLink: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  orb1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    top: -60,
    right: -60,
  },
  orb2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    bottom: 180,
    left: -50,
  },
  orb3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(94, 234, 212, 0.08)',
    top: '35%',
    right: -25,
  },
});
