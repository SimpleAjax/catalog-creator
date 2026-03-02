// Products Screen
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Plus, Search, Filter, X} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useProductStore, useAppStore} from '@/store';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {RootTabParamList} from '@/navigation/types';
import {colors, semantic, spacing, textStyles, typography} from '@/theme';
import {Header} from '@/components/Header';
import {ProductCard} from '@/components/ProductCard';



export const ProductsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    filteredProducts,
    categories,
    isLoading,
    loadProducts,
    filterByCategory,
    clearFilters,
  } = useProductStore();
  const {isSelectionMode, selectedProductIds, toggleProductSelection, clearSelection} =
    useAppStore();

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleProductPress = (productId: string) => {
    if (isSelectionMode) {
      toggleProductSelection(productId);
    } else {
      navigation.navigate('ProductDetail', {productId});
    }
  };

  const handleProductLongPress = (productId: string) => {
    if (!isSelectionMode) {
      useAppStore.getState().toggleSelectionMode();
    }
    toggleProductSelection(productId);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      filterByCategory(category);
    } else {
      clearFilters();
    }
  };

  const handleSearch = () => {
    navigation.navigate('Search');
  };

  const handleBulkTag = () => {
    if (selectedProductIds.length > 0) {
      navigation.navigate('BulkTag', {productIds: selectedProductIds});
      clearSelection();
    }
  };

  const renderHeader = () => (
    <View style={styles.headerActions}>
      <TouchableOpacity style={styles.searchBar} onPress={handleSearch}>
        <Search size={20} color={semantic.textSecondary} />
        <Text style={styles.searchPlaceholder}>Search products...</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterButton}>
        <Filter size={20} color={semantic.text} />
      </TouchableOpacity>
    </View>
  );

  const renderCategoryFilters = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={['All', ...categories]}
        keyExtractor={item => item}
        contentContainerStyle={styles.categoryList}
        renderItem={({item}) => {
          const isActive =
            item === 'All' ? selectedCategory === null : selectedCategory === item;
          return (
            <TouchableOpacity
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() =>
                handleCategoryFilter(item === 'All' ? null : item)
              }>
              <Text
                style={[
                  styles.categoryChipText,
                  isActive && styles.categoryChipTextActive,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Products"
        showBack={false}
        rightAction={
          isSelectionMode ? (
            <TouchableOpacity onPress={clearSelection}>
              <X size={24} color={semantic.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleAddProduct}>
              <Plus size={24} color={semantic.primary} />
            </TouchableOpacity>
          )
        }
      />

      {renderHeader()}
      {renderCategoryFilters()}

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={semantic.primary} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          numColumns={3}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={[
            styles.productList,
            {paddingBottom: insets.bottom + 100}
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No products found</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddProduct}>
                <Plus size={20} color={semantic.card} />
                <Text style={styles.addButtonText}>Add Product</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({item}) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.id)}
              onLongPress={() => handleProductLongPress(item.id)}
              selected={selectedProductIds.includes(item.id)}
              style={styles.productCard}
            />
          )}
        />
      )}

      {isSelectionMode && selectedProductIds.length > 0 && (
        <View style={[styles.selectionBar, {bottom: insets.bottom + 80}]}>
          <Text style={styles.selectionText}>
            {selectedProductIds.length} selected
          </Text>
          <TouchableOpacity style={styles.tagButton} onPress={handleBulkTag}>
            <Text style={styles.tagButtonText}>Tag</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background,
  },
  headerActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.card,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: semantic.textSecondary,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: semantic.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    marginBottom: spacing.md,
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: semantic.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: semantic.border,
  },
  categoryChipActive: {
    backgroundColor: semantic.primaryLight,
    borderColor: semantic.primary,
  },
  categoryChipText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: semantic.primary,
  },
  productList: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  productRow: {
    gap: 10,
    marginBottom: 10,
  },
  productCard: {
    flex: 1,
    maxWidth: '31%',
  },
  loader: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: semantic.textSecondary,
    marginBottom: spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.sm,
  },
  addButtonText: {
    color: semantic.card,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  selectionBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: semantic.card,
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectionText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.text,
  },
  tagButton: {
    backgroundColor: semantic.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  tagButtonText: {
    color: semantic.card,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
});

export default ProductsScreen;
