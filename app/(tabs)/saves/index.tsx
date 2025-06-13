import { View, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ScanBarcode, Heart, History } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { ProductCard, type SavedProduct } from '@/components/saves/ProductCard';
import { ProductDetailModal } from '@/components/saves/ProductDetailModal';
import { SearchAndFilter, type FilterOptions } from '@/components/saves/SearchAndFilter';
import {
  mockSavedProducts,
  getFavoriteProducts,
  getScannedProducts,
} from '@/data/savedProductsData';

type Tab = 'my-scans' | 'favorites';

function EmptyState({
  icon: Icon,
  title,
  description,
  buttonLabel,
  onButtonPress,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonLabel: string;
  onButtonPress: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="rounded-full p-6 mb-6">
        <Icon size={48} color="#6B7280" />
      </View>
      <Text className="text-2xl font-bold text-black mb-3 text-center">{title}</Text>
      <Text className="text-gray-600 text-center mb-8 text-lg leading-6">{description}</Text>
      <Button variant="primary" label={buttonLabel} onPress={onButtonPress} className="w-full" />
    </View>
  );
}

export default function SavesScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('my-scans');
  const [products, setProducts] = useState<SavedProduct[]>(mockSavedProducts);
  const [selectedProduct, setSelectedProduct] = useState<SavedProduct | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: null,
    safetyScore: null,
    sortBy: 'date',
  });

  const scannedProducts = getScannedProducts(products);
  const favoriteProducts = getFavoriteProducts(products);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'my-scans', label: 'My Scans', icon: History },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    const currentProducts = activeTab === 'my-scans' ? scannedProducts : favoriteProducts;

    let filtered = currentProducts.filter((product) => {
      // Text search
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = !filters.category || product.category === filters.category;

      // Safety score filter
      const matchesSafety =
        !filters.safetyScore ||
        (filters.safetyScore === 'Safe (8-10)' && product.safetyScore >= 8) ||
        (filters.safetyScore === 'Moderate (6-7)' &&
          product.safetyScore >= 6 &&
          product.safetyScore < 8) ||
        (filters.safetyScore === 'Caution (0-5)' && product.safetyScore < 6);

      return matchesSearch && matchesCategory && matchesSafety;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.safetyScore - a.safetyScore;
        case 'date':
        default:
          const dateA = new Date(a.scannedAt || a.savedAt || '').getTime();
          const dateB = new Date(b.scannedAt || b.savedAt || '').getTime();
          return dateB - dateA;
      }
    });

    return filtered;
  }, [activeTab, scannedProducts, favoriteProducts, searchQuery, filters]);

  const handleProductPress = (product: SavedProduct) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleToggleFavorite = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product
      )
    );

    // Update the selected product if it's currently shown in modal
    if (selectedProduct?.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const renderProductItem = ({ item }: { item: SavedProduct }) => (
    <View className="w-1/2 px-2">
      <ProductCard
        product={item}
        showDate={activeTab === 'my-scans' ? 'scannedAt' : 'savedAt'}
        onPress={handleProductPress}
        onToggleFavorite={handleToggleFavorite}
      />
    </View>
  );

  const renderContent = () => {
    if (filteredProducts.length === 0) {
      // Check if it's due to filters/search or actually empty
      const originalProducts = activeTab === 'my-scans' ? scannedProducts : favoriteProducts;
      const isFiltered =
        searchQuery !== '' || filters.category || filters.safetyScore || filters.sortBy !== 'date';

      if (originalProducts.length === 0) {
        const emptyStateProps =
          activeTab === 'my-scans'
            ? {
                icon: ScanBarcode,
                title: 'No scans yet',
                description:
                  'Start scanning beauty products to see your history here. Get detailed ingredient analysis and safety scores.',
                buttonLabel: 'Start Scanning',
                onButtonPress: () => router.push('/scan'),
              }
            : {
                icon: Heart,
                title: 'No favorites yet',
                description:
                  'Save products you love to easily find them later. Tap the heart icon on any product to add it to your favorites.',
                buttonLabel: 'Explore Products',
                onButtonPress: () => router.push('/(tabs)/explore'),
              };

        return <EmptyState {...emptyStateProps} />;
      }

      if (isFiltered) {
        return (
          <View className="flex-1 items-center justify-center px-8">
            <View className="bg-gray-100 rounded-full p-6 mb-6">
              <ScanBarcode size={48} color="#6B7280" />
            </View>
            <Text className="text-2xl font-bold text-black mb-3 text-center">No results found</Text>
            <Text className="text-gray-600 text-center mb-8 text-lg leading-6">
              Try adjusting your search or filters to find what you're looking for.
            </Text>
          </View>
        );
      }
    }

    return (
      <View className="flex-1 px-4">
        <Text className="text-lg font-semibold text-black mb-4">
          {activeTab === 'my-scans'
            ? `Recent Scans (${filteredProducts.length})`
            : `Saved Products (${filteredProducts.length})`}
        </Text>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ marginBottom: 8 }}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-3xl font-bold text-black mb-2">Saves</Text>

        {/* Tabs */}
        <View className="flex-row">
          {tabs.map((tab) => (
            <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)} className="flex-1">
              <View className="items-center py-3">
                <View className="flex-row items-center mb-1">
                  <Text
                    className={cn(
                      'text-base font-medium',
                      activeTab === tab.id ? 'text-black' : 'text-gray-500'
                    )}
                  >
                    {tab.label}
                  </Text>
                </View>
              </View>
              <View className={cn('h-0.5', activeTab === tab.id ? 'bg-black' : 'bg-transparent')} />
            </Pressable>
          ))}
        </View>
      </View>

      {/* Search and Filter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Content */}
      {renderContent()}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        visible={modalVisible}
        onClose={handleCloseModal}
        onToggleFavorite={handleToggleFavorite}
      />
    </SafeAreaView>
  );
}
