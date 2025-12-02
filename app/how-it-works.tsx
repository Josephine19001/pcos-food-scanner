import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Scan, Brain, CheckCircle, ExternalLink } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const MEDICAL_SOURCES = [
  {
    title: 'PCOS and Diet - NIH',
    description: 'National Institutes of Health research on PCOS dietary management',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6734597/',
  },
  {
    title: 'Polycystic Ovary Syndrome - Mayo Clinic',
    description: 'Comprehensive overview of PCOS symptoms and lifestyle recommendations',
    url: 'https://www.mayoclinic.org/diseases-conditions/pcos/symptoms-causes/syc-20353439',
  },
  {
    title: 'PCOS Nutrition Guidelines - ACOG',
    description: 'American College of Obstetricians and Gynecologists dietary guidance',
    url: 'https://www.acog.org/womens-health/faqs/polycystic-ovary-syndrome-pcos',
  },
  {
    title: 'Glycemic Index and PCOS - Endocrine Society',
    description: 'Research on low-glycemic diets for PCOS management',
    url: 'https://www.endocrine.org/patient-engagement/endocrine-library/pcos',
  },
];

function StepCard({
  number,
  icon: Icon,
  title,
  description,
  delay,
}: {
  number: number;
  icon: any;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400)}>
      <View className="flex-row mb-6">
        <View className="mr-4">
          <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center">
            <Icon size={24} color="#0D9488" />
          </View>
          {number < 3 && (
            <View className="w-0.5 h-8 bg-primary-200 self-center mt-2" />
          )}
        </View>
        <View className="flex-1 pt-1">
          <Text className="text-gray-400 text-xs font-medium mb-1">STEP {number}</Text>
          <Text className="text-gray-900 text-lg font-semibold mb-1">{title}</Text>
          <Text className="text-gray-500 text-sm leading-5">{description}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

function SourceCard({
  title,
  description,
  url,
  delay,
}: {
  title: string;
  description: string;
  url: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400)}>
      <Pressable
        onPress={() => Linking.openURL(url)}
        className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-100"
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-gray-900 font-semibold mb-1">{title}</Text>
            <Text className="text-gray-500 text-sm">{description}</Text>
          </View>
          <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
            <ExternalLink size={16} color="#0D9488" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HowItWorksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center -ml-2"
        >
          <ChevronLeft size={28} color="#0D0D0D" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-semibold text-gray-900 mr-10">
          How It Works
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Intro */}
        <Animated.View entering={FadeInUp.duration(400)} className="mb-8">
          <Text className="text-gray-900 text-2xl font-bold mb-3">
            Your PCOS Diet Assistant
          </Text>
          <Text className="text-gray-500 text-base leading-6">
            PCOS Food Scanner helps you make informed dietary choices by analyzing foods
            for their potential impact on PCOS symptoms, based on scientific research.
          </Text>
        </Animated.View>

        {/* Steps */}
        <View className="mb-8">
          <StepCard
            number={1}
            icon={Scan}
            title="Scan Any Food"
            description="Point your camera at any food item, package, or meal. Our AI will identify the food and its ingredients."
            delay={100}
          />
          <StepCard
            number={2}
            icon={Brain}
            title="AI Analysis"
            description="We analyze the glycemic index, anti-inflammatory properties, hormone impact, and nutritional profile based on PCOS research."
            delay={200}
          />
          <StepCard
            number={3}
            icon={CheckCircle}
            title="Get Results"
            description="Receive a clear rating (Safe, Caution, or Avoid) with detailed explanations of how the food may affect your PCOS symptoms."
            delay={300}
          />
        </View>

        {/* What We Check */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} className="mb-8">
          <Text className="text-gray-900 text-lg font-semibold mb-4">What We Analyze</Text>
          <View className="bg-primary-50 rounded-2xl p-4">
            <View className="flex-row flex-wrap">
              {[
                'Glycemic Index',
                'Sugar Content',
                'Inflammatory Markers',
                'Hormone Disruptors',
                'Fiber Content',
                'Healthy Fats',
                'Protein Quality',
                'Processed Ingredients',
              ].map((item, index) => (
                <View
                  key={item}
                  className="bg-white px-3 py-1.5 rounded-full mr-2 mb-2 border border-primary-200"
                >
                  <Text className="text-primary-700 text-sm">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Medical Disclaimer */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} className="mb-8">
          <View className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <Text className="text-amber-800 font-semibold mb-2">Important Note</Text>
            <Text className="text-amber-700 text-sm leading-5">
              This app is for informational purposes only and is not a substitute for
              professional medical advice. Always consult with your healthcare provider
              or a registered dietitian before making significant dietary changes.
            </Text>
          </View>
        </Animated.View>

        {/* Medical Sources */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)}>
          <Text className="text-gray-900 text-lg font-semibold mb-4">
            Medical Sources & Research
          </Text>
          <Text className="text-gray-500 text-sm mb-4">
            Our recommendations are based on peer-reviewed research and guidelines from trusted medical institutions.
          </Text>
        </Animated.View>

        {MEDICAL_SOURCES.map((source, index) => (
          <SourceCard
            key={source.title}
            title={source.title}
            description={source.description}
            url={source.url}
            delay={700 + index * 100}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
