import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Clock, Activity, CheckCircle } from 'lucide-react-native';
import type { Routine } from '@/lib/api/types';

interface RoutineCardProps {
  routine: Routine;
  onPress: () => void;
}

export function RoutineCard({ routine, onPress }: RoutineCardProps) {
  const getRoutineTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-50 text-blue-700';
      case 'weekly':
        return 'bg-green-50 text-green-700';
      case 'monthly':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getRoutineTypeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return Clock;
      case 'weekly':
        return Activity;
      case 'monthly':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const Icon = getRoutineTypeIcon(routine.routineType);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Icon className="w-5 h-5 text-gray-600 mr-2" />
          <Text className="text-lg font-medium text-gray-900">{routine.name}</Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${getRoutineTypeColor(routine.routineType)}`}>
          <Text
            className={`text-xs font-medium ${getRoutineTypeColor(routine.routineType).split(' ')[1]}`}
          >
            {routine.routineType}
          </Text>
        </View>
      </View>

      {routine.description && (
        <Text className="text-gray-600 mb-3" numberOfLines={2}>
          {routine.description}
        </Text>
      )}

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Clock className="w-4 h-4 text-gray-400 mr-1" />
          <Text className="text-sm text-gray-500">
            {routine.estimatedTime} min • {routine.steps?.length || 0} steps
          </Text>
        </View>

        {routine.difficulty && (
          <View className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-xs font-medium text-gray-600 capitalize">
              {routine.difficulty}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default RoutineCard;
