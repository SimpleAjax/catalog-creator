// Add/Edit Product Screen
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Camera, Image as ImageIcon, X} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RootStackParamList} from '@/navigation';
import {useProductStore} from '@/store';
import {semantic, spacing, textStyles, typography} from '@/theme';
import {Header} from '@/components/Header';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'AddProduct'>;

export const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const {addProduct, loadProduct, updateProduct} = useProductStore();
  const {productId} = route.params || {};
  const isEditMode = !!productId;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditMode);

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode && productId) {
      loadProductForEdit();
    }
  }, [productId]);

  const loadProductForEdit = async () => {
    setIsLoadingProduct(true);
    try {
      const product = await loadProduct(productId);
      if (product) {
        setName(product.name);
        setPrice(product.price?.toString() || '');
        setMrp(product.mrp?.toString() || '');
        setDescription(product.description);
        setCategory(product.category);
        setImageUri(product.imageUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load product');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode && productId) {
        // Update existing product
        await updateProduct(productId, {
          name: name.trim(),
          price: price ? parseInt(price, 10) : null,
          mrp: mrp ? parseInt(mrp, 10) : null,
          description: description.trim(),
          imageUri,
          category: category.trim(),
        });
      } else {
        // Create new product
        await addProduct({
          name: name.trim(),
          price: price ? parseInt(price, 10) : null,
          mrp: mrp ? parseInt(mrp, 10) : null,
          description: description.trim(),
          imageUri,
          category: category.trim(),
          tags: [],
          source: 'Gallery',
          stockStatus: 'in-stock',
          archived: false,
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'save'} product`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isEditMode ? 'Edit Product' : 'Add Product'}
        rightAction={
          <TouchableOpacity onPress={handleSave} disabled={isLoading || isLoadingProduct}>
            <Text style={[styles.saveButton, (isLoading || isLoadingProduct) && styles.saveButtonDisabled]}>
              Save
            </Text>
          </TouchableOpacity>
        }
      />
      
      {isLoadingProduct ? (
        <View style={styles.center}>
          <Text>Loading product...</Text>
        </View>
      ) : (

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{paddingBottom: insets.bottom + 20}}
        showsVerticalScrollIndicator={false}>
        {/* Image Picker */}
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {imageUri ? (
            <>
              <Image source={{uri: imageUri}} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => setImageUri(null)}>
                <X size={20} color={semantic.card} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <ImageIcon size={48} color={semantic.textSecondary} />
              <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter product name"
              placeholderTextColor={semantic.textTertiary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.flex1]}>
              <Text style={styles.label}>Price (₹)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                keyboardType="number-pad"
                placeholderTextColor={semantic.textTertiary}
              />
            </View>
            <View style={[styles.field, styles.flex1]}>
              <Text style={styles.label}>MRP (₹)</Text>
              <TextInput
                style={styles.input}
                value={mrp}
                onChangeText={setMrp}
                placeholder="0"
                keyboardType="number-pad"
                placeholderTextColor={semantic.textTertiary}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="e.g., Sarees, Kurtis"
              placeholderTextColor={semantic.textTertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter product description"
              placeholderTextColor={semantic.textTertiary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>
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
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: semantic.card,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImage: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: spacing.sm,
    fontSize: typography.bodySmall.fontSize,
    color: semantic.textSecondary,
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: spacing.lg,
  },
  field: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  label: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
    color: semantic.text,
    marginBottom: spacing.xs,
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
  textArea: {
    height: 100,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
});

export default AddProductScreen;
