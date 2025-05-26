import { View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from '@/components/ui/text';

const PageLayout = ({
  children,
  title,
  image,
}: {
  children: React.ReactNode;
  title: string;
  image?: string;
}) => {
  return (
    <ScrollView className="flex-1 bg-slate-100 pt-2">
      <View className="flex-row items-center justify-between pb-4 pt-12 px-4">
        <Text className="text-4xl font-bold">{title}</Text>
        {image && (
          <Image
            source={require('@/assets/images/avatar.png')}
            className="w-14 h-14 rounded-full mr-4"
          />
        )}
      </View>
      {children}
    </ScrollView>
  );
};

export default PageLayout;
