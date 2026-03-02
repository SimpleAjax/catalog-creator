// Home Screen
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Plus, Search, Package, BookOpen, ChevronRight} from 'lucide-react-native';

import {useProductStore, useCatalogStore} from '@/store';
import {colors, semantic, spacing, textStyles, typography} from '@/theme';
import {ScreenWrapper} from '@/components/ScreenWrapper';
import {ProductCard} from '@/components/ProductCard';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {products, totalCount, isLoading, loadProducts} = useProductStore();
  const {catalogs, loadCatalogs} = useCatalogStore();

  useEffect(() => {
    loadProducts();
    loadCatalogs();
  }, []);

  const recentProducts = products.slice(0, 6);

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleSearch = () => {
    navigation.navigate('Search');
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', {productId});
  };

  const handleSeeAllProducts = () => {
    navigation.navigate('MainTabs');
  };

  const handleSeeAllCatalogs = () => {
    navigation.navigate('MainTabs', {screen: 'Catalogs'});
  };

  return (
    <ScreenWrapper scrollable>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.subtitle}>Create beautiful catalogs</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Search size={24} color={semantic.text} />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={handleSeeAllProducts}>
          <View style={[styles.statIcon, {backgroundColor: semantic.primaryLight}]}>
            <Package size={24} color={semantic.primary} />
          </View>
          <Text style={styles.statValue}>{totalCount}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={handleSeeAllCatalogs}>
          <View style={[styles.statIcon, {backgroundColor: semantic.secondary}]}>
            <BookOpen size={24} color={semantic.textSecondary} />
          </View>
          <Text style={styles.statValue}>{catalogs.length}</Text>
          <Text style={styles.statLabel}>Catalogs</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={textStyles.sectionHeader}>Recent Products</Text>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={handleSeeAllProducts}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={semantic.primary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color={semantic.primary} />
        ) : recentProducts.length > 0 ? (
          <FlatList
            data={recentProducts}
            keyExtractor={item => item.id}
            numColumns={3}
            columnWrapperStyle={styles.productRow}
            scrollEnabled={false}
            renderItem={({item}) => (
              <ProductCard
                product={item}
                onPress={() => handleProductPress(item.id)}
                style={styles.productCard}
              />
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddProduct}>
              <Plus size={20} color={semantic.card} />
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={textStyles.sectionHeader}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={handleAddProduct}>
          <View style={[styles.actionIcon, {backgroundColor: semantic.primaryLight}]}>
            <Plus size={24} color={semantic.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Add Products</Text>
            <Text style={styles.actionSubtitle}>
              Import from gallery or camera
            </Text>
          </View>
          <ChevronRight size={20} color={semantic.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  greeting: {
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
    color: semantic.text,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: semantic.textSecondary,
    marginTop: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: semantic.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: semantic.card,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
    color: semantic.text,
  },
  statLabel: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.primary,
    fontWeight: '500',
  },
  productRow: {
    gap: spacing.sm,
  },
  productCard: {
    flex: 1,
    maxWidth: '31%',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
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
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semantic.card,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  actionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.text,
  },
  actionSubtitle: {
    fontSize: typography.caption.fontSize,
    color: semantic.textSecondary,
    marginTop: 2,
  },
});

export default HomeScreen;
