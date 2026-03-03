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
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Check, ChevronRight} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useCatalogStore, useProductStore} from '@/store';
import {colors, semantic, spacing, textStyles, typography} from '@/theme';
import {Header} from '@/components/Header';
import {Catalog, TemplateType} from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'CatalogBuilder'>;

const templates: {id: TemplateType; name: string; color: string}[] = [
  {id: 'minimal', name: 'Minimal', color: '#374151'},
  {id: 'bold', name: 'Bold', color: '#DC2626'},
  {id: 'elegant', name: 'Elegant', color: '#7C3AED'},
  {id: 'festive', name: 'Festive', color: '#D97706'},
  {id: 'modern', name: 'Modern', color: '#0891B2'},
];

export const CatalogBuilderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const {catalogId, template} = route.params || {};
  const {currentCatalog, loadCatalog, createCatalog, updateCatalog} =
    useCatalogStore();
  const {products} = useProductStore();

  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('minimal');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (catalogId) {
      loadCatalog(catalogId);
    }
    // If template is provided from route params, use it
    if (template && templates.some(t => t.id === template)) {
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
      const template = templates.find(t => t.id === selectedTemplate);
      const catalogData = {
        name: name.trim(),
        template: selectedTemplate,
        productIds: selectedProducts,
        primaryColor: template?.color || '#374151',
        secondaryColor: '#F3F4F6',
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
          <Text style={styles.label}>Choose Template</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.templatesRow}>
              {templates.map(template => (
                <TouchableOpacity
                  key={template.id}
                  style={[
                    styles.templateCard,
                    {backgroundColor: template.color},
                    selectedTemplate === template.id && styles.templateSelected,
                  ]}
                  onPress={() => setSelectedTemplate(template.id)}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  {selectedTemplate === template.id && (
                    <View style={styles.templateCheck}>
                      <Check size={16} color={colors.white} strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
  templatesRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  templateCard: {
    width: 120,
    height: 160,
    borderRadius: 16,
    justifyContent: 'flex-end',
    padding: spacing.md,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  templateSelected: {
    borderColor: semantic.primary,
  },
  templateName: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.white,
  },
  templateCheck: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: semantic.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255,255,255,0.8)',
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
