import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';

// Icons for each metric
function GlycemicIcon({ color = '#0D9488', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </Svg>
  );
}

function SugarIcon({ color = '#0D9488', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M8 12h8" />
      <Path d="M12 8v8" />
    </Svg>
  );
}

function InflammatoryIcon({ color = '#0D9488', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Svg>
  );
}

function HormoneIcon({ color = '#0D9488', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2v2" />
      <Path d="M12 20v2" />
      <Path d="m4.93 4.93 1.41 1.41" />
      <Path d="m17.66 17.66 1.41 1.41" />
      <Path d="M2 12h2" />
      <Path d="M20 12h2" />
      <Path d="m6.34 17.66-1.41 1.41" />
      <Path d="m19.07 4.93-1.41 1.41" />
    </Svg>
  );
}

function FiberIcon({ color = '#0D9488', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7 20h10" />
      <Path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <Path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
      <Path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </Svg>
  );
}

function ProteinIcon({ color = '#0D9488', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <Path d="M6 17h12" />
      <Path d="M9 21v-4a2 2 0 0 1 4 0v4" />
    </Svg>
  );
}

function FatsIcon({ color = '#0D9488', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
      <Circle cx="7.5" cy="10.5" r="1.5" />
      <Circle cx="12" cy="7.5" r="1.5" />
      <Circle cx="16.5" cy="10.5" r="1.5" />
    </Svg>
  );
}

function ProcessedIcon({ color = '#0D9488', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Svg>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ color?: string; size?: number }>;
  title: string;
  description: string;
  pcosImpact: string;
  goodValues: string;
  badValues: string;
  delay: number;
}

