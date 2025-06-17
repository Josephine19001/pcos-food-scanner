import { View, Text } from 'react-native';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: string;
  bgColor: string;
}

export function StatCard({ icon: Icon, title, value, color, bgColor }: StatCardProps) {
  return (
    <View className="p-4 rounded-2xl items-center" style={{ backgroundColor: bgColor }}>
      <Icon size={24} color={color} />
      <Text className="text-xs text-gray-600 mt-2 mb-1">{title}</Text>
      <Text className="font-bold text-black">{value}</Text>
    </View>
  );
}
