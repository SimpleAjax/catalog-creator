// Catalog Preview Screen
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Share,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Share2, Edit2, Trash2, Download} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useCatalogStore} from '@/store';
import {colors, semantic, spacing, typography} from '@/theme';
import {Header} from '@/components/Header';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'CatalogPreview'>;

export const CatalogPreviewScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const {catalogId} = route.params;
  const {
    currentCatalog,
    currentCatalogProducts,
    loadCatalog,
    deleteCatalog,
  } = useCatalogStore();

  useEffect(() => {
    loadCatalog(catalogId);
  }, [catalogId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my catalog: ${currentCatalog?.name}`,
        title: currentCatalog?.name,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    navigation.navigate('CatalogBuilder', {catalogId});
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Catalog',
      'Are you sure you want to delete this catalog?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCatalog(catalogId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleExport = () => {
    Alert.alert('Export', 'Export functionality coming soon!');
  };

  if (!currentCatalog) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Catalog Preview" />
        <View style={styles.center}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Catalog Preview"
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
              <Edit2 size={20} color={semantic.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={20} color={semantic.error} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: insets.bottom + 20}}>
        {/* Catalog Header */}
        <View
          style={[
            styles.catalogHeader,
            {backgroundColor: currentCatalog.primaryColor},
          ]}>
          <Text style={styles.catalogTitle}>{currentCatalog.name}</Text>
          <Text style={styles.catalogSubtitle}>
            {currentCatalogProducts.length} products
          </Text>
        </View>

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          {currentCatalogProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {currentCatalogProducts.map(product => (
                <View key={product.id} style={styles.productCard}>
                  <Image
                    source={{uri: product.imageUri}}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    {product.price && (
                      <Text style={styles.productPrice}>₹{product.price}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No products in this catalog</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={[styles.actionBar, {paddingBottom: insets.bottom + 16}]}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color={semantic.primary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
          <Download size={20} color={semantic.primary} />
          <Text style={styles.actionText}>Export</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  headerButton: {
    padding: spacing.xs,
  },
  catalogHeader: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  catalogTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  catalogSubtitle: {
    fontSize: typography.body.fontSize,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  productsContainer: {
    paddingHorizontal: 20,
    paddingVertical: spacing.lg,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  productCard: {
    width: '47%',
    backgroundColor: semantic.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: semantic.border,
  },
  productInfo: {
    padding: spacing.md,
  },
  productName: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
    color: semantic.text,
  },
  productPrice: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '700',
    color: semantic.text,
    marginTop: 4,
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: semantic.textSecondary,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    backgroundColor: semantic.card,
    borderTopWidth: 1,
    borderTopColor: semantic.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: semantic.primaryLight,
    borderRadius: 12,
  },
  actionText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.primary,
  },
});

export default CatalogPreviewScreen;
