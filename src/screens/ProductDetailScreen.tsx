// Product Detail Screen
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Edit2, Trash2, Share2} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useProductStore} from '@/store';
import {semantic, spacing, typography} from '@/theme';
import {Header} from '@/components/Header';
import {Product} from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const {productId} = route.params;
  const {loadProduct, archiveProduct} = useProductStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    setIsLoading(true);
    const data = await loadProduct(productId);
    setProduct(data);
    setIsLoading(false);
  };

  const handleEdit = () => {
    // TODO: Navigate to edit screen
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await archiveProduct(productId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Not set';
    return `₹${price}`;
  };

  if (isLoading || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Product Details" />
        <View style={styles.center}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Product Details"
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
        <Image source={{uri: product.imageUri}} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>

          {product.category && (
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>{formatPrice(product.price)}</Text>
            </View>
            {product.mrp && (
              <View style={styles.priceBlock}>
                <Text style={styles.priceLabel}>MRP</Text>
                <Text style={[styles.priceValue, styles.mrp]}>
                  {formatPrice(product.mrp)}
                </Text>
              </View>
            )}
          </View>

          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          {product.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {product.tags.map((tag, index) => (
                  <View key={index} style={styles.tagChip}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Stock Status</Text>
              <Text style={styles.detailValue}>
                {product.stockStatus.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Source</Text>
              <Text style={styles.detailValue}>{product.source}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Added</Text>
              <Text style={styles.detailValue}>
                {new Date(product.dateAdded).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: spacing.lg,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: semantic.text,
    marginBottom: spacing.sm,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: semantic.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  categoryText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.primary,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  priceBlock: {
    minWidth: 80,
  },
  priceLabel: {
    fontSize: typography.caption.fontSize,
    color: semantic.textSecondary,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: semantic.text,
  },
  mrp: {
    textDecorationLine: 'line-through',
    color: semantic.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tagChip: {
    backgroundColor: semantic.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  tagText: {
    fontSize: typography.caption.fontSize,
    color: semantic.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: semantic.border,
  },
  detailLabel: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
  },
  detailValue: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.text,
    fontWeight: '500',
  },
});

export default ProductDetailScreen;
