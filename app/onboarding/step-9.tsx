import { View, Dimensions } from 'react-native';
import { OnboardingLayout } from '@/components/layouts';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from '@/components/ui/text';
import Carousel from 'react-native-reanimated-carousel';
import { Quote, Star } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import * as StoreReview from 'expo-store-review';

const REVIEWS = [
  {
    quote: 'I finally understood why my hair was breaking.',
    author: 'Adesua',
    age: 27,
  },
  {
    quote: 'No more guessing. I scan products, get answers, and move on.',
    author: 'Yvonne',
    age: 33,
  },
  {
    quote: "H'Deets is the stylist I never had.",
    author: 'Jordan',
    age: 24,
  },
];

export default function Step9Screen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get('window').width;

  const handleReviewNow = async () => {
    const isAvailable = await StoreReview.hasAction();
    if (isAvailable) {
      await StoreReview.requestReview();
    } else {
      // fallback: go to store
      router.push('/onboarding/step-10');
    }
  };

  const handleRemindLater = () => {
    router.push('/onboarding/step-10');
  };

  const renderReview = ({ item }: { item: (typeof REVIEWS)[number] }) => (
    <View className="items-center px-8">
      <View className="bg-purple-50 p-4 rounded-full mb-6">
        <Quote size={24} className="text-purple-500" />
      </View>
      <Text className="text-xl text-center font-medium mb-4 leading-relaxed">"{item.quote}"</Text>
      <Text className="text-gray-600">
        – {item.author}, {item.age}
      </Text>
    </View>
  );

  return (
    <OnboardingLayout
      title="You're in good company"
      subtitle="Help others on their hair journey — leave a quick review!"
      currentStep={9}
      totalSteps={10}
    >
      <View className="flex-1">
        <Carousel
          width={width}
          height={200}
          autoPlay
          autoPlayInterval={3000}
          scrollAnimationDuration={1200}
          data={REVIEWS}
          loop
          mode="parallax"
          renderItem={renderReview}
          onProgressChange={(_, absoluteProgress) => {
            setCurrentIndex(Math.round(absoluteProgress));
          }}
        />

        <View className="flex-row justify-center gap-2 mt-4">
          {REVIEWS.map((_, index) => (
            <View
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>

        <View className="mt-10 items-center">
          <View className="flex-row mb-6">
            {[...Array(5)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Star key={i} size={22} className="text-yellow-400 mx-0.5" fill="#FACC15" />
            ))}
          </View>

          <View className="w-full gap-4">
            <Button
              variant="primary"
              label="Yes, rate now"
              onPress={handleReviewNow}
              className="bg-black"
            />
            <Button
              variant="link"
              label="Remind me later"
              onPress={handleRemindLater}
              className="bg-gray-100"
            />
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
}
