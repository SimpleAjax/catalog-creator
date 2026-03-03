// Catalog Preview Screen with Export & Share functionality
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Share2,
  Edit2,
  Trash2,
} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useCatalogStore, useAppStore} from '@/store';
import {colors, semantic, spacing, typography} from '@/theme';
import {getTemplate} from '@/theme/templates';
import {Header} from '@/components/Header';
import {generateCatalogPDF, PDFOptions} from '@/utils/pdf-generator';
import {shareFile, showShareError} from '@/utils/share-utils';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'CatalogPreview'>;

const {width} = Dimensions.get('window');

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
  const {storeName} = useAppStore();

  // Export state
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadCatalog(catalogId);
  }, [catalogId]);

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



  const getExportOptions = useCallback((): PDFOptions => {
    return {
      catalog: currentCatalog!,
      products: currentCatalogProducts,
      storeName: storeName || undefined,
      includePrices: true,
      includeStoreName: true,
    };
  }, [currentCatalog, currentCatalogProducts, storeName]);

  const handleSharePDF = async () => {
    if (!currentCatalog || currentCatalogProducts.length === 0) {
      Alert.alert('Error', 'No products to share');
      return;
    }

    setIsExporting(true);

    try {
      const options = getExportOptions();
      const pdfUri = await generateCatalogPDF(options);
      await shareFile(pdfUri, {mimeType: 'application/pdf'});
    } catch (error) {
      console.error('Error sharing PDF:', error);
      showShareError();
    } finally {
      setIsExporting(false);
    }
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

  const isLineSheet = currentCatalog.template === 'linesheet';
  const template = getTemplate(currentCatalog.template);

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
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}>
        {/* Catalog Header - Line Sheet Style or Standard */}
        {isLineSheet ? (
          <View style={[styles.lineSheetHeader, {backgroundColor: template.colors.background}]}>
            {storeName && (
              <Text style={[styles.lineSheetStoreName, {color: template.colors.textMuted}]}>
                {storeName.toUpperCase()}
              </Text>
            )}
            <Text style={[styles.lineSheetTitle, {color: template.colors.text}]}>
              LINE SHEET
            </Text>
            <Text style={[styles.lineSheetSubtitle, {color: template.colors.textMuted}]}>
              {currentCatalog.name}
            </Text>
            <Text style={[styles.lineSheetMeta, {color: template.colors.textMuted}]}>
              {currentCatalogProducts.length} Products
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.catalogHeader,
              {backgroundColor: currentCatalog.primaryColor},
            ]}>
            {storeName && (
              <Text style={styles.storeName}>{storeName}</Text>
            )}
            <Text style={styles.catalogTitle}>{currentCatalog.name}</Text>
            <Text style={styles.catalogSubtitle}>
              {currentCatalogProducts.length} products
            </Text>
          </View>
        )}

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          {currentCatalogProducts.length > 0 ? (
            <FlatList
              key={isLineSheet ? '3-col' : '2-col'} // Force re-render when columns change
              data={currentCatalogProducts}
              numColumns={isLineSheet ? 3 : 2}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              columnWrapperStyle={isLineSheet ? styles.productRowLineSheet : styles.productRow}
              renderItem={({item: product}) => (
                <View style={[
                  isLineSheet ? styles.productCardLineSheet : styles.productCard,
                  {backgroundColor: template.colors.cardBg, borderColor: template.colors.border}
                ]}>
                  <Image
                    source={{uri: product.imageUri}}
                    style={isLineSheet ? styles.productImageLineSheet : styles.productImage}
                    resizeMode={isLineSheet ? "contain" : "cover"}
                  />
                  <View style={isLineSheet ? styles.productInfoLineSheet : styles.productInfo}>
                    <Text 
                      style={[
                        isLineSheet ? styles.productNameLineSheet : styles.productName, 
                        {color: template.colors.text}
                      ]} 
                      numberOfLines={1}>
                      {product.name.toUpperCase()}
                    </Text>
                    {product.description && isLineSheet && (
                      <Text 
                        style={[styles.productDescLineSheet, {color: template.colors.textMuted}]} 
                        numberOfLines={2}>
                        {product.description}
                      </Text>
                    )}
                    {product.price !== undefined && product.price !== null && (
                      <Text style={[
                        isLineSheet ? styles.productPriceLineSheet : styles.productPrice,
                        {color: template.colors.price}
                      ]}>
                        ₹{product.price}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No products in this catalog</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Bar - Single Share Button */}
      <View style={[styles.actionBar, {paddingBottom: insets.bottom + 16}]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.shareButton]} 
          onPress={handleSharePDF}>
          <Share2 size={20} color={colors.white} />
          <Text style={styles.shareButtonText} numberOfLines={1}>Share Catalog</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Overlay */}
      {isExporting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={semantic.primary} />
          <Text style={styles.loadingText}>Generating catalog...</Text>
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
  // Line Sheet Header Styles
  lineSheetHeader: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: semantic.border,
  },
  lineSheetStoreName: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  lineSheetTitle: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 4,
  },
  lineSheetSubtitle: {
    fontSize: 14,
    marginTop: spacing.sm,
  },
  lineSheetMeta: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  // Standard Header Styles
  catalogHeader: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  storeName: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
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
    flex: 1,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  productRowLineSheet: {
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: spacing.md,
  },
  productCard: {
    width: (width - 60) / 2,
    backgroundColor: semantic.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  productCardLineSheet: {
    width: (width - 56) / 3,
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: semantic.border,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: semantic.border,
  },
  productImageLineSheet: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5F0EB',
    padding: 8,
  },
  productInfo: {
    padding: spacing.md,
  },
  productInfoLineSheet: {
    padding: spacing.sm,
    alignItems: 'center',
  },
  productName: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
    color: semantic.text,
  },
  productNameLineSheet: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  productDescLineSheet: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 12,
  },
  productPrice: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '700',
    color: semantic.text,
    marginTop: 4,
  },
  productPriceLineSheet: {
    fontSize: 12,
    fontWeight: '600',
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: semantic.primaryLight,
    borderRadius: 12,
  },
  actionText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
    color: semantic.primary,
    marginLeft: 4,
  },
  shareButton: {
    backgroundColor: semantic.primary,
    flex: 1,
  },
  shareButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 8,
  },
  // Loading Overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body.fontSize,
    color: semantic.textSecondary,
  },
});

export default CatalogPreviewScreen;
