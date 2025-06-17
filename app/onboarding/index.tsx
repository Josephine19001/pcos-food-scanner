import { useState } from 'react';
import { View, Text, Dimensions, Animated } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Button } from '@/components/ui/button';

const { width, height } = Dimensions.get('window');

const steps = ['Welcome', 'Discover', 'Analyze'];

function StepIndicator({ step }: { step: number }) {
  return (
    <View className="flex-row justify-center absolute top-16 left-0 right-0 z-10">
      {steps.map((_, i) => (
        <Animated.View
          key={i}
          className={`h-2 mx-1 rounded-full ${i === step ? 'w-6 bg-pink-500' : 'w-2 bg-white/40'}`}
        />
      ))}
    </View>
  );
}

function NavigationButtons({
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
  nextLabel = 'Next',
}: {
  onNext: () => void;
  onBack?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextLabel?: string;
}) {
  return (
    <View className="flex-row justify-between items-center px-8 py-6 pb-8">
      {!isFirstStep ? (
        <Button
          title="Back"
          onPress={onBack}
          variant="secondary"
          size="medium"
          className="flex-row items-center"
        />
      ) : (
        <View className="w-20" />
      )}

      <Button
        title={nextLabel}
        onPress={onNext}
        variant="primary"
        size="medium"
        className="flex-row items-center"
      />
    </View>
  );
}

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

function Welcome({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  return (
    <VideoBackground videoSource={require('@/assets/onboarding/example.mp4')}>
      <View className="flex-1 justify-end">
        {/* Content with rounded background from bottom */}
        <View className="bg-black/80 rounded-t-[32px] pt-8">
          <View className="px-8">
            <Text className="text-4xl font-bold text-white text-left mb-4 leading-tight">
              Choose Better
            </Text>
            <Text className="text-lg text-white/90 text-left mb-6 leading-relaxed">
              Know what's in your beauty products
            </Text>
          </View>

          <NavigationButtons
            onNext={onNext}
            onBack={onBack}
            isFirstStep={true}
            isLastStep={false}
            nextLabel="Get Started"
          />
        </View>
      </View>
    </VideoBackground>
  );
}

function Discover({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <VideoBackground videoSource={require('@/assets/onboarding/example.mp4')}>
      <View className="flex-1 justify-end">
        {/* Content with rounded background from bottom */}
        <View className="bg-black/80 rounded-t-[32px] pt-8">
          <View className="px-8">
            <Text className="text-3xl font-bold text-white text-left mb-4 leading-tight">
              Know Your Ingredients
            </Text>
            <Text className="text-lg text-white/90 text-left mb-6 leading-relaxed">
              Understand what each ingredient does to your skin
            </Text>
          </View>

          <NavigationButtons
            onNext={onNext}
            onBack={onBack}
            isFirstStep={false}
            isLastStep={false}
          />
        </View>
      </View>
    </VideoBackground>
  );
}

function Analyze({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <VideoBackground videoSource={require('@/assets/onboarding/example.mp4')}>
      <View className="flex-1 justify-end">
        {/* Content with rounded background from bottom */}
        <View className="bg-black/80 rounded-t-[32px] pt-8">
          <View className="px-8">
            <Text className="text-3xl font-bold text-white text-left mb-4 leading-tight">
              Save & Organize
            </Text>
            <Text className="text-lg text-white/90 text-left mb-6 leading-relaxed">
              Save your scanned products and build your beauty collection
            </Text>
          </View>

          <NavigationButtons
            onNext={onNext}
            onBack={onBack}
            isFirstStep={false}
            isLastStep={true}
            nextLabel="Start Scanning"
          />
        </View>
      </View>
    </VideoBackground>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const goNext = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Navigate to paywall after the last onboarding step
      router.replace('/paywall');
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StepIndicator step={step} />

      {step === 0 && <Welcome onNext={goNext} />}
      {step === 1 && <Discover onNext={goNext} onBack={goBack} />}
      {step === 2 && <Analyze onNext={goNext} onBack={goBack} />}
    </View>
  );
}
