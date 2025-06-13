import { View, TouchableOpacity, Modal, ScrollView, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import {
  X,
  Heart,
  Star,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Info,
  Shield,
  Award,
  Zap,
  Sparkles,
  Search,
  BookOpen,
  Building,
  Beaker,
  ArrowLeft,
} from 'lucide-react-native';
import type { SavedProduct } from './ProductCard';

interface ProductDetailModalProps {
  product: SavedProduct | null;
  visible: boolean;
  onClose: () => void;
  onToggleFavorite: (productId: string) => void;
  modalHeight?: 'full' | '80%';
}

interface IngredientCardProps {
  ingredient: SavedProduct['keyIngredients'][0];
}

function IngredientCard({ ingredient }: IngredientCardProps) {
  const getIngredientConfig = (type: string) => {
    switch (type) {
      case 'beneficial':
        return {
          color: '#10B981',
          icon: CheckCircle,
          bgColor: '#10B98115',
          label: 'Good for you',
        };
      case 'harmful':
        return {
          color: '#EF4444',
          icon: AlertTriangle,
          bgColor: '#EF444415',
          label: 'Watch out',
        };
      case 'neutral':
        return {
          color: '#6B7280',
          icon: Info,
          bgColor: '#6B728015',
          label: 'Neutral',
        };
      default:
        return {
          color: '#6B7280',
          icon: Info,
          bgColor: '#6B728015',
          label: 'Neutral',
        };
    }
  };

  const config = getIngredientConfig(ingredient.type);
  const IconComponent = config.icon;

  const getSimplifiedDescription = (name: string, description: string) => {
    const simplifications: Record<string, string> = {
      'Sodium Hyaluronate': 'Keeps your skin super hydrated and plump',
      'Tocopheryl Acetate': 'Protects skin from damage and adds moisture',
      Phenoxyethanol: 'Preservative that keeps the product fresh',
      Fragrance: 'Adds scent but may irritate sensitive skin',
    };

    return simplifications[name] || description.split('.')[0] + '.';
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      <View className="flex-row items-start">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4 mt-1"
          style={{ backgroundColor: config.bgColor }}
        >
          <IconComponent size={24} color={config.color} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Text className="font-bold text-black text-base flex-1">{ingredient.name}</Text>
            <View className="px-2 py-1 rounded-full" style={{ backgroundColor: config.bgColor }}>
              <Text className="text-xs font-medium" style={{ color: config.color }}>
                {config.label}
              </Text>
            </View>
          </View>
          <Text className="text-gray-600 text-sm leading-5">
            {getSimplifiedDescription(ingredient.name, ingredient.description)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  color,
  bgColor,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  color: string;
  bgColor: string;
}) {
  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100 items-center">
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={24} color={color} />
      </View>
      <Text className="text-xs text-gray-500 mb-1 text-center">{title}</Text>
      <Text className="text-lg font-bold text-center" style={{ color }}>
        {value}
      </Text>
    </View>
  );
}

export function ProductDetailModal({
  product,
  visible,
  onClose,
  onToggleFavorite,
  modalHeight = 'full',
}: ProductDetailModalProps) {
  if (!product) return null;

  const getScoreConfig = (score: number) => {
    if (score >= 8)
      return {
        color: '#10B981',
        label: 'Safe',
        icon: Shield,
        bgColor: '#10B98115',
      };
    if (score >= 6)
      return {
        color: '#F59E0B',
        label: 'Moderate',
        icon: AlertTriangle,
        bgColor: '#F59E0B15',
      };
    return {
      color: '#EF4444',
      label: 'Caution',
      icon: AlertTriangle,
      bgColor: '#EF444415',
    };
  };

  const scoreConfig = getScoreConfig(product.safetyScore);
  const beneficialCount = product.keyIngredients.filter((i) => i.type === 'beneficial').length;
  const harmfulCount = product.keyIngredients.filter((i) => i.type === 'harmful').length;

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hair':
        return Sparkles;
      case 'skin':
        return Heart;
      case 'face':
        return Award;
      case 'perfume':
        return Zap;
      default:
        return Info;
    }
  };

  const CategoryIcon = getCategoryIcon(product.category);

  const quickLinks = [
    {
      title: 'EWG Database',
      url: 'https://www.ewg.org/skindeep/',
      icon: Search,
      color: '#10B981',
    },
    {
      title: "Paula's Choice",
      url: 'https://www.paulaschoice.com/ingredient-dictionary',
      icon: BookOpen,
      color: '#8B5CF6',
    },
    {
      title: 'FDA Guide',
      url: 'https://www.fda.gov/cosmetics/cosmetic-ingredients',
      icon: Building,
      color: '#3B82F6',
    },
    {
      title: 'INCI Decoder',
      url: 'https://incidecoder.com/',
      icon: Beaker,
      color: '#F59E0B',
    },
  ];

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  if (modalHeight === '80%') {
    return (
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="h-4/5 bg-slate-50 rounded-t-3xl">
            <SafeAreaView className="flex-1" edges={['bottom']}>
              {/* Fixed Header */}
              <View className="flex-row items-center justify-between px-6 py-4 bg-slate-50 rounded-t-3xl">
                <TouchableOpacity
                  onPress={onClose}
                  className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
                >
                  <ArrowLeft size={20} color="#000" />
                </TouchableOpacity>

                <View className="flex-1" />

                <TouchableOpacity
                  onPress={() => onToggleFavorite(product.id)}
                  className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
                >
                  <Heart
                    size={20}
                    color="#000"
                    fill={product.isFavorite ? '#000' : 'transparent'}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Product Hero */}
                <View className="items-center px-6 pb-6">
                  <View className="relative mb-6">
                    <Image
                      source={product.image}
                      className="w-32 h-32 rounded-3xl"
                      resizeMode="cover"
                    />
                    <View
                      className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full items-center justify-center shadow-lg"
                      style={{ backgroundColor: scoreConfig.color }}
                    >
                      <Text className="text-white text-lg font-bold">{product.safetyScore}</Text>
                    </View>
                  </View>

                  <Text className="text-2xl font-bold text-black text-center mb-2">
                    {product.name}
                  </Text>
                  <Text className="text-gray-600 text-lg mb-4">{product.brand}</Text>

                  <View
                    className="px-6 py-3 rounded-2xl flex-row items-center"
                    style={{ backgroundColor: scoreConfig.bgColor }}
                  >
                    <scoreConfig.icon size={20} color={scoreConfig.color} />
                    <Text className="font-bold text-lg ml-2" style={{ color: scoreConfig.color }}>
                      {scoreConfig.label}
                    </Text>
                  </View>
                </View>

                {/* Stats Grid */}
                <View className="px-6 mb-6">
                  <View className="flex-row space-x-4">
                    <View className="flex-1">
                      <StatCard
                        icon={CategoryIcon}
                        title="Category"
                        value={product.category}
                        color="#6B7280"
                        bgColor="#6B728015"
                      />
                    </View>
                    <View className="flex-1">
                      <StatCard
                        icon={CheckCircle}
                        title="Benefits"
                        value={beneficialCount.toString()}
                        color="#10B981"
                        bgColor="#10B98115"
                      />
                    </View>
                    <View className="flex-1">
                      <StatCard
                        icon={AlertTriangle}
                        title="Concerns"
                        value={harmfulCount.toString()}
                        color="#EF4444"
                        bgColor="#EF444415"
                      />
                    </View>
                  </View>
                </View>

                {/* Key Ingredients */}
                <View className="px-6 mb-6">
                  <Text className="text-xl font-bold text-black mb-4">What's Inside</Text>
                  {product.keyIngredients.map((ingredient, index) => (
                    <IngredientCard key={index} ingredient={ingredient} />
                  ))}
                </View>

                {/* Quick Links */}
                <View className="px-6 mb-8">
                  <Text className="text-xl font-bold text-black mb-4">Learn More</Text>
                  <View className="flex-row flex-wrap">
                    {quickLinks.map((link, index) => (
                      <TouchableOpacity
                        key={index}
                        className="w-1/2 p-2"
                        onPress={() => openLink(link.url)}
                      >
                        <View className="bg-white rounded-2xl p-4 border border-gray-100 items-center min-h-[100px] justify-center">
                          <View
                            className="w-12 h-12 rounded-full items-center justify-center mb-3"
                            style={{ backgroundColor: `${link.color}15` }}
                          >
                            <link.icon size={24} color={link.color} />
                          </View>
                          <Text className="font-bold text-black text-sm text-center mb-1">
                            {link.title}
                          </Text>
                          <ExternalLink size={14} color="#6B7280" />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <SafeAreaView className="flex-1 mt-16 bg-slate-50" edges={['top', 'bottom']}>
        {/* Fixed Header */}
        <View className="flex-row items-center justify-between px-6 py-4 bg-slate-50">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
          >
            <ArrowLeft size={20} color="#000" />
          </TouchableOpacity>

          <View className="flex-1" />

          <TouchableOpacity
            onPress={() => onToggleFavorite(product.id)}
            className="w-10 h-10 items-center justify-center bg-white rounded-full shadow-sm"
          >
            <Heart size={20} color="#000" fill={product.isFavorite ? '#000' : 'transparent'} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Product Hero */}
          <View className="items-center px-6 pb-6">
            <View className="relative mb-6">
              <Image source={product.image} className="w-32 h-32 rounded-3xl" resizeMode="cover" />
              <View
                className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full items-center justify-center shadow-lg"
                style={{ backgroundColor: scoreConfig.color }}
              >
                <Text className="text-white text-lg font-bold">{product.safetyScore}</Text>
              </View>
            </View>

            <Text className="text-2xl font-bold text-black text-center mb-2">{product.name}</Text>
            <Text className="text-gray-600 text-lg mb-4">{product.brand}</Text>

            <View
              className="px-6 py-3 rounded-2xl flex-row items-center"
              style={{ backgroundColor: scoreConfig.bgColor }}
            >
              <scoreConfig.icon size={20} color={scoreConfig.color} />
              <Text className="font-bold text-lg ml-2" style={{ color: scoreConfig.color }}>
                {scoreConfig.label}
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View className="px-6 mb-6">
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <StatCard
                  icon={CategoryIcon}
                  title="Category"
                  value={product.category}
                  color="#6B7280"
                  bgColor="#6B728015"
                />
              </View>
              <View className="flex-1">
                <StatCard
                  icon={CheckCircle}
                  title="Benefits"
                  value={beneficialCount.toString()}
                  color="#10B981"
                  bgColor="#10B98115"
                />
              </View>
              <View className="flex-1">
                <StatCard
                  icon={AlertTriangle}
                  title="Concerns"
                  value={harmfulCount.toString()}
                  color="#EF4444"
                  bgColor="#EF444415"
                />
              </View>
            </View>
          </View>

          {/* Key Ingredients */}
          <View className="px-6 mb-6">
            <Text className="text-xl font-bold text-black mb-4">What's Inside</Text>
            {product.keyIngredients.map((ingredient, index) => (
              <IngredientCard key={index} ingredient={ingredient} />
            ))}
          </View>

          {/* Quick Links */}
          <View className="px-6 mb-8">
            <Text className="text-xl font-bold text-black mb-4">Learn More</Text>
            <View className="flex-row flex-wrap">
              {quickLinks.map((link, index) => (
                <TouchableOpacity
                  key={index}
                  className="w-1/2 p-2"
                  onPress={() => openLink(link.url)}
                >
                  <View className="bg-white rounded-2xl p-4 border border-gray-100 items-center min-h-[100px] justify-center">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mb-3"
                      style={{ backgroundColor: `${link.color}15` }}
                    >
                      <link.icon size={24} color={link.color} />
                    </View>
                    <Text className="font-bold text-black text-sm text-center mb-1">
                      {link.title}
                    </Text>
                    <ExternalLink size={14} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
