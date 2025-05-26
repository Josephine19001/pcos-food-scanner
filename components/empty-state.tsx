import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';

type EmptyStateProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
    icon?: React.ElementType;
  };
};

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <View className="items-center justify-center py-12">
      <View className="mb-6">
        <Icon width={100} height={100} color="#666" />
      </View>
      <Text className="text-2xl font-semibold mb-2 text-center">{title}</Text>
      <Text className="text-gray-500 text-center px-8">{description}</Text>
      {action && (
        <Pressable
          onPress={action.onPress}
          className="bg-white border border-black rounded-full px-6 py-3 flex-row items-center mt-6"
        >
          {action.icon && <action.icon size={20} color="#666" className="mr-2" />}
          <Text className="text-lg  ml-2">{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default EmptyState;
