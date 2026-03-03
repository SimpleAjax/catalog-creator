// Catalog Builder Screen
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Check} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useCatalogStore, useProductStore} from '@/store';
import {colors, semantic, spacing, textStyles, typography} from '@/theme';
import {catalogTemplates, getTemplate} from '@/theme/templates';
import {Header} from '@/components/Header';
import {TemplateType} from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'CatalogBuilder'>;

const {width} = Dimensions.get('window');
const TEMPLATE_CARD_WIDTH = 140;

export const CatalogBuilderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const {catalogId, template} = route.params || {};
  const {currentCatalog, loadCatalog, createCatalog, updateCatalog} =
    useCatalogStore();
  const {products} = useProductStore();

  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('linesheet');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (catalogId) {
      loadCatalog(catalogId);
    }
    // If template is provided from route params, use it
    if (template && catalogTemplates.some(t => t.id === template)) {
      setSelectedTemplate(template as TemplateType);
    }
  }, [catalogId, template]);

  useEffect(() => {
    if (currentCatalog && catalogId) {
      setName(currentCatalog.name);
      setSelectedTemplate(currentCatalog.template);
      setSelectedProducts(currentCatalog.productIds);
    }
  }, [currentCatalog, catalogId]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a catalog name');
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert('Error', 'Please select at least one product');
      return;
    }

    setIsLoading(true);
    try {
      const templateConfig = getTemplate(selectedTemplate);
      const catalogData = {
        name: name.trim(),
        template: selectedTemplate,
        productIds: selectedProducts,
        primaryColor: templateConfig.colors.primary,
        secondaryColor: templateConfig.colors.secondary,
        storeName: '',
        status: 'draft' as const,
      };

      if (catalogId) {
        await updateCatalog(catalogId, catalogData);
      } else {
        await createCatalog(catalogData);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save catalog');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId],
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'minimal': return '◐';
      case 'elegant': return '◆';
      case 'warm': return '●';
      case 'playful': return '★';
      case 'dark': return '◼';
      case 'vibrant': return '◉';
      default: return '◆';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={catalogId ? 'Edit Catalog' : 'Create Catalog'}
        rightAction={
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <Text style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}>
              Save
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{paddingBottom: insets.bottom + 20}}
        showsVerticalScrollIndicator={false}>
        {/* Name Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Catalog Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter catalog name"
            placeholderTextColor={semantic.textTertiary}
          />
        </View>

        {/* Template Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Choose Template Style</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templatesContainer}>
            {catalogTemplates.map(template => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  {width: TEMPLATE_CARD_WIDTH},
                  selectedTemplate === template.id && styles.templateSelected,
                ]}
                onPress={() => setSelectedTemplate(template.id as TemplateType)}>
                {/* Template Preview */}
                <View style={[
                  styles.templatePreview,
                  {
                    backgroundColor: template.colors.background,
                    borderRadius: template.style.borderRadius,
                    borderColor: template.colors.border,
                  },
                ]}>
                  {/* Header preview */}
                  <View style={[
                    styles.templateHeader,
                    {
                      backgroundColor: template.colors.primary,
                      borderTopLeftRadius: template.style.borderRadius,
                      borderTopRightRadius: template.style.borderRadius,
                    },
                  ]}>
                    <Text style={styles.templateIcon}>{getCategoryIcon(template.category)}</Text>
                  </View>
                  {/* Card preview */}
                  <View style={[
                    styles.templateCardPreview,
                    {
                      backgroundColor: template.colors.cardBg,
                      borderRadius: template.style.borderRadius - 4,
                      borderColor: template.colors.border,
                    },
                  ]}>
                    <View style={[
                      styles.templateImagePreview,
                      {backgroundColor: template.colors.secondary},
                    ]} />
                    <View style={[
                      styles.templateTextPreview,
                      {backgroundColor: template.colors.border},
                    ]} />
                    <View style={[
                      styles.templatePricePreview,
                      {backgroundColor: template.colors.primary},
                    ]} />
                  </View>
                </View>

                {/* Template Info */}
                <View style={styles.templateInfo}>
                  <Text style={[styles.templateName, {color: template.colors.text}]}>
                    {template.name}
                  </Text>
                  <Text style={[styles.templateDesc, {color: template.colors.textMuted}]} numberOfLines={1}>
                    {template.description}
                  </Text>
                </View>

                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <View style={styles.selectionBadge}>
                    <Check size={14} color={colors.white} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Select Products ({selectedProducts.length} selected)
          </Text>
          <View style={styles.productsGrid}>
            {products.map(product => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productItem,
                  selectedProducts.includes(product.id) && styles.productSelected,
                ]}
                onPress={() => toggleProduct(product.id)}>
                <View
                  style={[
                    styles.productImage,
                    {backgroundColor: semantic.border},
                  ]}
                />
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
                {selectedProducts.includes(product.id) && (
                  <View style={styles.productCheck}>
                    <Check size={12} color={colors.white} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
  saveButton: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.primary,
  },
  saveButtonDisabled: {
    color: semantic.textTertiary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: semantic.text,
    marginBottom: spacing.md,
  },
  input: {
    height: 52,
    backgroundColor: semantic.card,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: typography.body.fontSize,
    color: semantic.text,
    borderWidth: 1,
    borderColor: semantic.border,
  },
  templatesContainer: {
    paddingRight: spacing.lg,
    gap: spacing.md,
  },
  templateCard: {
    backgroundColor: semantic.card,
    borderRadius: 20,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  templateSelected: {
    borderColor: semantic.primary,
  },
  templatePreview: {
    height: 180,
    borderWidth: 1,
    overflow: 'hidden',
  },
  templateHeader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateIcon: {
    fontSize: 24,
    color: colors.white,
  },
  templateCardPreview: {
    margin: 12,
    padding: 8,
    borderWidth: 1,
    flex: 1,
  },
  templateImagePreview: {
    height: 60,
    borderRadius: 4,
    marginBottom: 8,
  },
  templateTextPreview: {
    height: 8,
    borderRadius: 4,
    width: '70%',
    marginBottom: 6,
  },
  templatePricePreview: {
    height: 8,
    borderRadius: 4,
    width: '40%',
  },
  templateInfo: {
    marginTop: spacing.md,
  },
  templateName: {
    fontSize: 15,
    fontWeight: '600',
  },
  templateDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  selectionBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: semantic.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  productItem: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: semantic.card,
  },
  productSelected: {
    borderColor: semantic.primary,
  },
  productImage: {
    flex: 1,
  },
  productName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
    fontSize: 10,
    color: semantic.text,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  productCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: semantic.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CatalogBuilderScreen;
