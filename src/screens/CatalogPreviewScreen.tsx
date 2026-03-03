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
  SafeAreaView,
  ActivityIndicator,
  Switch,
  FlatList,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  Share2,
  Edit2,
  Trash2,
  Download,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  X,
  Check,
} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useCatalogStore, useAppStore} from '@/store';
import {colors, semantic, spacing, typography} from '@/theme';
import {Header} from '@/components/Header';
import {generateCatalogPDF, exportAndSavePDF, PDFOptions} from '@/utils/pdf-generator';
import {generateCatalogImages, getExportSummary} from '@/utils/image-generator';
import {shareFile, shareToWhatsApp, saveToGallery, showShareError} from '@/utils/share-utils';

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
  const {storeName} = useAppStore();

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'images'>('pdf');
  const [includePrices, setIncludePrices] = useState(true);
  const [includeStoreName, setIncludeStoreName] = useState(true);
  const [columns, setColumns] = useState<2 | 3>(2);

  useEffect(() => {
    loadCatalog(catalogId);
  }, [catalogId]);

  const handleShare = async () => {
    try {
      await shareFile('', {
        dialogTitle: currentCatalog?.name || 'Share Catalog',
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

  const handleExportPress = () => {
    setShowExportOptions(true);
  };

  const closeExportOptions = () => {
    setShowExportOptions(false);
  };

  const getExportOptions = useCallback((): PDFOptions => {
    console.log(`[Export] Products available: ${currentCatalogProducts.length}`);
    console.log(`[Export] Product names: ${currentCatalogProducts.map(p => p.name).join(', ')}`);
    return {
      catalog: currentCatalog!,
      products: currentCatalogProducts,
      storeName: storeName || undefined,
      includePrices,
      includeStoreName,
    };
  }, [currentCatalog, currentCatalogProducts, storeName, includePrices, includeStoreName]);

  const handleExport = async () => {
    if (!currentCatalog || currentCatalogProducts.length === 0) {
      Alert.alert('Error', 'No products to export');
      return;
    }

    setIsExporting(true);
    setShowExportOptions(false);

    try {
      if (exportFormat === 'pdf') {
        const options = getExportOptions();
        const pdfUri = await exportAndSavePDF(options);

        Alert.alert(
          'PDF Generated',
          'Your catalog has been exported as PDF. Would you like to share it now?',
          [
            {text: 'Later', style: 'cancel'},
            {
              text: 'Share',
              onPress: () => shareFile(pdfUri, {mimeType: 'application/pdf'}),
            },
          ],
        );
      } else {
        // Image export - generates HTML files that can be rendered in WebView
        const imageCount = getExportSummary(currentCatalogProducts.length, columns).totalImages;
        
        Alert.alert(
          'Image Export',
          `This will generate ${imageCount} HTML file(s) for your ${currentCatalogProducts.length} products.\n\nNote: To get actual images, open these files in a browser or implement WebView capture.`,
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Continue',
              onPress: async () => {
                // Close the export options modal first
                setShowExportOptions(false);
                
                // Small delay to let modal close before showing loading
                setTimeout(async () => {
                  setIsExporting(true);
                  try {
                    // Generate catalog HTML files with pagination
                    const fileUris = await generateCatalogImages({
                      catalog: currentCatalog,
                      products: currentCatalogProducts,
                      columns: columns,
                      includeHeader: true,
                      includePrices: includePrices,
                      includeStoreName: includeStoreName,
                      storeName: storeName || undefined,
                    });
                    
                    if (fileUris.length === 0) {
                      showShareError('No files were generated.');
                      return;
                    }
                    
                    console.log(`[Export] Generated ${fileUris.length} HTML file(s):`, fileUris);
                    
                    // Share the HTML files
                    if (fileUris.length === 1) {
                      await shareFile(fileUris[0], {
                        mimeType: 'text/html',
                        dialogTitle: `Share ${currentCatalog.name}`,
                      });
                    } else {
                      // Multiple files - share the first one with info about the rest
                      Alert.alert(
                        'Files Generated',
                        `${fileUris.length} HTML files have been generated. Sharing the first one.\n\nTo view: Open the file in a web browser.`,
                        [
                          {text: 'OK', onPress: async () => {
                            await shareFile(fileUris[0], {
                              mimeType: 'text/html',
                              dialogTitle: `Share ${currentCatalog.name}`,
                            });
                          }},
                        ]
                      );
                    }
                  } catch (error) {
                    console.error('Error generating files:', error);
                    showShareError('Failed to generate files. Please try again.');
                  } finally {
                    setIsExporting(false);
                  }
                }, 300);
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error('Error exporting:', error);
      showShareError('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSharePDF = async () => {
    if (!currentCatalog || currentCatalogProducts.length === 0) {
      Alert.alert('Error', 'No products to share');
      return;
    }

    setIsExporting(true);

    try {
      const options = getExportOptions();
      const pdfUri = await generateCatalogPDF(options);
      await shareToWhatsApp(pdfUri, `Check out our ${currentCatalog.name}!`);
    } catch (error) {
      console.error('Error sharing PDF:', error);
      showShareError();
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareToWhatsApp = async () => {
    if (!currentCatalog || currentCatalogProducts.length === 0) {
      Alert.alert('Error', 'No products to share');
      return;
    }

    setIsExporting(true);

    try {
      const options = getExportOptions();
      const pdfUri = await generateCatalogPDF(options);
      await shareToWhatsApp(pdfUri, `Check out our ${currentCatalog.name}!`);
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      showShareError();
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!currentCatalog || currentCatalogProducts.length === 0) {
      Alert.alert('Error', 'No products to save');
      return;
    }

    setIsExporting(true);

    try {
      const options = getExportOptions();
      const pdfUri = await generateCatalogPDF(options);
      const saved = await saveToGallery(pdfUri);

      if (saved) {
        Alert.alert('Success', 'Catalog saved to your gallery!');
      }
    } catch (error) {
      console.error('Error saving to gallery:', error);
      showShareError('Failed to save to gallery.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export Options Modal
  const renderExportOptions = () => {
    if (!showExportOptions) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Export Options</Text>
            <TouchableOpacity onPress={closeExportOptions}>
              <X size={24} color={semantic.text} />
            </TouchableOpacity>
          </View>

          {/* Format Selection */}
          <Text style={styles.optionLabel}>Format</Text>
          <View style={styles.formatButtons}>
            <TouchableOpacity
              style={[
                styles.formatButton,
                exportFormat === 'pdf' && styles.formatButtonActive,
              ]}
              onPress={() => setExportFormat('pdf')}>
              <FileText
                size={20}
                color={exportFormat === 'pdf' ? colors.white : semantic.text}
              />
              <Text
                style={[
                  styles.formatButtonText,
                  exportFormat === 'pdf' && styles.formatButtonTextActive,
                ]}>
                PDF
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.formatButton,
                exportFormat === 'images' && styles.formatButtonActive,
              ]}
              onPress={() => setExportFormat('images')}>
              <ImageIcon
                size={20}
                color={exportFormat === 'images' ? colors.white : semantic.text}
              />
              <Text
                style={[
                  styles.formatButtonText,
                  exportFormat === 'images' && styles.formatButtonTextActive,
                ]}>
                Images
              </Text>
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsList}>
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Include Prices</Text>
              <Switch
                value={includePrices}
                onValueChange={setIncludePrices}
                trackColor={{false: semantic.border, true: semantic.primaryLight}}
                thumbColor={includePrices ? semantic.primary : colors.gray[400]}
              />
            </View>
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>Include Store Name</Text>
              <Switch
                value={includeStoreName}
                onValueChange={setIncludeStoreName}
                trackColor={{false: semantic.border, true: semantic.primaryLight}}
                thumbColor={includeStoreName ? semantic.primary : colors.gray[400]}
              />
            </View>
          </View>

          {/* Column Selection for Image Export */}
          {exportFormat === 'images' && (
            <>
              <Text style={styles.optionLabel}>Layout</Text>
              <View style={styles.formatButtons}>
                <TouchableOpacity
                  style={[
                    styles.formatButton,
                    columns === 2 && styles.formatButtonActive,
                  ]}
                  onPress={() => setColumns(2)}>
                  <Text
                    style={[
                      styles.formatButtonText,
                      columns === 2 && styles.formatButtonTextActive,
                    ]}>
                    2 Columns
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.formatButton,
                    columns === 3 && styles.formatButtonActive,
                  ]}
                  onPress={() => setColumns(3)}>
                  <Text
                    style={[
                      styles.formatButtonText,
                      columns === 3 && styles.formatButtonTextActive,
                    ]}>
                    3 Columns
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Pagination Info */}
              <View style={styles.paginationInfo}>
                <Text style={styles.paginationText}>
                  {currentCatalogProducts.length > 0 && (
                    `${getExportSummary(currentCatalogProducts.length, columns).totalImages} image(s) will be generated\n` +
                    `(${columns === 2 ? '4' : '6'} products per image)`
                  )}
                </Text>
              </View>
            </>
          )}

          {/* Export Button */}
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExport}>
            <Download size={20} color={colors.white} />
            <Text style={styles.exportButtonText}>
              Export {exportFormat === 'pdf' ? 'PDF' : 'Images'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}>
        {/* Catalog Header */}
        <View
          style={[
            styles.catalogHeader,
            {backgroundColor: currentCatalog.primaryColor},
          ]}>
          {includeStoreName && storeName && (
            <Text style={styles.storeName}>{storeName}</Text>
          )}
          <Text style={styles.catalogTitle}>{currentCatalog.name}</Text>
          <Text style={styles.catalogSubtitle}>
            {currentCatalogProducts.length} products
          </Text>
        </View>

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          {currentCatalogProducts.length > 0 ? (
            <FlatList
              data={currentCatalogProducts}
              numColumns={2}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              columnWrapperStyle={styles.productRow}
              renderItem={({item: product}) => (
                <View style={styles.productCard}>
                  <Image
                    source={{uri: product.imageUri}}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    {includePrices && product.price !== undefined && product.price !== null && (
                      <Text style={styles.productPrice}>₹{product.price}</Text>
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

      {/* Action Bar */}
      <View style={[styles.actionBar, {paddingBottom: insets.bottom + 16}]}>
        <TouchableOpacity style={styles.actionButton} onPress={handleExportPress}>
          <Download size={18} color={semantic.primary} />
          <Text style={styles.actionText} numberOfLines={1}>Export</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSharePDF}>
          <Share2 size={18} color={semantic.primary} />
          <Text style={styles.actionText} numberOfLines={1}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.whatsappButton]}
          onPress={handleShareToWhatsApp}>
          <MessageCircle size={18} color={colors.white} />
          <Text style={styles.whatsappButtonText} numberOfLines={1}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Export Options Modal */}
      {renderExportOptions()}

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
  productCard: {
    width: (Dimensions.get('window').width - 60) / 2,
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
  whatsappButton: {
    backgroundColor: semantic.whatsapp,
    flex: 1,
  },
  whatsappButtonText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 4,
  },
  // Modal Styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: semantic.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semantic.text,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semantic.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  formatButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  formatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: semantic.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: semantic.border,
  },
  formatButtonActive: {
    backgroundColor: semantic.primary,
    borderColor: semantic.primary,
  },
  formatButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.text,
  },
  formatButtonTextActive: {
    color: colors.white,
  },
  optionsList: {
    marginBottom: spacing.lg,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: semantic.divider,
  },
  optionText: {
    fontSize: typography.body.fontSize,
    color: semantic.text,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    backgroundColor: semantic.primary,
    borderRadius: 12,
  },
  exportButtonText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.white,
  },
  paginationInfo: {
    backgroundColor: semantic.primaryLight,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  paginationText: {
    fontSize: typography.bodySmall.fontSize,
    color: semantic.primary,
    textAlign: 'center',
    lineHeight: 20,
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
