import { View, Text } from 'react-native';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react-native';
import { ScannedProductUI } from '@/lib/types/product';

interface IngredientCardProps {
  ingredient: ScannedProductUI['keyIngredients'][0];
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  const getIngredientConfig = (type: string | undefined) => {
    switch (type) {
      case 'beneficial':
        return {
          color: '#10B981',
          bgColor: '#10B98115',
          icon: CheckCircle,
        };
      case 'harmful':
        return {
          color: '#EF4444',
          bgColor: '#EF444415',
          icon: AlertTriangle,
        };
      default:
        return {
          color: '#6B7280',
          bgColor: '#6B728015',
          icon: Info,
        };
    }
  };

  const config = getIngredientConfig(ingredient?.type);
  const IconComponent = config.icon;

  const getSimplifiedDescription = (name: string, description: string) => {
    if (!description) return 'No description available';

    // If description mentions the ingredient name, use it as is
    if (description.toLowerCase().includes(name.toLowerCase())) {
      return description;
    }

    // Otherwise, create a simple format
    const action =
      ingredient?.type === 'beneficial'
        ? 'helps with'
        : ingredient?.type === 'harmful'
          ? 'may cause'
          : 'provides';

    return `${name} ${action} ${description.toLowerCase()}`;
  };

  // Get the description text, preferring 'description' over 'effect'
  const getIngredientText = () => {
    return ingredient?.description || ingredient?.effect || '';
  };

  return (
    <View
      className="p-4 rounded-2xl mb-3 border"
      style={{
        backgroundColor: config.bgColor,
        borderColor: `${config.color}30`,
      }}
    >
      <View className="flex-row items-start">
        <View
          className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-1"
          style={{ backgroundColor: config.color }}
        >
          <IconComponent size={16} color="white" />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-black mb-1">
            {ingredient?.name || 'Unknown Ingredient'}
          </Text>
          <Text className="text-gray-700 text-sm leading-5">
            {getSimplifiedDescription(ingredient?.name || 'Unknown', getIngredientText())}
          </Text>
        </View>
      </View>
    </View>
  );
}