function MetricCard({
  icon: Icon,
  title,
  description,
  pcosImpact,
  goodValues,
  badValues,
  delay,
}: MetricCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400)}>
      <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center mr-3">
            <Icon size={24} color="#0D9488" />
          </View>
          <Text className="text-gray-900 text-lg font-semibold flex-1">{title}</Text>
        </View>

        {/* Description */}
        <Text className="text-gray-600 text-sm leading-5 mb-4">{description}</Text>

        {/* PCOS Impact */}
        <View className="bg-amber-50 rounded-xl p-3 mb-3">
          <Text className="text-amber-800 font-medium text-xs uppercase tracking-wide mb-1">
            How It Affects PCOS
          </Text>
          <Text className="text-amber-700 text-sm leading-5">{pcosImpact}</Text>
        </View>

        {/* Good vs Bad */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-green-50 rounded-xl p-3">
            <Text className="text-green-700 font-medium text-xs mb-1">Good</Text>
            <Text className="text-green-600 text-sm">{goodValues}</Text>
          </View>
          <View className="flex-1 bg-red-50 rounded-xl p-3">
            <Text className="text-red-700 font-medium text-xs mb-1">Limit</Text>
            <Text className="text-red-600 text-sm">{badValues}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const NUTRITION_METRICS = [
  {
    icon: GlycemicIcon,
    title: 'Glycemic Index',
    description:
      'Measures how quickly a food raises blood sugar levels. Foods are rated low (55 or less), medium (56-69), or high (70+).',
    pcosImpact:
      'High glycemic foods cause rapid blood sugar spikes, triggering excess insulin production. This worsens insulin resistance, a core issue in PCOS, and can increase androgen levels.',
    goodValues: 'Low GI foods like vegetables, legumes, whole grains',
    badValues: 'White bread, sugary drinks, processed snacks',
  },
  {
    icon: SugarIcon,
    title: 'Sugar Content',
    description:
      'The amount of simple sugars in a food, including natural sugars (fructose, lactose) and added sugars.',
    pcosImpact:
      'Excess sugar directly spikes insulin levels, promoting fat storage and hormonal imbalance. It also increases inflammation and can worsen acne and weight gain associated with PCOS.',
    goodValues: 'Whole fruits, vegetables, unsweetened foods',
    badValues: 'Candy, soda, sweetened yogurts, pastries',
  },
  {
    icon: InflammatoryIcon,
    title: 'Inflammatory Score',
    description:
      'Rates how much a food promotes or reduces inflammation in the body, on a scale of 1-10 (lower is better).',
    pcosImpact:
      'PCOS is associated with chronic low-grade inflammation. Inflammatory foods can worsen symptoms like irregular periods, weight gain, and increase risk of cardiovascular issues.',
    goodValues: 'Fatty fish, leafy greens, berries, olive oil',
    badValues: 'Fried foods, processed meats, refined oils',
  },
  {
    icon: HormoneIcon,
    title: 'Hormone Impact',
    description:
      'Evaluates how a food may affect hormone levels, particularly insulin, androgens, and estrogen.',
    pcosImpact:
      'PCOS involves hormonal imbalance with elevated androgens. Foods that disrupt hormones can worsen symptoms like hirsutism, acne, hair loss, and menstrual irregularities.',
    goodValues: 'Flaxseeds, cruciferous vegetables, lean proteins',
    badValues: 'Soy in excess, dairy for some, processed foods',
  },
  {
    icon: FiberIcon,
    title: 'Fiber Content',
    description:
      'The amount of dietary fiber, which slows digestion, improves gut health, and helps regulate blood sugar.',
    pcosImpact:
      'Fiber helps slow glucose absorption, reducing insulin spikes. It also supports healthy gut bacteria, which play a role in hormone metabolism and weight management.',
    goodValues: 'Vegetables, legumes, whole grains, nuts',
    badValues: 'Refined grains, processed foods, fruit juices',
  },
  {
    icon: ProteinIcon,
    title: 'Protein Quality',
    description:
      'Measures the completeness and digestibility of protein, considering amino acid profile and source.',
    pcosImpact:
      'Adequate protein helps maintain muscle mass, supports metabolism, and promotes satiety. This can help with weight management and blood sugar control in PCOS.',
    goodValues: 'Fish, eggs, legumes, lean poultry',
    badValues: 'Processed meats, low-quality protein bars',
  },
  {
    icon: FatsIcon,
    title: 'Healthy Fats',
    description:
      'Indicates presence of beneficial fats like omega-3s and monounsaturated fats versus harmful trans and saturated fats.',
    pcosImpact:
      'Omega-3 fatty acids reduce inflammation and may help lower androgen levels. Healthy fats also support hormone production and help you feel full longer.',
    goodValues: 'Avocado, olive oil, salmon, walnuts',
    badValues: 'Trans fats, excessive saturated fats',
  },
  {
    icon: ProcessedIcon,
    title: 'Processing Level',
    description:
      'Rates how processed a food is, from minimally processed whole foods to ultra-processed products.',
    pcosImpact:
      'Ultra-processed foods often contain added sugars, unhealthy fats, and artificial ingredients that promote inflammation, insulin resistance, and weight gain.',
    goodValues: 'Whole foods, home-cooked meals',
    badValues: 'Fast food, packaged snacks, instant meals',
  },
];

export default function NutritionGuideScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center -ml-2"
        >
          <ChevronLeft size={28} color="#0D0D0D" />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-semibold text-gray-900 mr-10">
          Nutrition Guide
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Intro */}
        <Animated.View entering={FadeInUp.duration(400)} className="mb-6">
          <Text className="text-gray-900 text-2xl font-bold mb-2">
            Understanding Your Scan Results
          </Text>
          <Text className="text-gray-500 text-base leading-6">
            Learn what each nutritional metric means and how it can affect your PCOS symptoms.
          </Text>
        </Animated.View>

        {/* Metric Cards */}
        {NUTRITION_METRICS.map((metric, index) => (
          <MetricCard
            key={metric.title}
            icon={metric.icon}
            title={metric.title}
            description={metric.description}
            pcosImpact={metric.pcosImpact}
            goodValues={metric.goodValues}
            badValues={metric.badValues}
            delay={100 + index * 80}
          />
        ))}

        {/* Bottom Note */}
        <Animated.View entering={FadeInUp.delay(800).duration(400)}>
          <View className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
            <Text className="text-primary-800 font-semibold mb-2">Remember</Text>
            <Text className="text-primary-700 text-sm leading-5">
              Everyone's body responds differently. Use these guidelines as a starting point
              and work with your healthcare provider to find what works best for you.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
