import { View, Pressable, Modal, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { TextInput } from '@/components/ui/text-input';
import { Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import products from '@/mock/products.json';
import { Button, ButtonWithIcon } from '@/components/ui';
type Product = {
  id: string;
  name: string;
  brand: string;
  type: string;
};

type ProductSelectorProps = {
  selectedProducts: Product[];
  onProductsChange: (products: Product[]) => void;
};

export function ProductSelector({ selectedProducts, onProductsChange }: ProductSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProduct = (product: Product) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      onProductsChange([...selectedProducts, product]);
    }
    setShowModal(false);
  };

  const removeProduct = (productId: string) => {
    onProductsChange(selectedProducts.filter((p) => p.id !== productId));
  };

  return (
    <View>
      {/* Selected Products List */}
      <View className="mb-4">
        {selectedProducts.map((product) => (
          <View
            key={product.id}
            className="flex-row items-center justify-between bg-gray-100 p-4 rounded-xl mb-2"
          >
            <View>
              <Text className="text-base font-medium">{product.name}</Text>
              <Text className="text-sm text-gray-600">
                {product.brand} · {product.type}
              </Text>
            </View>
            <Pressable onPress={() => removeProduct(product.id)} hitSlop={8} className="p-2">
              <X size={20} color="#4B5563" />
            </Pressable>
          </View>
        ))}
      </View>

      <ButtonWithIcon icon={Plus} label="Add Product" onPress={() => setShowModal(true)} />

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-white">
          <View className="p-4">
            <Text className="text-xl font-semibold mb-4 text-center">Add Product</Text>
            <View className="flex-row items-center rounded-xl px-4 py-2">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search products..."
                className="flex-1 ml-2 text-base "
              />
            </View>
          </View>

          <ScrollView className="flex-1">
            <View className="flex flex-col gap-2 px-6 py-4">
              {filteredProducts.map((product) => (
                <Pressable
                  key={product.id}
                  onPress={() => addProduct(product)}
                  className=" bg-gray-50 rounded-xl px-4 py-2"
                >
                  <Text className="text-base font-medium">{product.name}</Text>
                  <Text className="text-sm text-gray-600">
                    {product.brand} · {product.type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Button
            variant="secondary"
            className="m-4 mb-12"
            onPress={() => setShowModal(false)}
            label="Cancel"
          />
        </View>
      </Modal>
    </View>
  );
}
