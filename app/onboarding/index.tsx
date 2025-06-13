import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const steps = ['Welcome', 'WhatYouCanScan', 'HowItWorks', 'Personalize', 'GetStarted'];

function StepIndicator({ step }: { step: number }) {
  return (
    <View
      style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 16 }}
    >
      {steps.map((_, i) => (
        <View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 5,
            backgroundColor: i === step ? '#111' : '#E5E7EB',
            opacity: i === step ? 1 : 0.5,
          }}
        />
      ))}
    </View>
  );
}

function BlackButton({
  onPress,
  children,
  disabled,
}: {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: '100%',
        borderRadius: 999,
        backgroundColor: '#111',
        alignItems: 'center',
        paddingVertical: 18,
        marginTop: 24,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{children}</Text>
    </TouchableOpacity>
  );
}

function OnboardingBg({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'flex-end', alignItems: 'center' }}
    >
      {children}
    </View>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <OnboardingBg>
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 2,
              padding: 32,
              marginTop: 48,
              marginBottom: 16,
            }}
          >
            <Image
              source={require('@/assets/onboarding/example-icon.png')}
              style={{ width: 80, height: 80 }}
            />
          </View>
        </View>
        <View style={{ width: '90%', alignItems: 'center', marginBottom: 48 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#111',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Scan. Discover. Decide.
          </Text>
          <Text style={{ fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 8 }}>
            Instantly scan hair and skincare products. Get ingredient insights, safety info, and
            more.
          </Text>
          <BlackButton onPress={onNext}>Next</BlackButton>
        </View>
      </View>
    </OnboardingBg>
  );
}

function WhatYouCanScan({ onNext }: { onNext: () => void }) {
  return (
    <OnboardingBg>
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 2,
              padding: 32,
              marginTop: 48,
              marginBottom: 16,
            }}
          >
            <Image
              source={require('@/assets/onboarding/example-icon.png')}
              style={{ width: 80, height: 80 }}
            />
          </View>
        </View>
        <View style={{ width: '90%', alignItems: 'center', marginBottom: 48 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#111',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            What You Can Scan
          </Text>
          <Text style={{ fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 8 }}>
            Scan product labels, ingredients, and packaging to get instant details and AI-powered
            analysis.
          </Text>
          <BlackButton onPress={onNext}>Next</BlackButton>
        </View>
      </View>
    </OnboardingBg>
  );
}

function HowItWorks({ onNext }: { onNext: () => void }) {
  return (
    <OnboardingBg>
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 2,
              padding: 32,
              marginTop: 48,
              marginBottom: 16,
            }}
          >
            <Image
              source={require('@/assets/onboarding/example-icon.png')}
              style={{ width: 80, height: 80 }}
            />
          </View>
        </View>
        <View style={{ width: '90%', alignItems: 'center', marginBottom: 48 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#111',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            How It Works
          </Text>
          <Text style={{ fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 8 }}>
            Take a photo, get instant product details and ingredient analysis, and save your
            favourites.
          </Text>
          <BlackButton onPress={onNext}>Next</BlackButton>
        </View>
      </View>
    </OnboardingBg>
  );
}

function Personalize({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (type: string) => {
    setSelected((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };
  return (
    <OnboardingBg>
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 2,
              padding: 32,
              marginTop: 48,
              marginBottom: 16,
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              onPress={() => toggle('hair')}
              style={{ marginHorizontal: 8, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: selected.includes('hair') ? '#111' : '#F3F4F6',
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <Text style={{ fontSize: 32, color: selected.includes('hair') ? '#fff' : '#111' }}>
                  🧴
                </Text>
              </View>
              <Text style={{ color: '#111', fontWeight: '600', marginTop: 8 }}>Hair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggle('skin')}
              style={{ marginHorizontal: 8, alignItems: 'center' }}
            >
              <View
                style={{
                  backgroundColor: selected.includes('skin') ? '#111' : '#F3F4F6',
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                <Text style={{ fontSize: 32, color: selected.includes('skin') ? '#fff' : '#111' }}>
                  🧼
                </Text>
              </View>
              <Text style={{ color: '#111', fontWeight: '600', marginTop: 8 }}>Skin</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: '90%', alignItems: 'center', marginBottom: 48 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#111',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Personalize
          </Text>
          <Text style={{ fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 8 }}>
            What are you interested in?
          </Text>
          <BlackButton onPress={onNext} disabled={selected.length === 0}>
            Next
          </BlackButton>
        </View>
      </View>
    </OnboardingBg>
  );
}

function GetStarted({ onNext }: { onNext: () => void }) {
  return (
    <OnboardingBg>
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              shadowColor: '#000',
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 2,
              padding: 32,
              marginTop: 48,
              marginBottom: 16,
            }}
          >
            <Image
              source={require('@/assets/onboarding/example-icon.png')}
              style={{ width: 80, height: 80 }}
            />
          </View>
        </View>
        <View style={{ width: '90%', alignItems: 'center', marginBottom: 48 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#111',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            You're all set!
          </Text>
          <Text style={{ fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 8 }}>
            Start scanning products and get instant insights.
          </Text>
          <BlackButton onPress={onNext}>Get Started</BlackButton>
        </View>
      </View>
    </OnboardingBg>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {step === 0 && <Welcome onNext={goNext} />}
      {step === 1 && <WhatYouCanScan onNext={goNext} />}
      {step === 2 && <HowItWorks onNext={goNext} />}
      {step === 3 && <Personalize onNext={goNext} />}
      {step === 4 && <GetStarted onNext={() => router.replace('/paywall')} />}
      <StepIndicator step={step} />
    </View>
  );
}
