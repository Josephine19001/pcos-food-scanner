import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { FeatureCard } from '@/components/explore/FeatureCard';
import { CategoryCard } from '@/components/explore/CategoryCard';
import { ScanningPersonCard } from '@/components/explore/ScanningPersonCard';
import { PremiumBanner } from '@/components/explore/PremiumBanner';
import { mainFeatures, categories, scanningPeople } from '@/data/exploreData';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-6">
          <Text className="text-3xl font-bold text-black mb-6">Explore</Text>

          <PremiumBanner />
        </View>

        <View className="px-4">
          {mainFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </View>

        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-black mb-4">Scan by Category</Text>
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <CategoryCard key={category.label} category={category} />
            ))}
          </View>
        </View>

        <View className="px-4 mb-8">
          <Text className="text-xl font-bold text-black mb-4">What People Are Scanning</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
            {scanningPeople.map((person) => (
              <ScanningPersonCard key={person.id} person={person} />
            ))}
          </ScrollView>
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
